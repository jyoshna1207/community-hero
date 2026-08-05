import React from 'react';
import BasePortalLayout from './BasePortalLayout';

const AdminLayout = () => {
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Manage Users', path: '/admin/manage-users' },
    { label: 'Manage Issues', path: '/admin/manage-issues' },
    { label: 'Manage Departments', path: '/admin/manage-departments' },
    { label: 'Manage Wards', path: '/admin/manage-wards' },
    { label: 'Reports', path: '/admin/reports' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  return <BasePortalLayout portalTitle="Admin Portal" navItems={navItems} />;
};

export default AdminLayout;