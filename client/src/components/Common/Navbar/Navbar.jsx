// File path: src/components/Common/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiUsers, FiBell, FiUser, FiLogOut, FiMenu, FiX, FiShield, FiPlusCircle, FiList, FiHome, FiInfo, FiMail
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="hero-navbar">
      <div className="navbar-container">
        {/* Brand Logo & Tagline */}
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="brand-logo-icon">
            <FiMapPin className="pin-icon" />
          </div>
          <div className="brand-title">
            <h2>Community Hero</h2>
            <span className="brand-tagline">Small Reports. Real Change.</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/issues" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            Explore Issues
          </NavLink>
          <a href="/#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </a>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            Community
          </NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            About Us
          </NavLink>
        </nav>

        {/* User Actions & Auth Buttons */}
        <div className="navbar-actions">
          {user ? (
            <>
              <div className="notification-wrapper">
                <button className="icon-btn" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications">
                  <FiBell />
                  <span className="notification-dot"></span>
                </button>
                {notificationsOpen && (
                  <div className="notification-dropdown animate-fade-in">
                    <div className="notification-header">
                      <h4>Notifications</h4>
                      <span>Mark all read</span>
                    </div>
                    <div className="notification-list">
                      <div className="notification-item unread">
                        <p>Your reported issue #CH-2026-00124 has been verified by the Ward Officer.</p>
                        <span className="time">10m ago</span>
                      </div>
                      <div className="notification-item">
                        <p>Roads Department assigned staff to pothole repair.</p>
                        <span className="time">2h ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="user-profile-menu">
                <div className="user-avatar-badge" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                  <span className="user-initial">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                </div>
                {profileDropdownOpen && (
                  <div className="profile-dropdown animate-fade-in">
                    <div className="dropdown-user-info">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                      <span className="role-tag">
                        {user.role || 'citizen'}
                      </span>
                    </div>
                    <div className="dropdown-divider"></div>
                    
                    {user.role === 'admin' && (
                      <button onClick={() => { navigate('/admin/dashboard'); setProfileDropdownOpen(false); }}>
                        <FiShield /> Admin Portal
                      </button>
                    )}
                    {user.role === 'officer' && (
                      <button onClick={() => { navigate('/officer/dashboard'); setProfileDropdownOpen(false); }}>
                        <FiShield /> Ward Officer Portal
                      </button>
                    )}
                    {user.role === 'department' && (
                      <button onClick={() => { navigate('/department/dashboard'); setProfileDropdownOpen(false); }}>
                        <FiShield /> Department Portal
                      </button>
                    )}

                    <button onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}>
                      <FiUser /> View Profile
                    </button>
                    <button className="logout-action-btn" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btn-group">
              <button className="btn-login-text" onClick={() => navigate('/login')}>
                Log In
              </button>
              <button className="btn-signup-primary" onClick={() => navigate('/register')}>
                Sign Up
              </button>
            </div>
          )}

          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Navigation">
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}