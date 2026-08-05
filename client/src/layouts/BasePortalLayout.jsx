import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BasePortalLayout = ({ portalTitle, navItems }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f8' }}>
      {/* Unified Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#004d40', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', paddingBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '10px' }}>
            {portalTitle}
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', listStyle: 'none', padding: 0 }}>
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    padding: '12px',
                    borderRadius: '6px',
                    color: isActive ? '#fff' : '#b2dfdb',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    textDecoration: 'none',
                    display: 'block',
                  })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', border: 'none', background: '#e53935', color: 'white', cursor: 'pointer', textAlign: 'left', padding: '12px', borderRadius: '6px', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default BasePortalLayout;