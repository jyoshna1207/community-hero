import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiArrowLeft, FiShare2, FiMapPin, FiClock, FiCheckCircle, 
  FiAlertCircle, FiThumbsUp, FiHeart, FiEye, FiShield, FiLoader, FiBriefcase, FiCalendar, FiEdit3 
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import './TrackReport.css';

// Leaflet SVG DivIcon for exact marker pin
const customPinIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div class="custom-marker-wrapper">
      <div class="custom-marker-head">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="custom-marker-shadow"></div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
});

export default function TrackReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(1);
  const isMountedRef = useRef(true);

  // Fetch Report with Auto-Polling every 4 seconds for real-time status updates from Ward Officer
  const fetchReportDetails = async (isInitial = false) => {
    if (!id) {
      setError("Invalid Report ID provided.");
      setLoading(false);
      return;
    }

    try {
      // First check local storage for newly submitted reports
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const foundLocal = local.find(item => item.id === id || item._id === id);

      let fetchedData = null;
      try {
        const res = await axios.get(`http://localhost:5000/api/issues/${id}`);
        if (res.data) {
          fetchedData = res.data;
        }
      } catch (apiErr) {
        if (foundLocal) {
          fetchedData = foundLocal;
        }
      }

      if (!fetchedData && foundLocal) {
        fetchedData = foundLocal;
      }

      if (fetchedData && isMountedRef.current) {
        setReport(fetchedData);
        
        const likesArr = fetchedData.likes || [];
        setLikesCount(Array.isArray(likesArr) ? likesArr.length : (likesArr || 0));
        setViewsCount(fetchedData.views != null ? fetchedData.views : 1);

        if (user && Array.isArray(likesArr) && likesArr.some(l => l.user === user._id || l.user?._id === user._id || l === user._id)) {
          setIsLiked(true);
        }

        setError(null);
      } else if (!report && isMountedRef.current) {
        setReport({
          _id: id,
          id: id,
          title: 'Pothole Near College Entrance',
          category: 'Roads',
          status: 'UNSOLVED',
          priority: 'High',
          location: 'Anuru, Thondangi, Kakinada, Andhra Pradesh, India',
          latitude: 17.281524,
          longitude: 82.521632,
          description: 'Large pothole near the college entrance causing vehicle traffic hazard.',
          image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          createdAt: new Date().toISOString()
        });
        setLikesCount(0);
        setViewsCount(1);
      }
    } catch (err) {
      console.error("Track report error:", err);
      if (isInitial && isMountedRef.current) {
        setError("Report not found or database unavailable.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchReportDetails(true);

    const interval = setInterval(() => {
      fetchReportDetails(false);
    }, 4000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [id]);

  const handleToggleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }

    if (token && id) {
      try {
        const res = await axios.post(`http://localhost:5000/api/issues/${id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setLikesCount(res.data.likesCount);
          setIsLiked(res.data.isLiked);
        }
      } catch (err) {
        console.error("Toggle like error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="track-report-loading-container">
        <FiLoader className="spin-icon text-blue" />
        <p>Loading report tracking status...</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="track-report-error-container">
        <FiAlertCircle className="error-icon" />
        <h2>Report Not Found</h2>
        <p>{error}</p>
        <button className="btn-back-home" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  // Extract Report Properties
  const reportId = report._id || report.id || id;
  const title = report.title || 'Civic Issue Report';
  const category = report.category || 'General';
  const description = report.description || 'No detailed description provided.';
  const location = report.location || 'Local Ward Location';
  const rawStatus = (report.status || 'UNSOLVED').trim();
  const priority = report.priority || 'High';
  const image = report.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
  const lat = Number(report.latitude ?? report.locationCoords?.lat ?? 17.281524);
  const lng = Number(report.longitude ?? report.locationCoords?.lng ?? 82.521632);
  const reportedDate = report.createdAt || report.reportedDate 
    ? new Date(report.createdAt || report.reportedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : 'Recent';

  // Ward Officer Action Updates
  const officerRemarks = report.officerRemarks || '';
  const actionTaken = report.actionTaken || '';
  const expectedResolutionDate = report.expectedResolutionDate || '';
  const assignedDepartment = report.assignedDepartment || report.assignedDept || 'Roads & Municipal Department';
  const resolutionImage = report.resolutionImage || '';
  const resolutionNote = report.resolutionNote || '';

  // Determine Primary Statuses (🔴 UNSOLVED, 🟡 UNDER REVIEW, 🟠 IN PROGRESS, 🟢 SOLVED)
  let statusBadgeClass = 'badge-unsolved';
  let statusLabel = '🔴 UNSOLVED';
  let statusMessage = 'The issue has been reported and queued for Ward Officer review.';

  if (rawStatus === 'SOLVED' || rawStatus === 'Resolved' || rawStatus === 'Solved') {
    statusBadgeClass = 'badge-solved';
    statusLabel = '🟢 SOLVED';
    statusMessage = 'The issue has been resolved by the Ward Officer and Municipal Department.';
  } else if (rawStatus === 'IN PROGRESS' || rawStatus === 'In Progress') {
    statusBadgeClass = 'badge-in-progress';
    statusLabel = '🟠 IN PROGRESS';
    statusMessage = 'The issue is currently undergoing active repairs by assigned municipal team.';
  } else if (rawStatus === 'UNDER REVIEW' || rawStatus === 'Under Review') {
    statusBadgeClass = 'badge-under-review';
    statusLabel = '🟡 UNDER REVIEW';
    statusMessage = 'The Ward Officer is evaluating the hazard and assigning technical department.';
  }

  // 4-Stage Timeline
  const isUnderReviewDone = rawStatus === 'UNDER REVIEW' || rawStatus === 'Under Review' || rawStatus === 'IN PROGRESS' || rawStatus === 'In Progress' || rawStatus === 'SOLVED' || rawStatus === 'Resolved';
  const isInProgressDone = rawStatus === 'IN PROGRESS' || rawStatus === 'In Progress' || rawStatus === 'SOLVED' || rawStatus === 'Resolved';
  const isSolvedDone = rawStatus === 'SOLVED' || rawStatus === 'Resolved' || rawStatus === 'Solved';

  const timelineStages = [
    { key: 'submitted', label: 'Report Submitted', isDone: true },
    { key: 'reviewed', label: 'Under Review', isDone: isUnderReviewDone },
    { key: 'in_progress', label: 'In Progress', isDone: isInProgressDone },
    { key: 'solved', label: 'Solved', isDone: isSolvedDone }
  ];

  return (
    <div className="track-report-page-container">
      {/* Top Back Navigation Bar */}
      <div className="track-top-bar">
        <button className="btn-back-link" onClick={() => navigate('/my-reports')}>
          <FiArrowLeft /> Back to My Reports
        </button>
        <span className="page-title-badge">Track Your Report</span>
      </div>

      {/* Main Tracking Card Wireframe Box */}
      <div className="track-main-card">
        {/* Card Header */}
        <div className="track-card-header">
          <div>
            <h1 className="track-issue-title">{title}</h1>
            <div className="track-id-row">
              <span className="id-label">Report ID:</span>
              <span className="id-value">#{reportId}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="category-pill-badge">{category}</span>
            <span className={`priority-badge ${priority.toLowerCase()}`}>{priority} Priority</span>
          </div>
        </div>

        {/* CURRENT STATUS CARD */}
        <div className="current-status-section">
          <label className="section-micro-label">CURRENT STATUS</label>
          <div className={`status-display-box ${statusBadgeClass}`}>
            <div className="status-header-line">
              <span className="status-badge-text">{statusLabel}</span>
            </div>
            <p className="status-explanation-text">{statusMessage}</p>
          </div>
        </div>

        {/* VISUAL STATUS TIMELINE */}
        <div className="status-timeline-section">
          <label className="section-micro-label">STATUS TIMELINE</label>
          <div className="timeline-horizontal-flow">
            {timelineStages.map((stage, idx) => (
              <React.Fragment key={stage.key}>
                <div className={`timeline-stage-item ${stage.isDone ? 'completed' : 'pending'}`}>
                  <div className="stage-icon-circle">
                    {stage.isDone ? <FiCheckCircle /> : <span className="ring-icon" />}
                  </div>
                  <span className="stage-label">{stage.label}</span>
                </div>

                {idx < timelineStages.length - 1 && (
                  <div className={`timeline-connector-line ${timelineStages[idx + 1].isDone ? 'active' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* WARD OFFICER UPDATE & ACTION TAKEN CARD */}
        {(officerRemarks || actionTaken || expectedResolutionDate || assignedDepartment) && (
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            padding: '18px',
            margin: '20px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0F172A', fontSize: '0.95rem', marginBottom: '12px' }}>
              <FiShield style={{ color: '#155EEF' }} /> Ward Officer Live Updates
            </div>

            {assignedDepartment && (
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiBriefcase style={{ color: '#155EEF' }} /> <strong>Assigned Department:</strong> {assignedDepartment}
              </div>
            )}

            {officerRemarks && (
              <div style={{ fontSize: '0.88rem', color: '#0F172A', background: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '8px' }}>
                <strong>Officer Remarks:</strong> "{officerRemarks}"
              </div>
            )}

            {actionTaken && (
              <div style={{ fontSize: '0.85rem', color: '#166534', background: '#F0FDF4', padding: '8px 12px', borderRadius: '8px', border: '1px solid #BBF7D0', marginBottom: '8px' }}>
                <strong>Action Taken:</strong> {actionTaken}
              </div>
            )}

            {expectedResolutionDate && (
              <div style={{ fontSize: '0.825rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                <FiCalendar /> Expected Resolution: {expectedResolutionDate}
              </div>
            )}
          </div>
        )}

        {/* RESOLUTION PROOF (BEFORE & AFTER) */}
        {resolutionImage && (
          <div style={{
            background: '#F0FDF4',
            border: '2px solid #86EFAC',
            borderRadius: '14px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#166534', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheckCircle /> Resolution Proof & Verified Solution
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '12px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>BEFORE (Reported Photo)</span>
                <img src={image} alt="Reported problem" style={{ width: '100%', height: '160px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #CBD5E1' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', display: 'block', marginBottom: '4px' }}>AFTER (Resolution Photo Proof)</span>
                <img src={resolutionImage} alt="Resolution proof" style={{ width: '100%', height: '160px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #86EFAC' }} />
              </div>
            </div>
            {resolutionNote && (
              <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', color: '#15803D', fontWeight: 600, background: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                "{resolutionNote}"
              </p>
            )}
          </div>
        )}

        <hr className="divider-line" />

        {/* REPORT SUMMARY DETAILS */}
        <div className="problem-details-section">
          <label className="section-micro-label">PROBLEM DETAILS</label>
          <p className="problem-description">{description}</p>
          
          {image && !resolutionImage && (
            <div className="report-image-preview-wrapper">
              <img src={image} alt={title} className="report-image-preview" />
            </div>
          )}

          <div className="report-meta-info-grid">
            <div>
              <span className="meta-label">Category:</span>
              <span className="meta-val">{category}</span>
            </div>
            <div>
              <span className="meta-label">Date Reported:</span>
              <span className="meta-val">{reportedDate}</span>
            </div>
          </div>
        </div>

        {/* REPORT LOCATION & MAP */}
        <div className="location-map-section">
          <label className="section-micro-label">📍 LOCATION</label>
          <p className="location-address-text">{location}</p>
          
          <div style={{ fontSize: '0.8rem', color: '#155EEF', fontFamily: 'monospace', marginBottom: '8px' }}>
            Latitude: {lat.toFixed(6)} | Longitude: {lng.toFixed(6)}
          </div>

          <div className="small-leaflet-map-wrapper">
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              scrollWheelZoom={false}
              className="small-leaflet-canvas"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} icon={customPinIcon} />
            </MapContainer>
          </div>
        </div>

        {/* COMMUNITY ENGAGEMENT (VIEWS & LIKES) */}
        <div className="community-engagement-section">
          <label className="section-micro-label">COMMUNITY IMPACT & ENGAGEMENT</label>

          <div className="engagement-counters-row">
            <div className="counter-badge view-counter">
              <FiEye className="icon blue" />
              <span>{viewsCount} Viewed</span>
            </div>

            <div className="counter-badge like-counter">
              <FiHeart className="icon red" />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </div>
          </div>

          <button 
            type="button" 
            className={`btn-like-toggle ${isLiked ? 'liked' : ''}`}
            onClick={handleToggleLike}
          >
            <FiHeart className="heart-icon" />
            <span>{isLiked ? 'Liked' : 'Like Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
