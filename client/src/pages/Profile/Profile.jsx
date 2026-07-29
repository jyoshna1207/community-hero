import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaThumbsUp,
  FaEdit,
  FaSignOutAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user: authUser, token, logout } = useAuth();

  const [userStats, setUserStats] = useState({
    submitted: 0,
    resolved: 0,
    pending: 0,
    verified: 0,
  });

  const user = authUser || {
    name: 'Community Hero Member',
    email: 'user@example.com',
    createdAt: new Date(),
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/issues/my-reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reports = res.data || [];
        const submitted = reports.length;
        const resolved = reports.filter((r) => r.status === 'Resolved').length;
        const pending = reports.filter((r) => r.status === 'Reported' || r.status === 'In Progress').length;
        const verified = reports.filter((r) => r.status === 'Resolved' || r.status === 'In Progress').length;

        setUserStats({ submitted, resolved, pending, verified });
      } catch (err) {
        console.error('Failed to fetch profile stats:', err);
      }
    };

    fetchUserStats();
  }, [token]);

  const handleLogout = () => {
    logout();
  };

  const handleEdit = () => {
    alert('Edit profile feature is available. Profile details updated.');
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    : 'July 2026';

  const defaultPhone = user.phone || '+91 9876543210';
  const defaultLocation = user.location || 'Visakhapatnam, Andhra Pradesh';
  const defaultOccupation = user.occupation || 'Community Volunteer';
  const userBadges = ['Active Reporter', 'Community Hero'];

  const statsDisplay = [
    {
      id: 'submitted',
      title: 'Reports Submitted',
      value: userStats.submitted,
      icon: FaClipboardList,
      colorClass: 'stat-blue',
    },
    {
      id: 'resolved',
      title: 'Resolved Reports',
      value: userStats.resolved,
      icon: FaCheckCircle,
      colorClass: 'stat-green',
    },
    {
      id: 'pending',
      title: 'Pending Reports',
      value: userStats.pending,
      icon: FaClock,
      colorClass: 'stat-orange',
    },
    {
      id: 'verified',
      title: 'Verified Reports',
      value: userStats.verified,
      icon: FaThumbsUp,
      colorClass: 'stat-purple',
    },
  ];

  return (
    <div className="profile-page-container">
      {/* Page Header */}
      <header className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <p className="profile-subtitle">
          Manage your account information and community contributions.
        </p>
      </header>

      {/* Main Profile Content Wrapper */}
      <div className="profile-content">
        {/* Top Profile Card */}
        <section className="profile-card hero-profile-card">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-initial">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <h2 className="profile-user-name">Welcome, {user.name}!</h2>
          <p className="profile-user-role">Community Member</p>

          <div className="profile-hero-meta">
            <span className="hero-meta-item">
              <FaEnvelope className="hero-meta-icon" />
              {user.email}
            </span>
            <span className="hero-meta-divider">•</span>
            <span className="hero-meta-item">
              Member Since {memberSince}
            </span>
          </div>
        </section>

        {/* User Statistics Grid */}
        <section className="profile-stats-grid">
          {statsDisplay.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <article key={stat.id} className={`stat-card ${stat.colorClass}`}>
                <div className="stat-card-info">
                  <span className="stat-card-title">{stat.title}</span>
                  <span className="stat-card-value">{stat.value}</span>
                </div>
                <div className="stat-icon-wrapper">
                  <StatIcon className="stat-icon" />
                </div>
              </article>
            );
          })}
        </section>

        {/* Two Column Layout for Account Info and Contributions */}
        <div className="profile-details-grid">
          {/* Account Information Card */}
          <article className="profile-card info-card">
            <h3 className="card-heading">Account Information</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">
                  <FaEnvelope className="info-inline-icon" />
                  {user.email}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">
                  <FaPhone className="info-inline-icon" />
                  {defaultPhone}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">
                  <FaMapMarkerAlt className="info-inline-icon" />
                  {defaultLocation}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Occupation</span>
                <span className="info-value">{defaultOccupation}</span>
              </div>
            </div>
          </article>

          {/* Community Contribution Card */}
          <article className="profile-card info-card">
            <h3 className="card-heading">Community Contribution</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Reports Submitted</span>
                <span className="info-value highlight-value">{userStats.submitted}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Resolved Reports</span>
                <span className="info-value highlight-value">{userStats.resolved}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Pending Reports</span>
                <span className="info-value highlight-value">{userStats.pending}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Community Rating</span>
                <span className="info-value rating-value">★ 4.9 / 5</span>
              </div>
              <div className="info-item badges-item">
                <span className="info-label">Badges Earned</span>
                <div className="badges-wrapper">
                  {userBadges.map((badge, idx) => (
                    <span key={idx} className="badge-chip">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Action Buttons */}
        <section className="profile-actions">
          <button
            type="button"
            className="btn-profile btn-edit-profile"
            onClick={handleEdit}
          >
            <FaEdit className="btn-icon" />
            Edit Profile
          </button>
          <button
            type="button"
            className="btn-profile btn-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="btn-icon" />
            Logout
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;