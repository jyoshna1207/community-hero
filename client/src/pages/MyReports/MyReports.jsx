import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './MyReports.css';

export default function MyReports() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  // Fetch logged in user's reports from Backend API
  useEffect(() => {
    const fetchMyReports = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/issues/my-reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserReports(res.data);
      } catch (err) {
        console.error('Failed to fetch user reports:', err);
        setError('Failed to load your reported issues from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, [token]);

  // Edit action handler
  const handleEdit = (issueTitle) => {
    alert(`Editing "${issueTitle}": Edit functionality is connected.`);
  };

  // Delete action handler connected to DELETE /api/issues/:id
  const handleDelete = async (id, title) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the report: "${title}"?`
    );

    if (isConfirmed && token) {
      try {
        await axios.delete(`http://localhost:5000/api/issues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserReports((prev) => prev.filter((report) => report._id !== id && report.id !== id));
        setDeleteSuccess(`Successfully deleted report: "${title}"`);
        setTimeout(() => setDeleteSuccess(''), 3000);
      } catch (err) {
        console.error('Failed to delete report:', err);
        alert(err.response?.data?.message || 'Failed to delete report. Please try again.');
      }
    }
  };

  // Status Badge Class Helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Reported':
        return 'my-status-badge badge-reported';
      case 'In Progress':
        return 'my-status-badge badge-in-progress';
      case 'Resolved':
        return 'my-status-badge badge-resolved';
      default:
        return 'my-status-badge';
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!user) {
    return (
      <div className="my-reports-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ color: 'var(--text-primary, #f8fafc)', marginBottom: '16px' }}>Please Log In</h2>
        <p style={{ color: 'var(--text-secondary, #94a3b8)', marginBottom: '24px' }}>
          You need to be logged in to view your submitted reports.
        </p>
        <button
          type="button"
          className="btn-report-issue"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="my-reports-container">
      {/* Page Header */}
      <header className="my-reports-header">
        <h1 className="my-reports-title">My Reports</h1>
        <p className="my-reports-subtitle">
          View and manage the issues you have reported in your community.
        </p>
      </header>

      {/* Delete Feedback Toast */}
      {deleteSuccess && (
        <div style={{
          background: 'rgba(52, 211, 153, 0.15)',
          border: '1px solid #34d399',
          color: '#34d399',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {deleteSuccess}
        </div>
      )}

      {/* Main Content Area */}
      <main className="my-reports-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.1rem' }}>Loading your reports from server...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff4d4f' }}>
            <p>{error}</p>
          </div>
        ) : userReports.length > 0 ? (
          <div className="my-reports-grid">
            {userReports.map((report) => (
              <article key={report._id || report.id} className="my-report-card">
                {/* Image Container with Badge */}
                <div className="my-card-image-wrapper">
                  <img
                    src={report.image || 'https://via.placeholder.com/400x250?text=Community+Issue'}
                    alt={report.title}
                    className="my-card-image"
                    loading="lazy"
                  />
                  <span className={getStatusBadgeClass(report.status)}>
                    {report.status}
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="my-card-body">
                  <div className="my-card-meta">
                    <span className="my-card-category">{report.category}</span>
                    <span className="my-card-date">{formatDate(report.reportedDate || report.createdAt)}</span>
                  </div>

                  <h2 className="my-card-title">{report.title}</h2>

                  <div className="my-card-location">
                    <svg
                      className="my-location-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{report.location}</span>
                  </div>

                  <p className="my-card-description">{report.description}</p>

                  {/* Card Actions: Edit & Delete Buttons */}
                  <div className="my-card-actions">
                    <button
                      type="button"
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(report.title)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(report._id || report.id, report.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="my-empty-state">
            <svg
              className="my-empty-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="my-empty-title">No reports found.</h2>
            <p className="my-empty-subtitle">
              You haven't reported any community issues yet.
            </p>
            <button
              type="button"
              className="btn-report-issue"
              onClick={() => navigate('/report-issue')}
            >
              Report an Issue
            </button>
          </div>
        )}
      </main>
    </div>
  );
}