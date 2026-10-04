import React from 'react';
import { FaShieldAlt, FaSave, FaUndo } from 'react-icons/fa';
import '../AdminStyles.css';

export default function Settings() {
  return (
    <div className="admin-page-container" style={{ maxWidth: '900px' }}>
      {/* Top Header */}
      <div className="admin-top-header">
        <div className="admin-header-title">
          <h1>Admin Settings</h1>
          <p>Configure platform preferences, notification channels, and security protocols.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-pill-badge">
            <FaShieldAlt /> System Configuration
          </div>
        </div>
      </div>

      <div className="admin-grid-card">
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Profile Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Admin Name</label>
            <input 
              type="text" 
              defaultValue="Admin Super" 
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', background: '#FFFBF7', outline: 'none', fontSize: '0.9rem' }} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input 
              type="email" 
              defaultValue="admin@communityhero.org" 
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', background: '#FFFBF7', outline: 'none', fontSize: '0.9rem' }} 
            />
          </div>
        </div>
      </div>

      <div className="admin-grid-card">
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Automation & Dispatch Protocols</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#EA580C' }} /> 
            Enable automated AI ticket triage and department routing
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#EA580C' }} /> 
            Send SMS and push alerts to Ward Officers on Critical Priority Issues
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#EA580C' }} /> 
            Maintenance Mode (Disables public report submissions temporarily)
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="admin-btn-secondary" onClick={() => alert('Changes reset')}>
          <FaUndo /> Reset
        </button>
        <button className="admin-btn-primary" onClick={() => alert('Settings saved successfully (UI Only)')}>
          <FaSave /> Save Changes
        </button>
      </div>
    </div>
  );
}