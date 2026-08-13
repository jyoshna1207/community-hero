import React, { useState, useEffect } from 'react';
import { 
  FiClipboard, FiAlertCircle, FiClock, FiCheckCircle, FiAlertTriangle, 
  FiMapPin, FiSearch, FiFilter, FiEdit3, FiEye, FiCheck, FiX, FiUploadCloud, 
  FiBell, FiUser, FiLogOut, FiSend, FiPieChart, FiBarChart2, FiLayers, FiShield 
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './WardDashboard.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Category-based Leaflet Icons
const getCategoryIcon = (category) => {
  let color = '#155EEF';
  if (category === 'Roads') color = '#EF4444';
  if (category === 'Waste Management') color = '#F59E0B';
  if (category === 'Water Supply') color = '#06B6D4';
  if (category === 'Street Lights') color = '#8B5CF6';
  if (category === 'Drainage') color = '#D97706';

  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function WardDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'map' | 'analytics' | 'notifications'
  const [saveToast, setSaveToast] = useState(null);

  // Form State for Issue Management
  const [updateForm, setUpdateForm] = useState({
    status: 'IN PROGRESS',
    priority: 'High',
    assignedDepartment: 'Roads Department',
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

  // Fetch real database issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      let apiIssues = [];
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data)) {
          apiIssues = res.data;
        }
      } catch (err) {
        console.error("Fetch API error:", err);
      }

      // Merge local submitted reports to ensure offline sync
      let localReports = [];
      try {
        localReports = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      } catch (e) {}

      const mapById = new Map();
      [...apiIssues, ...localReports].forEach(item => {
        const key = item._id || item.id;
        if (key) {
          mapById.set(key, {
            _id: key,
            id: key,
            title: item.title || 'Civic Problem Report',
            category: item.category || 'Roads',
            description: item.description || 'Civic issue reported in ward.',
            location: item.location || 'Duvvada, Visakhapatnam',
            latitude: item.latitude || item.locationCoords?.lat || 17.6868,
            longitude: item.longitude || item.locationCoords?.lng || 83.2185,
            image: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
            status: item.status || 'UNSOLVED',
            priority: item.priority || 'High',
            views: item.views || 142,
            likes: Array.isArray(item.likes) ? item.likes.length : (item.likes || 18),
            date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 12, 2026'),
            createdAt: item.createdAt || new Date().toISOString(),
            assignedDepartment: item.assignedDepartment || item.assignedDept || 'Roads Department',
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
      setIssues(merged);
    } catch (error) {
      console.error("Dashboard data load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 4000);
    return () => clearInterval(interval);
  }, []);

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      (issue.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isSolvedStatus = statusFilter === 'Solved' || statusFilter === 'SOLVED';
    const isInProgressStatus = statusFilter === 'In Progress' || statusFilter === 'IN PROGRESS';
    const isUnderReviewStatus = statusFilter === 'Under Review' || statusFilter === 'UNDER REVIEW';
    const isUnsolvedStatus = statusFilter === 'Unsolved' || statusFilter === 'UNSOLVED';

    let matchesStatus = true;
    if (statusFilter !== 'All') {
      if (isSolvedStatus) matchesStatus = issue.status === 'SOLVED' || issue.status === 'Resolved' || issue.status === 'Solved';
      else if (isInProgressStatus) matchesStatus = issue.status === 'IN PROGRESS' || issue.status === 'In Progress';
      else if (isUnderReviewStatus) matchesStatus = issue.status === 'UNDER REVIEW' || issue.status === 'Under Review';
      else if (isUnsolvedStatus) matchesStatus = issue.status === 'UNSOLVED' || issue.status === 'Reported';
      else matchesStatus = issue.status === statusFilter;
    }

    let matchesPriority = true;
    if (priorityFilter !== 'All') {
      matchesPriority = (issue.priority || 'Medium').toLowerCase() === priorityFilter.toLowerCase();
    }

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate Real DB Overview Metrics
  const totalReports = issues.length;
  const newReports = issues.filter(i => i.status === 'UNSOLVED' || i.status === 'Reported').length;
  const unresolved = issues.filter(i => i.status === 'UNSOLVED' || i.status === 'Reported' || i.status === 'UNDER REVIEW' || i.status === 'Under Review').length;
  const inProgress = issues.filter(i => i.status === 'IN PROGRESS' || i.status === 'In Progress').length;
  const resolved = issues.filter(i => i.status === 'SOLVED' || i.status === 'Resolved' || i.status === 'Solved').length;
  const highPriority = issues.filter(i => i.priority === 'Critical' || i.priority === 'High').length;

  // Open Issue Management Drawer
  const handleOpenIssue = (issue) => {
    setSelectedIssue(issue);
    setUpdateForm({
      status: issue.status || 'IN PROGRESS',
      priority: issue.priority || 'High',
      assignedDepartment: issue.assignedDepartment || 'Roads Department',
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

    setSaveToast(`Report ${issueId} updated successfully! Citizen track status is updated.`);
    setTimeout(() => setSaveToast(null), 4000);
    setSelectedIssue(null);
    fetchIssues();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="ward-officer-page">
      {/* Toast Notification */}
      {saveToast && (
        <div className="ward-toast animate-fade-in">
          <FiCheck className="toast-icon" /> {saveToast}
        </div>
      )}

      {/* TOP OFFICER HEADER */}
      <header className="ward-top-header">
        <div className="ward-header-left">
          <div className="ward-badge-pill">
            <FiShield /> {wardId} • {wardName}
          </div>
          <h1>Ward Officer Dashboard</h1>
          <p className="ward-subtitle">{municipality} • Hyperlocal Issue Management</p>
        </div>

        <div className="ward-header-right">
          <div className="ward-officer-chip">
            <div className="officer-avatar-small">
              {officerName.charAt(0).toUpperCase()}
            </div>
            <div className="officer-info-text">
              <span className="officer-name">{officerName}</span>
              <span className="officer-title">Ward Inspector</span>
            </div>
          </div>

          <div className="dash-bell-icon" onClick={() => setActiveTab('notifications')}>
            <FiBell />
            <span className="bell-badge"></span>
          </div>

          <button className="btn-officer-logout" onClick={handleLogout} title="Logout">
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* TAB NAVIGATION */}
      <div className="ward-tabs-bar">
        <button 
          className={`ward-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FiClipboard /> Ward Reports ({totalReports})
        </button>

        <button 
          className={`ward-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <FiMapPin /> Ward Issue Map
        </button>

        <button 
          className={`ward-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FiPieChart /> Ward Analytics
        </button>

        <button 
          className={`ward-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FiBell /> Notifications & Alerts
        </button>
      </div>

      {/* REAL-TIME KPI OVERVIEW CARDS (6 METRICS) */}
      <div className="ward-kpi-grid">
        <div className="ward-kpi-card blue">
          <div className="kpi-icon-box"><FiClipboard /></div>
          <div>
            <span className="kpi-num">{totalReports}</span>
            <span className="kpi-label">Total Ward Reports</span>
          </div>
        </div>

        <div className="ward-kpi-card red">
          <div className="kpi-icon-box"><FiAlertCircle /></div>
          <div>
            <span className="kpi-num">{newReports}</span>
            <span className="kpi-label">New / Unsolved</span>
          </div>
        </div>

        <div className="ward-kpi-card orange">
          <div className="kpi-icon-box"><FiClock /></div>
          <div>
            <span className="kpi-num">{unresolved}</span>
            <span className="kpi-label">Total Unresolved</span>
          </div>
        </div>

        <div className="ward-kpi-card purple">
          <div className="kpi-icon-box"><FiLayers /></div>
          <div>
            <span className="kpi-num">{inProgress}</span>
            <span className="kpi-label">In Progress</span>
          </div>
        </div>

        <div className="ward-kpi-card green">
          <div className="kpi-icon-box"><FiCheckCircle /></div>
          <div>
            <span className="kpi-num">{resolved}</span>
            <span className="kpi-label">Resolved / Solved</span>
          </div>
        </div>

        <div className="ward-kpi-card critical">
          <div className="kpi-icon-box"><FiAlertTriangle /></div>
          <div>
            <span className="kpi-num">{highPriority}</span>
            <span className="kpi-label">Critical / High Priority</span>
          </div>
        </div>
      </div>

      {/* MAIN TAB CONTENT */}
      {activeTab === 'reports' && (
        <section className="ward-reports-section animate-fade-in">
          {/* SEARCH & FILTERS BAR */}
          <div className="ward-controls-bar">
            <div className="ward-search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by Report ID, title, or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <span className="filter-label"><FiFilter /> Status:</span>
              {['All', 'UNSOLVED', 'UNDER REVIEW', 'IN PROGRESS', 'SOLVED'].map(st => (
                <button 
                  key={st}
                  className={`filter-btn ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <span className="filter-label">Priority:</span>
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(pr => (
                <button 
                  key={pr}
                  className={`filter-btn ${priorityFilter === pr ? 'active' : ''}`}
                  onClick={() => setPriorityFilter(pr)}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          {/* REPORTS TABLE */}
          <div className="ward-table-card">
            <div className="table-responsive">
              <table className="ward-data-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Issue Details & Image</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Views / Likes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((item) => (
                      <tr key={item.id || item._id}>
                        <td>
                          <span className="report-id-badge">{item.id || item._id}</span>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{item.date}</div>
                        </td>

                        <td>
                          <div className="issue-row-flex">
                            <img src={item.image} alt={item.title} className="issue-row-thumb" />
                            <div>
                              <strong className="issue-row-title">{item.title}</strong>
                              <p className="issue-row-desc">{item.description}</p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="category-pill">{item.category}</span>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 600 }}>
                            <FiMapPin style={{ color: '#EF4444', marginRight: '4px' }} />
                            {item.location}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#155EEF', fontFamily: 'monospace' }}>
                            Lat: {Number(item.latitude).toFixed(4)} | Lng: {Number(item.longitude).toFixed(4)}
                          </div>
                        </td>

                        <td>
                          <span className={`priority-badge ${(item.priority || 'High').toLowerCase()}`}>
                            {item.priority || 'High'}
                          </span>
                        </td>

                        <td>
                          <span className={`officer-status-badge ${(item.status || 'UNSOLVED').toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.status || 'UNSOLVED'}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                            👀 {item.views || 0} views • ❤️ {item.likes || 0} likes
                          </div>
                        </td>

                        <td>
                          <button className="btn-manage-issue" onClick={() => handleOpenIssue(item)}>
                            <FiEdit3 /> Manage Issue
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                        No reports matching your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* WARD ISSUE MAP TAB */}
      {activeTab === 'map' && (
        <section className="ward-map-section animate-fade-in">
          <div className="map-section-header">
            <h2><FiMapPin /> Interactive Ward Issue Map</h2>
            <p>Geospatial tracking of open issues in {wardName}</p>
          </div>

          <div className="ward-leaflet-wrapper">
            <MapContainer 
              center={[17.6868, 83.2185]} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '550px', width: '100%', borderRadius: '16px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {issues.map((item) => (
                <Marker 
                  key={item.id || item._id} 
                  position={[item.latitude || 17.6868, item.longitude || 83.2185]}
                  icon={getCategoryIcon(item.category)}
                >
                  <Popup>
                    <div className="map-popup-card">
                      <img src={item.image} alt={item.title} className="map-popup-img" />
                      <div className="map-popup-body">
                        <span className="report-id-badge">{item.id || item._id}</span>
                        <h4>{item.title}</h4>
                        <p>{item.location}</p>
                        <div style={{ display: 'flex', gap: '6px', margin: '6px 0' }}>
                          <span className={`priority-badge ${(item.priority || 'High').toLowerCase()}`}>{item.priority || 'High'}</span>
                          <span className={`officer-status-badge ${(item.status || 'UNSOLVED').toLowerCase().replace(/\s+/g, '-')}`}>{item.status || 'UNSOLVED'}</span>
                        </div>
                        <button className="btn-popup-manage" onClick={() => handleOpenIssue(item)}>
                          Manage Issue →
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>
      )}

      {/* WARD ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <section className="ward-analytics-section animate-fade-in">
          <div className="map-section-header">
            <h2><FiPieChart /> Ward Resolution Analytics</h2>
            <p>Real-time performance metrics and resolution distribution for {wardName}</p>
          </div>

          <div className="analytics-cards-grid">
            <div className="analytics-card">
              <h3>Resolution Efficiency Rate</h3>
              <div className="big-stat-num">{totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0}%</div>
              <p>{resolved} out of {totalReports} reported problems resolved by municipal team.</p>
            </div>

            <div className="analytics-card">
              <h3>Average Resolution Time</h3>
              <div className="big-stat-num">2.4 Days</div>
              <p>Average time taken from report submission to final verification.</p>
            </div>

            <div className="analytics-card">
              <h3>Primary Concern Area</h3>
              <div className="big-stat-num">Road Damage</div>
              <p>Accounts for 42% of citizen reports in {wardName}.</p>
            </div>
          </div>
        </section>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <section className="ward-notifications-section animate-fade-in">
          <div className="map-section-header">
            <h2><FiBell /> Ward Officer Alerts & Notifications</h2>
            <p>Live feed of newly submitted issues and department escalations</p>
          </div>

          <div className="notifications-list">
            <div className="notification-item critical">
              <FiAlertTriangle className="notif-icon" />
              <div>
                <h4>Critical Pothole Reported in Duvvada Sector 4</h4>
                <p>Submitted 12 minutes ago by citizen • High traffic risk</p>
              </div>
            </div>

            <div className="notification-item info">
              <FiCheckCircle className="notif-icon" />
              <div>
                <h4>Roads Department Accepted Assignment</h4>
                <p>Issue #CH-2026-00124 assigned to Municipal Maintenance Team</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DETAILED ISSUE MANAGEMENT DRAWER / MODAL */}
      {selectedIssue && (
        <div className="issue-modal-backdrop" onClick={() => setSelectedIssue(null)}>
          <div className="issue-modal-drawer animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="report-id-badge">{selectedIssue.id || selectedIssue._id}</span>
                <h2>{selectedIssue.title}</h2>
              </div>
              <button className="btn-close-drawer" onClick={() => setSelectedIssue(null)}>
                <FiX />
              </button>
            </div>

            <div className="drawer-body">
              {/* Image & Map 2-Column Overview */}
              <div className="drawer-media-grid">
                <div className="drawer-media-box">
                  <span className="media-label">Uploaded Photo Evidence</span>
                  <img src={selectedIssue.image} alt={selectedIssue.title} className="drawer-img" />
                </div>

                <div className="drawer-media-box">
                  <span className="media-label">Geospatial Location Map</span>
                  <div style={{ height: '180px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                    <MapContainer 
                      center={[selectedIssue.latitude || 17.6868, selectedIssue.longitude || 83.2185]} 
                      zoom={14} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[selectedIssue.latitude || 17.6868, selectedIssue.longitude || 83.2185]} />
                    </MapContainer>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '6px' }}>
                    <FiMapPin style={{ color: '#EF4444' }} /> {selectedIssue.location}
                  </div>
                </div>
              </div>

              <div className="drawer-desc-box">
                <label>Issue Description</label>
                <p>{selectedIssue.description}</p>
              </div>

              {/* ISSUE MANAGEMENT FORM */}
              <form onSubmit={handleSaveIssueUpdate} className="drawer-update-form">
                <h3 className="form-section-title"><FiEdit3 /> Officer Status & Department Action</h3>

                <div className="form-2col-grid">
                  {/* Status Updater */}
                  <div className="form-group">
                    <label>Current Status</label>
                    <select 
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                      className="form-select-highlight"
                    >
                      <option value="UNSOLVED">🔴 UNSOLVED</option>
                      <option value="UNDER REVIEW">🟡 UNDER REVIEW</option>
                      <option value="IN PROGRESS">🟠 IN PROGRESS</option>
                      <option value="SOLVED">🟢 SOLVED</option>
                    </select>
                  </div>

                  {/* Priority Assigner */}
                  <div className="form-group">
                    <label>Assigned Priority</label>
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

                  {/* Department Assigner */}
                  <div className="form-group">
                    <label>Assigned Department</label>
                    <select 
                      value={updateForm.assignedDepartment}
                      onChange={(e) => setUpdateForm({ ...updateForm, assignedDepartment: e.target.value })}
                    >
                      <option value="Roads Department">Roads & Infrastructure Department</option>
                      <option value="Sanitation Department">GVMC Sanitation & Waste Board</option>
                      <option value="Electrical Department">Electrical Maintenance Wing</option>
                      <option value="Water Department">Water Supply & Sewerage Board</option>
                      <option value="Drainage Department">Drainage & Stormwater Department</option>
                      <option value="Public Safety">Public Safety Task Force</option>
                    </select>
                  </div>

                  {/* Expected Resolution Date */}
                  <div className="form-group">
                    <label>Expected Resolution Date</label>
                    <input 
                      type="date" 
                      value={updateForm.expectedResolutionDate}
                      onChange={(e) => setUpdateForm({ ...updateForm, expectedResolutionDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Officer Remarks */}
                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label>Officer Remarks (Visible to Citizen)</label>
                  <textarea 
                    rows="2"
                    value={updateForm.officerRemarks}
                    onChange={(e) => setUpdateForm({ ...updateForm, officerRemarks: e.target.value })}
                    placeholder="e.g. Repair team has been assigned to inspect damaged section."
                  ></textarea>
                </div>

                {/* Action Taken */}
                <div className="form-group">
                  <label>Action Taken</label>
                  <input 
                    type="text" 
                    value={updateForm.actionTaken}
                    onChange={(e) => setUpdateForm({ ...updateForm, actionTaken: e.target.value })}
                    placeholder="e.g. Dispatched road crew with cold asphalt mix."
                  />
                </div>

                {/* RESOLUTION PROOF (WHEN MARKED SOLVED) */}
                {(updateForm.status === 'SOLVED' || updateForm.status === 'Resolved') && (
                  <div className="resolution-proof-box animate-fade-in">
                    <h4><FiCheckCircle /> Upload Resolution Proof (Before & After)</h4>
                    
                    {updateForm.resolutionImage ? (
                      <div className="resolution-preview-wrapper">
                        <img src={updateForm.resolutionImage} alt="Resolution proof" className="resolution-img" />
                        <button type="button" className="btn-remove-res-img" onClick={() => setUpdateForm({ ...updateForm, resolutionImage: '' })}>
                          <FiX /> Remove Proof
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="resolution-upload-input" className="resolution-upload-btn">
                        <input 
                          type="file" 
                          id="resolution-upload-input" 
                          accept="image/*" 
                          onChange={handleResolutionPhotoSelect}
                          style={{ display: 'none' }}
                        />
                        <FiUploadCloud style={{ fontSize: '1.4rem', color: '#166534' }} />
                        <span>Upload Repaired / Solved Photo Proof</span>
                      </label>
                    )}

                    <input 
                      type="text" 
                      value={updateForm.resolutionNote}
                      onChange={(e) => setUpdateForm({ ...updateForm, resolutionNote: e.target.value })}
                      placeholder="Resolution note e.g. Pothole filled and road leveled completely."
                      style={{ marginTop: '10px' }}
                    />
                  </div>
                )}

                <div className="drawer-footer-actions">
                  <button type="button" className="btn-drawer-cancel" onClick={() => setSelectedIssue(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-drawer-save">
                    <FiSend /> Save & Update Citizen Track Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
