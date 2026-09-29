import React, { useState } from 'react';
import { FiMenu, FiBell, FiLogOut, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './TopHeader.css';

export default function TopHeader({ title, roleLabel, onToggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate mock notifications tailored to the user's role
  const getMockNotifications = () => {
    const role = (roleLabel || '').toLowerCase();
    
    if (role.includes('admin')) {
      return [
        { id: 1, type: 'alert', text: 'System SLA dropping in Ward 4. Immediate attention required.', time: '10 mins ago', icon: <FiAlertCircle /> },
        { id: 2, type: 'info', text: 'Weekly civic performance report has been generated.', time: '2 hours ago', icon: <FiInfo /> }
      ];
    }
    if (role.includes('officer') || role.includes('ward')) {
      return [
        { id: 1, type: 'alert', text: '3 New high-priority road damage issues reported in your ward.', time: '5 mins ago', icon: <FiAlertCircle /> },
        { id: 2, type: 'info', text: 'Department updated status on "Water Leakage" ticket.', time: '1 hour ago', icon: <FiInfo /> }
      ];
    }
    if (role.includes('dept') || role.includes('department')) {
      return [
        { id: 1, type: 'alert', text: 'New task assigned: "Fix Broken Streetlight" in Zone A.', time: '15 mins ago', icon: <FiAlertCircle /> },
        { id: 2, type: 'success', text: 'Your completion report for "Road Repair" was approved.', time: '3 hours ago', icon: <FiCheckCircle /> }
      ];
    }
    
    // Default: Citizen notifications
    return [
      { id: 1, type: 'success', text: 'Your issue "Pothole near temple" is now Resolved! Thank you!', time: '10 mins ago', icon: <FiCheckCircle /> },
      { id: 2, type: 'info', text: 'Rahul upvoted your report "Garbage Waste Pile".', time: '1 hour ago', icon: <FiInfo /> },
      { id: 3, type: 'info', text: 'Your report "Streetlight Inoperative" is currently In Progress.', time: 'Yesterday', icon: <FiInfo /> }
    ];
  };

  const notifications = getMockNotifications();

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
        <button 
          className="header-icon-btn" 
          aria-label="Notifications" 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        {showNotifications && (
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3>Notifications ({notifications.length})</h3>
            </div>
            <ul className="notifications-list">
              {notifications.map(n => (
                <li key={n.id} className="notification-item">
                  <div className={`notification-icon-wrap ${n.type}`}>
                    {n.icon}
                  </div>
                  <div className="notification-content">
                    <p>{n.text}</p>
                    <span>{n.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

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