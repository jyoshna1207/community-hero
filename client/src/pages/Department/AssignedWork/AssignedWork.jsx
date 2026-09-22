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
      const res = await axios.get('http://localhost:5000/api/issues');
      let issues = Array.isArray(res.data) ? res.data : [];

      const mapped = issues.map(item => ({
        id: item._id || item.id,
        _id: item._id || item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        priority: item.priority || item.aiSeverity || 'High',
        ward: item.wardId || item.wardName || 'Ward 4',
        department: item.assignedDept || 'Public Works Department',
        assignedDate: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        expectedCompletion: item.expectedResolutionDate || 'In 2 Days',
        currentStatus: item.status || 'Assigned',
        progress: item.status === 'Resolved' ? 100 : item.status === 'In Progress' ? 50 : 15,
        image: item.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
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
      setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, currentStatus: 'In Progress', progress: 30 } : w));
      showFeedback(`Work order #${id} accepted! Status updated to In Progress.`);
    } catch (err) {
      console.error('Accept work error:', err);
      showFeedback(`Order #${id} accepted locally.`);
      setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, currentStatus: 'In Progress', progress: 30 } : w));
    }
  };

  const handleStartWork = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${id}/department-progress`, {
        action: 'start',
        remarks: 'Repair equipment and field specialists deployed on site.',
        updatedBy: user?.name || 'Field Operations Lead'
      });
      setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, currentStatus: 'In Progress', progress: 50 } : w));
      showFeedback(`Work initiated for #${id}! Progress updated on citizen tracking timeline.`);
    } catch (err) {
      console.error('Start work error:', err);
      showFeedback(`Work initiated for #${id}!`);
      setWorks(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, currentStatus: 'In Progress', progress: 50 } : w));
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(work => (
            <div key={work.id} style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ position: 'relative', height: '170px', background: '#1e293b' }}>
                <img src={work.image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', color: '#fff', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {work.priority} Priority
                </span>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '6px' }}>
                    <span>#{work.id.slice(-6)} • {work.category}</span>
                    <span style={{ fontWeight: 700, color: '#0284c7' }}>{work.currentStatus}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px', color: '#1e293b' }}>{work.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {work.description}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                    <FaMapMarkerAlt style={{ color: '#ef4444' }} /> {work.location}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  <button 
                    onClick={() => { setSelectedWork(work); setViewModalOpen(true); }} 
                    style={{ padding: '8px 4px', fontSize: '0.8rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <FaEye /> View
                  </button>
                  <button 
                    onClick={() => { setSelectedWork(work); setAcceptModalOpen(true); }} 
                    style={{ padding: '8px 4px', fontSize: '0.8rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <FaCheckCircle /> Accept
                  </button>
                  <button 
                    onClick={() => handleStartWork(work.id)} 
                    style={{ padding: '8px 4px', fontSize: '0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <FaPlay /> Start
                  </button>
                </div>
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