// File path: src/components/Common/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiBell, FiUser, FiLogOut, FiMenu, FiX, FiShield, FiPlusCircle, 
  FiList, FiHome, FiCheckSquare, FiBriefcase, FiLayers, FiUsers
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = (user?.role || 'citizen').toLowerCase().trim();
  const isAdmin = role === 'admin';
  const isOfficer = role.includes('ward') || role === 'officer' || role === 'ward_officer';
  const isDept = role.includes('district') || role.includes('dept') || role === 'department';
  const isCitizen = !isAdmin && !isOfficer && !isDept;
  const targetDashboard = isAdmin ? '/admin/dashboard' : isOfficer ? '/ward-dashboard' : isDept ? '/department/dashboard' : '/dashboard';

  return (
    <header className="hero-navbar">
      <div className="navbar-container">
        {/* Brand Logo & Tagline */}
        <div className="navbar-brand" onClick={() => navigate(targetDashboard)}>
          <div className="brand-logo-icon">
            <FiMapPin className="pin-icon" />
          </div>
          <div className="brand-title">
            <h2>Community Hero</h2>
            <span className="brand-tagline">Small Reports. Real Change.</span>
          </div>
        </div>

        {/* Dynamic Role-Aware Navigation Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          {isCitizen && (
            <>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                {t('navDashboard')}
              </NavLink>
              <NavLink to="/report-issue" className={({isActive}) => isActive ? 'nav-link report-nav-pill active' : 'nav-link report-nav-pill'} onClick={() => setMobileMenuOpen(false)}>
                {t('navReportIssue')}
              </NavLink>
              <NavLink to="/issues" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                {t('navExploreMap')}
              </NavLink>
              <NavLink to="/my-reports" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                {t('navMyReports')}
              </NavLink>
            </>
          )}

          {isOfficer && (
            <>
              <NavLink to="/ward-dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Ward Overview
              </NavLink>
              <NavLink to="/officer/verify-issues" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Verify Queue
              </NavLink>
              <NavLink to="/officer/assigned-issues" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Dispatched Work
              </NavLink>
              <NavLink to="/officer/history" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Issue History
              </NavLink>
              <NavLink to="/issues" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                City Map
              </NavLink>
            </>
          )}

          {isDept && (
            <>
              <NavLink to="/department/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Dept Dashboard
              </NavLink>
              <NavLink to="/department/assigned-work" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Assigned Work
              </NavLink>
              <NavLink to="/department/update-progress" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Update Progress
              </NavLink>
              <NavLink to="/department/completed-work" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Resolved Archive
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Admin Overview
              </NavLink>
              <NavLink to="/admin/manage-issues" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                All Issues
              </NavLink>
              <NavLink to="/admin/manage-users" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Users Directory
              </NavLink>
              <NavLink to="/admin/manage-departments" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setMobileMenuOpen(false)}>
                Departments
              </NavLink>
            </>
          )}
        </nav>

        {/* User Actions & Auth Buttons */}
        <div className="navbar-actions">
          {/* Multilingual Selector Pill */}
          <div className="language-selector-pill" style={{ display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)', border: '1px solid #CBD5E1', borderRadius: '24px', padding: '3px 4px', gap: '2px', boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)' }}>
            <button 
              onClick={() => setLanguage('en')}
              style={{
                border: language === 'en' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                background: language === 'en' ? 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                color: language === 'en' ? '#FFFFFF' : '#475569',
                padding: '4px 10px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                boxShadow: language === 'en' ? 'inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(217, 119, 6, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="Switch to English"
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('te')}
              style={{
                border: language === 'te' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                background: language === 'te' ? 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                color: language === 'te' ? '#FFFFFF' : '#475569',
                padding: '4px 10px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                boxShadow: language === 'te' ? 'inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(217, 119, 6, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="తెలుగులోకి మార్చండి (Telugu)"
            >
              తెలుగు
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              style={{
                border: language === 'hi' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                background: language === 'hi' ? 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                color: language === 'hi' ? '#FFFFFF' : '#475569',
                padding: '4px 10px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                boxShadow: language === 'hi' ? 'inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 6px rgba(217, 119, 6, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title="हिंदी में बदलें (Hindi)"
            >
              हिंदी
            </button>
          </div>

          {user ? (
            <>
              {/* Context Action Button */}
              {isCitizen && (
                <button 
                  onClick={() => navigate('/report-issue')}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)', 
                    color: '#fff', 
                    padding: '9px 16px', 
                    borderRadius: '12px', 
                    fontWeight: 750, 
                    fontSize: '0.84rem', 
                    border: '1px solid rgba(255, 255, 255, 0.35)', 
                    cursor: 'pointer',
                    boxShadow: 'inset 0 1.5px 1px rgba(255, 255, 255, 0.5), inset 0 -1.5px 1px rgba(0, 0, 0, 0.2), 0 6px 16px -3px rgba(194, 65, 12, 0.45)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <FiPlusCircle /> {t('navReportIssue')}
                </button>
              )}
              {isOfficer && (
                <button 
                  onClick={() => navigate('/officer/verify-issues')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#D97706', color: '#fff', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.825rem', border: 'none', cursor: 'pointer' }}
                >
                  <FiCheckSquare /> Verify Queue
                </button>
              )}
              {isDept && (
                <button 
                  onClick={() => navigate('/department/update-progress')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', color: '#fff', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.825rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)' }}
                >
                  <FiBriefcase /> Update Progress
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={() => navigate('/admin/manage-issues')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#DC2626', color: '#fff', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.825rem', border: 'none', cursor: 'pointer' }}
                >
                  <FiLayers /> All Tickets
                </button>
              )}

              <div className="notification-wrapper">
                <button className="icon-btn" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications">
                  <FiBell />
                  <span className="notification-dot"></span>
                </button>
                {notificationsOpen && (
                  <div className="notification-dropdown animate-fade-in">
                    <div className="notification-header">
                      <h4>Live Notifications</h4>
                      <span>Mark all read</span>
                    </div>
                    <div className="notification-list">
                      <div className="notification-item unread">
                        <p>Issue #CH-2026-00124 verified by Ward Officer.</p>
                        <span className="time">Just now</span>
                      </div>
                      <div className="notification-item">
                        <p>Public Works Department accepted repair order.</p>
                        <span className="time">15m ago</span>
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
                      <span className="role-tag" style={{
                        background: isAdmin ? '#fee2e2' : isOfficer ? '#fef3c7' : isDept ? '#e0f2fe' : '#f0fdf4',
                        color: isAdmin ? '#991b1b' : isOfficer ? '#92400e' : isDept ? '#0369a1' : '#166534',
                        fontWeight: 700
                      }}>
                        {isAdmin ? 'Administrator' : isOfficer ? 'Ward Officer' : isDept ? 'Department Lead' : 'Community Citizen'}
                      </span>
                    </div>
                    <div className="dropdown-divider"></div>
                    
                    {isAdmin && (
                      <button onClick={() => { navigate('/admin/dashboard'); setProfileDropdownOpen(false); }}>
                        <FiShield /> Admin Dashboard
                      </button>
                    )}
                    {isOfficer && (
                      <button onClick={() => { navigate('/ward-dashboard'); setProfileDropdownOpen(false); }}>
                        <FiShield /> Ward Officer Portal
                      </button>
                    )}
                    {isDept && (
                      <button onClick={() => { navigate('/department/dashboard'); setProfileDropdownOpen(false); }}>
                        <FiShield /> Department Portal
                      </button>
                    )}

                    <button onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}>
                      <FiUser /> View Profile
                    </button>
                    <button onClick={() => { navigate('/login'); setProfileDropdownOpen(false); }} style={{ color: '#EA580C' }}>
                      <FiUsers /> Switch Role / Account
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