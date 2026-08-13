import React, { useState } from 'react';
import { FaSearch, FaCheckCircle, FaBan, FaShareAlt, FaEye } from 'react-icons/fa';
import { verificationQueueData } from '../../../services/OfficerDummyData';
import { VerifyIssueModal, RejectIssueModal, AssignDepartmentModal, ViewDetailsModal } from '../../../components/Common/OfficerModals';

export default function VerifyIssues() {
  const [queue, setQueue] = useState(verificationQueueData);
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Modal Visibility States
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [notification, setNotification] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const filtered = queue.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmVerify = (issueId) => {
    setQueue((prev) => prev.filter((i) => i.id !== issueId));
    showToast(`Issue ${issueId} verified & sent to dispatch queue! (+20 XP logged)`);
  };

  const handleConfirmReject = (issueId, reason) => {
    setQueue((prev) => prev.filter((i) => i.id !== issueId));
    showToast(`Report ${issueId} rejected. Reason: "${reason || 'Insufficient details'}"`);
  };

  const handleConfirmAssign = (issueId, dept, priority) => {
    setQueue((prev) => prev.filter((i) => i.id !== issueId));
    showToast(`Issue ${issueId} dispatched to ${dept} Department with ${priority} Priority!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>
          Ward Issue Verification Queue
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Inspect citizen reports, verify ground truth, reject spam, or route to municipal departments.
        </p>
      </div>

      {notification && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '8px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {notification}
        </div>
      )}

      <div
        style={{
          padding: '12px 16px',
          background: '#fff',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e2e8f0',
          width: '320px',
        }}
      >
        <FaSearch style={{ color: '#64748b', marginRight: '10px' }} />
        <input
          type="text"
          placeholder="Search by ID, title, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}
        />
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            color: '#64748b',
          }}
        >
          🎉 Verification queue is empty! All submitted reports in your ward have been reviewed.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    {item.id} • {item.ward} • {item.reportedDate}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: '#1e293b' }}>
                    {item.title}
                  </h3>
                </div>
                <span
                  style={{
                    background: item.priority === 'Urgent' ? '#fee2e2' : item.priority === 'High' ? '#fef3c7' : '#e0e7ff',
                    color: item.priority === 'Urgent' ? '#991b1b' : item.priority === 'High' ? '#92400e' : '#3730a3',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {item.priority}
                </span>
              </div>

              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.4' }}>{item.description}</p>

              <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Reporter:</strong> {item.reporterName}</span>
                <span><strong>Category:</strong> {item.category}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    setSelectedIssue(item);
                    setViewModalOpen(true);
                  }}
                  style={{
                    padding: '8px',
                    fontSize: '0.8rem',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <FaEye /> View
                </button>

                <button
                  onClick={() => {
                    setSelectedIssue(item);
                    setVerifyModalOpen(true);
                  }}
                  style={{
                    padding: '8px',
                    fontSize: '0.8rem',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                >
                  <FaCheckCircle /> Verify
                </button>

                <button
                  onClick={() => {
                    setSelectedIssue(item);
                    setAssignModalOpen(true);
                  }}
                  style={{
                    padding: '8px',
                    fontSize: '0.8rem',
                    background: '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                >
                  <FaShareAlt /> Assign Dept
                </button>

                <button
                  onClick={() => {
                    setSelectedIssue(item);
                    setRejectModalOpen(true);
                  }}
                  style={{
                    padding: '8px',
                    fontSize: '0.8rem',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                >
                  <FaBan /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <VerifyIssueModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        issue={selectedIssue}
        onConfirm={handleConfirmVerify}
      />
      <RejectIssueModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        issue={selectedIssue}
        onConfirm={handleConfirmReject}
      />
      <AssignDepartmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        issue={selectedIssue}
        onConfirm={handleConfirmAssign}
      />
      <ViewDetailsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        issue={selectedIssue}
      />
    </div>
  );
}