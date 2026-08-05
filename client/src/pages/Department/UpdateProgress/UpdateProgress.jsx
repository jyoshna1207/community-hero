import React, { useState } from 'react';
import { FaSearch, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { departmentAssignedWorks } from '../../../services/DepartmentDummyData';
import { UpdateProgressModal, MarkCompletedModal } from '../../../components/common/DepartmentModals';

export default function UpdateProgress() {
  const [works, setWorks] = useState(departmentAssignedWorks);
  const [search, setSearch] = useState('');
  const [selectedWork, setSelectedWork] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const filtered = works.filter(w => w.title.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>Update Work Progress</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Modify milestones, update percentages, and submit completion evidence.</p>
      </div>

      <div style={{ padding: '16px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '320px' }}>
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input type="text" placeholder="Search task..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map(work => (
          <div key={work.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{work.id} • {work.department}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: '#1e293b' }}>{work.title}</h3>
              </div>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', height: 'fit-content', fontWeight: 600 }}>{work.currentStatus}</span>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 600, color: '#334155' }}>
                <span>Progress</span><span>{work.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${work.progress}%`, height: '100%', background: '#0284c7' }}></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={() => { setSelectedWork(work); setProgressModalOpen(true); }} style={{ padding: '8px', fontSize: '0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}><FaEdit /> Update</button>
              <button onClick={() => { setSelectedWork(work); setCompleteModalOpen(true); }} style={{ padding: '8px', fontSize: '0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}><FaCheckCircle /> Complete</button>
            </div>
          </div>
        ))}
      </div>

      <UpdateProgressModal isOpen={progressModalOpen} onClose={() => setProgressModalOpen(false)} work={selectedWork} onConfirm={(id, val) => setWorks(works.map(w => w.id === id ? {...w, progress: val} : w))} />
      <MarkCompletedModal isOpen={completeModalOpen} onClose={() => setCompleteModalOpen(false)} work={selectedWork} onConfirm={(id) => setWorks(works.filter(w => w.id !== id))} />
    </div>
  );
}