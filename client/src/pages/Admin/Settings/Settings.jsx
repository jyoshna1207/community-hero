import React from 'react';

export default function Settings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Admin Settings</h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>Configure platform preferences, notification channels, and security protocols.</p>
      </div>

      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3>Profile Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Admin Name</label>
            <input type="text" defaultValue="Admin Super" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Email Address</label>
            <input type="email" defaultValue="admin@communityhero.org" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3>System Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} /> Enable automated ticket assignment routing
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} /> Send SMS alerts to Ward Officers on High Priority Issues
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="checkbox" style={{ width: '16px', height: '16px' }} /> Maintenance Mode (Disables citizen submissions temporarily)
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={() => alert('Changes reset')}>Reset</button>
        <button className="btn btn-outline" onClick={() => alert('Cancelled')}>Cancel</button>
        <button className="btn btn-primary" onClick={() => alert('Settings saved successfully (UI Only)')}>Save Changes</button>
      </div>
    </div>
  );
}