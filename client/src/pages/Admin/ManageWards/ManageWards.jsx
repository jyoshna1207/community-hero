import React from 'react';
import { FaMapMarkedAlt, FaUserTie, FaEye, FaEdit, FaUserPlus } from 'react-icons/fa';
import { dummyWards } from '../../../services/dummyData';

export default function ManageWards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Manage Wards</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Monitor municipal wards, population density, assigned officers, and ward efficiency scores.</p>
        </div>
        <button className="btn btn-primary">+ Add New Ward</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {dummyWards.map((ward, idx) => (
          <div key={idx} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#ecfdf5', color: '#10b981', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <FaMapMarkedAlt />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{ward.wardNumber}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>Population: {ward.population.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4f46e5' }}>{ward.performanceScore}%</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Performance</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
              <FaUserTie style={{ color: '#4f46e5' }} />
              <span>Ward Officer: <strong>{ward.wardOfficer}</strong></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Open Issues</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b45309' }}>{ward.openIssues}</div>
              </div>
              <div style={{ background: '#d1fae5', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>Resolved Issues</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#065f46' }}>{ward.resolvedIssues}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert(`Viewing ${ward.wardNumber}`)}><FaEye /> View</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert(`Editing ${ward.wardNumber}`)}><FaEdit /> Edit</button>
              <button className="btn btn-primary" onClick={() => alert(`Assign officer to ${ward.wardNumber}`)}><FaUserPlus /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}