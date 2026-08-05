import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiUser, FiCheckCircle, FiClock } from 'react-icons/fi';
import { issueDetailsData } from './IssueDetailsData';
import './IssueDetails.css';

export default function IssueDetails() {
  const { id } = useParams();
  const issue = issueDetailsData[id] || issueDetailsData["ISS-101"];

  return (
    <div className="issue-details-container">
      <Link to="/issues" className="back-link">
        <FiArrowLeft /> Back to Issues Directory
      </Link>

      <div className="issue-details-grid">
        {/* Left Column: Image, Title, Description, Timeline, Comments */}
        <div className="issue-main-content">
          <div className="large-image-placeholder">
            <img src={issue.image} alt={issue.title} />
          </div>

          <div className="details-card-box">
            <div className="title-status-flex">
              <h2>{issue.title}</h2>
              <span className={`status-badge-custom ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>{issue.status}</span>
            </div>

            <div className="meta-info-row">
              <span>📍 {issue.location} ({issue.ward})</span>
              <span>🏷️ {issue.category}</span>
              <span>⚡ Priority: <strong>{issue.priority}</strong></span>
            </div>

            <hr className="divider" />

            <div className="description-block">
              <h3>Description</h3>
              <p>{issue.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="details-card-box">
            <h3>Issue Resolution Timeline</h3>
            <div className="timeline-container">
              {issue.timeline.map((step, idx) => (
                <div key={idx} className={`timeline-item ${step.completed ? 'completed' : ''}`}>
                  <div className="timeline-marker">
                    {step.completed ? <FiCheckCircle /> : <FiClock />}
                  </div>
                  <div className="timeline-content">
                    <h4>{step.step}</h4>
                    <span>{step.date || 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Placeholder */}
          <div className="details-card-box">
            <h3>Citizen Comments & Updates</h3>
            <div className="comments-list">
              {issue.comments.map((comm, idx) => (
                <div key={idx} className="comment-item">
                  <div className="comment-header">
                    <strong>{comm.author}</strong>
                    <span>{comm.date}</span>
                  </div>
                  <p>{comm.text}</p>
                </div>
              ))}
            </div>
            <div className="add-comment-box">
              <textarea placeholder="Add a public update or comment..." rows="3"></textarea>
              <button className="btn-primary">Post Comment</button>
            </div>
          </div>
        </div>

        {/* Right Column: Reporter Info & Actions */}
        <div className="issue-sidebar-column">
          <div className="details-card-box">
            <h3>Reporter Information</h3>
            <div className="reporter-profile-flex">
              <div className="reporter-avatar">
                <FiUser />
              </div>
              <div>
                <h4>{issue.reporter.name}</h4>
                <p>Active Ward Contributor</p>
                <span className="reporter-badge">Community Hero Level 2</span>
              </div>
            </div>
          </div>

          <div className="details-card-box actions-box">
            <h3>Actions</h3>
            <Link to="/report-issue" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
              Report Similar Issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}