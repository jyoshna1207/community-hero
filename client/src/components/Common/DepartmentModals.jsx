import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaEdit, FaEye } from 'react-icons/fa';

export function AcceptWorkModal({ isOpen, onClose, work, onConfirm }) {
  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '420px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #fed7aa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#0f172a', margin: 0 }}><FaCheckCircle style={{ color: '#EA580C' }} /> Accept Work: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#94a3b8' }}><FaTimes /></button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '16px' }}>Confirm acceptance of dispatch order for field deployment.</p>
        <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', border: '1px solid #FEF3C7', color: '#92400E' }}>
          <strong>Title:</strong> {work.title}<br/>
          <strong>Ward:</strong> {work.ward}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>Cancel</button>
          <button onClick={() => { onConfirm(work.id); onClose(); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)', color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)' }}>Accept Work</button>
        </div>
      </div>
    </div>
  );
}

export function UpdateProgressModal({ isOpen, onClose, work, onConfirm }) {
  const [progress, setProgress] = useState(work?.progress || 50);
  const [remarks, setRemarks] = useState('');

  React.useEffect(() => {
    if (work) {
      setProgress(work.progress || 50);
      setRemarks('');
    }
  }, [work]);

  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '450px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #fed7aa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#0f172a', margin: 0 }}><FaEdit style={{ color: '#D97706' }} /> Update Progress: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#94a3b8' }}><FaTimes /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>Progress Percentage ({progress}%)</label>
            <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} style={{ width: '100%', accentColor: '#EA580C' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>Field Remarks</label>
            <textarea rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Provide milestone update..." style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #fed7aa', outline: 'none' }}></textarea>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>Cancel</button>
          <button onClick={() => { onConfirm(work.id, progress, remarks); onClose(); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)', color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)' }}>Save Progress</button>
        </div>
      </div>
    </div>
  );
}

export function MarkCompletedModal({ isOpen, onClose, work, onConfirm }) {
  const [completionNotes, setCompletionNotes] = useState('');

  React.useEffect(() => {
    if (work) {
      setCompletionNotes('');
    }
  }, [work]);

  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '450px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#0f172a', margin: 0 }}><FaCheckCircle style={{ color: '#16A34A' }} /> Mark as Completed: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#94a3b8' }}><FaTimes /></button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '12px' }}>Upload completion evidence and submit for citizen verification.</p>
        <div style={{ border: '2px dashed #fed7aa', padding: '16px', textAlign: 'center', borderRadius: '10px', marginBottom: '12px', background: '#FFFBEB', color: '#B45309', fontSize: '0.85rem' }}>
          📷 Completion Photo Evidence Attached
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>Completion Remarks / Verification Notes</label>
          <textarea 
            rows="3" 
            value={completionNotes} 
            onChange={(e) => setCompletionNotes(e.target.value)} 
            placeholder="Field repairs finished and verified by department supervisor..." 
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #fed7aa', outline: 'none' }}
          ></textarea>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>Cancel</button>
          <button onClick={() => { onConfirm(work.id, completionNotes); onClose(); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'linear-gradient(180deg, #22C55E 0%, #16A34A 100%)', color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)' }}>Submit Completion</button>
        </div>
      </div>
    </div>
  );
}

export function ViewDetailsModal({ isOpen, onClose, work }) {
  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '500px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #fed7aa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#0f172a', margin: 0 }}><FaEye style={{ color: '#EA580C' }} /> Work Details: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#94a3b8' }}><FaTimes /></button>
        </div>
        {work.image && <img src={work.image} alt={work.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />}
        <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px' }}>{work.title}</h4>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>{work.description}</p>
        <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', border: '1px solid #FEF3C7', color: '#92400E' }}>
          <div><strong>Category:</strong> {work.category}</div>
          <div><strong>Priority:</strong> {work.priority}</div>
          <div><strong>Ward:</strong> {work.ward}</div>
          <div><strong>Status:</strong> {work.currentStatus || work.finalStatus}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)', color: '#fff', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)' }}>Close</button>
        </div>
      </div>
    </div>
  );
}