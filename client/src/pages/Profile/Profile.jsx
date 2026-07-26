import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import {
  FaUserCircle,
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

// Dummy User Statistics Data
const USER_STATS = [
  {
    id: 'submitted',
    title: 'Reports Submitted',
    value: 18,
    icon: FaClipboardList,
    colorClass: 'stat-blue',
  },
  {
    id: 'resolved',
    title: 'Resolved Reports',
    value: 10,
    icon: FaCheckCircle,
    colorClass: 'stat-green',
  },
  {
    id: 'pending',
    title: 'Pending Reports',
    value: 6,
    icon: FaClock,
    colorClass: 'stat-orange',
  },
  {
    id: 'verified',
    title: 'Verified Reports',
    value: 2,
    icon: FaThumbsUp,
    colorClass: 'stat-purple',
  },
];

const Profile = () => {
  const { user: authUser, logout } = useAuth();

  // Temporary fallback user so you can immediately preview your page
  const user = authUser || {
    name: 'Jyoshna',
    email: 'jyoshna@example.com',
    createdAt: '2026-07-01',
  };
  const handleLogout = () => {
    logout();
  };

  const handleEdit = () => {
    alert('Edit feature will be available after backend integration.');
  };

  if (!user) return null;

  // Format date safely if available, otherwise default to "July 2026"
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    : 'July 2026';

  const defaultPhone = user.phone || '+91 9876543210';
  const defaultLocation = user.location || 'Visakhapatnam, Andhra Pradesh';
  const defaultOccupation = user.occupation || 'Student';
  const userBadges = ['Helpful Reporter', 'Community Volunteer'];

  return (
    <>
      
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
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-initial">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
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
            {USER_STATS.map((stat) => {
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
                  <span className="info-value highlight-value">18</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Resolved Reports</span>
                  <span className="info-value highlight-value">10</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Pending Reports</span>
                  <span className="info-value highlight-value">6</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Community Rating</span>
                  <span className="info-value rating-value">★ 4.8 / 5</span>
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
    </>
  );
};

export default Profile;