import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#0d47a1', fontWeight: 600 }}>
        Loading session...
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = (user.role || 'citizen').toLowerCase().trim();

  if (allowedRole) {
    const targetRole = allowedRole.toLowerCase().trim();
    const isOfficer = currentRole.includes('ward') || currentRole === 'officer' || currentRole === 'ward_officer';
    const isDept = currentRole.includes('district') || currentRole.includes('dept') || currentRole === 'department';
    const isAdmin = currentRole === 'admin';

    let isAllowed = false;
    if (targetRole.includes('ward') || targetRole === 'officer' || targetRole === 'ward_officer') {
      isAllowed = isOfficer;
    } else if (targetRole.includes('dept') || targetRole.includes('district') || targetRole === 'department') {
      isAllowed = isDept;
    } else if (targetRole === 'admin') {
      isAllowed = isAdmin;
    } else if (targetRole === 'citizen') {
      isAllowed = currentRole === 'citizen';
    }

    if (!isAllowed) {
      if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
      if (isOfficer) return <Navigate to="/ward-dashboard" replace />;
      if (isDept) return <Navigate to="/department/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;