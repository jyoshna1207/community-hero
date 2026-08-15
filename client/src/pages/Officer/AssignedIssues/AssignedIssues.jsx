import React, { useState, useEffect, useRef } from 'react';
import {
  FiShield, FiSearch, FiBriefcase, FiMapPin, FiClock,
  FiUser, FiAlertTriangle, FiCheckCircle, FiEye, FiEdit3,
  FiActivity, FiLoader, FiX, FiCheck, FiCalendar, FiImage,
  FiList, FiArrowRight
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './AssignedIssues.css';

// ---------------------------------------------------------------------------
// Status pill config — maps raw backend status values → display label + class
// ---------------------------------------------------------------------------
const STATUS_CONFIG = {
  'in progress':   { label: 'In Progress',   cls: 'in-progress' },
  'in_progress':   { label: 'In Progress',   cls: 'in-progress' },
  'under review':  { label: 'Under Review',  cls: 'under-review' },
  'under_review':  { label: 'Under Review',  cls: 'under-review' },
  'resolved':      { label: 'Resolved',      cls: 'resolved' },
  'solved':        { label: 'Resolved',      cls: 'solved' },
  'unsolved':      { label: 'Unsolved',      cls: 'unsolved' },
  'reported':      { label: 'Reported',      cls: 'reported' },
};

const getStatusConfig = (rawStatus) => {
  if (!rawStatus) return { label: 'Unknown', cls: 'default' };
  const key = rawStatus.toLowerCase().trim();
  return STATUS_CONFIG[key] || { label: rawStatus, cls: 'default' };
};

// ---------------------------------------------------------------------------
// Progress percentage derived from status
// ---------------------------------------------------------------------------
const statusProgress = (status) => {
  const k = (status || '').toLowerCase().trim();
  if (k === 'resolved' || k === 'solved') return 100;
  if (k === 'in progress' || k === 'in_progress') return 65;
  if (k === 'under review' || k === 'under_review') return 35;
  if (k === 'reported' || k === 'unsolved') return 10;
  return 20;
};

const progressColor = (pct) => {
  if (pct >= 100) return 'green';
  if (pct >= 60)  return 'blue';
  if (pct >= 30)  return 'orange';
  return 'red';
};

// ---------------------------------------------------------------------------
// Timeline dot color
// ---------------------------------------------------------------------------
const tlDotColor = (status) => {
  const k = (status || '').toLowerCase();
  if (k.includes('resolv') || k.includes('solve') || k.includes('verif')) return 'green';
  if (k.includes('progress') || k.includes('dispatch'))                    return 'blue';
  if (k.includes('review'))                                                 return 'orange';
  if (k.includes('reject') || k.includes('reject'))                        return 'red';
  return 'gray';
};

// ---------------------------------------------------------------------------
// Overdue detection
// ---------------------------------------------------------------------------
const isOverdue = (expectedDate, status) => {
  if (!expectedDate) return false;
  const k = (status || '').toLowerCase();
  if (k.includes('resolv') || k.includes('solve')) return false;
  return new Date(expectedDate) < new Date();
};

// ---------------------------------------------------------------------------
// Date formatter
// ---------------------------------------------------------------------------
const fmtDate = (raw) => {
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  } catch {
    return String(raw);
  }
};

