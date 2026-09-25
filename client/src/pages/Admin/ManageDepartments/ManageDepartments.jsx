import React, { useState, useEffect } from 'react';
import { FaBuilding, FaUserPlus, FaEdit, FaEye, FaSync } from 'react-icons/fa';
import axios from 'axios';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDepartmentStats = async () => {
    setLoading(true);
    try {
      // Mock department stats for now
      const mockDepts = [
        { id: 1, name: 'Roads & Infrastructure Department', completionPercentage: 85, officerCount: 24, openIssues: 12 },
        { id: 2, name: 'State Sanitation & Waste Board', completionPercentage: 92, officerCount: 35, openIssues: 8 },
        { id: 3, name: 'Electrical Maintenance Wing', completionPercentage: 78, officerCount: 15, openIssues: 18 },
        { id: 4, name: 'Water Supply & Sewerage Board', completionPercentage: 88, officerCount: 20, openIssues: 9 },
        { id: 5, name: 'Drainage & Stormwater Department', completionPercentage: 95, officerCount: 18, openIssues: 4 },
        { id: 6, name: 'Public Safety Task Force', completionPercentage: 90, officerCount: 40, openIssues: 6 },
      ];
      setDepartments(mockDepts);
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartmentStats();
  }, []);

  return (
    <div className="officer-dashboard-page" style={{ padding: '0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Department Administration</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Configure civic departments, set jurisdiction bounds, and track departmental KPIs.</p>
          </div>
          <button 
            onClick={loadDepartmentStats} 
            style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Departments
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {departments.map(dept => (
            <div key={dept.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ background: '#4f46e5', color: '#fff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    <FaBuilding />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{dept.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>{dept.officerCount} Active Field Officers</div>
                  </div>
                </div>
                <span className="badge badge-active" style={{ background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
                  {dept.completionPercentage}% Resolved
                </span>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Dispatches:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b45309' }}>{dept.openIssues} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Issues</span></span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.825rem', fontWeight: 700 }} onClick={() => alert(`View details for ${dept.name}`)}>
                  <FaEye /> View
                </button>
                <button className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.825rem', fontWeight: 700 }} onClick={() => alert(`Edit config for ${dept.name}`)}>
                  <FaEdit /> Config
                </button>
                <button className="btn btn-primary" style={{ padding: '8px 14px' }} title="Assign New Officer" onClick={() => alert(`Assign officer to ${dept.name}`)}>
                  <FaUserPlus />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}