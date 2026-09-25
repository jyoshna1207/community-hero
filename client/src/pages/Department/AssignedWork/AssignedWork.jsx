import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCheckCircle, FaPlay, FaMapMarkerAlt, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { AcceptWorkModal, ViewDetailsModal } from '../../../components/Common/DepartmentModals';

export default function AssignedWork() {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWork, setSelectedWork] = useState(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadAssignedWorks = async () => {
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

      const mapped = merged
        .filter(item => {
          const s = (item.status || '').toUpperCase();
          return s === 'ASSIGNED' || s === 'REPORTED' || s === 'UNSOLVED' || s === 'UNDER REVIEW'; // Show everything pending department action
        })
        .map(item => ({
        id: item._id || item.id,
        _id: item._id || item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        priority: item.priority || item.aiSeverity || 'High',
        ward: item.wardId || item.wardName || 'Ward 4',
        department: item.assignedDepartment || item.assignedDept || 'Public Works Department',
        assignedDate: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        expectedCompletion: item.expectedResolutionDate || 'In 2 Days',
        currentStatus: item.status || 'Assigned',
        progress: item.progress || (item.status === 'Resolved' ? 100 : item.status === 'In Progress' ? 50 : 15),
        image: item.image || item.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        location: item.location,
        locationCoords: item.locationCoords,
        aiTags: item.aiTags || [],
        timeline: item.timeline || []
      }));

      setWorks(mapped);
    } catch (err) {
      console.error('Error loading assigned works:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedWorks();
  }, []);

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleAcceptWork = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${id}/department-progress`, {
        action: 'accept',
        remarks: `Work order accepted by ${user?.name || 'Department Supervisor'}. Field crew scheduled.`,
        updatedBy: user?.name || 'Department Officer'
      });
    } catch (err) {
      console.error('API update failed, continuing with local storage:', err);
    }

    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === id || item._id === id) {
          return { ...item, status: 'IN PROGRESS', progress: 30, actionTaken: `Accepted by Department. Field crew scheduled.` };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, currentStatus: 'IN PROGRESS', progress: 30 } : w));
    showFeedback(`Work order #${id} accepted! Status updated to In Progress.`);
    
    // Remove it from assigned view as it is now technically In Progress
    setTimeout(() => {
      setWorks(prev => prev.filter(w => w.id !== id && w._id !== id));
    }, 1500);
  };

  const handleStartWork = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${id}/department-progress`, {
        action: 'start',
        remarks: 'Repair equipment and field specialists deployed on site.',
        updatedBy: user?.name || 'Field Operations Lead'
      });
    } catch (err) {
      console.error('API update failed, continuing with local storage:', err);
    }

    try {
      const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
      const updatedLocal = local.map(item => {
        if (item.id === id || item._id === id) {
          return { ...item, status: 'IN PROGRESS', progress: 50, actionTaken: 'Work Started. Specialists deployed on site.' };
        }
        return item;
      });
      localStorage.setItem('my_submitted_reports', JSON.stringify(updatedLocal));
    } catch (e) {
      console.error("Local sync error:", e);
    }

    setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, currentStatus: 'IN PROGRESS', progress: 50 } : w));
    showFeedback(`Work initiated for #${id}! Progress updated on citizen tracking timeline.`);
    
    setTimeout(() => {
      setWorks(prev => prev.filter(w => w.id !== id && w._id !== id));
    }, 1500);
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Assigned Work Orders</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Accept dispatch orders, dispatch field specialists, and notify citizens in real-time.</p>
        </div>
        <button 
          onClick={loadAssignedWorks}
          style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
        >
          <FaSync className={loading ? 'animate-spin' : ''} /> Refresh Queue
        </button>
      </div>

      {feedbackMsg && (
        <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.875rem', fontWeight: 700 }}>
          ✓ {feedbackMsg}
        </div>
      )}

      <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', width: '340px' }}>
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input 
          type="text" 
          placeholder="Search assigned work or location..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '0.875rem' }} 
        />
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading work orders...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 8px', color: '#1e293b' }}>No Work Orders Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>All assigned tasks are either completed or matching search criteria.</p>
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
                  <span className="officer-category-badge">{work.category}</span>
                  <span className="meta-sep">•</span>
                  <span>{work.createdAt ? new Date(work.createdAt).toLocaleDateString() : 'N/A'}</span>
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
                  onClick={() => { setSelectedWork(work); setAcceptModalOpen(true); }}
                >
                  <FaCheckCircle /> Accept
                </button>
                <button 
                  className="btn-manage-action"
                  style={{ background: '#10b981', borderColor: '#10b981' }}
                  onClick={() => handleStartWork(work.id)}
                >
                  <FaPlay /> Start
                </button>
                <button 
                  className="btn-manage-action"
                  style={{ background: '#FFFFFF', color: '#155EEF', border: '1px solid #E2E8F0' }}
                  onClick={() => { setSelectedWork(work); setViewModalOpen(true); }}
                >
                  <FaEye /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AcceptWorkModal 
        isOpen={acceptModalOpen} 
        onClose={() => setAcceptModalOpen(false)} 
        work={selectedWork} 
        onConfirm={(id) => handleAcceptWork(id)} 
      />
      <ViewDetailsModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        work={selectedWork} 
      />
    </div>
  );
}