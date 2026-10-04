import React, { useState, useEffect } from 'react';
import { FaBuilding, FaUserPlus, FaEdit, FaEye, FaSync, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import '../AdminStyles.css';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDepartmentStats = async () => {
    setLoading(true);
    try {
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
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-top-header">
        <div className="admin-header-title">
          <h1>Department Administration</h1>
          <p>Configure civic departments, set jurisdiction bounds, and track departmental KPIs.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-pill-badge">
            <FaShieldAlt /> Civic Divisions
          </div>
          <button onClick={loadDepartmentStats} className="admin-refresh-btn">
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Departments
          </button>
        </div>
      </div>

      <div className="admin-grid-cards">
        {departments.map(dept => (
          <div key={dept.id} className="admin-grid-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div className="admin-card-icon-box">
                  <FaBuilding />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{dept.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '3px', fontWeight: 600 }}>{dept.officerCount} Active Field Officers</div>
                </div>
              </div>
              <span style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
                {dept.completionPercentage}% Resolved
              </span>
            </div>

            {/* Resolution Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
                <span>Resolution Rate</span>
                <span style={{ color: '#EA580C' }}>{dept.completionPercentage}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${dept.completionPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #FB923C, #EA580C)', borderRadius: '10px' }}></div>
              </div>
            </div>

            <div style={{ padding: '12px 16px', background: '#FFFBF7', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #FED7AA' }}>
              <span style={{ fontSize: '0.85rem', color: '#78350F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaExclamationTriangle style={{ color: '#EA580C' }} /> Active Dispatches:
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EA580C' }}>
                {dept.openIssues} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9A3412' }}>Tickets</span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
              <button className="admin-btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.825rem' }} onClick={() => alert(`View details for ${dept.name}`)}>
                <FaEye /> View
              </button>
              <button className="admin-btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.825rem' }} onClick={() => alert(`Edit config for ${dept.name}`)}>
                <FaEdit /> Config
              </button>
              <button className="admin-btn-primary" style={{ padding: '8px 14px' }} title="Assign New Officer" onClick={() => alert(`Assign officer to ${dept.name}`)}>
                <FaUserPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}