import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing icons for the mobile menu toggle
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Toggles the mobile menu state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Closes the mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // Helper to apply an 'active' class to the current page link
  const isActive = (path) => (location.pathname === path ? 'active-link' : '');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🤝</span> Community<span>Hero</span>
        </Link>

        {/* Hamburger Icon for Mobile View */}
        <div className="menu-icon" onClick={toggleMenu} aria-label="Toggle navigation menu">
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Links and Buttons */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className={`nav-links ${isActive('/')}`} onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
  <Link
    to="/events"
    className={`nav-links ${isActive('/events')}`}
    onClick={closeMobileMenu}
  >
    Events
  </Link>
</li>
          
          {/* Authentication Buttons */}
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className={`nav-links ${isActive('/profile')}`} onClick={closeMobileMenu}>
                  Profile
                </Link>
              </li>
              <li className="nav-btn-item">
                <button 
                  onClick={() => { logout(); closeMobileMenu(); }} 
                  className="btn-link secondary-btn"
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-btn-item">
                <Link to="/login" className="btn-link secondary-btn" onClick={closeMobileMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-btn-item">
                <Link to="/register" className="btn-link primary-btn" onClick={closeMobileMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;