import React from 'react';
import BasePortalLayout from './BasePortalLayout';

const DepartmentLayout = () => {
  const navItems = [
    { label: 'Dashboard', path: '/department/dashboard' },
    { label: 'Assigned Work', path: '/department/assigned-work' },
    { label: 'Update Progress', path: '/department/update-progress' },
    { label: 'Completed Work', path: '/department/completed-work' },
  ];

  return <BasePortalLayout portalTitle="Department Portal" navItems={navItems} />;
};

export default DepartmentLayout;