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

  const currentRole = (user.role || 'citizen').toLowerCase();

  if (allowedRole) {
    const targetRole = allowedRole.toLowerCase();
    if (currentRole !== targetRole) {
      if (currentRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
      if (currentRole === 'officer') return <Navigate to="/officer/dashboard" replace />;
      if (currentRole === 'department') return <Navigate to="/department/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;