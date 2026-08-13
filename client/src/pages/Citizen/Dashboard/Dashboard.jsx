import React, { useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiBell, FiChevronDown, FiPlusCircle, FiMapPin, FiClock, FiChevronRight, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [monthFilter, setMonthFilter] = useState('This Month');

  const recentReportsList = [
    {
      id: 'CH-2026-00124',
      title: 'Large Pothole Near Main Road',
      location: 'Duvvada Main Road',
      time: 'Reported 2 days ago',
      status: 'In Progress',
      statusType: 'in-progress',
      priority: 'High',
      priorityType: 'critical',
      progress: 65,
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'CH-2026-00118',
      title: 'Broken Streetlight at Sector 4',
      location: 'Sector 4 Junction, Visakhapatnam',
      time: 'Reported 3 days ago',
      status: 'Pending',
      statusType: 'pending',
      priority: 'Medium',
      priorityType: 'warning',
      progress: 30,
      image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'CH-2026-00102',
      title: 'Garbage Dump Overflow near Park',
      location: 'Ward 12 Community Park',
      time: 'Reported 5 days ago',
      status: 'Resolved',
      statusType: 'resolved',
      priority: 'Low',
      priorityType: 'success',
      progress: 100,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'CH-2026-00095',
      title: 'Water Pipeline Leakage',
      location: 'Gajuwaka Main Market',
      time: 'Reported 1 week ago',
      status: 'Resolved',
      statusType: 'resolved',
      priority: 'High',
      priorityType: 'critical',
      progress: 100,
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=300&q=80',
    }
  ];

  return (
    <div className="citizen-dashboard-page">
      {/* SCREEN 3 — DASHBOARD HEADER */}
      <div className="dash-top-header">
        <div className="dash-header-left">
          <h1>Good morning, {user?.name || 'Anusha'} 👋</h1>
          <p className="dash-subtitle">Here's what's happening in your community.</p>
        </div>

        <div className="dash-header-right">
          <div className="month-filter-dropdown">
            <span>{monthFilter}</span>
            <FiChevronDown />
          </div>

          <div className="dash-bell-icon">
            <FiBell />
            <span className="bell-badge"></span>
          </div>

          <div className="dash-avatar-chip">
            <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</span>
          </div>
        </div>
      </div>

      {/* KPI CARDS (4 IN ONE ROW) */}
      <div className="kpi-cards-grid">
        {/* Card 1 */}
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">24</span>
            <p className="kpi-label">Issues Reported</p>
          </div>
          <div className="kpi-trend trend-up">
            <FiTrendingUp /> <span>↑ 12% vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">8</span>
            <p className="kpi-label">In Progress</p>
          </div>
          <div className="kpi-trend trend-down">
            <FiTrendingDown /> <span>↓ 5% vs last month</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="kpi-card">
          <div className="kpi-val-group">
            <span className="kpi-num">16</span>
            <p className="kpi-label">Resolved</p>
          </div>
          <div className="kpi-trend trend-up">
            <FiTrendingUp /> <span>↑ 20% vs last month</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="kpi-card impact-card">
          <div className="kpi-val-group">
            <span className="kpi-num">₹12,450</span>
            <p className="kpi-label">Community Impact</p>
          </div>
          <p className="kpi-subtext">Value of problems resolved</p>
        </div>
      </div>

      {/* RECENT REPORTS SECTION */}
      <div className="recent-reports-section">
        <div className="recent-reports-header">
          <h2>Recent Reports</h2>
          <Link to="/issues" className="view-all-link">
            View All →
          </Link>
        </div>

        {/* Horizontal Issue Cards List */}
        <div className="recent-horizontal-list">
          {recentReportsList.map((issue) => (
            <div key={issue.id} className="horizontal-issue-card">
              <div className="issue-img-wrapper">
                <img src={issue.image} alt={issue.title} />
              </div>

              <div className="issue-details-main">
                <div className="issue-title-row">
                  <h3>{issue.title}</h3>
                  <div className="issue-badge-group">
                    <span className={`status-pill ${issue.statusType}`}>
                      {issue.status === 'In Progress' ? '🔵 In Progress' : issue.status === 'Resolved' ? '🟢 Resolved' : '🟠 Pending'}
                    </span>
                    <span className={`status-pill ${issue.priorityType}`}>
                      {issue.priority === 'High' ? '🔴 High' : issue.priority === 'Medium' ? '🟡 Medium' : '🟢 Low'}
                    </span>
                  </div>
                </div>

                <div className="issue-meta-row">
                  <span>📍 {issue.location}</span>
                  <span className="meta-dot">•</span>
                  <span><FiClock /> {issue.time}</span>
                </div>

                <div className="issue-progress-bar-row">
                  <div className="progress-label-flex">
                    <span>Progress</span>
                    <span className="progress-pct">{issue.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${issue.progress}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="issue-action-side">
                <Link to={`/issues/${issue.id}`} className="btn-view-details">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}