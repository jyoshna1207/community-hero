import React, { useState } from 'react';
import { FaSearch, FaEye, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { issueHistoryData } from '../../../services/OfficerDummyData';
import { ViewDetailsModal } from '../../../components/Common/OfficerModals';

export default function IssueHistory() {
  const [history] = useState(issueHistoryData);
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filtered = history.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b' }}>
          Resolved Issue History Archive
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Historical record of completed municipal resolutions with before/after evidence photos and citizen confirmation timelines.
        </p>
      </div>

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
          placeholder="Search history archive..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}
        />
      </div>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {item.id} • {item.ward} • Closed on {item.completionDate}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: '#1e293b' }}>
                  {item.title}
                </h3>
              </div>
              <span
                style={{
                  background: '#d1fae5',
                  color: '#065f46',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaCheckCircle /> {item.finalStatus}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                  BEFORE REPORTING
                </div>
                <img
                  src={item.beforeImage}
                  alt="Before repair"
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                  AFTER RESOLUTION
                </div>
                <img
                  src={item.afterImage}
                  alt="After repair"
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              <strong>Department:</strong> {item.department} | <strong>Verification:</strong> {item.verificationDate}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => {
                  setSelectedIssue(item);
                  setViewModalOpen(true);
                }}
                style={{
                  flex: 1,
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
                  fontWeight: 600,
                }}
              >
                <FaEye /> View Timeline
              </button>
              <button
                onClick={() => alert(`Exported resolution certificate for ${item.id}`)}
                style={{
                  flex: 1,
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
                <FaDownload /> Audit Report
              </button>
            </div>
          </div>
        ))}
      </div>

      <ViewDetailsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        issue={selectedIssue}
      />
    </div>
  );
}