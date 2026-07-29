import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaShieldAlt, FaThumbsUp, FaRobot, FaBuilding, FaClock, FaCheckCircle, FaMapMarkerAlt, FaVideo, FaBolt } from 'react-icons/fa';
import './IssueDetails.css';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  // Fetch issue details
  useEffect(() => {
    const fetchIssueDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/issues/${id}`);
        setIssue(res.data);
      } catch (err) {
        console.error('Failed to fetch issue details:', err);
        setError('Issue not found or failed to load from server.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIssueDetails();
    }
  }, [id]);

  // Upvote Handler (+10 XP)
  const handleUpvote = async () => {
    if (!user || !token) {
      setActionError('Please log in to upvote issues and earn XP.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/issues/${id}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage('🎉 ' + res.data.message);
      setIssue((prev) => ({
        ...prev,
        upvotes: [...(prev.upvotes || []), { user: user._id }],
      }));
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Upvote failed.');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  // Community Verify Handler (+20 XP)
  const handleVerify = async () => {
    if (!user || !token) {
      setActionError('Please log in to verify issues and earn XP.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/issues/${id}/verify`,
        { note: 'Verified by community member on-site' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage('🛡️ ' + res.data.message);
      setIssue((prev) => ({
        ...prev,
        verifications: [...(prev.verifications || []), { user: user._id }],
        timeline: [
          ...(prev.timeline || []),
          { status: 'Verified', note: `Verified on-site by ${user.name}`, date: new Date() },
        ],
      }));
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Verification failed.');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Reported': return 'details-status-badge status-reported';
      case 'In Progress': return 'details-status-badge status-in-progress';
      case 'Resolved': return 'details-status-badge status-resolved';
      default: return 'details-status-badge';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="issue-details-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Loading issue telemetry & AI predictions...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="issue-details-container">
        <div className="not-found-card">
          <h2>Issue Not Found</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate('/issues')}>← Back to Issues</button>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-details-container">
      <header className="details-header">
        <button className="back-link-btn" onClick={() => navigate('/issues')}>← Back to All Issues</button>
        <h1 className="details-page-title">{issue.title}</h1>
        <p className="details-page-subtitle">Hyperlocal issue details, community validation & real-time progress tracker.</p>
      </header>

      {actionMessage && <div className="action-toast-success">{actionMessage}</div>}
      {actionError && <div className="action-toast-error">{actionError}</div>}

      <main className="details-card">
        {/* Hero Media Section */}
        <div className="details-image-container">
          {issue.video ? (
            <video src={issue.video} controls className="details-image" />
          ) : (
            <img src={issue.image || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'} alt={issue.title} className="details-image" />
          )}
          <span className={getStatusBadgeClass(issue.status)}>{issue.status}</span>
        </div>

        {/* Content Layout */}
        <div className="details-content-grid">
          <section className="details-main-info">
            <div className="tags-row">
              <span className="details-category-tag">{issue.category}</span>
              <span className={`severity-tag ${issue.aiSeverity ? issue.aiSeverity.toLowerCase() : 'medium'}`}>
                AI Severity: {issue.aiSeverity || 'Medium'}
              </span>
              <span className="priority-score-chip">
                AI Priority Score: <strong>{issue.aiPriorityScore || 80}/100</strong>
              </span>
            </div>

            <div className="details-section">
              <h3 className="section-heading">Description</h3>
              <p className="details-description">{issue.description}</p>
            </div>

            {/* AI Tags Row */}
            {issue.aiTags && issue.aiTags.length > 0 && (
              <div className="details-section">
                <h4 className="subheading">AI Keyword Tags</h4>
                <div className="ai-tags-flex">
                  {issue.aiTags.map((tag, idx) => (
                    <span key={idx} className="ai-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Gamified Community Actions */}
            <div className="details-actions">
              <button type="button" className="action-btn upvote-btn" onClick={handleUpvote}>
                <FaThumbsUp /> Confirm / Upvote ({issue.upvotes?.length || 0}) <span className="xp-tag">+10 XP</span>
              </button>
              <button type="button" className="action-btn verify-btn" onClick={handleVerify}>
                <FaShieldAlt /> On-Site Verify ({issue.verifications?.length || 0}) <span className="xp-tag">+20 XP</span>
              </button>
            </div>

            {/* Real-time Resolution Timeline */}
            <div className="details-section timeline-section">
              <h3 className="section-heading">Real-Time Progress Tracker</h3>
              <div className="timeline-stepper">
                {issue.timeline && issue.timeline.length > 0 ? (
                  issue.timeline.map((step, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-icon-box">
                        <FaCheckCircle className="timeline-check-icon" />
                      </div>
                      <div className="timeline-content">
                        <h4 className="timeline-status">{step.status}</h4>
                        <p className="timeline-note">{step.note}</p>
                        <span className="timeline-meta">By {step.updatedBy || 'System'} • {formatDate(step.date)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8' }}>Tracking initialized.</p>
                )}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="details-sidebar">
            <h3 className="sidebar-heading">Issue Information</h3>
            <dl className="info-list">
              <div className="info-item">
                <dt className="info-label">Assigned Department</dt>
                <dd className="info-value highlight-value">{issue.assignedDept || 'Municipal Task Force'}</dd>
              </div>
              <div className="info-item">
                <dt className="info-label">Location Landmark</dt>
                <dd className="info-value"><FaMapMarkerAlt /> {issue.location}</dd>
              </div>
              <div className="info-item">
                <dt className="info-label">Reported Date</dt>
                <dd className="info-value">{formatDate(issue.reportedDate || issue.createdAt)}</dd>
              </div>
              <div className="info-item">
                <dt className="info-label">Reported By</dt>
                <dd className="info-value">{issue.user?.name || 'Citizen Hero'}</dd>
              </div>
              <div className="info-item">
                <dt className="info-label">Community Validations</dt>
                <dd className="info-value">{issue.verifications?.length || 0} Verifications</dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
    </div>
  );
}