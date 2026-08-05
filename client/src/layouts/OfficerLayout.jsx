import React from 'react';
import BasePortalLayout from './BasePortalLayout';

const OfficerLayout = () => {
  const navItems = [
    { label: 'Dashboard', path: '/officer/dashboard' },
    { label: 'Verify Issues', path: '/officer/verify-issues' },
    { label: 'Assigned Issues', path: '/officer/assigned-issues' },
    { label: 'Issue History', path: '/officer/history' },
  ];

  return <BasePortalLayout portalTitle="Ward Officer Portal" navItems={navItems} />;
};

export default OfficerLayout;