import React from 'react';
import { FiClipboard, FiClock, FiCheckCircle, FiAward, FiPlusCircle, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { dashboardCardsData, recentReportsData, communityScoreData, quickActionsData } from './DashboardData';
import './Dashboard.css';
// REMOVED DashboardLayout import to stop layout duplication
import AdminDashboardCards from '../../../components/dashboards/AdminDashboardCards/AdminDashboardCards';
import DepartmentDashboardCards from '../../../components/dashboards/DepartmentDashboardCards/DepartmentDashboardCards';
import OfficerDashboardCards from '../../../components/dashboards/OfficerDashboardCards/OfficerDashboardCards';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../constants/roles';

export default function Dashboard() {
  const { user } = useAuth();
  const currentRole = user?.role?.toLowerCase() || 'citizen';

  const renderRoleCards = () => {
    switch (currentRole) {
      case 'admin':
      case 'administrator':
      case ROLES.ADMIN:
        return <AdminDashboardCards />;
      case 'department':
      case 'department officer':
      case 'department_officer':
      case ROLES.DEPARTMENT:
        return <DepartmentDashboardCards />;
      case 'ward officer':
      case 'ward_officer':
      case 'officer':
      case ROLES.WARD_OFFICER:
        return <OfficerDashboardCards />;
      default:
        return (
          <div className="dash-cards-grid">
            <div className="dash-metric-card">
              <div className="metric-icon blue"><FiClipboard /></div>
              <div>
                <h3>{dashboardCardsData.totalReports}</h3>
                <p>Total Reports</p>
              </div>
            </div>
            <div className="dash-metric-card">
              <div className="metric-icon orange"><FiClock /></div>
              <div>
                <h3>{dashboardCardsData.pendingReports}</h3>
                <p>Pending Reports</p>
              </div>
            </div>
            <div className="dash-metric-card">
              <div className="metric-icon green"><FiCheckCircle /></div>
              <div>
                <h3>{dashboardCardsData.resolvedReports}</h3>
                <p>Resolved Reports</p>
              </div>
            </div>
            <div className="dash-metric-card">
              <div className="metric-icon purple"><FiAward /></div>
              <div>
                <h3>{dashboardCardsData.communityScore}</h3>
                <p>Community Score</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    // Replaced <DashboardLayout> with a clean fragment <> so it relies strictly on CitizenLayout
    <>
      <div className="citizen-dashboard-page">
        <div className="dashboard-welcome-banner">
          <div>
            <h2>Welcome back, {user?.name || 'Citizen Hero'} 👋</h2>
            <p>Monitor your active civic contributions and community score statistics.</p>
          </div>
          <Link to="/report-issue" className="dashboard-action-btn">
            <FiPlusCircle /> Report New Issue
          </Link>
        </div>

        {/* Dynamic Role-Based Cards Grid */}
        {renderRoleCards()}

        {/* Main Content Split */}
        <div className="dash-content-split">
          {/* Recent Reports */}
          <div className="dash-section-box">
            <div className="section-title-flex">
              <h3>Recent Reports</h3>
              <Link to="/my-reports">View All →</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReportsData.map((rep) => (
                    <tr key={rep.id}>
                      <td><strong>{rep.title}</strong></td>
                      <td>{rep.category}</td>
                      <td><span className={`status-pill ${rep.status.toLowerCase().replace(/\s+/g, '-')}`}>{rep.status}</span></td>
                      <td>{rep.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Community Contribution */}
          <div className="dash-sidebar-column">
            <div className="dash-section-box">
              <h3>Quick Actions</h3>
              <div className="quick-actions-list">
                {quickActionsData.map((act) => (
                  <Link key={act.id} to={act.path} className="quick-action-item">
                    <span>{act.icon} {act.label}</span>
                    <FiArrowRight />
                  </Link>
                ))}
              </div>
            </div>

            <div className="dash-section-box community-score-box">
              <h3>Community Contribution</h3>
              <div className="score-progress-container">
                <div className="score-ring">
                  <span>{communityScoreData.score}%</span>
                </div>
                <p>You are in the top <strong>{communityScoreData.percentile}%</strong> of active ward contributors this month!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}