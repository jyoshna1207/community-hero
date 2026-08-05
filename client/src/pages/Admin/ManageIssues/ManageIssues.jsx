import React, { useState } from 'react';
import { FaSearch, FaEye, FaUserCheck, FaTrash, FaCheckDouble } from 'react-icons/fa';
import { dummyIssues } from '../../../services/dummyData';
import { DeleteModal, AssignOfficerModal, ViewDetailsModal } from '../../../components/common/Modals';

export default function ManageIssues() {
  const [issues, setIssues] = useState(dummyIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filteredIssues = issues.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || i.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchesPri = priorityFilter === 'All' || i.priority === priorityFilter;
    return matchesSearch && matchesCat && matchesStatus && matchesPri;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Manage Issues</h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>Monitor civic complaints, assign field officers, and resolve reports.</p>
      </div>

      <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '8px 16px', borderRadius: '8px', width: '280px', gap: '10px', border: '1px solid #e2e8f0' }}>
          <FaSearch style={{ color: '#475569' }} />
          <input 
            type="text" 
            placeholder="Search issue title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Drainage">Drainage</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Ward</th>
              <th>Department</th>
              <th>Status</th>
              <th>Assigned Officer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map(issue => (
              <tr key={issue.id}>
                <td><strong>{issue.title}</strong><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{issue.id}</div></td>
                <td>{issue.category}</td>
                <td><span style={{ fontWeight: 600, color: issue.priority === 'Urgent' ? '#ef4444' : issue.priority === 'High' ? '#f59e0b' : '#3b82f6' }}>{issue.priority}</span></td>
                <td>{issue.location}</td>
                <td>{issue.ward}</td>
                <td>{issue.department}</td>
                <td><span className={`badge badge-${issue.status.toLowerCase().replace(/\s+/g, '')}`}>{issue.status}</span></td>
                <td>{issue.assignedOfficer}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-icon" onClick={() => { setSelectedIssue(issue); setViewModalOpen(true); }}><FaEye /></button>
                    <button className="btn btn-outline btn-icon" style={{ color: '#4f46e5' }} onClick={() => { setSelectedIssue(issue); setAssignModalOpen(true); }}><FaUserCheck /></button>
                    <button className="btn btn-outline btn-icon" style={{ color: '#10b981' }} onClick={() => alert(`Issue ${issue.id} marked closed`)}><FaCheckDouble /></button>
                    <button className="btn btn-outline btn-icon" style={{ color: '#ef4444' }} onClick={() => { setSelectedIssue(issue); setDeleteModalOpen(true); }}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignOfficerModal 
        isOpen={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)} 
        issueId={selectedIssue?.id} 
        onAssign={() => alert('Officer successfully assigned')} 
      />

      <ViewDetailsModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        title={`Issue Details: ${selectedIssue?.id}`} 
        data={selectedIssue} 
      />

      <DeleteModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => { setIssues(issues.filter(i => i.id !== selectedIssue?.id)); setDeleteModalOpen(false); }} 
        itemName={selectedIssue?.title} 
      />
    </div>
  );
}