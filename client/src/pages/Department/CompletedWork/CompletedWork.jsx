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
      let apiIssues = [];
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data)) apiIssues = res.data;
      } catch (e) { console.error(e); }

      let localReports = [];
      try {
        localReports = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      } catch (e) { console.error(e); }

      const mapById = new Map();
      [...apiIssues, ...localReports].forEach(item => {
        const key = item._id || item.id;
        if (key) mapById.set(key, item);
      });

      const merged = Array.from(mapById.values());

      const resolvedOnly = merged.filter(i => {
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
        beforeImage: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
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
        <div className="officer-cards-list">
          {filtered.map(item => (
            <div key={item.id} className="officer-issue-card">
              <div className="officer-card-img">
                <img src={item.afterImage || item.beforeImage || `https://picsum.photos/seed/${item.id}/400/300`} alt={item.title} />
              </div>

              <div className="officer-card-body">
                <div className="officer-card-header">
                  <h3>{item.title}</h3>
                  <div className="officer-badge-cluster">
                    <span className={`officer-status-pill solved`}>
                      {item.finalStatus || 'RESOLVED'}
                    </span>
                    <span className={`officer-priority-pill ${(item.priority || 'medium').toLowerCase()}`}>
                      {item.priority || 'Medium'} Priority
                    </span>
                  </div>
                </div>

                <div className="officer-meta-row">
                  <span className="officer-category-badge">{item.ward || item.department}</span>
                  <span className="meta-sep">•</span>
                  <span>{item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : 'N/A'}</span>
                  <span className="meta-sep">•</span>
                  <span className="officer-location-text">
                    <FaMapMarkerAlt style={{ color: '#ef4444', marginRight: '4px' }} />
                    {item.location}
                  </span>
                </div>
              </div>

              <div className="officer-card-actions" style={{ gap: '8px' }}>
                <button 
                  className="btn-manage-action"
                  style={{ background: '#0284c7', borderColor: '#0284c7' }}
                  onClick={() => alert(`Certificate of completion downloaded for ticket #${item.id}`)}
                >
                  <FaDownload /> Certificate
                </button>
                <button 
                  className="btn-manage-action"
                  style={{ background: '#FFFFFF', color: '#155EEF', border: '1px solid #E2E8F0' }}
                  onClick={() => { setSelectedWork(item); setViewModalOpen(true); }}
                >
                  <FaEye /> Full Ticket
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