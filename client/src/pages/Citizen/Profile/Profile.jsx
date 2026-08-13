import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiShield, FiAward, FiCalendar, 
  FiEdit, FiLock, FiLogOut, FiClipboard, FiCheckCircle 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    submitted: 0,
    resolved: 0,
    score: '100 XP'
  });

  useEffect(() => {
    const loadUserStats = async () => {
      let userReports = [];

      // 1. Read local submitted reports
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        userReports = [...local];
      } catch (e) {
        console.error("Local storage read error:", e);
      }

      // 2. Fetch API user reports if token present
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/issues/my-reports', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && Array.isArray(res.data)) {
            const apiReports = res.data;
            const existingIds = new Set(userReports.map(r => r.id || r._id));
            apiReports.forEach(r => {
              if (!existingIds.has(r._id)) userReports.push(r);
            });
          }
        } catch (err) {
          console.error("API my-reports fetch error:", err);
        }
      }

      const submitted = userReports.length;
      const resolved = userReports.filter(r => r.status === 'Resolved' || r.status === 'Solved').length;
      const calculatedPoints = user?.points != null ? `${user.points} XP` : `${(submitted * 50) + (resolved * 100) + 50} XP`;

      setStats({
        submitted,
        resolved,
        score: calculatedPoints
      });
    };

    loadUserStats();
  }, [token, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || 'Medisetti Anusha';
  const displayEmail = user?.email || 'anusha@communityhero.org';
  const displayRole = (user?.role || 'Citizen').toUpperCase() + ' HERO';
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Aug 2026';

  return (
    <div className="profile-page-container">
      {/* Profile Banner */}
      <div className="profile-header-banner">
        <div className="profile-avatar-large">
          <span>{displayName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-user-titles">
          <h2>{displayName}</h2>
          <p>{displayEmail}</p>
          <span className="role-badge">{displayRole}</span>
        </div>
      </div>

      {/* Profile Metrics */}
      <div className="profile-stats-grid">
        <div className="dash-metric-card">
          <div className="metric-icon blue"><FiClipboard /></div>
          <div>
            <h3>{stats.submitted}</h3>
            <p>Reports Submitted</p>
          </div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-icon green"><FiCheckCircle /></div>
          <div>
            <h3>{stats.resolved}</h3>
            <p>Resolved Reports</p>
          </div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-icon purple"><FiAward /></div>
          <div>
            <h3>{stats.score}</h3>
            <p>Community Score</p>
          </div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-icon orange"><FiCalendar /></div>
          <div>
            <h3>{memberSince}</h3>
            <p>Member Since</p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="profile-actions-box">
        <h3>Account Settings</h3>
        <div className="profile-buttons-flex">
          <button className="btn-primary" onClick={() => alert("Profile updated successfully")}>
            <FiEdit /> Edit Profile
          </button>
          <button className="btn-danger-outline" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
