import React from 'react';
import {
  FaClipboardList,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaRoad,
  FaTint,
  FaBolt,
} from 'react-icons/fa';
import './Dashboard.css';

// Summary Stats Data
const SUMMARY_STATS = [
  {
    id: 'total',
    title: 'Total Issues',
    value: 128,
    icon: FaClipboardList,
    colorClass: 'card-blue',
  },
  {
    id: 'reported',
    title: 'Reported',
    value: 96,
    icon: FaExclamationCircle,
    colorClass: 'card-orange',
  },
  {
    id: 'resolved',
    title: 'Resolved',
    value: 24,
    icon: FaCheckCircle,
    colorClass: 'card-green',
  },
  {
    id: 'pending',
    title: 'Pending',
    value: 8,
    icon: FaClock,
    colorClass: 'card-red',
  },
];

// Recent Reports Data
const RECENT_REPORTS = [
  {
    id: 1,
    title: 'Garbage Dump',
    category: 'Waste',
    status: 'Reported',
    icon: FaTrash,
  },
  {
    id: 2,
    title: 'Street Light Not Working',
    category: 'Electricity',
    status: 'Pending',
    icon: FaBolt,
  },
  {
    id: 3,
    title: 'Road Pothole',
    category: 'Roads',
    status: 'Resolved',
    icon: FaRoad,
  },
  {
    id: 4,
    title: 'Water Leakage',
    category: 'Water Supply',
    status: 'Reported',
    icon: FaTint,
  },
];

// Category Distribution Data
const CATEGORY_DISTRIBUTION = [
  { id: 'waste', category: 'Waste', percentage: 35, barClass: 'bar-blue' },
  { id: 'roads', category: 'Roads', percentage: 25, barClass: 'bar-green' },
  { id: 'water', category: 'Water Supply', percentage: 20, barClass: 'bar-cyan' },
  { id: 'electricity', category: 'Electricity', percentage: 10, barClass: 'bar-amber' },
  { id: 'others', category: 'Others', percentage: 10, barClass: 'bar-purple' },
];

// Status Overview Data
const STATUS_OVERVIEW = [
  {
    id: 'reported',
    status: 'Reported',
    count: 96,
    icon: FaExclamationCircle,
    boxClass: 'box-reported',
  },
  {
    id: 'resolved',
    status: 'Resolved',
    count: 24,
    icon: FaCheckCircle,
    boxClass: 'box-resolved',
  },
  {
    id: 'pending',
    status: 'Pending',
    count: 8,
    icon: FaClock,
    boxClass: 'box-pending',
  },
];

// Helper to set status badge CSS
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Reported':
      return 'dash-status-badge badge-reported';
    case 'Pending':
      return 'dash-status-badge badge-pending';
    case 'Resolved':
      return 'dash-status-badge badge-resolved';
    default:
      return 'dash-status-badge';
  }
};

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor community issues and reporting statistics.
        </p>
      </header>

      {/* Summary Cards Grid */}
      <section className="summary-cards-grid">
        {SUMMARY_STATS.map((stat) => {
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
            {RECENT_REPORTS.map((report) => {
              const ReportIcon = report.icon;
              return (
                <div key={report.id} className="recent-report-item">
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
            })}
          </div>
        </article>

        {/* Category Distribution Card */}
        <article className="dash-card">
          <h2 className="dash-card-heading">Category Distribution</h2>
          <div className="category-list">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.id} className="category-item">
                <div className="category-meta">
                  <span className="category-name">{cat.category}</span>
                  <span className="category-percentage">{cat.percentage}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className={`progress-bar-fill ${cat.barClass}`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Status Overview Card */}
        <article className="dash-card">
          <h2 className="dash-card-heading">Status Overview</h2>
          <div className="status-overview-list">
            {STATUS_OVERVIEW.map((item) => {
              const StatusIcon = item.icon;
              return (
                <div key={item.id} className={`status-box ${item.boxClass}`}>
                  <div className="status-box-info">
                    <StatusIcon className="status-box-icon" />
                    <span className="status-box-title">{item.status}</span>
                  </div>
                  <span className="status-box-count">{item.count}</span>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}