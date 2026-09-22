import React, { useState, useEffect } from 'react';
import { 
  FiChevronDown, FiTrendingDown, FiPieChart, FiMapPin, FiBarChart2, 
  FiClock, FiSearch, FiFilter, FiEye, FiArrowRight, FiCheckCircle, FiActivity, FiRefreshCw 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaBuilding, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadAdminDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/issues');
      const all = Array.isArray(res.data) ? res.data : [];

      const mapped = all.map(item => {
        const status = item.status || 'Reported';
        let statusType = 'pending';
        const sUpper = status.toUpperCase();
        if (sUpper === 'RESOLVED' || sUpper === 'SOLVED') statusType = 'resolved';
        else if (sUpper === 'IN PROGRESS') statusType = 'in-progress';
        else if (sUpper === 'CRITICAL') statusType = 'critical';

        let priorityType = 'normal';
        const pUpper = (item.priority || item.aiSeverity || '').toUpperCase();
        if (pUpper === 'CRITICAL') priorityType = 'critical';
        else if (pUpper === 'HIGH') priorityType = 'warning';
        else if (pUpper === 'LOW') priorityType = 'success';

        return {
          id: item._id || item.id,
          _id: item._id || item.id,
          title: item.title,
          category: item.category || 'Roads',
          location: item.location || 'Visakhapatnam',
          priority: item.priority || item.aiSeverity || 'High',
          priorityType,
          status,
          statusType,
          assignedTo: item.assignedDept || 'Municipal Task Force',
          date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };
      });

      setIssues(mapped);

      const total = mapped.length;
      const inProg = mapped.filter(i => i.status.toUpperCase() === 'IN PROGRESS').length;
      const resCount = mapped.filter(i => i.status.toUpperCase() === 'RESOLVED' || i.status.toUpperCase() === 'SOLVED').length;
      const critCount = mapped.filter(i => (i.priority || '').toUpperCase() === 'CRITICAL').length;
      const pend = total - inProg - resCount;

      setStats({
        total,
        pending: Math.max(0, pend),
        inProgress: inProg,
        resolved: resCount,
        critical: critCount,
      });
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminDashboardData();
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || issue.status.toLowerCase().includes(selectedStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-operations-dashboard">
      {/* PURPOSE HERO BANNER */}
      <div className="portal-purpose-banner admin-theme">
        <div className="banner-left-content">
          <div className="banner-role-tag">
            <FaBuilding /> Central Municipal Administration Control
          </div>
          <h1>City-Wide Governance & Operational Integrity</h1>
          <p>
            Oversee all municipal wards, audit user credentials & roles, track department workload balance, re-route unresolved emergencies, and monitor city-level SLA compliance in real time.
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/admin/manage-issues" className="banner-btn-primary">
            Manage All Issues
          </Link>
          <Link to="/admin/manage-users" className="banner-btn-secondary">
            <FaUsers /> Manage Users
          </Link>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="admin-header-flex">
        <div>
          <h2>City Operations Overview</h2>
          <p className="admin-subtitle">Live city-wide municipal operations, cross-department tracking, and KPI analytics.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={loadAdminDashboardData} 
            style={{ padding: '8px 14px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <div className="admin-filter-select">
            <span>All Wards & Zones</span>
            <FiChevronDown />
          </div>
        </div>
      </div>

      {/* KPI CARDS (5 CARDS) */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-num">{loading ? '...' : stats.total}</span>
          <span className="admin-kpi-label">Total Issues</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-num text-orange">{loading ? '...' : stats.pending}</span>
          <span className="admin-kpi-label">Pending Verification</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-num text-blue">{loading ? '...' : stats.inProgress}</span>
          <span className="admin-kpi-label">In Progress</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-num text-green">{loading ? '...' : stats.resolved}</span>
          <span className="admin-kpi-label">Resolved Issues</span>
        </div>

        <div className="admin-kpi-card border-red">
          <span className="admin-kpi-num text-red">{loading ? '...' : stats.critical}</span>
          <span className="admin-kpi-label">Critical Urgency</span>
        </div>
      </div>

      {/* RECENT ISSUES TABLE WITH LIVE SEARCH & FILTERS */}
      <div className="admin-table-section">
        <div className="table-header-controls">
          <div className="table-heading-group">
            <h2>Recent Community Reports</h2>
            <span className="table-subtitle">Showing live issues across municipal wards</span>
          </div>

          <div className="table-actions-group">
            {/* Search Input */}
            <div className="admin-search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search issues, location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="status-filter-wrapper">
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="admin-status-dropdown"
              >
                <option value="All">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Responsive Table */}
        <div className="table-responsive-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ISSUE ID</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>LOCATION</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>ASSIGNED TO</th>
                <th>REPORTED</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    Loading database records...
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    No reports match the current filter.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-slate-700">#{item.id.slice(-6)}</td>
                    <td className="font-semibold text-slate-900">{item.title}</td>
                    <td>
                      <span className="category-tag-badge">{item.category}</span>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`priority-indicator ${item.priorityType}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag-badge ${item.statusType}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.assignedTo}</td>
                    <td>{item.date}</td>
                    <td>
                      <Link to={`/track-report/${item.id}`} className="table-action-link" title="Track issue details">
                        <FiEye /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-pagination">
          <span>Showing {filteredIssues.length} of {issues.length} total reports</span>
          <Link to="/admin/manage-issues" className="view-all-link">
            Manage All Issues & Assignments <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}