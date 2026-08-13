import React, { useState, useEffect, useRef } from 'react';
import { 
  FiTrendingUp, FiTrendingDown, FiBell, FiChevronDown, 
  FiPlusCircle, FiMapPin, FiClock, FiChevronRight, FiCheckCircle, FiActivity, FiLoader 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
    impact: 0
  });

  const isMountedRef = useRef(true);

  // Real-time Analytics & Auto-polling engine
  const fetchRealTimeAnalytics = async () => {
    try {
      let combined = [];

      // 1. Read locally stored reports
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        combined = local.map(item => ({
          id: item.id || item._id,
          _id: item.id || item._id,
          title: item.title,
          location: item.location,
          category: item.category,
          status: item.status || 'Reported',
          priority: item.priority || 'High',
          date: item.date || 'Recent',
          createdAt: item.createdAt || new Date().toISOString(),
          image: item.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
          latitude: item.latitude,
          longitude: item.longitude
        }));
      } catch (err) {
        console.error("Local reports read error:", err);
      }

      // 2. Fetch real database issues from backend
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const apiMapped = res.data.map(item => ({
            id: item._id,
            _id: item._id,
            title: item.title,
            location: item.location,
            category: item.category,
            status: item.status || 'Reported',
            priority: item.aiSeverity || 'High',
            date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            createdAt: item.createdAt || new Date().toISOString(),
            image: item.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
            latitude: item.latitude,
            longitude: item.longitude
          }));

          const existingIds = new Set(combined.map(i => i.id));
          apiMapped.forEach(i => {
            if (!existingIds.has(i.id)) combined.push(i);
          });
        }
      } catch (apiErr) {
        console.error("API issues fetch error:", apiErr);
      }

      if (isMountedRef.current) {
        // Calculate Real-Time Metrics based on citizen & officer actions
        const total = combined.length;
        const inProgress = combined.filter(r => 
          r.status === 'In Progress' || r.status === 'Under Review' || r.status === 'Assigned'
        ).length;
        const resolved = combined.filter(r => 
          r.status === 'Resolved' || r.status === 'Solved' || r.status === 'Citizen Confirmed'
        ).length;

        // Estimated Community Value Saved = (Resolved × ₹1,250) + (Total × ₹250)
        const impact = (resolved * 1250) + (total * 250);

        setMetrics({ total, inProgress, resolved, impact });
        setReports(combined);
      }
    } catch (err) {
      console.error("Fetch analytics error:", err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchRealTimeAnalytics();

    // Auto-polling interval every 4 seconds to catch officer status changes live
    const interval = setInterval(() => {
      fetchRealTimeAnalytics();
    }, 4000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  // Calculate Progress Percentage dynamically
  const getProgressPercentage = (status) => {
    if (status === 'Resolved' || status === 'Solved' || status === 'Citizen Confirmed') return 100;
    if (status === 'In Progress') return 65;
    if (status === 'Under Review' || status === 'Assigned') return 40;
    return 15; // Reported / Pending
  };

  return (
    <div className="citizen-dashboard-page">
      {/* DASHBOARD HEADER */}
      <div className="dash-top-header">
        <div className="dash-header-left">
          <h1>Good morning, {user?.name || 'Community Member'} 👋</h1>
          <p className="dash-subtitle">
            Real-time analytics of citizen reports and resolutions by officers & community.
          </p>
        </div>

        <div className="dash-header-right">
          <div className="realtime-status-pill">
            <span className="pulse-green-dot"></span> Real-time Live
          </div>

          <div className="dash-avatar-chip" onClick={() => navigate('/profile')}>
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'C'}</span>
          </div>
        </div>
      </div>

      {/* REAL-TIME KPI CARDS */}
      <div className="kpi-cards-grid">
        {/* Card 1: Total Reported */}
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{metrics.total}</span>
            <p className="kpi-label">Issues Reported</p>
          </div>
          <div className="kpi-trend trend-up">
            <FiActivity /> <span>Real-time community submissions</span>
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{metrics.inProgress}</span>
            <p className="kpi-label">In Progress</p>
          </div>
          <div className="kpi-trend trend-orange">
            <FiClock /> <span>Active work by Ward Officers</span>
          </div>
        </div>

        {/* Card 3: Resolved */}
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{metrics.resolved}</span>
            <p className="kpi-label">Resolved</p>
          </div>
          <div className="kpi-trend trend-up">
            <FiCheckCircle /> <span>Solved by Officers & Citizens</span>
          </div>
        </div>

        {/* Card 4: Community Impact */}
        <div className="kpi-card impact-card">
          <div className="kpi-val-group">
            <span className="kpi-num">₹{metrics.impact.toLocaleString('en-IN')}</span>
            <p className="kpi-label">Community Impact</p>
          </div>
          <p className="kpi-subtext">Estimated civic value generated</p>
        </div>
      </div>

      {/* RECENT REPORTS SECTION */}
      <div className="recent-reports-section">
        <div className="recent-reports-header">
          <h2>Recent Real-time Reports ({reports.length})</h2>
          <Link to="/issues" className="view-all-link">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="dash-loading-box">
            <FiLoader className="spin-icon text-blue" />
            <p>Loading real-time citizen report analytics...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="dash-empty-box">
            <p>No reports submitted yet in your community.</p>
            <button className="btn-hero-primary" onClick={() => navigate('/report-issue')}>
              <FiPlusCircle /> Report an Issue
            </button>
          </div>
        ) : (
          /* Horizontal Issue Cards List */
          <div className="recent-horizontal-list">
            {reports.map((issue) => {
              const progressPct = getProgressPercentage(issue.status);

              return (
                <div key={issue.id || issue._id} className="horizontal-issue-card">
                  <div className="issue-img-wrapper">
                    <img src={issue.image} alt={issue.title} />
                  </div>

                  <div className="issue-details-main">
                    <div className="issue-title-row">
                      <h3>{issue.title}</h3>
                      <div className="issue-badge-group">
                        <span className={`status-pill ${
                          issue.status === 'Resolved' || issue.status === 'Solved' ? 'resolved' :
                          issue.status === 'In Progress' ? 'in-progress' : 'pending'
                        }`}>
                          {issue.status === 'Resolved' || issue.status === 'Solved' ? '🟢 Resolved' :
                           issue.status === 'In Progress' ? '🔵 In Progress' : '🟠 Pending'}
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
                    </div>

                    <div className="issue-progress-bar-row">
                      <div className="progress-label-flex">
                        <span>Resolution Progress</span>
                        <span className="progress-pct">{progressPct}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="issue-action-side">
                    <Link to={`/track-report/${issue.id || issue._id}`} className="btn-view-details">
                      Track Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}