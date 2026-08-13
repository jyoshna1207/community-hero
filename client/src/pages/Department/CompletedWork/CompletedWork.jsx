import React, { useState } from 'react';
import { FaSearch, FaEye, FaDownload } from 'react-icons/fa';
import { departmentCompletedWorks } from '../../../services/DepartmentDummyData';
import { ViewDetailsModal } from '../../../components/Common/DepartmentModals';

export default function CompletedWork() {
  const [completed] = useState(departmentCompletedWorks);
  const [search, setSearch] = useState('');
  const [selectedWork, setSelectedWork] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filtered = completed.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Completed Work Archive</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Historical record of resolved municipal tickets with before/after evidence.</p>
      </div>

      <div style={{ padding: '16px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '320px' }}>
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input type="text" placeholder="Search archive..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.id} • {item.ward}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: '#1e293b' }}>{item.title}</h3>
              </div>
              <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', height: 'fit-content', fontWeight: 600 }}>{item.finalStatus}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>BEFORE</div>
                <img src={item.beforeImage} alt="Before" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>AFTER</div>
                <img src={item.afterImage} alt="After" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setSelectedWork(item); setViewModalOpen(true); }} style={{ flex: 1, padding: '8px', fontSize: '0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}><FaEye /> View Details</button>
              <button onClick={() => alert(`Downloading completion report for ${item.id}`)} style={{ flex: 1, padding: '8px', fontSize: '0.8rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}><FaDownload /> Download</button>
            </div>
          </div>
        ))}
      </div>

      <ViewDetailsModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} work={selectedWork} />
    </div>
  );
}