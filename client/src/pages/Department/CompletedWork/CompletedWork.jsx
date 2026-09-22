import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaDownload, FaCheckCircle, FaCalendarCheck, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { ViewDetailsModal } from '../../../components/Common/DepartmentModals';

export default function CompletedWork() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWork, setSelectedWork] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const loadCompletedWorks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/issues');
      let issues = Array.isArray(res.data) ? res.data : [];

      const resolvedOnly = issues.filter(i => {
        const s = (i.status || '').toUpperCase();
        return s === 'RESOLVED' || s === 'SOLVED';
      }).map(item => ({
        id: item._id || item.id,
        _id: item._id || item.id,
        title: item.title,
        description: item.description,
        ward: item.wardId || item.wardName || 'Ward 4',
        finalStatus: 'Resolved & Verified',
        completedDate: new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        beforeImage: item.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        afterImage: item.resolutionImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
        resolutionNote: item.resolutionNote || item.actionTaken || 'Civic repair completed and inspected.',
        location: item.location,
        category: item.category,
      }));

      setCompleted(resolvedOnly);
    } catch (err) {
      console.error('Error loading completed works:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompletedWorks();
  }, []);

  const filtered = completed.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    (c.location && c.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Completed Work Archive</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Historical record of resolved municipal tickets with before/after photo verification.</p>
        </div>
        <button 
          onClick={loadCompletedWorks}
          style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Archive
        </button>
      </div>

      <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '340px' }}>
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input 
          type="text" 
          placeholder="Search resolved archive..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '0.875rem' }} 
        />
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading completed work records...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>No Completed Work Archived Yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Once department crews resolve tickets in "Update Progress", they will permanently appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>#{item.id.slice(-6)} • {item.ward}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px', color: '#1e293b' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {item.location}</div>
                </div>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaCheckCircle /> {item.finalStatus}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>BEFORE REPAIR</div>
                  <img src={item.beforeImage} alt="Before" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #fee2e2' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>AFTER RESOLUTION</div>
                  <img src={item.afterImage} alt="After" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d1fae5' }} />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
                <strong>Resolution Note:</strong> {item.resolutionNote}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button 
                  onClick={() => { setSelectedWork(item); setViewModalOpen(true); }} 
                  style={{ flex: 1, padding: '8px', fontSize: '0.825rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FaEye /> Full Ticket
                </button>
                <button 
                  onClick={() => alert(`Certificate of completion downloaded for ticket #${item.id}`)} 
                  style={{ flex: 1, padding: '8px', fontSize: '0.825rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FaDownload /> Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ViewDetailsModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        work={selectedWork} 
      />
    </div>
  );
}