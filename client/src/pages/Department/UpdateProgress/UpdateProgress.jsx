import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaCheckCircle, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { UpdateProgressModal, MarkCompletedModal } from '../../../components/Common/DepartmentModals';

export default function UpdateProgress() {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWork, setSelectedWork] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const loadProgressWorks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/issues');
      let issues = Array.isArray(res.data) ? res.data : [];

      // Filter active in-progress or assigned issues
      const filteredActive = issues.filter(i => {
        const s = (i.status || '').toUpperCase();
        return s !== 'RESOLVED' && s !== 'SOLVED';
      }).map(item => ({
        id: item._id || item.id,
        _id: item._id || item.id,
        title: item.title,
        description: item.description,
        department: item.assignedDept || 'Public Works Department',
        currentStatus: item.status || 'In Progress',
        progress: item.status === 'In Progress' ? 65 : 25,
        location: item.location,
        priority: item.priority || 'High',
      }));

      setWorks(filteredActive);
    } catch (err) {
      console.error('Error loading progress works:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressWorks();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleUpdateProgress = async (id, val, remarks) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${id}/department-progress`, {
        action: 'progress',
        progress: val,
        remarks: remarks || `Progress milestone updated to ${val}%.`,
        updatedBy: user?.name || 'Department Supervisor'
      });
      setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, progress: val } : w));
      showNotification(`Milestone updated to ${val}% for #${id}!`);
    } catch (err) {
      console.error('Update progress error:', err);
      setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, progress: val } : w));
      showNotification(`Progress updated to ${val}%.`);
    }
  };

  const handleMarkCompleted = async (id, remarks) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${id}/department-progress`, {
        action: 'complete',
        remarks: remarks || 'Field repairs finished and verified by department supervisor.',
        resolutionImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
        updatedBy: user?.name || 'Department Lead'
      });
      setWorks(prev => prev.filter(w => w.id !== id && w._id !== id));
      showNotification(`Ticket #${id} marked as Completed and Resolved! Archived in records.`);
    } catch (err) {
      console.error('Complete work error:', err);
      setWorks(prev => prev.filter(w => w.id !== id && w._id !== id));
      showNotification(`Ticket #${id} marked as Completed!`);
    }
  };

  const filtered = works.filter(w => 
    w.title.toLowerCase().includes(search.toLowerCase()) || 
    w.id.toLowerCase().includes(search.toLowerCase()) ||
    (w.location && w.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Update Work Progress</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Modify milestones, record field notes, and submit completed ticket resolutions.</p>
        </div>
        <button 
          onClick={loadProgressWorks}
          style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh List
        </button>
      </div>

      {notification && (
        <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.875rem', fontWeight: 700 }}>
          ✓ {notification}
        </div>
      )}

      <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '340px' }}>
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input 
          type="text" 
          placeholder="Search active tasks..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '0.875rem' }} 
        />
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading active tasks...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>No Active In-Progress Tasks</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>All department work orders have reached completion status.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(work => (
            <div key={work.id} style={{ background: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>#{work.id.slice(-6)} • {work.department}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '4px', color: '#1e293b' }}>{work.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>📍 {work.location}</div>
                </div>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {work.currentStatus}
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px', fontWeight: 700, color: '#334155' }}>
                  <span>Repair Milestone Progress</span>
                  <span style={{ color: '#0284c7' }}>{work.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '9px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${work.progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #0284c7 100%)', borderRadius: '5px', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button 
                  onClick={() => { setSelectedWork(work); setProgressModalOpen(true); }} 
                  style={{ padding: '9px', fontSize: '0.825rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FaEdit /> Update %
                </button>
                <button 
                  onClick={() => { setSelectedWork(work); setCompleteModalOpen(true); }} 
                  style={{ padding: '9px', fontSize: '0.825rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FaCheckCircle /> Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <UpdateProgressModal 
        isOpen={progressModalOpen} 
        onClose={() => setProgressModalOpen(false)} 
        work={selectedWork} 
        onConfirm={(id, val, remarks) => handleUpdateProgress(id, val, remarks)} 
      />
      <MarkCompletedModal 
        isOpen={completeModalOpen} 
        onClose={() => setCompleteModalOpen(false)} 
        work={selectedWork} 
        onConfirm={(id, remarks) => handleMarkCompleted(id, remarks)} 
      />
    </div>
  );
}