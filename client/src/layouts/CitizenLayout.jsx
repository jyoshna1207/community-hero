import React from 'react';
import BasePortalLayout from './BasePortalLayout';

const CitizenLayout = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Report Issue', path: '/report-issue' },
    { label: 'All Issues', path: '/issues' },
    { label: 'My Reports', path: '/my-reports' },
    { label: 'Profile', path: '/profile' },
  ];

  return <BasePortalLayout portalTitle="Citizen Portal" navItems={navItems} />;
};

export default CitizenLayout;