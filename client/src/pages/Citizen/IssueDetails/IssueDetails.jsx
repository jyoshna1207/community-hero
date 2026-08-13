import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiArrowLeft, FiShare2, FiMapPin, FiClock, FiCheckCircle, 
  FiAlertCircle, FiThumbsUp, FiArrowRight, FiCheck, FiEye, FiShield, FiTrendingUp 
} from 'react-icons/fi';
import './IssueDetails.css';

// Leaflet SVG DivIcon for exact location marker pin
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

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [affectedCount, setAffectedCount] = useState(32);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [issue, setIssue] = useState(null);
  const [viewsCount, setViewsCount] = useState(48);

  useEffect(() => {
    const fetchIssue = async () => {
      // 1. Check local submitted reports
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        const found = local.find(item => item.id === id || item._id === id);
        if (found) {
          setIssue(found);
          return;
        }
      } catch (e) {
        console.error("Local search error:", e);
      }

      // 2. Fetch from API
      if (id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/issues/${id}`);
          if (res.data) {
            setIssue(res.data);
            return;
          }
        } catch (err) {
          console.error("API fetch error:", err);
        }
      }

      // 3. Fallback dummy data if not found
      setIssue({
        id: id || 'CH-2026-00124',
        title: 'Street Light Not Working',
        category: 'Street Lights',
        status: 'Reported',
        location: 'Anuru, Thondangi, Kakinada, Andhra Pradesh, India',
        latitude: 17.281524,
        longitude: 82.521632,
        description: 'Street light is not working, it is very important to resolve fast.',
        date: 'Today'
      });
    };

    fetchIssue();
  }, [id]);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setAffectedCount(affectedCount + 1);
      setHasUpvoted(true);
    }
  };

  const title = issue?.title || 'Reported Civic Issue';
  const location = issue?.location || 'Anuru, Thondangi, Kakinada, Andhra Pradesh, India';
  const description = issue?.description || 'Civic issue report submitted by resident.';
  const category = issue?.category || 'General';
  const rawStatus = issue?.status || 'Reported';
  const lat = Number(issue?.latitude ?? issue?.locationCoords?.lat ?? 17.281524);
  const lng = Number(issue?.longitude ?? issue?.locationCoords?.lng ?? 82.521632);

  const isSolved = rawStatus === 'Resolved' || rawStatus === 'Solved';
  const isInProgress = rawStatus === 'In Progress';
  
  // Progress calculation
  let progressPercent = 25;
  let statusBadgeText = 'UNSOLVED (Under Review)';
  let statusBadgeClass = 'status-unsolved-reported';

  if (isSolved) {
    progressPercent = 100;
    statusBadgeText = 'SOLVED / RESOLVED 🎉';
    statusBadgeClass = 'status-solved';
  } else if (isInProgress) {
    progressPercent = 75;
    statusBadgeText = 'UNSOLVED (Work In Progress 🛠️)';
    statusBadgeClass = 'status-unsolved-progress';
  }

  // Dynamic authority text extraction
  const getAuthorityTitle = (addr) => {
    if (!addr) return 'Local Ward & District Officers';
    const parts = addr.split(',').map(p => p.trim()).filter(Boolean);
    const locality = parts[0] || 'Local';
    const district = parts.length >= 3 ? parts[2] : (parts.length >= 2 ? parts[1] : null);
    if (district && district !== locality) {
      return `${locality} Ward Officers & ${district} District Officers`;
    }
    return `${locality} Ward & District Officers`;
  };

  const authorityName = getAuthorityTitle(location);

  const timelineSteps = [
    { 
      stepNum: 1,
      title: '1. Issue Reported by Citizen', 
      date: issue?.date || 'Submitted Recently', 
      status: 'completed',
      detail: `Report logged with exact GPS location (${lat.toFixed(6)}, ${lng.toFixed(6)}).`
    },
    { 
      stepNum: 2,
      title: '2. Ward Officer Review & Verification', 
      date: isSolved || isInProgress ? 'Verified On-Site' : 'In Progress Now', 
      status: isSolved || isInProgress ? 'completed' : 'active',
      detail: `Assigned to ${authorityName} for field inspection.`
    },
    { 
      stepNum: 3,
      title: '3. Municipal Department Assigned', 
      date: isSolved || isInProgress ? 'Dispatched' : 'Queued', 
      status: isSolved || isInProgress ? 'completed' : 'pending',
      detail: `Forwarded to ${category} Maintenance Cell for resolution.`
    },
    { 
      stepNum: 4,
      title: '4. Ground Work In Progress', 
      date: isSolved ? 'Completed' : (isInProgress ? 'Active Repair' : 'Pending Deployment'), 
      status: isSolved ? 'completed' : (isInProgress ? 'active' : 'pending'),
      detail: isInProgress ? 'Field crew actively fixing problem on-site.' : 'Awaiting crew dispatch.'
    },
    { 
      stepNum: 5,
      title: '5. Solved & Community Verified', 
      date: isSolved ? 'Successfully Solved 🎉' : 'Pending Completion', 
      status: isSolved ? 'completed' : 'pending',
      detail: isSolved ? 'Issue resolved and verified on location.' : 'Final resolution check.'
    },
  ];

  return (
    <div className="issue-details-page-container">
      {/* TOP NAV BAR */}
      <div className="details-top-bar">
        <button className="btn-back-link" onClick={() => navigate('/my-reports')}>
          <FiArrowLeft /> Back to My Reports
        </button>
        <button 
          className="btn-share-icon" 
          aria-label="Share Issue"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Report tracking link copied to clipboard!");
          }}
        >
          <FiShare2 />
        </button>
      </div>

      {/* TOP HIGH-IMPACT STATUS CARD (SOLVED / UNSOLVED TRACKER) */}
      <div className={`issue-status-banner-card ${statusBadgeClass}`}>
        <div className="status-banner-header">
          <div className="status-badge-title">
            {isSolved ? <FiCheckCircle className="status-icon" /> : <FiAlertCircle className="status-icon" />}
            <span>STATUS: {statusBadgeText}</span>
          </div>
          <span className="report-id-chip">ID: {issue?.id || id || 'CH-2026-00124'}</span>
        </div>

        <p className="status-banner-desc">
          {isSolved 
            ? `🎉 Great news! This civic issue at ${location} has been fully solved and verified.`
            : `📍 Process In Progress: Assigned to ${authorityName}. Officers are actively handling this report.`}
        </p>

        {/* VISUAL PROCESS PROGRESS BAR */}
        <div className="process-progress-container">
          <div className="process-progress-info">
            <span>Overall Resolution Progress</span>
            <span className="progress-num">{progressPercent}%</span>
          </div>
          <div className="process-progress-track">
            <div 
              className="process-progress-fill" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* PEOPLE METRICS ROW ("VIEWED BY PEOPLE LIKE THAT") */}
      <div className="people-metrics-card">
        <div className="metric-box">
          <FiEye className="metric-icon blue" />
          <div className="metric-text">
            <span className="metric-val">{viewsCount} Views</span>
            <span className="metric-sub">By Citizens & Ward Officers</span>
          </div>
        </div>

        <div className="metric-box">
          <FiThumbsUp className="metric-icon green" />
          <div className="metric-text">
            <span className="metric-val">{affectedCount} People</span>
            <span className="metric-sub">Affected & Upvoted</span>
          </div>
        </div>

        <div className="metric-box">
          <FiShield className="metric-icon orange" />
          <div className="metric-text">
            <span className="metric-val">{authorityName.split('&')[0]}</span>
            <span className="metric-sub">Assigned Authority</span>
          </div>
        </div>
      </div>

      {/* ISSUE TITLE & LOCATION HEADER */}
      <div className="issue-header-card">
        <div className="title-badges-flex">
          <h1>{title}</h1>
          <div className="details-badge-group">
            <span className={`status-pill ${isSolved ? 'solved' : 'in-progress'}`}>
              {isSolved ? '🟢 Solved' : '🟡 Unsolved'}
            </span>
            <span className="status-pill category-pill">Category: {category}</span>
          </div>
        </div>

        <p className="issue-location-line">
          📍 {location}
        </p>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#155EEF', fontFamily: 'monospace', margin: '8px 0' }}>
          <span>Latitude: {lat.toFixed(6)}</span>
          <span>Longitude: {lng.toFixed(6)}</span>
        </div>

        {/* LEAFLET MAP PREVIEW IN TRACKER */}
        <div className="issue-detail-map-wrapper" style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', marginTop: '14px', border: '1px solid #CBD5E1' }}>
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={customPinIcon} />
          </MapContainer>
        </div>
      </div>

      {/* TABS (TIMELINE / DETAILS / UPDATES) */}
      <div className="details-tabs-bar">
        <button className={activeTab === 'timeline' ? 'tab-item active' : 'tab-item'} onClick={() => setActiveTab('timeline')}>
          📈 Process Timeline
        </button>
        <button className={activeTab === 'details' ? 'tab-item active' : 'tab-item'} onClick={() => setActiveTab('details')}>
          📝 Issue Description
        </button>
        <button className={activeTab === 'updates' ? 'tab-item active' : 'tab-item'} onClick={() => setActiveTab('updates')}>
          🏛️ Officer Updates
        </button>
      </div>

      {/* TAB 1: PROCESS TIMELINE ("PROCESS GOING ON") */}
      {activeTab === 'timeline' && (
        <div className="tab-content-card">
          <h2>Resolution Process Tracker</h2>
          <div className="vertical-timeline-tree">
            {timelineSteps.map((step) => (
              <div key={step.stepNum} className={`timeline-row ${step.status}`}>
                <div className="timeline-node">
                  {step.status === 'completed' && <FiCheck className="check-mark" />}
                  {step.status === 'active' && <span className="active-dot"></span>}
                  {step.status === 'pending' && <span className="pending-ring"></span>}
                </div>

                <div className="timeline-info">
                  <h3>{step.title}</h3>
                  <p className="timeline-detail-text" style={{ fontSize: '0.875rem', color: '#475569', margin: '2px 0 4px 0' }}>{step.detail}</p>
                  <span className="timeline-date"><FiClock /> {step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DETAILS */}
      {activeTab === 'details' && (
        <div className="tab-content-card">
          <h2>Issue Description</h2>
          <p className="description-text">{description}</p>

          <div style={{ marginTop: '16px', padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <strong>Location Address:</strong> {location}<br/>
            <strong>Category:</strong> {category}<br/>
            <strong>Assigned Officers:</strong> {authorityName}
          </div>
        </div>
      )}

      {/* TAB 3: UPDATES */}
      {activeTab === 'updates' && (
        <div className="tab-content-card">
          <h2>Official Ward & District Officer Updates</h2>
          <div className="update-item" style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', borderLeft: '4px solid #155EEF' }}>
            <span className="update-author" style={{ fontWeight: 700, color: '#155EEF' }}>{authorityName}</span>
            <p style={{ margin: '6px 0', fontSize: '0.9rem', color: '#0F172A' }}>
              {isSolved 
                ? 'Work completed and verified on-site by field team.' 
                : 'Report received with GPS coordinates. Officer dispatched for on-site inspection.'}
            </p>
            <span className="update-time" style={{ fontSize: '0.8rem', color: '#64748B' }}>Updated Recently</span>
          </div>
        </div>
      )}

      {/* BOTTOM CTA BUTTON */}
      <div className="bottom-impact-cta-bar">
        <button 
          className={`btn-affected-cta ${hasUpvoted ? 'voted' : ''}`}
          onClick={handleUpvote}
        >
          <FiThumbsUp /> I'm Affected Too ({affectedCount})
        </button>
      </div>
    </div>
  );
}