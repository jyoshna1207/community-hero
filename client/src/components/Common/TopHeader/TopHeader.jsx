import React from 'react';
import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import './TopHeader.css';

export default function TopHeader({ title, roleLabel, onToggleSidebar }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          <FiMenu />
        </button>
        <div className="header-brand">
          <span className="brand-title">Community Hero</span>
          <span className="role-badge">{roleLabel}</span>
        </div>
      </div>

      <div className="header-center">
        <h1 className="page-main-title">{title}</h1>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" aria-label="Notifications">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile-section">
          <div className="avatar-placeholder">CH</div>
        </div>

        <button className="logout-btn" onClick={() => {}} title="Logout">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}