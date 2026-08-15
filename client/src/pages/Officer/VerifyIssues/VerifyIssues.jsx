import React, { useState, useEffect, useRef } from 'react';
import { 
  FiCheckCircle, FiXCircle, FiShare2, FiEye, FiSearch, 
  FiFilter, FiMapPin, FiClock, FiUser, FiAlertTriangle, 
  FiShield, FiBriefcase, FiCalendar, FiCheck, FiX, FiLoader, FiAlertCircle 
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './VerifyIssues.css';

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

export default function VerifyIssues() {
  const { user, token } = useAuth();

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  
  // Selected Issue for Modals
  const [activeIssue, setActiveIssue] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'verify' | 'reject' | 'assign' | 'view'
  
  // Rejection Reason Form
  const [rejectReason, setRejectReason] = useState('');
  
  // Assignment Form State
  const [assignDept, setAssignDept] = useState('Roads & Infrastructure Department');
  const [assignPriority, setAssignPriority] = useState('High');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [expectedDate, setExpectedDate] = useState('2026-08-22');

  // Verify Form State
  const [verifyRemarks, setVerifyRemarks] = useState('Issue inspected and verified on-site by Ward Officer.');

  // Notification Toast
  const [toast, setToast] = useState('');
  const isMountedRef = useRef(true);

  const officerName = user?.name || 'Officer Rajesh Kumar';
  const wardId = user?.wardId || 'WARD-04';
  const wardName = user?.wardName || 'Duvvada Ward 4';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // Fetch real unverified/pending issues from backend + localStorage
  const loadQueue = async () => {
    try {
      let apiIssues = [];
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data)) {
          apiIssues = res.data;
        }
      } catch (err) {
        console.error("API queue fetch error:", err);
      }

      let localReports = [];
      try {
        localReports = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      } catch (e) {
        console.error("Local queue read error:", e);
      }

      const mapById = new Map();
      [...apiIssues, ...localReports].forEach((item) => {
        const key = item._id || item.id;
        if (key) {
          const status = (item.status || 'UNSOLVED').toUpperCase();
          // Include reports that are pending verification (UNSOLVED, REPORTED, UNDER REVIEW, PENDING VERIFICATION)
          const isPending = 
            status === 'UNSOLVED' || 
            status === 'REPORTED' || 
            status === 'UNDER REVIEW' || 
            status === 'PENDING VERIFICATION';

          if (isPending) {
            mapById.set(key, {
              _id: key,
              id: key,
              title: item.title || 'Civic Problem Report',
              category: item.category || 'Roads',
              description: item.description || 'Civic hazard reported by citizen in ward.',
              location: item.location || 'Duvvada, Visakhapatnam',
              latitude: item.latitude || item.locationCoords?.lat || 17.6868,
              longitude: item.longitude || item.locationCoords?.lng || 83.2185,
              image: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
              status: item.status || 'UNSOLVED',
              priority: item.priority || item.aiSeverity || 'High',
              reporterName: item.reporterName || item.user?.name || 'Verified Resident',
              date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'),
              createdAt: item.createdAt || new Date().toISOString(),
              assignedDepartment: item.assignedDepartment || item.assignedDept || 'Roads & Infrastructure Department',
              officerRemarks: item.officerRemarks || '',
              actionTaken: item.actionTaken || '',
              timeline: item.timeline || []
            });
          }
        }
      });

      const merged = Array.from(mapById.values());
      if (isMountedRef.current) {
        setQueue(merged);
      }
    } catch (err) {
      console.error("Queue load error:", err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadQueue();

    const interval = setInterval(loadQueue, 4000);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // Filter queue
  const filteredQueue = queue.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (item.id || '').toLowerCase().includes(term) ||
      (item.title || '').toLowerCase().includes(term) ||
      (item.location || '').toLowerCase().includes(term) ||
      (item.category || '').toLowerCase().includes(term) ||
      (item.reporterName || '').toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === 'All' ||
      (item.category || '').toLowerCase() === selectedCategory.toLowerCase();

    const matchesPriority =
      selectedPriority === 'All' ||
      (item.priority || 'Medium').toLowerCase() === selectedPriority.toLowerCase();

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // KPI Metrics for top summary bar
  const totalPending = queue.length;
  const criticalCount = queue.filter(i => (i.priority || '').toLowerCase() === 'critical' || (i.priority || '').toLowerCase() === 'high').length;
  const underReviewCount = queue.filter(i => (i.status || '').toUpperCase() === 'UNDER REVIEW').length;

  // 1. Confirm Verify Action
  const handleConfirmVerify = async () => {
    if (!activeIssue) return;
    const issueId = activeIssue._id || activeIssue.id;

    const payload = {
      status: 'UNDER REVIEW',
      officerRemarks: verifyRemarks || 'Issue verified on-site by Ward Officer.',
      actionTaken: 'Field verification confirmed. Routed to dispatch queue.',
      updatedBy: officerName
    };

    if (token) {
      try {
        await axios.put(`http://localhost:5000/api/issues/${issueId}/officer-update`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("API verify error:", err);
      }
    }

    // Sync localStorage
    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === issueId || item._id === issueId) {
          return { ...item, ...payload, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    // Update state
    setQueue(prev => prev.map(item => {
      if (item.id === issueId || item._id === issueId) {
        return { ...item, ...payload };
      }
      return item;
    }));

    showToast(`Report verified & logged in dispatch queue! (+20 XP logged)`);
    setModalMode(null);
    setActiveIssue(null);
    loadQueue();
  };

  // 2. Confirm Reject Action (Preserves report for audit, marks status as 'Rejected')
  const handleConfirmReject = async () => {
    if (!activeIssue) return;
    const issueId = activeIssue._id || activeIssue.id;
    const reasonText = rejectReason.trim() || 'Duplicate / Insufficient details';

    const payload = {
      status: 'Rejected',
      officerRemarks: `Rejected by Officer: ${reasonText}`,
      actionTaken: `Report rejected. Reason: ${reasonText}`,
      updatedBy: officerName
    };

    if (token) {
      try {
        await axios.put(`http://localhost:5000/api/issues/${issueId}/officer-update`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("API reject error:", err);
      }
    }

    // Sync localStorage
    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === issueId || item._id === issueId) {
          return { ...item, ...payload, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    // Remove from active pending queue
    setQueue(prev => prev.filter(i => i.id !== issueId && i._id !== issueId));

    showToast(`Report marked Rejected. Reason: "${reasonText}"`);
    setRejectReason('');
    setModalMode(null);
    setActiveIssue(null);
    loadQueue();
  };

  // 3. Confirm Assign Department Action
  const handleConfirmAssign = async () => {
    if (!activeIssue) return;
    const issueId = activeIssue._id || activeIssue.id;

    const payload = {
      status: 'IN PROGRESS',
      priority: assignPriority,
      assignedDepartment: assignDept,
      officerRemarks: assignRemarks || `Assigned to ${assignDept} for repairs.`,
      actionTaken: `Dispatched to ${assignDept} with ${assignPriority} priority.`,
      expectedResolutionDate: expectedDate,
      updatedBy: officerName
    };

    if (token) {
      try {
        await axios.put(`http://localhost:5000/api/issues/${issueId}/officer-update`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("API assign error:", err);
      }
    }

    // Sync localStorage
    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === issueId || item._id === issueId) {
          return { ...item, ...payload, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    // Remove from verification queue as it is now in progress
    setQueue(prev => prev.filter(i => i.id !== issueId && i._id !== issueId));

    showToast(`Report dispatched to ${assignDept} (${assignPriority} Priority)!`);
    setModalMode(null);
    setActiveIssue(null);
    loadQueue();
  };

  return (
    <div className="verify-issues-page">
      {/* Toast Notification */}
      {toast && (
        <div className="officer-toast-success animate-fade-in">
          <FiCheck className="check-icon" /> {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="verify-top-header">
        <div className="verify-header-left">
          <h1>Ward Issue Verification Queue</h1>
          <p className="verify-subtitle">
            Inspect incoming citizen reports, verify ground truth, reject spam, and route to municipal departments for {wardName}.
          </p>
        </div>

        <div className="verify-header-right">
          <div className="ward-badge-tag">
            <FiShield /> {wardId} • Verification Station
          </div>

          <div className="realtime-status-pill">
            <span className="pulse-green-dot"></span> Real-time Live
          </div>
        </div>
      </div>

      {/* SUMMARY KPI CARDS BAR */}
      <div className="verify-summary-grid">
        <div className="verify-summary-card">
          <div className="summary-icon-box orange">
            <FiClock />
          </div>
          <div className="summary-card-text">
            <span className="summary-card-num">{totalPending}</span>
            <span className="summary-card-label">Pending Verification</span>
          </div>
        </div>

        <div className="verify-summary-card">
          <div className="summary-icon-box red">
            <FiAlertTriangle />
          </div>
          <div className="summary-card-text">
            <span className="summary-card-num">{criticalCount}</span>
            <span className="summary-card-label">Critical / High Priority</span>
          </div>
        </div>

        <div className="verify-summary-card">
          <div className="summary-icon-box blue">
            <FiShield />
          </div>
          <div className="summary-card-text">
            <span className="summary-card-num">{underReviewCount}</span>
            <span className="summary-card-label">Under Active Review</span>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="verify-controls-card">
        <div className="verify-search-row">
          <div className="verify-search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Report ID, title, location, category, or reporter..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="verify-filter-group">
            <select 
              className="filter-select"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* VERIFICATION CARDS GRID */}
      {loading ? (
        <div className="verify-empty-card">
          <FiLoader className="spin-icon text-blue" style={{ fontSize: '2rem', color: '#155EEF' }} />
          <p>Loading incoming ward reports...</p>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="verify-empty-card">
          <FiCheckCircle style={{ fontSize: '2.5rem', color: '#16A34A' }} />
          <h3>Verification Queue is Clear!</h3>
          <p>All citizen reports in {wardName} have been inspected and verified.</p>
        </div>
      ) : (
        <div className="verification-cards-grid">
          {filteredQueue.map((item) => (
            <div key={item.id || item._id} className="verification-card">
              {/* Media Preview */}
              <div className="v-card-media">
                <img src={item.image} alt={item.title} />
                <div className="v-card-tags-overlay" style={{ justifyContent: 'flex-end' }}>
                  <span className={`priority-badge-overlay ${(item.priority || 'Medium').toLowerCase()}`}>
                    {item.priority} Priority
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="v-card-body">
                <div className="v-card-title-row">
                  <h3>{item.title}</h3>
                  <span className="category-chip">{item.category}</span>
                </div>

                <p className="v-card-desc">{item.description}</p>

                <div className="v-card-meta-list">
                  <div className="meta-item-line">
                    <FiMapPin style={{ color: '#EF4444' }} />
                    <span><strong>Location:</strong> {item.location}</span>
                  </div>
                  <div className="meta-item-line">
                    <FiUser style={{ color: '#155EEF' }} />
                    <span><strong>Reporter:</strong> {item.reporterName}</span>
                  </div>
                  <div className="meta-item-line">
                    <FiClock style={{ color: '#64748B' }} />
                    <span><strong>Submitted:</strong> {item.date}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="v-card-actions">
                  <button 
                    className="btn-v-action btn-v-view"
                    onClick={() => { setActiveIssue(item); setModalMode('view'); }}
                  >
                    <FiEye /> View
                  </button>

                  <button 
                    className="btn-v-action btn-v-verify"
                    onClick={() => { 
                      setActiveIssue(item); 
                      setVerifyRemarks(`Issue verified on-site by ${officerName}. Inspection confirmed.`);
                      setModalMode('verify'); 
                    }}
                  >
                    <FiCheckCircle /> Verify
                  </button>

                  <button 
                    className="btn-v-action btn-v-assign"
                    onClick={() => { 
                      setActiveIssue(item); 
                      setAssignPriority(item.priority || 'High');
                      setModalMode('assign'); 
                    }}
                  >
                    <FiShare2 /> Assign
                  </button>

                  <button 
                    className="btn-v-action btn-v-reject"
                    onClick={() => { setActiveIssue(item); setRejectReason(''); setModalMode('reject'); }}
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================================
          MODALS / DIALOGS
          ==================================================================== */}

      {/* 1. INSPECT & VERIFY MODAL */}
      {modalMode === 'verify' && activeIssue && (
        <div className="v-modal-backdrop" onClick={() => setModalMode(null)}>
          <div className="v-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="v-modal-header">
              <h3><FiCheckCircle style={{ color: '#16A34A' }} /> Verify Report</h3>
              <button className="btn-v-close" onClick={() => setModalMode(null)}><FiX /></button>
            </div>

            <div className="v-modal-body">
              <img src={activeIssue.image} alt={activeIssue.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#0F172A', fontWeight: 700 }}>{activeIssue.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>📍 {activeIssue.location}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Officer Verification Remarks</label>
                <textarea 
                  rows="3"
                  value={verifyRemarks}
                  onChange={(e) => setVerifyRemarks(e.target.value)}
                  placeholder="Enter notes on field inspection or verification confirmation..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                ></textarea>
              </div>
            </div>

            <div className="v-modal-footer">
              <button className="btn-modal-cancel" onClick={() => setModalMode(null)}>Cancel</button>
              <button className="btn-modal-success" onClick={handleConfirmVerify}>
                <FiCheck /> Confirm & Verify Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REJECT REPORT MODAL */}
      {modalMode === 'reject' && activeIssue && (
        <div className="v-modal-backdrop" onClick={() => setModalMode(null)}>
          <div className="v-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="v-modal-header">
              <h3><FiXCircle style={{ color: '#DC2626' }} /> Reject Report</h3>
              <button className="btn-v-close" onClick={() => setModalMode(null)}><FiX /></button>
            </div>

            <div className="v-modal-body">
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                Please specify a reason for rejecting this report. The report will be kept in audit history with your reason logged.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Rejection Reason (Required)</label>
                <textarea 
                  rows="3"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Duplicate submission, insufficient evidence, private property issue..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                ></textarea>
              </div>
            </div>

            <div className="v-modal-footer">
              <button className="btn-modal-cancel" onClick={() => setModalMode(null)}>Cancel</button>
              <button className="btn-modal-danger" onClick={handleConfirmReject}>
                <FiXCircle /> Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ASSIGN DEPARTMENT MODAL */}
      {modalMode === 'assign' && activeIssue && (
        <div className="v-modal-backdrop" onClick={() => setModalMode(null)}>
          <div className="v-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="v-modal-header">
              <h3><FiShare2 style={{ color: '#155EEF' }} /> Assign to Department</h3>
              <button className="btn-v-close" onClick={() => setModalMode(null)}><FiX /></button>
            </div>

            <div className="v-modal-body">
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                Route <strong>{activeIssue.title}</strong> directly to the appropriate municipal engineering wing.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Select Department</label>
                  <select 
                    value={assignDept}
                    onChange={(e) => setAssignDept(e.target.value)}
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  >
                    <option value="Roads & Infrastructure Department">Roads & Infrastructure Department</option>
                    <option value="GVMC Sanitation & Waste Board">GVMC Sanitation & Waste Board</option>
                    <option value="Electrical Maintenance Wing">Electrical Maintenance Wing</option>
                    <option value="Water Supply & Sewerage Board">Water Supply & Sewerage Board</option>
                    <option value="Drainage & Stormwater Department">Drainage & Stormwater Department</option>
                    <option value="Public Safety Task Force">Public Safety Task Force</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Assign Priority</label>
                  <select 
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value)}
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Expected Resolution Date</label>
                <input 
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  style={{ padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Dispatch Remarks / Instructions</label>
                <textarea 
                  rows="2"
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                  placeholder="e.g. Please deploy asphalt patching crew on priority."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                ></textarea>
              </div>
            </div>

            <div className="v-modal-footer">
              <button className="btn-modal-cancel" onClick={() => setModalMode(null)}>Cancel</button>
              <button className="btn-modal-primary" onClick={handleConfirmAssign}>
                <FiShare2 /> Dispatch Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW DETAILS MODAL */}
      {modalMode === 'view' && activeIssue && (
        <div className="v-modal-backdrop" onClick={() => setModalMode(null)}>
          <div className="v-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="v-modal-header">
              <h3><FiEye style={{ color: '#155EEF' }} /> Issue Details</h3>
              <button className="btn-v-close" onClick={() => setModalMode(null)}><FiX /></button>
            </div>

            <div className="v-modal-body">
              <img src={activeIssue.image} alt={activeIssue.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              
              <h4 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>{activeIssue.title}</h4>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>{activeIssue.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <div><strong>Category:</strong> {activeIssue.category}</div>
                <div><strong>Priority:</strong> {activeIssue.priority}</div>
                <div><strong>Location:</strong> {activeIssue.location}</div>
                <div><strong>Reporter:</strong> {activeIssue.reporterName}</div>
                <div><strong>Reported Date:</strong> {activeIssue.date}</div>
                <div><strong>Status:</strong> {activeIssue.status}</div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#155EEF', fontFamily: 'monospace' }}>
                GPS: Latitude {Number(activeIssue.latitude).toFixed(6)} | Longitude {Number(activeIssue.longitude).toFixed(6)}
              </div>
            </div>

            <div className="v-modal-footer">
              <button className="btn-modal-primary" onClick={() => setModalMode(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}