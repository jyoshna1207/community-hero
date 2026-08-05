// File path: src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiPlusCircle, FiList, FiBarChart2, FiUser, FiInfo, FiMail, 
  FiLogOut, FiBell, FiMenu, FiX, FiShield 
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
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="brand-logo-icon">
            <FiShield />
          </div>
          <div className="brand-title">
            <h2>Community<span>Hero</span></h2>
            <span className="brand-subtitle">Hyperlocal Solver</span>
          </div>
        </div>

        <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            <FiHome /> Home
          </NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            <FiBarChart2 /> Dashboard
          </NavLink>
          <NavLink to="/report-issue" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            <FiPlusCircle /> Report Issue
          </NavLink>
          <NavLink to="/issues" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            <FiList /> Issues
          </NavLink>
          <NavLink to="/my-reports" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            <FiCheckCircleCustom /> My Reports
          </NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            <FiInfo /> About
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
            <FiMail /> Contact
          </NavLink>
        </nav>

        <div className="navbar-actions">
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
                    <p>Your reported issue #402 has been verified by the Ward Officer.</p>
                    <span className="time">10m ago</span>
                  </div>
                  <div className="notification-item">
                    <p>Department assigned staff to road repair task.</p>
                    <span className="time">2h ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="user-profile-menu">
            <div className="user-avatar-badge" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              <FiUser />
            </div>
            {profileDropdownOpen && (
              <div className="profile-dropdown animate-fade-in">
                <div className="dropdown-user-info">
                  <p className="dropdown-name">{user?.name || 'Citizen User'}</p>
                  <p className="dropdown-email">{user?.email || 'citizen@hero.com'}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}>
                  <FiUser /> View Profile
                </button>
                <button className="logout-action-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>

          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Navigation">
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}

function FiCheckCircleCustom(props) {
  return <FiList {...props} />;
}