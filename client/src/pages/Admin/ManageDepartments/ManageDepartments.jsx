import React from 'react';
import { FaBuilding, FaUserPlus, FaEye, FaEdit } from 'react-icons/fa';
import { dummyDepartments } from '../../../services/dummyData';

export default function ManageDepartments() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Manage Departments</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Oversee municipal civic departments, staff distribution, and issue resolution metrics.</p>
        </div>
        <button className="btn btn-primary">+ Add Department</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {dummyDepartments.map(dept => (
          <div key={dept.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ background: '#4f46e5', color: '#fff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <FaBuilding />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{dept.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>{dept.officerCount} Active Officers</div>
                </div>
              </div>
              <span className="badge badge-active">{dept.completionPercentage}% Resolved</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Open Issues</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b' }}>{dept.openIssues}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Completed</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>{dept.completedIssues}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert(`Viewing ${dept.name}`)}><FaEye /> View</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert(`Editing ${dept.name}`)}><FaEdit /> Edit</button>
              <button className="btn btn-primary" onClick={() => alert(`Assign officer to ${dept.name}`)}><FaUserPlus /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}