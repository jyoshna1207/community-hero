import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaSync, FaShieldAlt, FaAward } from 'react-icons/fa';
import axios from 'axios';
import { DeleteModal, EditUserModal } from '../../../components/Common/Modals';
import '../AdminStyles.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users');
      const all = Array.isArray(res.data) ? res.data : [];
      const mapped = all.map(u => {
        let displayRole = 'Citizen';
        const r = (u.role || '').toLowerCase();
        if (r.includes('ward') || r === 'officer') displayRole = 'Ward Officer';
        else if (r.includes('district') || r.includes('dept')) displayRole = 'Department Officer';
        else if (r === 'admin') displayRole = 'Administrator';

        return {
          id: u._id || u.id,
          _id: u._id || u.id,
          name: u.name,
          email: u.email,
          role: displayRole,
          rawRole: u.role,
          status: 'Active',
          ward: u.wardName || u.wardId || 'Ward 4',
          department: u.departmentName || 'Public Works Department',
          createdDate: new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          points: u.points ?? 150,
          level: u.level ?? 1,
        };
      });
      setUsers(mapped);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleUpdateUser = async (updatedData) => {
    if (!selectedUser) return;
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${selectedUser.id}`, updatedData);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...updatedData } : u));
      setEditModalOpen(false);
      showNotification(`User ${selectedUser.name} updated successfully!`);
    } catch (err) {
      console.error('Update user error:', err);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...updatedData } : u));
      setEditModalOpen(false);
      showNotification(`User profile updated.`);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${selectedUser.id}`);
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setDeleteModalOpen(false);
      showNotification(`User ${selectedUser.name} deleted.`);
    } catch (err) {
      console.error('Delete user error:', err);
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setDeleteModalOpen(false);
      showNotification(`User account removed.`);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-top-header">
        <div className="admin-header-title">
          <h1>User Administration</h1>
          <p>Manage citizens, assign roles, and administer system accounts securely.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-pill-badge">
            <FaShieldAlt /> System Accounts
          </div>
          <button onClick={loadUsers} className="admin-refresh-btn">
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Directory
          </button>
        </div>
      </div>

      {notification && (
        <div className="admin-toast-banner">
          ✓ {notification}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="admin-filters-card">
        <div className="admin-search-wrapper">
          <FaSearch style={{ color: '#EA580C' }} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-selects">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="admin-select">
            <option value="All">All Roles</option>
            <option value="Citizen">Citizen</option>
            <option value="Ward Officer">Ward Officer</option>
            <option value="Department Officer">Department Officer</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>System Role</th>
                <th>Ward / Jurisdiction</th>
                <th>Department</th>
                <th>XP Points</th>
                <th>Created</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <FaSync className="animate-spin" style={{ marginRight: '8px', color: '#EA580C' }} /> Loading user directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No users match criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  let roleClass = 'citizen';
                  if (user.role === 'Administrator') roleClass = 'admin';
                  else if (user.role === 'Ward Officer') roleClass = 'officer';
                  else if (user.role === 'Department Officer') roleClass = 'department';

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: '#0F172A', display: 'block' }}>{user.name}</strong>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.85rem' }}>{user.email}</td>
                      <td>
                        <span className={`admin-role-tag ${roleClass}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{user.ward}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: '#475569' }}>{user.department}</span>
                      </td>
                      <td>
                        <span className="admin-xp-tag">
                          <FaAward /> {user.points} XP
                        </span>
                        <div style={{ fontSize: '0.725rem', color: '#94A3B8', fontWeight: 600 }}>Level {user.level}</div>
                      </td>
                      <td style={{ fontSize: '0.825rem', color: '#64748B' }}>{user.createdDate}</td>
                      <td>
                        <div className="admin-actions-cell" style={{ justifyContent: 'center' }}>
                          <button 
                            className="admin-btn-action edit" 
                            title="Edit User" 
                            onClick={() => { setSelectedUser(user); setEditModalOpen(true); }}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="admin-btn-action delete" 
                            title="Delete User" 
                            onClick={() => { setSelectedUser(user); setDeleteModalOpen(true); }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDeleteUser} 
        itemName={selectedUser?.name} 
      />

      <EditUserModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        user={selectedUser} 
        onSave={handleUpdateUser} 
      />
    </div>
  );
}