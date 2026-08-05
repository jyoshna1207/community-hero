import React, { useState } from 'react';
import { FaSearch, FaEye, FaCheckCircle, FaPlay } from 'react-icons/fa';
import { departmentAssignedWorks } from '../../../services/DepartmentDummyData';
import { AcceptWorkModal, ViewDetailsModal } from '../../../components/common/DepartmentModals';

export default function AssignedWork() {
  const [works, setWorks] = useState(departmentAssignedWorks);
  const [search, setSearch] = useState('');
  const [selectedWork, setSelectedWork] = useState(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filtered = works.filter(w => w.title.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Assigned Work Management</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Accept, review, and initiate municipal tasks.</p>
      </div>

      <div style={{ padding: '16px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '320px' }}>
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input type="text" placeholder="Search assigned work..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map(work => (
          <div key={work.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <img src={work.image} alt={work.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{work.id} • {work.ward}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0 8px', color: '#1e293b' }}>{work.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '12px' }}>{work.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => { setSelectedWork(work); setViewModalOpen(true); }} style={{ padding: '6px', fontSize: '0.75rem', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaEye /> View</button>
                <button onClick={() => { setSelectedWork(work); setAcceptModalOpen(true); }} style={{ padding: '6px', fontSize: '0.75rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaCheckCircle /> Accept</button>
                <button onClick={() => alert(`Started work for ${work.id}`)} style={{ padding: '6px', fontSize: '0.75rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><FaPlay /> Start</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AcceptWorkModal isOpen={acceptModalOpen} onClose={() => setAcceptModalOpen(false)} work={selectedWork} onConfirm={(id) => setWorks(works.map(w => w.id === id ? {...w, currentStatus: 'Accepted'} : w))} />
      <ViewDetailsModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} work={selectedWork} />
    </div>
  );
}