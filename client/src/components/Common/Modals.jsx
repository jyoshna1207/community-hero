import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '16px' }}>
          <FaExclamationTriangle style={{ margin: '0 auto' }} />
        </div>
        <h3 style={{ marginBottom: '8px', color: 'var(--gray-800)' }}>Confirm Deletion</h3>
        <p style={{ color: 'var(--gray-600)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  if (!isOpen || !user) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Edit User Details</h3>
          <button className="btn btn-outline btn-icon" onClick={onClose}><FaTimes /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Full Name</label>
            <input type="text" defaultValue={user.name} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Email Address</label>
            <input type="email" defaultValue={user.email} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Role</label>
            <select defaultValue={user.role} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }}>
              <option>Citizen</option>
              <option>Ward Officer</option>
              <option>Department Officer</option>
              <option>Administrator</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { onSave(); onClose(); }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssignOfficerModal = ({ isOpen, onClose, issueId, onAssign }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Assign Field Officer ({issueId})</h3>
          <button className="btn btn-outline btn-icon" onClick={onClose}><FaTimes /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Select Department Officer</label>
            <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }}>
              <option>Rohan Verma (Roads)</option>
              <option>Priya Patel (Sanitation)</option>
              <option>Manoj Kumar (Water Supply)</option>
              <option>Suresh Menon (Drainage)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Priority Note / Deadline</label>
            <textarea placeholder="Optional notes for the assigned officer..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px', height: '80px' }}></textarea>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { onAssign(); onClose(); }}>Confirm Assignment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ViewDetailsModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>{title}</h3>
          <button className="btn btn-outline btn-icon" onClick={onClose}><FaTimes /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {Object.entries(data || {}).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-200)' }}>
              <span style={{ fontWeight: 600, color: 'var(--gray-600)', textTransform: 'capitalize' }}>{key}:</span>
              <span style={{ color: 'var(--gray-800)' }}>{String(val)}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};