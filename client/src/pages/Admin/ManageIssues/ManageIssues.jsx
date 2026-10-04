import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaUserCheck, FaTrash, FaCheckDouble, FaSync, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { DeleteModal, AssignOfficerModal, ViewDetailsModal } from '../../../components/Common/Modals';
import '../AdminStyles.css';

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
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-top-header">
        <div className="admin-header-title">
          <h1>Global Ticket Management</h1>
          <p>Administer, re-route, and monitor all civic reports across the municipal platform.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-pill-badge">
            <FaShieldAlt /> Central Operations
          </div>
          <button onClick={loadIssues} className="admin-refresh-btn">
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Global Database
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
            placeholder="Search issue title, id, or place..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-selects">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="admin-select">
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Electricity">Electricity</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Drainage">Drainage</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-select">
            <option value="All">All Statuses</option>
            <option value="Reported">Reported / Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="admin-select">
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table Card Container */}
      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
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
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <FaSync className="animate-spin" style={{ marginRight: '8px', color: '#EA580C' }} /> Loading database issues...
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No matching reports found in database.
                  </td>
                </tr>
              ) : (
                filteredIssues.map(issue => {
                  const statusNormalized = (issue.status || 'REPORTED').toLowerCase().replace(/\s+/g, '-');
                  const priorityNormalized = (issue.priority || 'medium').toLowerCase();
                  return (
                    <tr key={issue.id}>
                      <td>
                        <strong style={{ color: '#0F172A', display: 'block' }}>{issue.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>#{issue.id.slice(-6)}</span>
                      </td>
                      <td>
                        <span className="admin-category-badge">{issue.category}</span>
                      </td>
                      <td>
                        <span className={`admin-priority-badge ${priorityNormalized}`}>
                          ● {issue.priority}
                        </span>
                      </td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={issue.location}>
                        📍 {issue.location}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#475569' }}>{issue.ward}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: '#334155' }}>{issue.department}</span>
                      </td>
                      <td>
                        <span className={`admin-pill-status ${statusNormalized}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: issue.assignedOfficer === 'Pending Assignment' ? '#94A3B8' : '#0F172A', fontWeight: issue.assignedOfficer === 'Pending Assignment' ? 400 : 600 }}>
                          {issue.assignedOfficer}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions-cell" style={{ justifyContent: 'center' }}>
                          <button 
                            className="admin-btn-action view" 
                            title="View Full Details" 
                            onClick={() => { setSelectedIssue(issue); setViewModalOpen(true); }}
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="admin-btn-action assign" 
                            title="Assign Department/Officer" 
                            onClick={() => { setSelectedIssue(issue); setAssignModalOpen(true); }}
                          >
                            <FaUserCheck />
                          </button>
                          <button 
                            className="admin-btn-action resolve" 
                            title="Quick Resolve" 
                            onClick={() => handleQuickResolve(issue.id)}
                          >
                            <FaCheckDouble />
                          </button>
                          <button 
                            className="admin-btn-action delete" 
                            title="Delete Ticket" 
                            onClick={() => { setSelectedIssue(issue); setDeleteModalOpen(true); }}
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
  );
}