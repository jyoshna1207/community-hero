import React, { useState, useEffect, useRef } from 'react';
import {
  FiShield, FiSearch, FiBriefcase, FiMapPin, FiClock,
  FiUser, FiAlertTriangle, FiCheckCircle, FiEye, FiList,
  FiActivity, FiLoader, FiX, FiCalendar, FiImage,
  FiArchive, FiXCircle
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './IssueHistory.css';

// ---------------------------------------------------------------------------
// Status display config
// ---------------------------------------------------------------------------
const STATUS_CONFIG = {
  'in progress':  { label: 'In Progress',  cls: 'in-progress' },
  'in_progress':  { label: 'In Progress',  cls: 'in-progress' },
  'under review': { label: 'Under Review', cls: 'under-review' },
  'under_review': { label: 'Under Review', cls: 'under-review' },
  'resolved':     { label: 'Resolved',     cls: 'resolved' },
  'solved':       { label: 'Resolved',     cls: 'solved' },
  'unsolved':     { label: 'Unsolved',     cls: 'unsolved' },
  'reported':     { label: 'Reported',     cls: 'reported' },
  'rejected':     { label: 'Rejected',     cls: 'rejected' },
};

const getStatusConfig = (raw) => {
  if (!raw) return { label: 'Unknown', cls: 'default' };
  const key = raw.toLowerCase().trim();
  return STATUS_CONFIG[key] || { label: raw, cls: 'default' };
};

// ---------------------------------------------------------------------------
// Timeline dot color
// ---------------------------------------------------------------------------
const tlDotColor = (status) => {
  const k = (status || '').toLowerCase();
  if (k.includes('resolv') || k.includes('solve') || k.includes('verif')) return 'green';
  if (k.includes('progress') || k.includes('dispatch') || k.includes('assign')) return 'blue';
  if (k.includes('review') || k.includes('analyz')) return 'orange';
  if (k.includes('reject')) return 'red';
  return 'gray';
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

const fmtDateTime = (raw) => {
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return String(raw);
  }
};

// ===========================================================================
// COMPONENT
// ===========================================================================
export default function IssueHistory() {
  const { user } = useAuth();

  const [issues, setIssues]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState('All');
  const [deptFilter,     setDeptFilter]     = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal state
  const [activeIssue, setActiveIssue] = useState(null);
  const [modalMode,   setModalMode]   = useState(null); // 'details' | 'timeline'

  const isMountedRef = useRef(true);

  const wardId   = user?.wardId   || 'WARD-04';
  const wardName = user?.wardName || 'Duvvada Ward 4';

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------
  const fetchHistory = async () => {
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

        // Include issues that show officer activity:
        // - Has an assignedDept, OR
        // - Has officerRemarks, OR
        // - Has actionTaken, OR
        // - Has resolutionNote, OR
        // - Status indicates officer processing
        const dept     = (item.assignedDept || item.assignedDepartment || '').trim();
        const remarks  = (item.officerRemarks || '').trim();
        const action   = (item.actionTaken || '').trim();
        const resNote  = (item.resolutionNote || '').trim();
        const status   = (item.status || '').toUpperCase();
        const hasOfficerActivity = dept || remarks || action || resNote;
        const isProcessedStatus  =
          status === 'RESOLVED' || status === 'SOLVED' ||
          status === 'IN PROGRESS' || status === 'UNDER REVIEW' ||
          status === 'REJECTED';

        if (!hasOfficerActivity && !isProcessedStatus) return;

        mapById.set(key, {
          _id:                    key,
          id:                     key,
          title:                  item.title || 'Civic Report',
          category:               item.category || 'Other',
          description:            item.description || '',
          location:               item.location || '—',
          latitude:               item.latitude  || item.locationCoords?.lat || 17.6868,
          longitude:              item.longitude || item.locationCoords?.lng || 83.2185,
          image:                  item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          status:                 item.status || 'UNSOLVED',
          priority:               item.priority || item.aiSeverity || 'High',
          assignedDept:           dept || '—',
          officerRemarks:         remarks,
          actionTaken:            action,
          expectedResolutionDate: item.expectedResolutionDate || '',
          resolutionImage:        item.resolutionImage || '',
          resolutionNote:         resNote,
          updatedByOfficer:       item.updatedByOfficer || '',
          reporterName:           item.reporterName || item.user?.name || 'Citizen Reporter',
          date:                   fmtDate(item.reportedDate || item.createdAt),
          createdAt:              item.createdAt || new Date().toISOString(),
          updatedAt:              item.updatedAt || '',
          timeline:               item.timeline || [],
        });
      });

      const merged = Array.from(mapById.values());

      // Sort: resolved/solved first, then by date descending
      merged.sort((a, b) => {
        const aResolved = ['resolved', 'solved'].includes((a.status || '').toLowerCase());
        const bResolved = ['resolved', 'solved'].includes((b.status || '').toLowerCase());
        if (aResolved && !bResolved) return -1;
        if (!aResolved && bResolved) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      if (isMountedRef.current) setIssues(merged);
    } catch (err) {
      console.error('IssueHistory fetch error:', err);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchHistory();
    const interval = setInterval(fetchHistory, 6000);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // -------------------------------------------------------------------------
  // KPI Metrics
  // -------------------------------------------------------------------------
  const totalRecords  = issues.length;
  const resolvedCount = issues.filter(i => {
    const s = (i.status || '').toLowerCase();
    return s === 'resolved' || s === 'solved';
  }).length;
  const activeCount = issues.filter(i => {
    const s = (i.status || '').toLowerCase().replace(/_/g, ' ');
    return s === 'in progress' || s === 'under review';
  }).length;
  const rejectedCount = issues.filter(i =>
    (i.status || '').toLowerCase() === 'rejected'
  ).length;

  // -------------------------------------------------------------------------
  // Filtering
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
      (item.status || '').toLowerCase().replace(/_/g, ' ').includes(statusFilter.toLowerCase());

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

  const closeModal = () => { setModalMode(null); setActiveIssue(null); };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  return (
    <div className="history-page">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="history-top-header">
        <div className="history-header-left">
          <h1>Issue History Archive</h1>
          <p className="history-subtitle">
            Historical record of all officer-processed municipal issues, resolutions, and audit trails for {wardName}.
          </p>
        </div>
        <div className="history-header-right">
          <div className="ward-badge-tag">
            <FiShield /> {wardId} • History Archive
          </div>
        </div>
      </div>

      {/* ── KPI SUMMARY BAR ─────────────────────────────────────────────── */}
      <div className="history-summary-grid">
        <div className="history-summary-card">
          <div className="summary-icon-box blue"><FiArchive /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{totalRecords}</span>
            <span className="summary-card-label">Total Records</span>
          </div>
        </div>
        <div className="history-summary-card">
          <div className="summary-icon-box green"><FiCheckCircle /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{resolvedCount}</span>
            <span className="summary-card-label">Resolved</span>
          </div>
        </div>
        <div className="history-summary-card">
          <div className="summary-icon-box orange"><FiActivity /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{activeCount}</span>
            <span className="summary-card-label">In Progress / Active</span>
          </div>
        </div>
        <div className="history-summary-card">
          <div className="summary-icon-box red"><FiXCircle /></div>
          <div className="summary-card-text">
            <span className="summary-card-num">{rejectedCount}</span>
            <span className="summary-card-label">Rejected</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ────────────────────────────────────────────── */}
      <div className="history-controls-card">
        <div className="history-search-row">
          <div className="history-search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, location, department, category or reporter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="history-filter-group">
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Resolved">Resolved</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
              <option value="Reported">Reported</option>
            </select>

            <select className="filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Roads">Roads</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Electrical">Electrical</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Safety">Public Safety</option>
            </select>

            <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Street Lights">Street Lights</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Safety">Public Safety</option>
            </select>

            {filteredIssues.length !== totalRecords && (
              <span className="results-count-label">
                {filteredIssues.length} of {totalRecords}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── HISTORY CARDS GRID ──────────────────────────────────────────── */}
      {loading ? (
        <div className="history-empty-card">
          <FiLoader style={{ fontSize: '2rem', color: '#155EEF' }} />
          <p>Loading issue history archive…</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="history-empty-card">
          <FiArchive style={{ fontSize: '2.5rem', color: '#94A3B8' }} />
          <h3>
            {issues.length === 0
              ? 'No History Records Found'
              : 'No Results Match Your Filters'}
          </h3>
          <p style={{ maxWidth: 400 }}>
            {issues.length === 0
              ? `No officer-processed issues found for ${wardName}. Process reports from the Verify Issues or Assigned Issues queues to populate the history.`
              : 'Try adjusting the search term or filters above.'}
          </p>
        </div>
      ) : (
        <div className="history-cards-grid">
          {filteredIssues.map((issue) => {
            const statusCfg = getStatusConfig(issue.status);
            const hasResolutionImage = !!issue.resolutionImage;

            return (
              <div key={issue._id || issue.id} className="history-card">

                {/* Before / After image pair */}
                <div className="hc-images-row">
                  {/* Before — citizen report */}
                  <div className="hc-img-col">
                    <img src={issue.image} alt="Before" />
                    <span className="hc-img-label before">Before</span>
                    <span className={`hc-priority-badge ${(issue.priority || 'medium').toLowerCase()}`}>
                      {issue.priority}
                    </span>
                  </div>
                  {/* After — resolution proof */}
                  <div className="hc-img-col">
                    {hasResolutionImage ? (
                      <>
                        <img src={issue.resolutionImage} alt="After" />
                        <span className="hc-img-label after">After</span>
                      </>
                    ) : (
                      <>
                        <div className="hc-no-image">
                          <FiImage style={{ fontSize: '1.3rem' }} />
                          <span>No proof yet</span>
                        </div>
                        <span className="hc-img-label no-proof">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="hc-body">
                  <div className="hc-title-row">
                    <h3>{issue.title}</h3>
                    <span className="category-chip">{issue.category}</span>
                  </div>

                  <div className="hc-status-row">
                    <span className={`status-pill ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="hc-meta-list">
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
                        <FiCalendar style={{ color: '#64748B', flexShrink: 0 }} />
                        <span><strong>Due:</strong> {fmtDate(issue.expectedResolutionDate)}</span>
                      </div>
                    )}
                    <div className="meta-item-line">
                      <FiClock style={{ color: '#64748B', flexShrink: 0 }} />
                      <span><strong>Submitted:</strong> {issue.date}</span>
                    </div>
                  </div>

                  {issue.officerRemarks && (
                    <div className="hc-remarks-preview">
                      {issue.officerRemarks}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="hc-actions">
                    <button
                      className="btn-hc btn-hc-details"
                      onClick={() => { setActiveIssue(issue); setModalMode('details'); }}
                    >
                      <FiEye /> Full Details
                    </button>
                    <button
                      className="btn-hc btn-hc-timeline"
                      onClick={() => { setActiveIssue(issue); setModalMode('timeline'); }}
                    >
                      <FiList /> Audit Timeline
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

      {/* 1. FULL DETAILS MODAL */}
      {modalMode === 'details' && activeIssue && (
        <div className="hc-modal-backdrop" onClick={closeModal}>
          <div className="hc-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="hc-modal-header">
              <h3><FiEye style={{ color: '#155EEF' }} /> Issue Details</h3>
              <button className="btn-hc-close" onClick={closeModal}><FiX /></button>
            </div>

            <div className="hc-modal-body">
              {/* Before / After images */}
              <div className="hc-modal-images">
                <div className="hc-modal-img-box">
                  <span className="hc-modal-img-label">Before — Citizen Report</span>
                  <img src={activeIssue.image} alt="Before" />
                </div>
                <div className="hc-modal-img-box">
                  <span className="hc-modal-img-label">After — Resolution Proof</span>
                  {activeIssue.resolutionImage ? (
                    <img src={activeIssue.resolutionImage} alt="After" />
                  ) : (
                    <div className="hc-modal-no-image">
                      <FiImage style={{ fontSize: '1.4rem' }} />
                      <span>No resolution photo</span>
                    </div>
                  )}
                </div>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>{activeIssue.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>{activeIssue.description}</p>

              <div className="hc-detail-grid">
                <div className="hc-detail-item">
                  <strong>Category</strong>
                  <span>{activeIssue.category}</span>
                </div>
                <div className="hc-detail-item">
                  <strong>Priority</strong>
                  <span>{activeIssue.priority}</span>
                </div>
                <div className="hc-detail-item">
                  <strong>Status</strong>
                  <span>{getStatusConfig(activeIssue.status).label}</span>
                </div>
                <div className="hc-detail-item">
                  <strong>Department</strong>
                  <span>{activeIssue.assignedDept}</span>
                </div>
                <div className="hc-detail-item">
                  <strong>Location</strong>
                  <span>{activeIssue.location}</span>
                </div>
                <div className="hc-detail-item">
                  <strong>Reporter</strong>
                  <span>{activeIssue.reporterName}</span>
                </div>
                <div className="hc-detail-item">
                  <strong>Reported</strong>
                  <span>{activeIssue.date}</span>
                </div>
                {activeIssue.expectedResolutionDate && (
                  <div className="hc-detail-item">
                    <strong>Due Date</strong>
                    <span>{fmtDate(activeIssue.expectedResolutionDate)}</span>
                  </div>
                )}
                {activeIssue.updatedByOfficer && (
                  <div className="hc-detail-item">
                    <strong>Updated By</strong>
                    <span>{activeIssue.updatedByOfficer}</span>
                  </div>
                )}
              </div>

              {activeIssue.officerRemarks && (
                <div>
                  <p className="hc-section-label">Officer Remarks</p>
                  <div className="hc-remarks-block">{activeIssue.officerRemarks}</div>
                </div>
              )}

              {activeIssue.actionTaken && (
                <div>
                  <p className="hc-section-label">Action Taken</p>
                  <div className="hc-remarks-block">{activeIssue.actionTaken}</div>
                </div>
              )}

              {activeIssue.resolutionNote && (
                <div>
                  <p className="hc-section-label">Resolution Note</p>
                  <div className="hc-remarks-block">{activeIssue.resolutionNote}</div>
                </div>
              )}

              {!activeIssue.resolutionImage && (
                <div className="hc-no-proof-notice">
                  <strong>No resolution proof uploaded.</strong> Resolution photo will appear here once the assigned department completes the work and uploads evidence.
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: '#155EEF', fontFamily: 'monospace' }}>
                GPS: {Number(activeIssue.latitude).toFixed(6)}, {Number(activeIssue.longitude).toFixed(6)}
              </p>
            </div>

            <div className="hc-modal-footer">
              <button className="btn-modal-cancel" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AUDIT TIMELINE MODAL */}
      {modalMode === 'timeline' && activeIssue && (
        <div className="hc-modal-backdrop" onClick={closeModal}>
          <div className="hc-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="hc-modal-header">
              <h3><FiList style={{ color: '#155EEF' }} /> Audit Timeline</h3>
              <button className="btn-hc-close" onClick={closeModal}><FiX /></button>
            </div>

            <div className="hc-modal-body">
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{activeIssue.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  📍 {activeIssue.location} &nbsp;·&nbsp; {activeIssue.assignedDept}
                </p>
              </div>

              {activeIssue.timeline && activeIssue.timeline.length > 0 ? (
                <div className="hc-timeline-list">
                  {[...activeIssue.timeline].reverse().map((entry, idx) => {
                    const dotCls = tlDotColor(entry.status);
                    const isLast = idx === activeIssue.timeline.length - 1;
                    return (
                      <div key={idx} className="hc-timeline-entry">
                        <div className="hc-tl-line-col">
                          <span className={`hc-tl-dot ${dotCls}`} />
                          {!isLast && <span className="hc-tl-connector" />}
                        </div>
                        <div className="hc-tl-content">
                          <div className="hc-tl-status">{entry.status || 'Update'}</div>
                          <div className="hc-tl-note">{entry.note}</div>
                          <div className="hc-tl-meta">
                            {entry.updatedBy && <span>By {entry.updatedBy}</span>}
                            {entry.date && <span> · {fmtDateTime(entry.date)}</span>}
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

            <div className="hc-modal-footer">
              <button
                className="btn-modal-primary"
                onClick={() => { closeModal(); setTimeout(() => { setActiveIssue(activeIssue); setModalMode('details'); }, 50); }}
              >
                <FiEye /> View Full Details
              </button>
              <button className="btn-modal-cancel" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}