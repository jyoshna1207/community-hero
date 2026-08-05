import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Common/Sidebar/Sidebar'; // Adjust path to your Sidebar component
import TopHeader from '../../Common/TopHeader/TopHeader';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout-container" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* 1. Include the Sidebar here so it stays fixed on every page */}
      <Sidebar />
      
      <div className="dashboard-main-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopHeader />
        <main className="dashboard-page-body" style={{ padding: '24px', flex: 1 }}>
          {/* 2. Support both React Router nested <Outlet /> and direct children props */}
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
}