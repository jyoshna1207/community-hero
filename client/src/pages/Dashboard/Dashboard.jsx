import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaClipboardList,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaRoad,
  FaTint,
  FaBolt,
  FaLightbulb,
  FaShieldAlt,
  FaTree,
} from 'react-icons/fa';
import './Dashboard.css';

// Helper to match category icon
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Waste Management':
      return FaTrash;
    case 'Roads':
      return FaRoad;
    case 'Water Supply':
      return FaTint;
    case 'Electricity':
      return FaBolt;
    case 'Street Lights':
      return FaLightbulb;
    case 'Public Safety':
      return FaShieldAlt;
    case 'Parks':
      return FaTree;
    default:
      return FaExclamationCircle;
  }
};

// Helper to set status badge CSS
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Reported':
      return 'dash-status-badge badge-reported';
    case 'In Progress':
      return 'dash-status-badge badge-pending';
    case 'Resolved':
      return 'dash-status-badge badge-resolved';
    default:
      return 'dash-status-badge';
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
    pending: 0,
    categoryCounts: [],
    recentReports: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/issues/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load live dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const summaryStatsData = [
    {
      id: 'total',
      title: 'Total Issues',
      value: stats.total,
      icon: FaClipboardList,
      colorClass: 'card-blue',
    },
    {
      id: 'reported',
      title: 'Reported',
      value: stats.reported,
      icon: FaExclamationCircle,
      colorClass: 'card-orange',
    },
    {
      id: 'resolved',
      title: 'Resolved',
      value: stats.resolved,
      icon: FaCheckCircle,
      colorClass: 'card-green',
    },
    {
      id: 'pending',
      title: 'Pending',
      value: stats.pending,
      icon: FaClock,
      colorClass: 'card-red',
    },
  ];

  const barClasses = ['bar-blue', 'bar-green', 'bar-cyan', 'bar-amber', 'bar-purple'];

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor real-time community issues and reporting statistics.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.2rem' }}>Loading live dashboard data...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff4d4f' }}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Summary Cards Grid */}
          <section className="summary-cards-grid">
            {summaryStatsData.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <article key={stat.id} className={`summary-card ${stat.colorClass}`}>
                  <div className="summary-card-info">
                    <span className="summary-card-title">{stat.title}</span>
                    <span className="summary-card-value">{stat.value}</span>
                  </div>
                  <div className="summary-card-icon-wrapper">
                    <IconComponent className="summary-card-icon" />
                  </div>
                </article>
              );
            })}
          </section>

          {/* Main Grid: Recent Reports, Categories, and Status */}
          <section className="dashboard-main-grid">
            {/* Recent Reports Card */}
            <article className="dash-card">
              <h2 className="dash-card-heading">Recent Reports</h2>
              <div className="recent-reports-list">
                {stats.recentReports && stats.recentReports.length > 0 ? (
                  stats.recentReports.map((report) => {
                    const ReportIcon = getCategoryIcon(report.category);
                    return (
                      <div key={report._id || report.id} className="recent-report-item">
                        <div className="recent-report-left">
                          <div className="recent-report-icon-box">
                            <ReportIcon className="recent-report-icon" />
                          </div>
                          <div className="recent-report-details">
                            <h3 className="recent-report-title">{report.title}</h3>
                            <span className="recent-report-category">{report.category}</span>
                          </div>
                        </div>
                        <span className={getStatusBadgeClass(report.status)}>
                          {report.status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>No recent reports found.</p>
                )}
              </div>
            </article>

            {/* Category Distribution Card */}
            <article className="dash-card">
              <h2 className="dash-card-heading">Category Distribution</h2>
              <div className="category-list">
                {stats.categoryCounts && stats.categoryCounts.length > 0 ? (
                  stats.categoryCounts.map((cat, idx) => (
                    <div key={cat.category} className="category-item">
                      <div className="category-meta">
                        <span className="category-name">{cat.category}</span>
                        <span className="category-percentage">{cat.percentage}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${barClasses[idx % barClasses.length]}`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>No category data available.</p>
                )}
              </div>
            </article>

            {/* Status Overview Card */}
            <article className="dash-card">
              <h2 className="dash-card-heading">Status Overview</h2>
              <div className="status-overview-list">
                <div className="status-box box-reported">
                  <div className="status-box-info">
                    <FaExclamationCircle className="status-box-icon" />
                    <span className="status-box-title">Reported</span>
                  </div>
                  <span className="status-box-count">{stats.reported}</span>
                </div>
                <div className="status-box box-resolved">
                  <div className="status-box-info">
                    <FaCheckCircle className="status-box-icon" />
                    <span className="status-box-title">Resolved</span>
                  </div>
                  <span className="status-box-count">{stats.resolved}</span>
                </div>
                <div className="status-box box-pending">
                  <div className="status-box-info">
                    <FaClock className="status-box-icon" />
                    <span className="status-box-title">Pending</span>
                  </div>
                  <span className="status-box-count">{stats.pending}</span>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}