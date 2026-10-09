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
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [role, setRole] = React.useState(user?.role || 'Citizen');

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'Citizen');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = () => {
    onSave({ name, email, role });
    onClose();
  };

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
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }}
            >
              <option value="Citizen">Citizen</option>
              <option value="Ward Officer">Ward Officer</option>
              <option value="Department Officer">Department Officer</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssignOfficerModal = ({ isOpen, onClose, issueId, onAssign }) => {
  const [selectedOfficer, setSelectedOfficer] = React.useState('Rohan Verma (Roads)');
  const [note, setNote] = React.useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const officerName = selectedOfficer.split(' (')[0];
    const deptMatch = selectedOfficer.match(/\((.*?)\)/);
    const department = deptMatch ? `${deptMatch[1]} Department` : 'Public Works Department';
    onAssign(issueId, officerName, department, note);
    onClose();
  };

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
            <select 
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px' }}
            >
              <option value="Rohan Verma (Roads)">Rohan Verma (Roads)</option>
              <option value="Priya Patel (Sanitation)">Priya Patel (Sanitation)</option>
              <option value="Manoj Kumar (Water Supply)">Manoj Kumar (Water Supply)</option>
              <option value="Suresh Menon (Drainage)">Suresh Menon (Drainage)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>Priority Note / Deadline</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional notes for the assigned officer..." 
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--gray-300)', marginTop: '4px', height: '80px' }}
            ></textarea>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleConfirm}>Confirm Assignment</button>
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