// File path: src/pages/NotFound.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ fontSize: '6rem', color: '#ff9800', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '2rem', color: '#333', margin: '10px 0' }}>Page Not Found</h2>
      <p style={{ color: '#666', maxWidth: '400px', marginBottom: '30px' }}>
        The page you are looking for does not exist or has been relocated.
      </p>
      <button onClick={() => navigate('/')} style={{ padding: '10px 20px', backgroundColor: '#0d47a1', color: '#white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        Return Home
      </button>
    </div>
  );
};

export default NotFound;