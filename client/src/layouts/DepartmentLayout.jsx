import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  FiBriefcase, FiBell, FiUser, FiLogOut, FiMenu, FiX, FiExternalLink 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../components/Common/Navbar/Navbar.css';

const DepartmentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const departmentName = user?.departmentName || 'Public Works Department';
  const userName = user?.name || 'Department Officer';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F9FC' }}>
      {/* Top Header Navbar */}
      <header className="hero-navbar">
        <div className="navbar-container">
          {/* Brand Logo & Portal Title */}
          <div className="navbar-brand" onClick={() => navigate('/department/dashboard')}>
            <div className="brand-logo-icon">
              <FiBriefcase className="pin-icon" />
            </div>
            <div className="brand-title">
              <h2>Community Hero</h2>
              <span className="brand-tagline">Department Portal • {departmentName}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            <NavLink 
              to="/department/dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/department/assigned-work" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Assigned Work
            </NavLink>
            <NavLink 
              to="/department/update-progress" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Update Progress
            </NavLink>
            <NavLink 
              to="/department/completed-work" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Completed Work
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
                    <h4>Department Alerts</h4>
                    <span>Mark all read</span>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item unread">
                      <p><strong>New Task:</strong> Ward Officer assigned 3 new tickets to {departmentName}.</p>
                      <span className="time">10m ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
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
                    <p className="dropdown-name">{userName}</p>
                    <p className="dropdown-email">{user?.email || 'dept@communityhero.org'}</p>
                    <span className="role-tag">
                      {departmentName}
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
      <main style={{ flex: 1, width: '100%', padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DepartmentLayout;