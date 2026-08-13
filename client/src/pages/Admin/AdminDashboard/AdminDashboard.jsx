import React, { useState } from 'react';
import { 
  FiChevronDown, FiTrendingDown, FiPieChart, FiMapPin, FiBarChart2, 
  FiClock, FiSearch, FiFilter, FiEye, FiArrowRight 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const adminIssuesList = [
    {
      id: 'CH-2026-00124',
      title: 'Large Pothole Near Main Road',
      category: 'Road Damage',
      location: 'Duvvada',
      priority: 'High',
      priorityType: 'critical',
      status: 'In Progress',
      statusType: 'in-progress',
      assignedTo: 'Roads Department',
      date: '6 May',
    },
    {
      id: 'CH-2026-00118',
      title: 'Broken Streetlight at Sector 4',
      category: 'Streetlight',
      location: 'Gajuwaka',
      priority: 'Medium',
      priorityType: 'warning',
      status: 'Pending',
      statusType: 'pending',
      assignedTo: 'Electrical Dept',
      date: '5 May',
    },
    {
      id: 'CH-2026-00102',
      title: 'Garbage Dump Overflow near Park',
      category: 'Garbage & Waste',
      location: 'Ward 12',
      priority: 'Low',
      priorityType: 'success',
      status: 'Resolved',
      statusType: 'resolved',
      assignedTo: 'Sanitation Dept',
      date: '4 May',
    },
    {
      id: 'CH-2026-00095',
      title: 'Water Pipeline Leakage',
      category: 'Water Leakage',
      location: 'Main Market',
      priority: 'High',
      priorityType: 'critical',
      status: 'Resolved',
      statusType: 'resolved',
      assignedTo: 'Water Works Dept',
      date: '2 May',
    },
    {
      id: 'CH-2026-00088',
      title: 'Open Drainage Overflow',
      category: 'Drainage',
      location: 'Ward 8',
      priority: 'High',
      priorityType: 'critical',
      status: 'Critical',
      statusType: 'critical',
      assignedTo: 'Public Health Dept',
      date: '1 May',
    }
  ];

  return (
    <div className="admin-operations-dashboard">
      {/* MAIN HEADER (SCREEN 10) */}
      <div className="admin-header-flex">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-subtitle">Overview of community issues</p>
        </div>

        <div className="admin-filter-select">
          <span>This Month</span>
          <FiChevronDown />
        </div>
      </div>

      {/* KPI CARDS (5 CARDS) */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-num">248</span>
          <span className="admin-kpi-label">Total Issues</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-num text-orange">72</span>
          <span className="admin-kpi-label">Pending</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-num text-blue">31</span>
          <span className="admin-kpi-label">In Progress</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-num text-green">176</span>
          <span className="admin-kpi-label">Resolved</span>
        </div>

        <div className="admin-kpi-card border-red">
          <span className="admin-kpi-num text-red">12</span>
          <span className="admin-kpi-label">Critical Issues</span>
        </div>
      </div>

      {/* ANALYTICS 2-COLUMN LAYOUT */}
      <div className="admin-analytics-grid">
        {/* Left: Donut Chart Representation */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Issues by Category</h2>
            <FiPieChart className="card-icon" />
          </div>

          <div className="donut-chart-wrapper">
            <div className="visual-donut-ring">
              <div className="donut-center-stat">
                <span className="stat-big">248</span>
                <span className="stat-lbl">Total</span>
              </div>
            </div>

            <div className="donut-legend-list">
              <div className="legend-row">
                <span className="legend-color c-road"></span>
                <span className="legend-name">Road Damage</span>
                <span className="legend-pct">35%</span>
              </div>
              <div className="legend-row">
                <span className="legend-color c-water"></span>
                <span className="legend-name">Water Leakage</span>
                <span className="legend-pct">25%</span>
              </div>
              <div className="legend-row">
                <span className="legend-color c-garbage"></span>
                <span className="legend-name">Garbage & Waste</span>
                <span className="legend-pct">20%</span>
              </div>
              <div className="legend-row">
                <span className="legend-color c-light"></span>
                <span className="legend-name">Streetlight</span>
                <span className="legend-pct">12%</span>
              </div>
              <div className="legend-row">
                <span className="legend-color c-other"></span>
                <span className="legend-name">Others</span>
                <span className="legend-pct">8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map Heatmap Representation */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Issues by Location</h2>
            <FiMapPin className="card-icon" />
          </div>

          <div className="heatmap-container">
            <div className="heatmap-canvas-bg">
              <div className="heatmap-grid-overlay"></div>
              <div className="heat-zone zone-high" style={{ top: '35%', left: '30%' }}>
                <span>Duvvada (84)</span>
              </div>
              <div className="heat-zone zone-med" style={{ top: '60%', left: '60%' }}>
                <span>Gajuwaka (52)</span>
              </div>
              <div className="heat-zone zone-low" style={{ top: '25%', left: '70%' }}>
                <span>Ward 12 (38)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ANALYTICS */}
      <div className="admin-analytics-grid">
        {/* Left: Resolution Trend */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h2>Resolution Trend</h2>
            <FiBarChart2 className="card-icon" />
          </div>

          <div className="line-chart-container">
            <div className="chart-bars-flex">
              <div className="bar-column">
                <div className="bar-fill resolved" style={{ height: '70%' }}></div>
                <div className="bar-fill progress" style={{ height: '25%' }}></div>
                <span>Jan</span>
              </div>
              <div className="bar-column">
                <div className="bar-fill resolved" style={{ height: '80%' }}></div>
                <div className="bar-fill progress" style={{ height: '20%' }}></div>
                <span>Feb</span>
              </div>
              <div className="bar-column">
                <div className="bar-fill resolved" style={{ height: '65%' }}></div>
                <div className="bar-fill progress" style={{ height: '30%' }}></div>
                <span>Mar</span>
              </div>
              <div className="bar-column">
                <div className="bar-fill resolved" style={{ height: '85%' }}></div>
                <div className="bar-fill progress" style={{ height: '15%' }}></div>
                <span>Apr</span>
              </div>
              <div className="bar-column">
                <div className="bar-fill resolved" style={{ height: '90%' }}></div>
                <div className="bar-fill progress" style={{ height: '10%' }}></div>
                <span>May</span>
              </div>
            </div>

            <div className="chart-legend-row">
              <span className="dot green"></span> Resolved Issues
              <span className="dot blue"></span> In Progress
            </div>
          </div>
        </div>

        {/* Right: Average Resolution Time */}
        <div className="analytics-card flex-center">
          <div className="analytics-card-header">
            <h2>Average Resolution Time</h2>
            <FiClock className="card-icon" />
          </div>

          <div className="res-time-box">
            <span className="time-big">4.2 days</span>
            <p className="trend-good">
              <FiTrendingDown /> ↓ 1.2 days vs last month
            </p>
          </div>
        </div>
      </div>

      {/* SCREEN 11 — ADMIN ISSUE DATA TABLE */}
      <div className="admin-table-card">
        <div className="table-header-flex">
          <h2>All Issue Reports</h2>
          <div className="table-search-box">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search issues, locations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminIssuesList.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.title}</strong></td>
                  <td>{row.category}</td>
                  <td>📍 {row.location}</td>
                  <td>
                    <span className={`priority-badge ${row.priorityType}`}>
                      {row.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${row.statusType}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.assignedTo}</td>
                  <td>{row.date}</td>
                  <td>
                    <Link to={`/issues/${row.id}`} className="btn-table-action">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}