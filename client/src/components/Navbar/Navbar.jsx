import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaHandsHelping, FaBars, FaTimes, FaTrophy, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import GamificationBar from '../GamificationBar/GamificationBar';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          
          {/* Brand Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <FaHandsHelping className="logo-icon" />
            <span className="logo-text">Community Hero</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navigation Links Menu */}
          <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/issues" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
                  Issues
                </NavLink>
              </li>
              <li>
                <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
                  <FaTrophy style={{ marginRight: '4px', color: '#fbbf24' }} /> Leaderboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/insights" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
                  <FaChartLine style={{ marginRight: '4px', color: '#38bdf8' }} /> AI Insights
                </NavLink>
              </li>

              {user ? (
                <>
                  <li>
                    <NavLink to="/report-issue" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
                      Report Issue
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-reports" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
                      My Reports
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={closeMobileMenu}>
                      Profile
                    </NavLink>
                  </li>
                </>
              ) : null}
            </ul>

            {/* User Auth Buttons or Profile Avatar */}
            <div className="nav-auth-actions">
              {user ? (
                <Link to="/profile" className="profile-avatar-btn" onClick={closeMobileMenu} title="View Profile">
                  <span className="avatar-initial">{getInitial(user.name)}</span>
                </Link>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-login" onClick={closeMobileMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-register" onClick={closeMobileMenu}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </nav>
      <GamificationBar />
    </>
  );
};

export default Navbar;