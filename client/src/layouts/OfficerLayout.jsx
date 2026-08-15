import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiShield, FiBell, FiUser, FiLogOut, FiMenu, FiX, 
  FiGrid, FiCheckSquare, FiBriefcase, FiClock, FiExternalLink 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../components/Common/Navbar/Navbar.css';

const OfficerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const officerName = user?.name || 'Officer Rajesh Kumar';
  const wardId = user?.wardId || 'WARD-04';
  const userInitial = officerName.charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F9FC' }}>
      {/* Top Header Navbar */}
      <header className="hero-navbar">
        <div className="navbar-container">
          {/* Brand Logo & Officer Portal Title */}
          <div className="navbar-brand" onClick={() => navigate('/officer/dashboard')}>
            <div className="brand-logo-icon">
              <FiShield className="pin-icon" />
            </div>
            <div className="brand-title">
              <h2>Community Hero</h2>
              <span className="brand-tagline">Ward Officer Portal • {wardId}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            <NavLink 
              to="/officer/dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/officer/verify-issues" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Verify Issues
            </NavLink>
            <NavLink 
              to="/officer/assigned-issues" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Assigned Issues
            </NavLink>
            <NavLink 
              to="/officer/history" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Issue History
            </NavLink>
          </nav>

          {/* User Actions & Profile Menu */}
          <div className="navbar-actions">
            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button 
                className="icon-btn" 
                onClick={() => setNotificationsOpen(!notificationsOpen)} 
                aria-label="Notifications"
              >
                <FiBell />
                <span className="notification-dot"></span>
              </button>
              {notificationsOpen && (
                <div className="notification-dropdown animate-fade-in">
                  <div className="notification-header">
                    <h4>Officer Alerts</h4>
                    <span>Mark all read</span>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item unread">
                      <p><strong>Urgent:</strong> High-priority pothole report submitted in {wardId}.</p>
                      <span className="time">5m ago</span>
                    </div>
                    <div className="notification-item">
                      <p>Roads Department acknowledged assignment for repair.</p>
                      <span className="time">1h ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Officer Profile Menu */}
            <div className="user-profile-menu">
              <div 
                className="user-avatar-badge" 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span className="user-initial">{userInitial}</span>
              </div>
              {profileDropdownOpen && (
                <div className="profile-dropdown animate-fade-in">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{officerName}</p>
                    <p className="dropdown-email">{user?.email || 'officer@communityhero.org'}</p>
                    <span className="role-tag">
                      {wardId} • Ward Officer
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={() => { navigate('/dashboard'); setProfileDropdownOpen(false); }}>
                    <FiExternalLink /> View Citizen Portal
                  </button>
                  <button onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}>
                    <FiUser /> View Profile
                  </button>
                  <button className="logout-action-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button 
              className="hamburger-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default OfficerLayout;