import React, { useState } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUserSlash } from 'react-icons/fa';
import { dummyUsers } from '../../../services/dummyData';
import { DeleteModal, EditUserModal } from '../../../components/Common/Modals';

export default function ManageUsers() {
  const [users, setUsers] = useState(dummyUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Manage Users</h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>Control system access, user roles, and profile statuses.</p>
      </div>

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

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Ward</th>
              <th>Department</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td><img src={user.avatar} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} /></td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><span className={`badge badge-${user.status.toLowerCase()}`}>{user.status}</span></td>
                <td>{user.ward}</td>
                <td>{user.department}</td>
                <td>{user.createdDate}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-icon" onClick={() => alert(`Viewing details for ${user.name}`)}><FaEye /></button>
                    <button className="btn btn-outline btn-icon" onClick={() => { setSelectedUser(user); setEditModalOpen(true); }}><FaEdit /></button>
                    <button className="btn btn-outline btn-icon" style={{ color: '#f59e0b' }} onClick={() => alert(`Toggled status for ${user.name}`)}><FaUserSlash /></button>
                    <button className="btn btn-outline btn-icon" style={{ color: '#ef4444' }} onClick={() => { setSelectedUser(user); setDeleteModalOpen(true); }}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => { setUsers(users.filter(u => u.id !== selectedUser?.id)); setDeleteModalOpen(false); }} 
        itemName={selectedUser?.name} 
      />

      <EditUserModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        user={selectedUser} 
        onSave={() => alert('User updated successfully')} 
      />
    </div>
  );
}