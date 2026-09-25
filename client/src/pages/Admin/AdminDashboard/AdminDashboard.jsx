import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiFilter, FiSettings, FiActivity, FiArrowRight, FiCheckCircle, FiClock, FiAlertCircle 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import '../../Officer/Dashboard/OfficerDashboard.css'; // For identical layout design
import '../../../components/dashboards/OfficerDashboardCards/OfficerDashboardCards.css'; // For KPIs

export default function AdminDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, critical: 0 });
  const [loading, setLoading] = useState(true);

  const adminName = user?.name || 'Super Admin';

  useEffect(() => {
    const loadAdminDashboardData = async () => {
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

        const total = merged.length;
        const inProg = merged.filter(i => (i.status || '').toUpperCase() === 'IN PROGRESS').length;
        const resCount = merged.filter(i => {
          const s = (i.status || '').toUpperCase();
          return s === 'RESOLVED' || s === 'SOLVED';
        }).length;
        const critCount = merged.filter(i => (i.priority || i.aiSeverity || '').toUpperCase() === 'CRITICAL').length;
        const pend = total - inProg - resCount;

        setStats({
          total,
          pending: Math.max(0, pend),
          inProgress: inProg,
          resolved: resCount,
          critical: critCount,
        });

        const sortedRecent = merged
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5);
        setIssues(sortedRecent);
      } catch (err) {
        console.error('Admin dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminDashboardData();
  }, []);

  return (
    <div className="officer-dashboard-page">
      {/* HEADER SECTION */}
      <div className="officer-top-header">
        <div className="officer-header-left">
          <h1>Good morning, {adminName} 👋</h1>
          <p className="officer-subtitle">
            System Administration & Global Metrics Command Center.
          </p>
        </div>
        <div className="officer-header-right">
          <div className="ward-badge-tag" style={{ background: '#475569', color: '#fff', borderColor: '#475569' }}>
            <FiSettings /> Master Access
          </div>
          <div className="realtime-status-pill">
            <span className="pulse-green-dot"></span> System Online
          </div>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="kpi-cards-grid officer-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{stats.total}</span>
            <p className="kpi-label">Total Platform Reports</p>
          </div>
          <div className="kpi-trend trend-blue">
            <FiActivity /> <span>All-time issues logged</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{stats.pending}</span>
            <p className="kpi-label">Pending / Unassigned</p>
          </div>
          <div className="kpi-trend trend-orange">
            <FiAlertCircle /> <span>Awaiting officer action</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{stats.inProgress}</span>
            <p className="kpi-label">Work In Progress</p>
          </div>
          <div className="kpi-trend trend-blue">
            <FiClock /> <span>Under active repair by departments</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{stats.resolved}</span>
            <p className="kpi-label">Total Resolved</p>
          </div>
          <div className="kpi-trend trend-up">
            <FiCheckCircle /> <span>Successfully closed platform-wide</span>
          </div>
        </div>
      </div>

      {/* RECENT GLOBAL OPERATIONS */}
      <div className="officer-reports-section">
        <div className="officer-reports-header">
          <h2>Recent Global Reports ({issues.length})</h2>
          <Link to="/admin/manage-issues" className="view-all-link">
            View All Issues <FiArrowRight />
          </Link>
        </div>

        <div className="officer-cards-list">
          {issues.map((t) => (
            <div key={t._id || t.id} className="officer-issue-card">
              <div className="officer-card-img">
                <img src={t.image || t.imageUrl || `https://picsum.photos/seed/${t.id}/400/300`} alt={t.title} />
              </div>

              <div className="officer-card-body">
                <div className="officer-card-header">
                  <h3>{t.title}</h3>
                  <div className="officer-badge-cluster">
                    <span className={`officer-status-pill ${(t.status || 'UNSOLVED').toLowerCase().replace(' ', '-')}`}>
                      {t.status || 'UNSOLVED'}
                    </span>
                    <span className={`officer-priority-pill ${(t.priority || 'medium').toLowerCase()}`}>
                      {t.priority || 'Medium'} Priority
                    </span>
                  </div>
                </div>

                <div className="officer-meta-row">
                  <span className="officer-category-badge">{t.category || 'General'}</span>
                  <span className="meta-sep">•</span>
                  <span>{t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent')}</span>
                  <span className="meta-sep">•</span>
                  <span className="officer-location-text">
                    📍 {t.location || 'Unknown Location'}
                  </span>
                </div>
              </div>

              <div className="officer-card-actions" style={{ gap: '8px' }}>
                <Link to="/admin/manage-issues" className="btn-manage-action" style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                  <FiSearch style={{ marginRight: '6px' }} /> Inspect Record
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}