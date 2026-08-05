import React from 'react';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import Button from '../Button/Button';
import './IssueCard.css';

export default function IssueCard({
  title,
  category,
  location,
  status,
  reportedDate,
  image,
  onViewDetails,
  onVerify,
  onAssign,
  onResolve,
  onEdit,
  onDelete
}) {
  const getStatusBadgeClass = (st) => {
    switch (st?.toLowerCase()) {
      case 'resolved': return 'badge-resolved';
      case 'in progress': return 'badge-progress';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="issue-card shadow-card">
      {image && (
        <div className="issue-card-image-box">
          <img src={image} alt={title} className="issue-card-img" />
          <span className={`status-badge ${getStatusBadgeClass(status)}`}>
            {status || 'Pending'}
          </span>
        </div>
      )}
      <div className="issue-card-body">
        {!image && (
          <div className="issue-card-header-row">
            <span className={`status-badge ${getStatusBadgeClass(status)}`}>
              {status || 'Pending'}
            </span>
            <span className="issue-category-tag">{category}</span>
          </div>
        )}
        {image && <span className="issue-category-tag inline">{category}</span>}

        <h3 className="issue-card-title">{title}</h3>
        
        <div className="issue-card-meta">
          <div className="meta-item">
            <FiMapPin />
            <span>{location}</span>
          </div>
          <div className="meta-item">
            <FiCalendar />
            <span>{reportedDate}</span>
          </div>
        </div>

        <div className="issue-card-actions">
          {onViewDetails && <Button text="View" variant="outline" onClick={onViewDetails} />}
          {onVerify && <Button text="Verify" variant="secondary" onClick={onVerify} />}
          {onAssign && <Button text="Assign" variant="secondary" onClick={onAssign} />}
          {onResolve && <Button text="Resolve" variant="success" onClick={onResolve} />}
          {onEdit && <Button text="Edit" variant="outline" onClick={onEdit} />}
          {onDelete && <Button text="Delete" variant="danger" onClick={onDelete} />}
        </div>
      </div>
    </div>
  );
}