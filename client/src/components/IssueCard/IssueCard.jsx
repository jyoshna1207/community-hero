import React from 'react';
import './IssueCard.css';
import Button from '../Button/Button';

export default function IssueCard({
  title,
  category,
  location,
  status,
  image,
  reportedDate,
  onView,
}) {
  const getStatusClass = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'reported':
        return 'status-reported';
      case 'pending':
        return 'status-pending';
      case 'resolved':
        return 'status-resolved';
      default:
        return 'status-reported';
    }
  };

  return (
    <div className="issue-card">
      <div className="issue-img-container">
        {image ? (
          <img src={image} alt={title} className="issue-image" />
        ) : (
          <div className="issue-image-placeholder">
            <span>No Image Available</span>
          </div>
        )}
        <span className={`issue-status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>

      <div className="issue-content">
        <span className="issue-category">{category}</span>
        <h3 className="issue-title" title={title}>{title}</h3>
        
        <div className="issue-details">
          <div className="issue-meta-item">
            <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="meta-text" title={location}>{location}</span>
          </div>

          <div className="issue-meta-item">
            <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="meta-text">{reportedDate}</span>
          </div>
        </div>

        <div className="issue-footer">
          <Button
            text="View Details"
            variant="outline"
            onClick={onView}
          />
        </div>
      </div>
    </div>
  );
}