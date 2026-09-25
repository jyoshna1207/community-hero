import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { 
  FiBriefcase, FiAlertCircle, FiClock, FiCheckCircle, FiLoader, FiActivity, FiArrowRight
} from 'react-icons/fi';

/* Re-use exact same design language from Officer Dashboard */
import '../../Officer/Dashboard/OfficerDashboard.css'; 
import '../../../components/dashboards/OfficerDashboardCards/OfficerDashboardCards.css';

export default function DepartmentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedIssues: 0,
    workInProgress: 0,
    totalCompleted: 0,
    criticalWorks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const departmentName = user?.departmentName || 'Public Works Department';

  useEffect(() => {
    const fetchDepartmentData = async () => {
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

        const assigned = merged.filter(i => {
          const s = (i.status || '').toUpperCase();
          return s === 'REPORTED' || s === 'UNSOLVED' || s === 'UNDER REVIEW' || s === 'ASSIGNED';
        }).length;

        const inProgress = merged.filter(i => (i.status || '').toUpperCase() === 'IN PROGRESS').length;
        const resolved = merged.filter(i => {
          const s = (i.status || '').toUpperCase();
          return s === 'RESOLVED' || s === 'SOLVED';
        }).length;

        const critical = merged.filter(i => (i.priority || i.aiSeverity || '').toUpperCase() === 'CRITICAL').length;

        setStats({
          assignedIssues: assigned,
          workInProgress: inProgress,
          totalCompleted: resolved,
          criticalWorks: critical,
        });

        const sortedRecent = merged
          .filter(i => {
            const s = (i.status || '').toUpperCase();
            return s !== 'RESOLVED' && s !== 'SOLVED';
          })
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5);
        setRecentTasks(sortedRecent);
      } catch (err) {
        console.error('Error loading department dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  return (
    <div className="officer-dashboard-page">
      {/* HEADER SECTION */}
      <div className="officer-top-header">
        <div className="officer-header-left">
          <h1>Good morning, Department Lead 👋</h1>
          <p className="officer-subtitle">
            Infrastructure Repair & Field Task Force Execution for {departmentName}.
          </p>
        </div>

        <div className="officer-header-right">
          <div className="ward-badge-tag">
            <FiBriefcase /> {departmentName}
          </div>
          <div className="realtime-status-pill">
            <span className="pulse-green-dot"></span> Live Operations
          </div>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="kpi-cards-grid officer-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{stats.assignedIssues}</span>
            <p className="kpi-label">Assigned Work</p>
          </div>
          <div className="kpi-trend trend-blue">
            <FiBriefcase /> <span>Pending department action</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{stats.workInProgress}</span>
            <p className="kpi-label">Work In Progress</p>
          </div>
          <div className="kpi-trend trend-orange">
            <FiClock /> <span>Under active repair</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">{stats.totalCompleted}</span>
            <p className="kpi-label">Total Resolved</p>
          </div>
          <div className="kpi-trend trend-up">
            <FiCheckCircle /> <span>Successfully closed repairs</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num" style={{ color: '#ef4444' }}>{stats.criticalWorks}</span>
            <p className="kpi-label">Critical Urgency</p>
          </div>
          <div className="kpi-trend trend-red" style={{ color: '#ef4444' }}>
            <FiAlertCircle /> <span>Requires immediate deployment</span>
          </div>
        </div>
      </div>

      {/* RECENT ASSIGNED WORK QUEUE */}
      <div className="officer-reports-section">
        <div className="officer-reports-header">
          <h2>Recent Field Operations ({recentTasks.length})</h2>
          <Link to="/department/assigned-work" className="view-all-link">
            Manage Queue <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="dash-loading-box">
            <FiLoader className="spin-icon text-blue" />
            <p>Loading real-time field operations...</p>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="dash-empty-box">
            <FiAlertCircle style={{ fontSize: '2rem', color: '#64748B' }} />
            <p>No active tasks found in the department queue.</p>
          </div>
        ) : (
          <div className="officer-cards-list">
            {recentTasks.map((t) => (
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
                    <span className="officer-category-badge">{t.category}</span>
                    <span className="meta-sep">•</span>
                    <span>{t.date || (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent')}</span>
                    <span className="meta-sep">•</span>
                    <span className="officer-location-text">
                      📍 {t.location}
                    </span>
                  </div>
                </div>

                <div className="officer-card-actions" style={{ gap: '8px' }}>
                  <Link to="/department/assigned-work" className="btn-manage-action" style={{ background: '#10b981', color: '#fff', border: 'none' }}>
                    <FiActivity style={{ marginRight: '6px' }} /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}