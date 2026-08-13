import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiPlusCircle, FiList, FiFileText, FiUser, 
  FiGrid, FiUsers, FiBriefcase, FiMapPin, 
  FiBarChart2, FiSettings, FiCheckSquare, FiClipboard, 
  FiClock, FiTrendingUp, FiLogOut, FiMap, FiBell, FiShield
} from 'react-icons/fi';
import './BasePortalLayout.css';

const getNavIcon = (label, customIcon) => {
  if (customIcon) {
    const CustomIconComp = customIcon;
    return <CustomIconComp className="nav-item-icon" />;
  }
  const l = label.toLowerCase();
  if (l.includes('dashboard')) return <FiGrid className="nav-item-icon" />;
  if (l.includes('report issue')) return <FiPlusCircle className="nav-item-icon" />;
  if (l.includes('explore issues') || l.includes('issues')) return <FiList className="nav-item-icon" />;
  if (l.includes('map')) return <FiMap className="nav-item-icon" />;
  if (l.includes('my reports') || l.includes('reports')) return <FiFileText className="nav-item-icon" />;
  if (l.includes('community')) return <FiUsers className="nav-item-icon" />;
  if (l.includes('notifications')) return <FiBell className="nav-item-icon" />;
  if (l.includes('profile')) return <FiUser className="nav-item-icon" />;
  if (l.includes('settings')) return <FiSettings className="nav-item-icon" />;
  if (l.includes('users')) return <FiUsers className="nav-item-icon" />;
  if (l.includes('department')) return <FiBriefcase className="nav-item-icon" />;
  if (l.includes('ward')) return <FiMapPin className="nav-item-icon" />;
  if (l.includes('analytics')) return <FiBarChart2 className="nav-item-icon" />;
  return <FiFileText className="nav-item-icon" />;
};

const BasePortalLayout = ({ portalTitle, navItems }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = portalTitle?.toLowerCase().includes('admin');
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="portal-layout-container">
      {/* Unified Sidebar (Dark Navy for Admin, Light/Slate for Citizen) */}
      <aside className={`portal-sidebar ${isAdmin ? 'admin-navy-sidebar' : 'citizen-light-sidebar'}`}>
        <div>
          {/* Brand Header */}
          <Link to="/" className="sidebar-brand-header">
            <div className="sidebar-logo-icon">
              <FiMapPin />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">
                {isAdmin ? 'Admin Panel' : 'Community Hero'}
              </span>
              <span className="sidebar-portal-badge">{portalTitle}</span>
            </div>
          </Link>

          {/* Navigation List */}
          <ul className="sidebar-nav-list">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {getNavIcon(item.label, item.icon)}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* User Card & Logout */}
        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user-card">
              <div className="user-avatar-circle">{userInitial}</div>
              <div className="user-info-group">
                <span className="user-display-name">{user.name || 'Anusha'}</span>
                <span className="user-display-role">{user.role || 'Citizen'}</span>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="portal-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default BasePortalLayout;