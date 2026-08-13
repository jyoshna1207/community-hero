import React, { useState } from 'react';
import { FaSearch, FaEye, FaSync, FaCheckDouble } from 'react-icons/fa';
import { assignedIssuesData } from '../../../services/OfficerDummyData';
import { ViewDetailsModal } from '../../../components/Common/OfficerModals';

export default function AssignedIssues() {
  const [assigned, setAssigned] = useState(assignedIssuesData);
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filtered = assigned.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Assigned Issues Tracker</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Monitor departmental progress and active field dispatches.</p>
      </div>

      <div style={{ padding: '16px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '320px' }}>
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input type="text" placeholder="Search assigned issue..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map(issue => (
          <div key={issue.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{issue.id} • {issue.department}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>{issue.title}</h3>
              </div>
              <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', height: 'fit-content', fontWeight: 600 }}>{issue.status}</span>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 600 }}>
                <span>Progress</span><span>{issue.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${issue.progress}%`, height: '100%', background: '#4f46e5' }}></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={() => { setSelectedIssue(issue); setViewModalOpen(true); }} style={{ padding: '8px', fontSize: '0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaEye /> View</button>
              <button onClick={() => setAssigned(assigned.filter(i => i.id !== issue.id))} style={{ padding: '8px', fontSize: '0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaCheckDouble /> Close</button>
            </div>
          </div>
        ))}
      </div>

      <ViewDetailsModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} issue={selectedIssue} />
    </div>
  );
}