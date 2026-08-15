import React, { useState, useEffect, useRef } from 'react';
import { 
  FiClipboard, FiAlertCircle, FiClock, FiCheckCircle, FiAlertTriangle, 
  FiMapPin, FiSearch, FiFilter, FiEdit3, FiEye, FiCheck, FiX, FiUploadCloud, 
  FiSend, FiShield, FiBriefcase, FiCalendar, FiActivity, FiLoader, FiArrowRight 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import OfficerDashboardCards from '../../../components/dashboards/OfficerDashboardCards/OfficerDashboardCards';
import './OfficerDashboard.css';

// Helper to format consistent, unique, human-friendly display report IDs
const formatDisplayId = (itemOrId) => {
  if (!itemOrId) return '#CH-00000';
  const rawId = typeof itemOrId === 'object' 
    ? (itemOrId.reportId || itemOrId.issueId || itemOrId.id || itemOrId._id || '')
    : String(itemOrId);
    
  if (!rawId) return '#CH-00000';
  const clean = String(rawId).trim().replace(/^#+/, '');
  
  if (/^(CH|ISS|REQ|REP)-/i.test(clean)) {
    return `#${clean.toUpperCase()}`;
  }
  
  if (/^[0-9a-fA-F]{24}$/.test(clean)) {
    const part1 = clean.slice(16, 20).toUpperCase();
    const part2 = clean.slice(20, 24).toUpperCase();
    return `#CH-${part1}-${part2}`;
  }
  
  return clean.startsWith('CH-') ? `#${clean}` : `#CH-${clean}`;
};

export default function OfficerDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [saveToast, setSaveToast] = useState(null);

  const isMountedRef = useRef(true);

  // Form State for Issue Management Drawer
  const [updateForm, setUpdateForm] = useState({
    status: 'IN PROGRESS',
    priority: 'High',
    assignedDepartment: 'Roads & Infrastructure Department',
    officerRemarks: '',
    actionTaken: '',
    expectedResolutionDate: '2026-08-20',
    resolutionImage: '',
    resolutionNote: ''
  });

  // Ward Officer Metadata
  const officerName = user?.name || 'Officer Rajesh Kumar';
  const wardId = user?.wardId || 'WARD-04';
  const wardName = user?.wardName || 'Duvvada Ward 4';
  const municipality = user?.municipality || 'Visakhapatnam Municipal Corporation';

  // Real-time Data Fetching & Polling Engine
  const fetchIssues = async () => {
    try {
      let apiIssues = [];
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data)) {
          apiIssues = res.data;
        }
      } catch (err) {
        console.error("API issues fetch error:", err);
      }

      // Merge local submitted reports for offline/immediate reactivity
      let localReports = [];
      try {
        localReports = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      } catch (e) {
        console.error("Local reports read error:", e);
      }

      const mapById = new Map();
      [...apiIssues, ...localReports].forEach(item => {
        const key = item._id || item.id;
        if (key) {
          mapById.set(key, {
            _id: key,
            id: key,
            title: item.title || 'Civic Grievance Report',
            category: item.category || 'Roads',
            description: item.description || 'Civic issue logged in ward jurisdiction.',
            location: item.location || 'Duvvada, Visakhapatnam',
            latitude: item.latitude || item.locationCoords?.lat || 17.6868,
            longitude: item.longitude || item.locationCoords?.lng || 83.2185,
            image: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
            status: item.status || 'UNSOLVED',
            priority: item.priority || item.aiSeverity || 'High',
            reporterName: item.reporterName || item.user?.name || 'Community Member',
            date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'),
            createdAt: item.createdAt || new Date().toISOString(),
            assignedDepartment: item.assignedDepartment || item.assignedDept || 'Roads & Infrastructure Department',
            officerRemarks: item.officerRemarks || '',
            actionTaken: item.actionTaken || '',
            expectedResolutionDate: item.expectedResolutionDate || '',
            resolutionImage: item.resolutionImage || '',
            resolutionNote: item.resolutionNote || '',
            updatedByOfficer: item.updatedByOfficer || ''
          });
        }
      });

      const merged = Array.from(mapById.values());
      if (isMountedRef.current) {
        setIssues(merged);
      }
    } catch (error) {
      console.error("Dashboard data load error:", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchIssues();

    // Live auto-polling every 4 seconds
    const interval = setInterval(fetchIssues, 4000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // Compute Real Metrics for KPI Cards
  const total = issues.length;
  const pendingVerification = issues.filter(i => 
    i.status === 'UNSOLVED' || i.status === 'Reported' || i.status === 'Pending Verification'
  ).length;
  const inProgress = issues.filter(i => 
    i.status === 'IN PROGRESS' || i.status === 'In Progress' || i.status === 'UNDER REVIEW' || i.status === 'Under Review' || i.status === 'Assigned'
  ).length;
  const resolved = issues.filter(i => 
    i.status === 'SOLVED' || i.status === 'Resolved' || i.status === 'Solved' || i.status === 'Citizen Confirmed'
  ).length;
  const critical = issues.filter(i => 
    (i.priority || '').toLowerCase() === 'critical' || (i.priority || '').toLowerCase() === 'high'
  ).length;

  const metrics = { total, pendingVerification, inProgress, resolved, critical };

  // Calculate Progress Percentage dynamically (same pattern as Citizen)
  const getProgressPercentage = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'SOLVED' || s === 'RESOLVED' || s === 'CITIZEN CONFIRMED') return 100;
    if (s === 'IN PROGRESS') return 65;
    if (s === 'UNDER REVIEW' || s === 'ASSIGNED') return 40;
    return 15; // UNSOLVED / Reported
  };

  // Filter Issues
  const filteredIssues = issues.filter(issue => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (issue.id || '').toLowerCase().includes(term) ||
      (issue.title || '').toLowerCase().includes(term) ||
      (issue.location || '').toLowerCase().includes(term) ||
      (issue.category || '').toLowerCase().includes(term);

    const s = (issue.status || '').toUpperCase();
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (statusFilter === 'UNSOLVED') matchesStatus = s === 'UNSOLVED' || s === 'REPORTED';
      else if (statusFilter === 'UNDER REVIEW') matchesStatus = s === 'UNDER REVIEW';
      else if (statusFilter === 'IN PROGRESS') matchesStatus = s === 'IN PROGRESS';
      else if (statusFilter === 'SOLVED') matchesStatus = s === 'SOLVED' || s === 'RESOLVED';
      else matchesStatus = issue.status === statusFilter;
    }

    let matchesPriority = true;
    if (priorityFilter !== 'All') {
      matchesPriority = (issue.priority || 'Medium').toLowerCase() === priorityFilter.toLowerCase();
    }

    let matchesCategory = true;
    if (categoryFilter !== 'All') {
      matchesCategory = (issue.category || '').toLowerCase() === categoryFilter.toLowerCase();
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Open Issue Management Drawer
  const handleOpenIssue = (issue) => {
    setSelectedIssue(issue);
    setUpdateForm({
      status: issue.status || 'IN PROGRESS',
      priority: issue.priority || 'High',
      assignedDepartment: issue.assignedDepartment || 'Roads & Infrastructure Department',
      officerRemarks: issue.officerRemarks || '',
      actionTaken: issue.actionTaken || '',
      expectedResolutionDate: issue.expectedResolutionDate || '2026-08-20',
      resolutionImage: issue.resolutionImage || '',
      resolutionNote: issue.resolutionNote || ''
    });
  };

  // Handle Photo Evidence Upload for Resolution
  const handleResolutionPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdateForm(prev => ({ ...prev, resolutionImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Ward Officer Update
  const handleSaveIssueUpdate = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    const issueId = selectedIssue._id || selectedIssue.id;

    const payload = {
      status: updateForm.status,
      priority: updateForm.priority,
      assignedDepartment: updateForm.assignedDepartment,
      officerRemarks: updateForm.officerRemarks,
      actionTaken: updateForm.actionTaken,
      expectedResolutionDate: updateForm.expectedResolutionDate,
      resolutionImage: updateForm.resolutionImage,
      resolutionNote: updateForm.resolutionNote,
      updatedBy: officerName
    };

    // 1. Update API backend
    if (token) {
      try {
        await axios.put(`http://localhost:5000/api/issues/${issueId}/officer-update`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("API officer update error:", err);
      }
    }

    // 2. Sync localStorage (my_submitted_reports) so Citizen Track Your Report updates live
    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === issueId || item._id === issueId) {
          return {
            ...item,
            status: updateForm.status,
            priority: updateForm.priority,
            assignedDepartment: updateForm.assignedDepartment,
            officerRemarks: updateForm.officerRemarks,
            actionTaken: updateForm.actionTaken,
            expectedResolutionDate: updateForm.expectedResolutionDate,
            resolutionImage: updateForm.resolutionImage,
            resolutionNote: updateForm.resolutionNote,
            updatedByOfficer: officerName,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    // 3. Update local state
    setIssues(prev => prev.map(item => {
      if (item.id === issueId || item._id === issueId) {
        return {
          ...item,
          ...payload,
          updatedByOfficer: officerName
        };
      }
      return item;
    }));

    setSaveToast(`Report updated successfully! Live citizen track status is updated.`);
    setTimeout(() => setSaveToast(null), 4000);
    setSelectedIssue(null);
    fetchIssues();
  };

  return (
    <div className="officer-dashboard-page">
      {/* Toast Notification */}
      {saveToast && (
        <div className="officer-toast-success animate-fade-in">
          <FiCheck className="check-icon" /> {saveToast}
        </div>
      )}

      {/* DASHBOARD HEADER (MATCHING CITIZEN TOP HEADER) */}
      <div className="officer-top-header">
        <div className="officer-header-left">
          <h1>Good morning, {officerName} 👋</h1>
          <p className="officer-subtitle">
            Hyperlocal civic oversight, real-time report verification, and department triage for {wardName}.
          </p>
        </div>

        <div className="officer-header-right">
          <div className="ward-badge-tag">
            <FiShield /> {wardId} • {municipality}
          </div>

          <div className="realtime-status-pill">
            <span className="pulse-green-dot"></span> Real-time Live
          </div>
        </div>
      </div>

      {/* REAL-TIME KPI CARDS (MATCHING CITIZEN KPI PATTERN) */}
      <OfficerDashboardCards metrics={metrics} />

      {/* SEARCH & FILTERS CONTROL BAR */}
      <div className="officer-controls-card">
        <div className="officer-search-row">
          <div className="officer-search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search reports by ID, title, category, or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="officer-filter-pills-row">
            <select 
              className="filter-select"
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Roads">Roads & Infrastructure</option>
              <option value="Waste Management">Waste & Sanitation</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Street Lights">Street Lights</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Safety">Public Safety</option>
            </select>

            <select 
              className="filter-select"
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="officer-filter-pills-row">
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Status Filter:</span>
          {['All', 'UNSOLVED', 'UNDER REVIEW', 'IN PROGRESS', 'SOLVED'].map((st) => (
            <button
              key={st}
              className={`filter-pill-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'All' ? 'All Reports' : st}
            </button>
          ))}
        </div>
      </div>

      {/* REAL-TIME WARD REPORTS QUEUE (HORIZONTAL ISSUE CARDS) */}
      <div className="officer-reports-section">
        <div className="officer-reports-header">
          <h2>Ward Reports & Triage Queue ({filteredIssues.length})</h2>
          <Link to="/officer/verify-issues" className="view-all-link">
            Verify Queue →
          </Link>
        </div>

        {loading ? (
          <div className="dash-loading-box">
            <FiLoader className="spin-icon text-blue" />
            <p>Loading real-time ward grievance records...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="dash-empty-box">
            <FiAlertCircle style={{ fontSize: '2rem', color: '#64748B' }} />
            <p>No reports found matching the selected filters in {wardName}.</p>
          </div>
        ) : (
          <div className="officer-issue-list">
            {filteredIssues.map((issue) => {
              const progressPct = getProgressPercentage(issue.status);
              const s = (issue.status || 'UNSOLVED').toUpperCase();

              let statusClass = 'unsolved';
              let statusLabel = '🔴 Unsolved';
              if (s === 'SOLVED' || s === 'RESOLVED') {
                statusClass = 'resolved';
                statusLabel = '🟢 Solved';
              } else if (s === 'IN PROGRESS') {
                statusClass = 'in-progress';
                statusLabel = '🔵 In Progress';
              } else if (s === 'UNDER REVIEW' || s === 'ASSIGNED') {
                statusClass = 'under-review';
                statusLabel = '🟡 Under Review';
              }

              return (
                <div key={issue.id || issue._id} className="horizontal-issue-card">
                  <div className="issue-img-wrapper">
                    <img src={issue.image} alt={issue.title} />
                  </div>

                  <div className="issue-details-main">
                    <div className="issue-title-row">
                      <h3>{issue.title}</h3>
                      <div className="issue-badge-group">
                        <span className={`status-pill ${statusClass}`}>
                          {statusLabel}
                        </span>
                        <span className={`priority-pill ${(issue.priority || 'Medium').toLowerCase()}`}>
                          {issue.priority} Priority
                        </span>
                        <span className="priority-pill">
                          {issue.category}
                        </span>
                      </div>
                    </div>

                    <div className="issue-meta-row">
                      <span>📍 {issue.location}</span>
                      <span className="meta-dot">•</span>
                      <span><FiClock /> {issue.date}</span>
                      <span className="meta-dot">•</span>
                      <span>Reporter: <strong>{issue.reporterName}</strong></span>
                      {issue.assignedDepartment && (
                        <>
                          <span className="meta-dot">•</span>
                          <span><FiBriefcase /> {issue.assignedDepartment}</span>
                        </>
                      )}
                    </div>

                    {/* Resolution Progress Bar */}
                    <div className="issue-progress-bar-row">
                      <div className="progress-label-flex">
                        <span>Resolution Progress</span>
                        <span className="progress-pct">{progressPct}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                      </div>
                    </div>

                    {/* Officer Remarks Preview */}
                    {issue.officerRemarks && (
                      <div className="officer-remarks-badge">
                        <FiShield style={{ color: '#155EEF' }} />
                        <span><strong>Officer Remarks:</strong> "{issue.officerRemarks}"</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="issue-action-side">
                    <button 
                      className="btn-manage-action"
                      onClick={() => handleOpenIssue(issue)}
                    >
                      <FiEdit3 /> Manage Issue
                    </button>
                    <Link 
                      to={`/track-report/${issue.id || issue._id}`} 
                      className="btn-track-link"
                    >
                      Track View →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ISSUE MANAGEMENT MODAL / DRAWER */}
      {selectedIssue && (
        <div className="officer-modal-backdrop" onClick={() => setSelectedIssue(null)}>
          <div className="officer-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-card-header">
              <div>
                <h2>{selectedIssue.title}</h2>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedIssue(null)}>
                <FiX />
              </button>
            </div>

            {/* Body */}
            <div className="modal-card-body">
              {/* Overview Details */}
              <div className="modal-overview-grid">
                <div className="modal-overview-item">
                  <span className="modal-overview-label">Location Address</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#0F172A', fontWeight: 600 }}>
                    📍 {selectedIssue.location}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#155EEF', fontFamily: 'monospace', marginTop: '4px' }}>
                    Lat: {Number(selectedIssue.latitude).toFixed(4)} | Lng: {Number(selectedIssue.longitude).toFixed(4)}
                  </div>
                </div>

                <div className="modal-overview-item">
                  <span className="modal-overview-label">Category & Reporter</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#0F172A', fontWeight: 600 }}>
                    {selectedIssue.category} • {selectedIssue.reporterName}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                    Reported on: {selectedIssue.date}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span className="modal-overview-label">Issue Description</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.4 }}>
                  {selectedIssue.description}
                </p>
              </div>

              {/* Triage & Status Update Form */}
              <form id="officer-triage-form" onSubmit={handleSaveIssueUpdate}>
                <div className="modal-form-grid">
                  {/* Status Selector */}
                  <div className="modal-form-group">
                    <label>Resolution Status</label>
                    <select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    >
                      <option value="UNSOLVED">🔴 UNSOLVED</option>
                      <option value="UNDER REVIEW">🟡 UNDER REVIEW</option>
                      <option value="IN PROGRESS">🟠 IN PROGRESS</option>
                      <option value="SOLVED">🟢 SOLVED</option>
                    </select>
                  </div>

                  {/* Priority Selector */}
                  <div className="modal-form-group">
                    <label>Priority Level</label>
                    <select
                      value={updateForm.priority}
                      onChange={(e) => setUpdateForm({ ...updateForm, priority: e.target.value })}
                    >
                      <option value="Critical">🔥 Critical Priority</option>
                      <option value="High">⚠️ High Priority</option>
                      <option value="Medium">⚡ Medium Priority</option>
                      <option value="Low">🌱 Low Priority</option>
                    </select>
                  </div>

                  {/* Assigned Department */}
                  <div className="modal-form-group">
                    <label>Assigned Department</label>
                    <select
                      value={updateForm.assignedDepartment}
                      onChange={(e) => setUpdateForm({ ...updateForm, assignedDepartment: e.target.value })}
                    >
                      <option value="Roads & Infrastructure Department">Roads & Infrastructure Department</option>
                      <option value="GVMC Sanitation & Waste Board">GVMC Sanitation & Waste Board</option>
                      <option value="Electrical Maintenance Wing">Electrical Maintenance Wing</option>
                      <option value="Water Supply & Sewerage Board">Water Supply & Sewerage Board</option>
                      <option value="Drainage & Stormwater Department">Drainage & Stormwater Department</option>
                      <option value="Public Safety Task Force">Public Safety Task Force</option>
                    </select>
                  </div>

                  {/* Expected Resolution Date */}
                  <div className="modal-form-group">
                    <label>Expected Resolution Date</label>
                    <input 
                      type="date" 
                      value={updateForm.expectedResolutionDate}
                      onChange={(e) => setUpdateForm({ ...updateForm, expectedResolutionDate: e.target.value })}
                    />
                  </div>

                  {/* Officer Remarks */}
                  <div className="modal-form-group full-width">
                    <label>Officer Remarks (Visible to Citizen on Tracker)</label>
                    <textarea 
                      rows="2"
                      value={updateForm.officerRemarks}
                      onChange={(e) => setUpdateForm({ ...updateForm, officerRemarks: e.target.value })}
                      placeholder="e.g. Field inspection completed. Repair team scheduled for morning dispatch."
                    ></textarea>
                  </div>

                  {/* Action Taken */}
                  <div className="modal-form-group full-width">
                    <label>Action Taken</label>
                    <input 
                      type="text"
                      value={updateForm.actionTaken}
                      onChange={(e) => setUpdateForm({ ...updateForm, actionTaken: e.target.value })}
                      placeholder="e.g. Dispatched asphalt patching crew to repair road surface."
                    />
                  </div>
                </div>

                {/* Resolution Proof (When Marked SOLVED) */}
                {(updateForm.status === 'SOLVED' || updateForm.status === 'Resolved') && (
                  <div className="modal-resolution-proof animate-fade-in" style={{ marginTop: '16px' }}>
                    <h4><FiCheckCircle /> Upload Resolution Photo Proof (Before & After)</h4>
                    {updateForm.resolutionImage ? (
                      <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                        <img src={updateForm.resolutionImage} alt="Resolution proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          onClick={() => setUpdateForm({ ...updateForm, resolutionImage: '' })}
                          style={{ position: 'absolute', top: '8px', right: '8px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="res-photo-file" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#FFFFFF', border: '1px dashed #16A34A', borderRadius: '8px', padding: '14px', cursor: 'pointer', color: '#166534', fontWeight: 600, fontSize: '0.85rem' }}>
                        <input 
                          type="file" 
                          id="res-photo-file" 
                          accept="image/*" 
                          onChange={handleResolutionPhotoSelect} 
                          style={{ display: 'none' }}
                        />
                        <FiUploadCloud style={{ fontSize: '1.2rem' }} /> Upload Resolved Evidence Photo
                      </label>
                    )}

                    <input 
                      type="text"
                      value={updateForm.resolutionNote}
                      onChange={(e) => setUpdateForm({ ...updateForm, resolutionNote: e.target.value })}
                      placeholder="Resolution summary note (e.g. Pothole filled and road leveled)."
                      style={{ marginTop: '10px', width: '100%', padding: '8px 12px', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="modal-card-footer">
              <button 
                type="button" 
                className="btn-modal-cancel" 
                onClick={() => setSelectedIssue(null)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="officer-triage-form"
                className="btn-modal-save"
              >
                <FiSend /> Save & Sync Citizen Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}