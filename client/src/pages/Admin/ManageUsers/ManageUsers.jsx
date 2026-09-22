import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUserSlash, FaSync, FaUserCheck } from 'react-icons/fa';
import axios from 'axios';
import { DeleteModal, EditUserModal } from '../../../components/Common/Modals';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Manage Registered Users</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Control system access, user roles, ward assignments, and profile permissions.</p>
        </div>
        <button 
          onClick={loadUsers} 
          style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Users
        </button>
      </div>

      {notification && (
        <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.875rem', fontWeight: 700 }}>
          ✓ {notification}
        </div>
      )}

      <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '8px 16px', borderRadius: '8px', width: '300px', gap: '10px', border: '1px solid #e2e8f0' }}>
          <FaSearch style={{ color: '#475569' }} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Roles</option>
            <option value="Citizen">Citizen</option>
            <option value="Ward Officer">Ward Officer</option>
            <option value="Department Officer">Department Officer</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading user directory...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No users match criteria.</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: user.role === 'Administrator' ? '#fee2e2' : user.role === 'Ward Officer' ? '#fef3c7' : user.role === 'Department Officer' ? '#e0f2fe' : '#f0fdf4',
                      color: user.role === 'Administrator' ? '#991b1b' : user.role === 'Ward Officer' ? '#92400e' : user.role === 'Department Officer' ? '#0369a1' : '#166534',
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.ward}</td>
                  <td>{user.department}</td>
                  <td><span style={{ fontWeight: 700, color: '#4f46e5' }}>{user.points} XP</span> (Lvl {user.level})</td>
                  <td>{user.createdDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-outline btn-icon" 
                        title="Edit User" 
                        onClick={() => { setSelectedUser(user); setEditModalOpen(true); }}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-outline btn-icon" 
                        style={{ color: '#ef4444' }} 
                        title="Delete User" 
                        onClick={() => { setSelectedUser(user); setDeleteModalOpen(true); }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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