import React from 'react';
import { FaMapMarkedAlt, FaUserTie, FaEye, FaEdit, FaUserPlus, FaShieldAlt } from 'react-icons/fa';
import { dummyWards } from '../../../services/dummyData';
import '../AdminStyles.css';

export default function ManageWards() {
  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-top-header">
        <div className="admin-header-title">
          <h1>Ward Administration</h1>
          <p>Monitor municipal wards, population density, assigned officers, and ward efficiency scores.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-pill-badge">
            <FaShieldAlt /> Municipal Jurisdictions
          </div>
          <button className="admin-btn-primary" onClick={() => alert('Add Ward modal (UI Only)')}>
            + Add New Ward
          </button>
        </div>
      </div>

      <div className="admin-grid-cards">
        {dummyWards.map((ward, idx) => (
          <div key={idx} className="admin-grid-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="admin-card-icon-box">
                  <FaMapMarkedAlt />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{ward.wardNumber}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                    Population: {ward.population.toLocaleString()}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EA580C' }}>{ward.performanceScore}%</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Efficiency</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#334155', background: '#FFFBF7', padding: '12px', borderRadius: '10px', border: '1px solid #FED7AA' }}>
              <FaUserTie style={{ color: '#EA580C', fontSize: '1.1rem' }} />
              <span>Ward Officer: <strong style={{ color: '#0F172A' }}>{ward.wardOfficer}</strong></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700 }}>Open Issues</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>{ward.openIssues}</div>
              </div>
              <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>Resolved Issues</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>{ward.resolvedIssues}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
              <button className="admin-btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.825rem' }} onClick={() => alert(`Viewing ${ward.wardNumber}`)}>
                <FaEye /> View
              </button>
              <button className="admin-btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.825rem' }} onClick={() => alert(`Editing ${ward.wardNumber}`)}>
                <FaEdit /> Edit
              </button>
              <button className="admin-btn-primary" style={{ padding: '8px 14px' }} onClick={() => alert(`Assign officer to ${ward.wardNumber}`)}>
                <FaUserPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}