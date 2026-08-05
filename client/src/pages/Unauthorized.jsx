// File path: src/pages/Unauthorized.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ fontSize: '6rem', color: '#e53935', margin: '0' }}>403</h1>
      <h2 style={{ fontSize: '2rem', color: '#333', margin: '10px 0' }}>Access Denied</h2>
      <p style={{ color: '#666', maxWidth: '400px', marginBottom: '30px' }}>
        You do not have the required permissions to view this portal section. Please check your account credentials or return home.
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#0d47a1', color: '#white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Go Home
        </button>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Go Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;