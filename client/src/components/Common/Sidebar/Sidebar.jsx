import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiClipboard, FiLayers, FiMapPin, FiBarChart2, FiSettings, 
  FiCheckSquare, FiClock, FiCheckCircle, FiBriefcase, FiPlusCircle, FiUser 
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../constants/roles';
import './Sidebar.css';

export default function Sidebar() {
  const { role, user } = useAuth();

  // Determine user role safely, checking all potential fallback fields
  const currentRole = (role || user?.role || '').toLowerCase();

  const renderAdminLinks = () => (
    <>
      <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiBarChart2 /> Dashboard
      </NavLink>
      <NavLink to="/admin/manage-users" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiUsers /> Manage Users
      </NavLink>
      <NavLink to="/admin/manage-issues" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiClipboard /> Manage Issues
      </NavLink>
      <NavLink to="/admin/manage-departments" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiLayers /> Manage Departments
      </NavLink>
      <NavLink to="/admin/manage-wards" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiMapPin /> Manage Wards
      </NavLink>
      <NavLink to="/admin/reports" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiBarChart2 /> Reports & Analytics
      </NavLink>
      <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiSettings /> System Settings
      </NavLink>
    </>
  );

  const renderOfficerLinks = () => (
    <>
      <NavLink to="/officer/dashboard" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiHome /> Officer Dashboard
      </NavLink>
      <NavLink to="/officer/verify-issues" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiCheckSquare /> Verify Issues
      </NavLink>
      <NavLink to="/officer/assigned-issues" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiClipboard /> Assigned Issues
      </NavLink>
      <NavLink to="/officer/history" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiClock /> Verification History
      </NavLink>
    </>
  );

  
  const renderDepartmentLinks = () => (
    <>
      <NavLink to="/department/dashboard" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiHome />  Dashboard
      </NavLink>
      <NavLink to="/department/assigned-work" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiBriefcase /> Assigned Work
      </NavLink>
      <NavLink to="/department/update-progress" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiClock /> Update Progress
      </NavLink>
      <NavLink to="/department/completed-work" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiCheckCircle /> Completed Work
      </NavLink>
    </>
  );

  const renderCitizenLinks = () => (
    <>
      <NavLink to="/dashboard" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiHome /> Dashboard
      </NavLink>
      <NavLink to="/report-issue" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiPlusCircle /> Report Issue
      </NavLink>
      <NavLink to="/issues" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiClipboard /> All Issues
      </NavLink>
      <NavLink to="/my-reports" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiCheckCircle /> My Reports
      </NavLink>
      <NavLink to="/profile" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FiUser /> Profile
      </NavLink>
    </>
  );

  // Switch-based renderer for bulletproof selection
  const renderNavigationLinks = () => {
    switch (true) {
      case currentRole.includes('admin') || currentRole === ROLES?.ADMIN:
        return renderAdminLinks();
      case currentRole.includes('officer') || currentRole.includes('ward') || currentRole === ROLES?.WARD_OFFICER:
        return renderOfficerLinks();
      case currentRole.includes('dept') || currentRole.includes('department') || currentRole === ROLES?.DEPARTMENT:
        return renderDepartmentLinks();
      default:
        return renderCitizenLinks();
    }
  };

  return (
    <aside className="hero-sidebar">
      <div className="sidebar-brand">
        <h3>Community Hero</h3>
        <span className="role-badge">{currentRole ? currentRole.toUpperCase() : 'USER'}</span>
      </div>
      <nav className="sidebar-nav">
        {renderNavigationLinks()}
      </nav>
    </aside>
  );
}