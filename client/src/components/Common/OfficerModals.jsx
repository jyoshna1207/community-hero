import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaBan, FaShareAlt, FaEye } from 'react-icons/fa';

export function VerifyIssueModal({ isOpen, onClose, issue, onConfirm }) {
  if (!isOpen || !issue) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal">
        <div className="modal-header">
          <h3><FaCheckCircle style={{ color: '#10b981', marginRight: '8px' }} /> Verify Issue: {issue.id}</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>
        <p className="modal-subtitle">Review details before marking this report as verified for departmental routing.</p>
        <div className="modal-body-card">
          <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
          <h4>{issue.title}</h4>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{issue.description}</p>
          <div className="modal-meta-grid">
            <span><strong>Category:</strong> {issue.category}</span>
            <span><strong>Priority:</strong> {issue.priority}</span>
            <span><strong>Reporter:</strong> {issue.reporterName}</span>
            <span><strong>Location:</strong> {issue.location}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={() => { onConfirm(issue.id); onClose(); }}>Confirm & Verify</button>
        </div>
      </div>
    </div>
  );
}

export function RejectIssueModal({ isOpen, onClose, issue, onConfirm }) {
  const [reason, setReason] = useState('');
  if (!isOpen || !issue) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal">
        <div className="modal-header">
          <h3><FaBan style={{ color: '#ef4444', marginRight: '8px' }} /> Reject Report: {issue.id}</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>
        <p className="modal-subtitle">Please specify a reason for rejecting this citizen submission.</p>
        <div style={{ margin: '16px 0' }}>
          <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Rejection Reason</label>
          <textarea 
            rows="4" 
            placeholder="e.g., Duplicate report, insufficient evidence, outside ward jurisdiction..." 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          ></textarea>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(issue.id, reason); onClose(); }}>Reject Report</button>
        </div>
      </div>
    </div>
  );
}

export function AssignDepartmentModal({ isOpen, onClose, issue, onConfirm }) {
  const [department, setDepartment] = useState('Sanitation');
  const [priority, setPriority] = useState('High');
  if (!isOpen || !issue) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal">
        <div className="modal-header">
          <h3><FaShareAlt style={{ color: '#4f46e5', marginRight: '8px' }} /> Assign to Department: {issue.id}</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>
        <p className="modal-subtitle">Route issue <strong>{issue.title}</strong> to the appropriate municipal department team.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '16px 0' }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Select Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="Roads">Roads & Infrastructure</option>
              <option value="Sanitation">Sanitation & Waste Management</option>
              <option value="Water Supply">Water Supply & Sewage</option>
              <option value="Electricity">Municipal Electricity & Lighting</option>
              <option value="Drainage">Drainage & Stormwater</option>
              <option value="Parks">Parks & Horticulture</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Assign Priority Level</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent / Emergency</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onConfirm(issue.id, department, priority); onClose(); }}>Dispatch Assignment</button>
        </div>
      </div>
    </div>
  );
}

export function ViewDetailsModal({ isOpen, onClose, issue }) {
  if (!isOpen || !issue) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3><FaEye style={{ color: '#3b82f6', marginRight: '8px' }} /> Issue Details: {issue.id}</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
          {issue.image && (
            <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', margin: '12px 0' }} />
          )}
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#1e293b' }}>{issue.title}</h4>
          <p style={{ color: '#475569', marginBottom: '16px', lineHeight: '1.5' }}>{issue.description || "Comprehensive municipal grievance record."}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '0.875rem' }}>
            <div><strong>Category:</strong> {issue.category || issue.department}</div>
            <div><strong>Priority:</strong> {issue.priority}</div>
            <div><strong>Ward:</strong> {issue.ward || "Ward 4"}</div>
            <div><strong>Status:</strong> <span className={`badge badge-${(issue.status || 'Verified').toLowerCase().replace(/\s+/g, '')}`}>{issue.status || 'Verified'}</span></div>
            <div><strong>Reporter:</strong> {issue.reporterName || "Verified Citizen"}</div>
            <div><strong>Reported Date:</strong> {issue.reportedDate || issue.assignedDate || "2026-03-24"}</div>
          </div>

          {issue.timeline && (
            <div style={{ marginTop: '20px' }}>
              <h5 style={{ marginBottom: '10px', color: '#1e293b' }}>Lifecycle Timeline</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {issue.timeline.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{t.stage}</span>
                    <span style={{ color: '#64748b' }}>{t.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer" style={{ marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={onClose}>Close Window</button>
        </div>
      </div>
    </div>
  );
}