// ===========================================================================
// COMPONENT
// ===========================================================================
export default function AssignedIssues() {
  const { user, token } = useAuth();

  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search,          setSearch]          = useState('');
  const [statusFilter,    setStatusFilter]    = useState('All');
  const [deptFilter,      setDeptFilter]      = useState('All');
  const [priorityFilter,  setPriorityFilter]  = useState('All');
  const [categoryFilter,  setCategoryFilter]  = useState('All');

  // Modal state
  const [activeIssue, setActiveIssue] = useState(null);
  const [modalMode,   setModalMode]   = useState(null); // 'manage' | 'view' | 'timeline' | 'proof'

  // Manage modal form
  const [manageStatus,   setManageStatus]   = useState('');
  const [manageRemarks,  setManageRemarks]  = useState('');
  const [manageAction,   setManageAction]   = useState('');
  const [manageExpDate,  setManageExpDate]  = useState('');
  const [manageResNote,  setManageResNote]  = useState('');
  const [saving,         setSaving]         = useState(false);

  // Toast
  const [toast,       setToast]       = useState('');
  const isMountedRef                  = useRef(true);

  const officerName = user?.name || 'Ward Officer';
  const wardId      = user?.wardId || 'WARD-04';
  const wardName    = user?.wardName || 'Duvvada Ward 4';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // -------------------------------------------------------------------------
  // Data fetching — GET /api/issues, merge localStorage, filter by assignedDept
  // -------------------------------------------------------------------------
  const fetchAssigned = async () => {
    try {
      let apiIssues = [];
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data)) apiIssues = res.data;
      } catch (err) {
        console.error('API fetch error:', err);
      }

      let localReports = [];
      try {
        localReports = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      } catch (e) {
        console.error('Local reports read error:', e);
      }

      const mapById = new Map();

      [...apiIssues, ...localReports].forEach((item) => {
        const key = item._id || item.id;
        if (!key) return;

        // Only include issues that have a valid assigned department
        const dept = (item.assignedDept || item.assignedDepartment || '').trim();
        if (!dept) return;

        mapById.set(key, {
          _id:                key,
          id:                 key,
          title:              item.title || 'Civic Report',
          category:           item.category || 'Other',
          description:        item.description || '',
          location:           item.location || '—',
          latitude:           item.latitude  || item.locationCoords?.lat || 17.6868,
          longitude:          item.longitude || item.locationCoords?.lng || 83.2185,
          image:              item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          status:             item.status || 'UNSOLVED',
          priority:           item.priority || item.aiSeverity || 'High',
          assignedDept:       dept,
          officerRemarks:     item.officerRemarks || '',
          actionTaken:        item.actionTaken    || '',
          expectedResolutionDate: item.expectedResolutionDate || '',
          resolutionImage:    item.resolutionImage || '',
          resolutionNote:     item.resolutionNote  || '',
          reporterName:       item.reporterName || item.user?.name || 'Citizen Reporter',
          date:               fmtDate(item.reportedDate || item.createdAt),
          createdAt:          item.createdAt || new Date().toISOString(),
          timeline:           item.timeline || [],
        });
      });

      const merged = Array.from(mapById.values());

      // Sort: in-progress first, then by date descending
      merged.sort((a, b) => {
        const aResolved = (a.status || '').toLowerCase().includes('resolv') || (a.status || '').toLowerCase() === 'solved';
        const bResolved = (b.status || '').toLowerCase().includes('resolv') || (b.status || '').toLowerCase() === 'solved';
        if (aResolved && !bResolved) return 1;
        if (!aResolved && bResolved) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      if (isMountedRef.current) {
        setIssues(merged);
      }
    } catch (err) {
      console.error('AssignedIssues fetch error:', err);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchAssigned();
    const interval = setInterval(fetchAssigned, 5000);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // -------------------------------------------------------------------------
  // KPI Metrics
  // -------------------------------------------------------------------------
  const totalAssigned   = issues.length;
  const inProgressCount = issues.filter(i => (i.status || '').toLowerCase().replace(/_/g,' ').includes('in progress')).length;
  const resolvedCount   = issues.filter(i => {
    const s = (i.status || '').toLowerCase();
    return s === 'resolved' || s === 'solved';
  }).length;
  const overdueCount    = issues.filter(i => isOverdue(i.expectedResolutionDate, i.status)).length;

  // -------------------------------------------------------------------------
  // Client-side filtering
  // -------------------------------------------------------------------------
  const filteredIssues = issues.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (item.title        || '').toLowerCase().includes(term) ||
      (item.location     || '').toLowerCase().includes(term) ||
      (item.category     || '').toLowerCase().includes(term) ||
      (item.assignedDept || '').toLowerCase().includes(term) ||
      (item.reporterName || '').toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'All' ||
      (item.status || '').toLowerCase().replace(/_/g,' ').includes(statusFilter.toLowerCase());

    const matchesDept =
      deptFilter === 'All' ||
      (item.assignedDept || '').toLowerCase().includes(deptFilter.toLowerCase());

    const matchesPriority =
      priorityFilter === 'All' ||
      (item.priority || '').toLowerCase() === priorityFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === 'All' ||
      (item.category || '').toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDept && matchesPriority && matchesCategory;
  });

  // -------------------------------------------------------------------------
  // Open Manage modal — pre-fill form from issue
  // -------------------------------------------------------------------------
  const openManageModal = (issue) => {
    setActiveIssue(issue);
    setManageStatus(issue.status || 'IN PROGRESS');
    setManageRemarks(issue.officerRemarks || '');
    setManageAction(issue.actionTaken || '');
    setManageExpDate(issue.expectedResolutionDate || '');
    setManageResNote(issue.resolutionNote || '');
    setModalMode('manage');
  };

  // -------------------------------------------------------------------------
  // Save status / remarks update via PUT /api/issues/:id/officer-update
  // -------------------------------------------------------------------------
  const handleSaveUpdate = async () => {
    if (!activeIssue) return;
    setSaving(true);
    const issueId = activeIssue._id || activeIssue.id;

    const payload = {
      status:                 manageStatus,
      officerRemarks:         manageRemarks,
      actionTaken:            manageAction,
      expectedResolutionDate: manageExpDate,
      resolutionNote:         manageResNote,
      updatedBy:              officerName,
    };

    try {
      await axios.put(
        `http://localhost:5000/api/issues/${issueId}/officer-update`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
    } catch (err) {
      console.error('Status update error:', err);
    }

    // Sync localStorage
    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updated = local.map(item => {
        if (item.id === issueId || item._id === issueId) {
          return { ...item, ...payload, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updated));
    } catch (e) {
      console.error('Local sync error:', e);
    }

    // Optimistic local update
    setIssues(prev => prev.map(item => {
      if (item.id === issueId || item._id === issueId) {
        return {
          ...item,
          status:                 manageStatus,
          officerRemarks:         manageRemarks,
          actionTaken:            manageAction,
          expectedResolutionDate: manageExpDate,
          resolutionNote:         manageResNote,
        };
      }
      return item;
    }));

    setSaving(false);
    showToast('Issue updated successfully.');
    setModalMode(null);
    setActiveIssue(null);
    fetchAssigned();
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveIssue(null);
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  return (
    <div className="assigned-issues-page">

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {toast && (
        <div className="officer-toast-success">
          <FiCheck /> {toast}
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="assigned-top-header">
        <div className="assigned-header-left">
          <h1>Assigned Issues Tracker</h1>
          <p className="assigned-subtitle">
            Monitor departmental progress and manage active field dispatches for {wardName}.
          </p>
        </div>
        <div className="assigned-header-right">
          <div className="ward-badge-tag">
            <FiShield /> {wardId} • Dispatch Hub
          </div>
          <div className="realtime-status-pill">
            <span className="pulse-green-dot" />
            Real-time Live
          </div>
        </div>
      </div>

      {/* ── KPI SUMMARY BAR ─────────────────────────────────────────────── */}
      <div className="assigned-summary-grid">
        <div className="assigned-summary-card">
          <div className="summary-icon-box blue"><FiBriefcase /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{totalAssigned}</span>
            <span className="summary-card-label">Total Dispatched</span>
          </div>
        </div>
        <div className="assigned-summary-card">
          <div className="summary-icon-box orange"><FiActivity /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{inProgressCount}</span>
            <span className="summary-card-label">In Progress</span>
          </div>
        </div>
        <div className="assigned-summary-card">
          <div className="summary-icon-box green"><FiCheckCircle /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{resolvedCount}</span>
            <span className="summary-card-label">Resolved</span>
          </div>
        </div>
        <div className="assigned-summary-card">
          <div className="summary-icon-box red"><FiAlertTriangle /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{overdueCount}</span>
            <span className="summary-card-label">Overdue</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ────────────────────────────────────────────── */}
      <div className="assigned-controls-card">
        <div className="assigned-search-row">
          <div className="assigned-search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, location, department, category or reporter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="assigned-filter-group">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Reported">Reported</option>
            </select>

            <select
              className="filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Roads">Roads</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Electrical">Electrical</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Safety">Public Safety</option>
            </select>

            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Street Lights">Street Lights</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Safety">Public Safety</option>
            </select>

            {filteredIssues.length !== totalAssigned && (
              <span className="results-count-label">
                {filteredIssues.length} of {totalAssigned}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── CARDS GRID ──────────────────────────────────────────────────── */}
      {loading ? (
        <div className="assigned-empty-card">
          <FiLoader style={{ fontSize: '2rem', color: '#155EEF' }} />
          <p>Loading dispatched ward issues…</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="assigned-empty-card">
          <FiCheckCircle style={{ fontSize: '2.5rem', color: '#16A34A' }} />
          <h3>
            {issues.length === 0
              ? 'No Assigned Issues Found'
              : 'No Results Match Your Filters'}
          </h3>
          <p style={{ maxWidth: 400 }}>
            {issues.length === 0
              ? `All issues in ${wardName} are unassigned or cleared. Use the Verify Issues queue to dispatch reports to departments.`
              : 'Try adjusting the search term or filters above.'}
          </p>
        </div>
      ) : (
        <div className="assigned-cards-grid">
          {filteredIssues.map((issue) => {
            const statusCfg = getStatusConfig(issue.status);
            const pct       = statusProgress(issue.status);
            const pColor    = progressColor(pct);
            const overdue   = isOverdue(issue.expectedResolutionDate, issue.status);
            const hasProof  = !!issue.resolutionImage;

            return (
              <div key={issue._id || issue.id} className="assigned-card">

                {/* Thumbnail */}
                <div className="ac-media">
                  <img src={issue.image} alt={issue.title} />
                  <div className="ac-overlay-tags">
                    <span className={`priority-badge-overlay ${(issue.priority || 'medium').toLowerCase()}`}>
                      {issue.priority} Priority
                    </span>
                    {overdue && (
                      <span className="overdue-badge-overlay">⚠ Overdue</span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="ac-body">
                  {/* Title + Category */}
                  <div className="ac-title-row">
                    <h3>{issue.title}</h3>
                    <span className="category-chip">{issue.category}</span>
                  </div>

                  {/* Status pill */}
                  <div className="ac-status-row">
                    <span className={`status-pill ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Description excerpt */}
                  <p className="ac-desc">{issue.description}</p>

                  {/* Meta info */}
                  <div className="ac-meta-list">
                    <div className="meta-item-line">
                      <FiMapPin style={{ color: '#EF4444', flexShrink: 0 }} />
                      <span><strong>Location:</strong> {issue.location}</span>
                    </div>
                    <div className="meta-item-line">
                      <FiBriefcase style={{ color: '#155EEF', flexShrink: 0 }} />
                      <span><strong>Department:</strong> {issue.assignedDept}</span>
                    </div>
                    {issue.expectedResolutionDate && (
                      <div className="meta-item-line">
                        <FiCalendar style={{ color: overdue ? '#DC2626' : '#64748B', flexShrink: 0 }} />
                        <span style={{ color: overdue ? '#DC2626' : undefined }}>
                          <strong>Due:</strong> {fmtDate(issue.expectedResolutionDate)}
                          {overdue && ' (Overdue)'}
                        </span>
                      </div>
                    )}
                    <div className="meta-item-line">
                      <FiUser style={{ color: '#64748B', flexShrink: 0 }} />
                      <span><strong>Reporter:</strong> {issue.reporterName}</span>
                    </div>
                    <div className="meta-item-line">
                      <FiClock style={{ color: '#64748B', flexShrink: 0 }} />
                      <span><strong>Submitted:</strong> {issue.date}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="ac-progress-section">
                    <div className="ac-progress-label-row">
                      <span>Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="ac-progress-track">
                      <div
                        className={`ac-progress-fill ${pColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="ac-actions">
                    <button
                      className="btn-ac btn-ac-manage"
                      onClick={() => openManageModal(issue)}
                    >
                      <FiEdit3 /> Manage
                    </button>

                    <button
                      className="btn-ac btn-ac-view"
                      onClick={() => { setActiveIssue(issue); setModalMode('view'); }}
                    >
                      <FiEye /> Details
                    </button>

                    <button
                      className="btn-ac btn-ac-timeline"
                      onClick={() => { setActiveIssue(issue); setModalMode('timeline'); }}
                    >
                      <FiList /> Timeline
                    </button>

                    <button
                      className={`btn-ac ${hasProof ? 'btn-ac-proof' : 'btn-ac-view'}`}
                      onClick={() => { setActiveIssue(issue); setModalMode('proof'); }}
                    >
                      <FiImage /> {hasProof ? 'Proof' : 'Resolution'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================================
          MODALS
          ================================================================== */}

      {/* 1. MANAGE MODAL — status update + remarks */}
      {modalMode === 'manage' && activeIssue && (
        <div className="ac-modal-backdrop" onClick={closeModal}>
          <div className="ac-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-header">
              <h3><FiEdit3 style={{ color: '#155EEF' }} /> Manage Issue</h3>
              <button className="btn-ac-close" onClick={closeModal}><FiX /></button>
            </div>

            <div className="ac-modal-body">
              <img
                src={activeIssue.image}
                alt={activeIssue.title}
                style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E2E8F0' }}
              />

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>{activeIssue.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                  📍 {activeIssue.location} &nbsp;·&nbsp; <FiBriefcase style={{ display: 'inline', verticalAlign: 'middle' }} /> {activeIssue.assignedDept}
                </p>
              </div>

              <div className="ac-form-grid-2">
                <div className="ac-form-group">
                  <label className="ac-form-label">Update Status</label>
                  <select
                    className="ac-form-select"
                    value={manageStatus}
                    onChange={(e) => setManageStatus(e.target.value)}
                  >
                    <option value="UNDER REVIEW">Under Review</option>
                    <option value="IN PROGRESS">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="SOLVED">Solved</option>
                    <option value="UNSOLVED">Unsolved</option>
                  </select>
                </div>

                <div className="ac-form-group">
                  <label className="ac-form-label">Expected Resolution Date</label>
                  <input
                    type="date"
                    className="ac-form-input"
                    value={manageExpDate}
                    onChange={(e) => setManageExpDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="ac-form-group">
                <label className="ac-form-label">Officer Remarks</label>
                <textarea
                  rows="3"
                  className="ac-form-textarea"
                  value={manageRemarks}
                  onChange={(e) => setManageRemarks(e.target.value)}
                  placeholder="e.g. Field inspection confirmed. Crew dispatched to site."
                />
              </div>

              <div className="ac-form-group">
                <label className="ac-form-label">Action Taken</label>
                <textarea
                  rows="2"
                  className="ac-form-textarea"
                  value={manageAction}
                  onChange={(e) => setManageAction(e.target.value)}
                  placeholder="e.g. Asphalt patching crew deployed. Work in progress."
                />
              </div>

              <div className="ac-form-group">
                <label className="ac-form-label">Resolution Note</label>
                <textarea
                  rows="2"
                  className="ac-form-textarea"
                  value={manageResNote}
                  onChange={(e) => setManageResNote(e.target.value)}
                  placeholder="e.g. Pothole filled and road surface restored to standard."
                />
              </div>
            </div>

            <div className="ac-modal-footer">
              <button className="btn-modal-cancel" onClick={closeModal}>Cancel</button>
              <button
                className="btn-modal-primary"
                onClick={handleSaveUpdate}
                disabled={saving}
              >
                {saving ? <FiLoader /> : <FiCheck />}
                {saving ? 'Saving…' : 'Save Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW DETAILS MODAL */}
      {modalMode === 'view' && activeIssue && (
        <div className="ac-modal-backdrop" onClick={closeModal}>
          <div className="ac-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-header">
              <h3><FiEye style={{ color: '#155EEF' }} /> Issue Details</h3>
              <button className="btn-ac-close" onClick={closeModal}><FiX /></button>
            </div>

            <div className="ac-modal-body">
              <img
                src={activeIssue.image}
                alt={activeIssue.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E2E8F0' }}
              />

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{activeIssue.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>{activeIssue.description}</p>

              <div className="ac-detail-grid">
                <div className="ac-detail-item">
                  <strong>Category</strong>
                  <span>{activeIssue.category}</span>
                </div>
                <div className="ac-detail-item">
                  <strong>Priority</strong>
                  <span>{activeIssue.priority}</span>
                </div>
                <div className="ac-detail-item">
                  <strong>Status</strong>
                  <span>{getStatusConfig(activeIssue.status).label}</span>
                </div>
                <div className="ac-detail-item">
                  <strong>Department</strong>
                  <span>{activeIssue.assignedDept}</span>
                </div>
                <div className="ac-detail-item">
                  <strong>Location</strong>
                  <span>{activeIssue.location}</span>
                </div>
                <div className="ac-detail-item">
                  <strong>Reporter</strong>
                  <span>{activeIssue.reporterName}</span>
                </div>
                <div className="ac-detail-item">
                  <strong>Reported</strong>
                  <span>{activeIssue.date}</span>
                </div>
                {activeIssue.expectedResolutionDate && (
                  <div className="ac-detail-item">
                    <strong>Due Date</strong>
                    <span style={{ color: isOverdue(activeIssue.expectedResolutionDate, activeIssue.status) ? '#DC2626' : undefined }}>
                      {fmtDate(activeIssue.expectedResolutionDate)}
                      {isOverdue(activeIssue.expectedResolutionDate, activeIssue.status) && ' ⚠ Overdue'}
                    </span>
                  </div>
                )}
              </div>

              {activeIssue.officerRemarks && (
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Officer Remarks</p>
                  <div className="ac-remarks-block">{activeIssue.officerRemarks}</div>
                </div>
              )}

              {activeIssue.actionTaken && (
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Action Taken</p>
                  <div className="ac-remarks-block">{activeIssue.actionTaken}</div>
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: '#155EEF', fontFamily: 'monospace' }}>
                GPS: {Number(activeIssue.latitude).toFixed(6)}, {Number(activeIssue.longitude).toFixed(6)}
              </p>
            </div>

            <div className="ac-modal-footer">
              <button
                className="btn-modal-primary"
                onClick={() => { closeModal(); setTimeout(() => openManageModal(activeIssue), 50); }}
              >
                <FiEdit3 /> Manage
              </button>
              <button className="btn-modal-cancel" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TIMELINE MODAL */}
      {modalMode === 'timeline' && activeIssue && (
        <div className="ac-modal-backdrop" onClick={closeModal}>
          <div className="ac-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-header">
              <h3><FiList style={{ color: '#155EEF' }} /> Audit Timeline</h3>
              <button className="btn-ac-close" onClick={closeModal}><FiX /></button>
            </div>

            <div className="ac-modal-body">
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{activeIssue.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>📍 {activeIssue.location}</p>
              </div>

              {activeIssue.timeline && activeIssue.timeline.length > 0 ? (
                <div className="ac-timeline-list">
                  {[...activeIssue.timeline].reverse().map((entry, idx) => {
                    const dotCls = tlDotColor(entry.status);
                    const isLast = idx === activeIssue.timeline.length - 1;
                    return (
                      <div key={idx} className="ac-timeline-entry">
                        <div className="ac-tl-line-col">
                          <span className={`ac-tl-dot ${dotCls}`} />
                          {!isLast && <span className="ac-tl-connector" />}
                        </div>
                        <div className="ac-tl-content">
                          <div className="ac-tl-status-label">{entry.status || 'Update'}</div>
                          <div className="ac-tl-note">{entry.note}</div>
                          <div className="ac-tl-meta">
                            {entry.updatedBy && <span>By {entry.updatedBy}</span>}
                            {entry.date && (
                              <span> · {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '0.9rem' }}>
                  No timeline entries recorded yet.
                </div>
              )}
            </div>

            <div className="ac-modal-footer">
              <button className="btn-modal-cancel" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESOLUTION PROOF MODAL */}
      {modalMode === 'proof' && activeIssue && (
        <div className="ac-modal-backdrop" onClick={closeModal}>
          <div className="ac-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-header">
              <h3><FiImage style={{ color: '#155EEF' }} /> Resolution Proof</h3>
              <button className="btn-ac-close" onClick={closeModal}><FiX /></button>
            </div>

            <div className="ac-modal-body">
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{activeIssue.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {activeIssue.assignedDept} &nbsp;·&nbsp; {getStatusConfig(activeIssue.status).label}
                </p>
              </div>

              <div className="ac-proof-images">
                <div className="ac-proof-img-box">
                  <span className="ac-proof-img-label">Before — Citizen Report</span>
                  {activeIssue.image ? (
                    <img src={activeIssue.image} alt="Before" />
                  ) : (
                    <div className="ac-proof-no-image">
                      <FiImage style={{ fontSize: '1.5rem' }} />
                      <span>No photo available</span>
                    </div>
                  )}
                </div>

                <div className="ac-proof-img-box">
                  <span className="ac-proof-img-label">After — Resolution Proof</span>
                  {activeIssue.resolutionImage ? (
                    <img src={activeIssue.resolutionImage} alt="After — Resolution Proof" />
                  ) : (
                    <div className="ac-proof-no-image">
                      <FiImage style={{ fontSize: '1.5rem' }} />
                      <span>No resolution photo yet</span>
                    </div>
                  )}
                </div>
              </div>

              {activeIssue.resolutionNote && (
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Resolution Note</p>
                  <div className="ac-remarks-block">{activeIssue.resolutionNote}</div>
                </div>
              )}

              {!activeIssue.resolutionImage && (
                <div style={{ padding: '12px 14px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', fontSize: '0.875rem', color: '#92400E' }}>
                  <strong>No resolution proof uploaded yet.</strong> Use the Manage action to add a resolution note once the department completes the work.
                </div>
              )}
            </div>

            <div className="ac-modal-footer">
              <button
                className="btn-modal-primary"
                onClick={() => { closeModal(); setTimeout(() => openManageModal(activeIssue), 50); }}
              >
                <FiEdit3 /> Manage
              </button>
              <button className="btn-modal-cancel" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}