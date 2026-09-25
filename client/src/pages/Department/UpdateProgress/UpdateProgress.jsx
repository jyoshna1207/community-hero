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

      // Filter active in-progress issues
      const filteredActive = merged.filter(i => {
        const s = (i.status || '').toUpperCase();
        return s === 'IN PROGRESS';
      }).map(item => ({
        id: item._id || item.id,
        _id: item._id || item.id,
        title: item.title,
        description: item.description,
        department: item.assignedDepartment || item.assignedDept || 'Public Works Department',
        category: item.category,
        currentStatus: item.status || 'In Progress',
        progress: item.progress || 50,
        location: item.location,
        priority: item.priority || 'High',
        image: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
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
    } catch (err) {
      console.error('API update failed, continuing with local storage:', err);
    }

    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === id || item._id === id) {
          return { ...item, progress: val, actionTaken: remarks || `Progress milestone updated to ${val}%.` };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, progress: val } : w));
    showNotification(`Milestone updated to ${val}% for #${id}!`);
  };

  const handleMarkCompleted = async (id, remarks) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${id}/department-progress`, {
        action: 'complete',
        remarks: remarks || 'Field repairs finished and verified by department supervisor.',
        resolutionImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
        updatedBy: user?.name || 'Department Lead'
      });
    } catch (err) {
      console.error('API update failed, continuing with local storage:', err);
    }

    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === id || item._id === id) {
          return { 
            ...item, 
            status: 'RESOLVED', 
            progress: 100, 
            resolutionNote: remarks || 'Field repairs finished and verified by department supervisor.',
            resolvedAt: new Date().toISOString()
          };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    setWorks(prev => prev.filter(w => w.id !== id && w._id !== id));
    showNotification(`Ticket #${id} marked as Completed and Resolved! Archived in records.`);
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
        <div className="officer-cards-list">
          {filtered.map(work => (
            <div key={work.id} className="officer-issue-card">
              <div className="officer-card-img">
                <img src={work.image || `https://picsum.photos/seed/${work.id}/400/300`} alt={work.title} />
              </div>

              <div className="officer-card-body">
                <div className="officer-card-header">
                  <h3>{work.title}</h3>
                  <div className="officer-badge-cluster">
                    <span className={`officer-status-pill ${(work.currentStatus || 'UNSOLVED').toLowerCase().replace(' ', '-')}`}>
                      {work.currentStatus}
                    </span>
                    <span className={`officer-priority-pill ${(work.priority || 'medium').toLowerCase()}`}>
                      {work.priority || 'Medium'} Priority
                    </span>
                  </div>
                </div>

                <div className="officer-meta-row">
                  <span className="officer-category-badge">{work.category || work.department}</span>
                  <span className="meta-sep">•</span>
                  <span>Progress: {work.progress}%</span>
                  <span className="meta-sep">•</span>
                  <span className="officer-location-text">
                    <FaMapMarkerAlt style={{ color: '#ef4444', marginRight: '4px' }} />
                    {work.location}
                  </span>
                </div>
              </div>

              <div className="officer-card-actions" style={{ gap: '8px' }}>
                <button 
                  className="btn-manage-action"
                  onClick={() => { setSelectedWork(work); setProgressModalOpen(true); }}
                >
                  <FaEdit /> Update %
                </button>
                <button 
                  className="btn-manage-action"
                  style={{ background: '#10b981', borderColor: '#10b981' }}
                  onClick={() => { setSelectedWork(work); setCompleteModalOpen(true); }}
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