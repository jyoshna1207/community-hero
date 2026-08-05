import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaEdit, FaEye } from 'react-icons/fa';

export function AcceptWorkModal({ isOpen, onClose, work, onConfirm }) {
  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '420px', maxWidth: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#1e293b' }}><FaCheckCircle style={{ color: '#0284c7' }} /> Accept Work: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}><FaTimes /></button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '16px' }}>Confirm acceptance of dispatch order for field deployment.</p>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
          <strong>Title:</strong> {work.title}<br/>
          <strong>Ward:</strong> {work.ward}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onConfirm(work.id); onClose(); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Accept Work</button>
        </div>
      </div>
    </div>
  );
}

export function UpdateProgressModal({ isOpen, onClose, work, onConfirm }) {
  const [progress, setProgress] = useState(work?.progress || 50);
  const [remarks, setRemarks] = useState('');
  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '450px', maxWidth: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#1e293b' }}><FaEdit style={{ color: '#6366f1' }} /> Update Progress: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}><FaTimes /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Progress Percentage ({progress}%)</label>
            <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Field Remarks</label>
            <textarea rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Provide milestone update..." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}></textarea>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onConfirm(work.id, progress, remarks); onClose(); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Progress</button>
        </div>
      </div>
    </div>
  );
}

export function MarkCompletedModal({ isOpen, onClose, work, onConfirm }) {
  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '450px', maxWidth: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#1e293b' }}><FaCheckCircle style={{ color: '#10b981' }} /> Mark as Completed: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}><FaTimes /></button>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '16px' }}>Upload completion evidence and submit for citizen verification.</p>
        <div style={{ border: '2px dashed #cbd5e1', padding: '20px', textAlign: 'center', borderRadius: '8px', marginBottom: '16px', background: '#f8fafc', color: '#64748b', fontSize: '0.85rem' }}>
          [Upload Completion Image Placeholder]
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onConfirm(work.id); onClose(); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Submit Completion</button>
        </div>
      </div>
    </div>
  );
}

export function ViewDetailsModal({ isOpen, onClose, work }) {
  if (!isOpen || !work) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#1e293b' }}><FaEye style={{ color: '#0284c7' }} /> Work Details: {work.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}><FaTimes /></button>
        </div>
        {work.image && <img src={work.image} alt={work.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />}
        <h4 style={{ fontSize: '1.05rem', color: '#1e293b', marginBottom: '6px' }}>{work.title}</h4>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '16px' }}>{work.description}</p>
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div><strong>Category:</strong> {work.category}</div>
          <div><strong>Priority:</strong> {work.priority}</div>
          <div><strong>Ward:</strong> {work.ward}</div>
          <div><strong>Status:</strong> {work.currentStatus || work.finalStatus}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Close</button>
        </div>
      </div>
    </div>
  );
}