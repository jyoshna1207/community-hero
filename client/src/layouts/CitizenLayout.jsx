import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Common/Navbar/Navbar';

const CitizenLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F7F9FC' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default CitizenLayout;