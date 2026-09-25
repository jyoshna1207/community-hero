import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaUserCheck, FaTrash, FaCheckDouble, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { DeleteModal, AssignOfficerModal, ViewDetailsModal } from '../../../components/Common/Modals';

export default function ManageIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const loadIssues = async () => {
    setLoading(true);
    try {
      let apiIssues = [];
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data)) apiIssues = res.data;
      } catch (e) { console.error(e); }

      let localReports = [];
      try {
        localReports = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      } catch (e) { console.error(e); }

      const mapById = new Map();
      [...apiIssues, ...localReports].forEach(item => {
        const key = item._id || item.id;
        if (key) mapById.set(key, item);
      });

      const merged = Array.from(mapById.values());

      const mapped = merged.map(i => ({
        id: i._id || i.id,
        _id: i._id || i.id,
        title: i.title,
        category: i.category || 'Roads',
        priority: i.priority || i.aiSeverity || 'High',
        location: i.location || 'Unknown Location',
        ward: i.wardId || i.wardName || 'Unassigned',
        department: i.assignedDepartment || i.assignedDept || 'Pending Assignment',
        status: i.status || 'Reported',
        assignedOfficer: i.updatedByOfficer || i.updatedBy || 'Pending Assignment',
        description: i.description,
        image: i.image || i.imageUrl,
        date: new Date(i.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));
      setIssues(mapped);
    } catch (err) {
      console.error('Error loading admin issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleAssignOfficer = async (issueId, officerName, department) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${issueId}/officer-update`, {
        assignedDepartment: department || 'State Task Force',
        updatedBy: officerName || 'Admin Dispatch',
        officerRemarks: `Assigned to ${officerName || 'Field Team'} by Admin.`
      });
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, department: department || i.department, assignedOfficer: officerName || 'Assigned Officer', status: 'In Progress' } : i));
      showNotification(`Issue #${issueId.slice(-6)} assigned successfully!`);
    } catch (err) {
      console.error('Error assigning officer:', err);
      showNotification(`Assignment recorded.`);
    }
  };

  const handleQuickResolve = async (issueId) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${issueId}/status`, {
        status: 'Resolved',
        note: 'Marked resolved directly by City Administrator.',
        updatedBy: 'City Administrator'
      });
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: 'Resolved' } : i));
      showNotification(`Issue #${issueId.slice(-6)} marked as Resolved!`);
    } catch (err) {
      console.error('Error resolving issue:', err);
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: 'Resolved' } : i));
      showNotification(`Issue marked as Resolved.`);
    }
  };

  const handleDeleteIssue = async () => {
    if (!selectedIssue) return;
    try {
      await axios.delete(`http://localhost:5000/api/issues/${selectedIssue.id}`);
      setIssues(prev => prev.filter(i => i.id !== selectedIssue.id));
      setDeleteModalOpen(false);
      showNotification(`Issue #${selectedIssue.id.slice(-6)} permanently deleted.`);
    } catch (err) {
      console.error('Error deleting issue:', err);
      setIssues(prev => prev.filter(i => i.id !== selectedIssue.id));
      setDeleteModalOpen(false);
      showNotification(`Issue removed.`);
    }
  };

  const filteredIssues = issues.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || i.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || i.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesPri = priorityFilter === 'All' || i.priority.toLowerCase().includes(priorityFilter.toLowerCase());
    return matchesSearch && matchesCat && matchesStatus && matchesPri;
  });

  return (
    <div className="officer-dashboard-page" style={{ padding: '0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Global Ticket Management</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Administer, re-route, and monitor all civic reports across the entire platform.</p>
          </div>
          <button 
            onClick={loadIssues}
            style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Global Database
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
            placeholder="Search issue title, id, or place..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Electricity">Electricity</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Drainage">Drainage</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Statuses</option>
            <option value="Reported">Reported / Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}>
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading database issues...</td>
              </tr>
            ) : filteredIssues.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No matching reports found.</td>
              </tr>
            ) : (
              filteredIssues.map(issue => (
                <tr key={issue.id}>
                  <td><strong>{issue.title}</strong><div style={{ fontSize: '0.75rem', color: '#64748b' }}>#{issue.id.slice(-6)}</div></td>
                  <td>{issue.category}</td>
                  <td>
                    <span style={{ 
                      fontWeight: 700, 
                      color: (issue.priority || '').toUpperCase() === 'CRITICAL' ? '#ef4444' : (issue.priority || '').toUpperCase() === 'HIGH' ? '#f59e0b' : '#3b82f6' 
                    }}>
                      {issue.priority}
                    </span>
                  </td>
                  <td>{issue.location}</td>
                  <td>{issue.ward}</td>
                  <td>{issue.department}</td>
                  <td>
                    <span className={`badge badge-${issue.status.toLowerCase().replace(/\s+/g, '')}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>{issue.assignedOfficer}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-outline btn-icon" 
                        title="View Full Details" 
                        onClick={() => { setSelectedIssue(issue); setViewModalOpen(true); }}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn btn-outline btn-icon" 
                        style={{ color: '#4f46e5' }} 
                        title="Assign Department/Officer" 
                        onClick={() => { setSelectedIssue(issue); setAssignModalOpen(true); }}
                      >
                        <FaUserCheck />
                      </button>
                      <button 
                        className="btn btn-outline btn-icon" 
                        style={{ color: '#10b981' }} 
                        title="Quick Resolve" 
                        onClick={() => handleQuickResolve(issue.id)}
                      >
                        <FaCheckDouble />
                      </button>
                      <button 
                        className="btn btn-outline btn-icon" 
                        style={{ color: '#ef4444' }} 
                        title="Delete Ticket" 
                        onClick={() => { setSelectedIssue(issue); setDeleteModalOpen(true); }}
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

      <AssignOfficerModal 
        isOpen={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)} 
        issueId={selectedIssue?.id} 
        onAssign={(dept, officer) => {
          handleAssignOfficer(selectedIssue?.id, officer, dept);
          setAssignModalOpen(false);
        }} 
      />

      <ViewDetailsModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        title={`Issue Details: #${selectedIssue?.id?.slice(-6)}`} 
        data={selectedIssue} 
      />

      <DeleteModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDeleteIssue} 
        itemName={selectedIssue?.title} 
      />
      </div>
    </div>
  );
}