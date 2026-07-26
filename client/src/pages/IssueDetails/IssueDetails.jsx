import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './IssueDetails.css';

// Realistic dummy data array matching the listing page
const ISSUES_DATA = [
  {
    id: 1,
    title: 'Garbage Dump Near Community Center',
    category: 'Waste Management',
    location: 'Gajuwaka',
    status: 'Reported',
    reportedDate: '2026-07-24',
    description: 'Unattended heap of household waste accumulating near the entrance of the community center, causing severe foul odor and health risks to visitors and residents.',
    image: 'https://via.placeholder.com/900x500?text=Waste+Management',
  },
  {
    id: 2,
    title: 'Severe Pothole on Main Arterial Road',
    category: 'Roads',
    location: 'MVP Colony',
    status: 'In Progress',
    reportedDate: '2026-07-22',
    description: 'Deep pothole caused by recent heavy rains right at the central intersection. Poses high risk to two-wheelers during peak traffic hours.',
    image: 'https://via.placeholder.com/900x500?text=Road+Damage',
  },
  {
    id: 3,
    title: 'Pipeline Water Leakage on Street 4',
    category: 'Water Supply',
    location: 'Madhurawada',
    status: 'Resolved',
    reportedDate: '2026-07-18',
    description: 'Underground supply line burst leading to thousands of liters of clean water wastage daily. Repaired by municipal civic authorities.',
    image: 'https://via.placeholder.com/900x500?text=Water+Leakage',
  },
  {
    id: 4,
    title: 'Non-Functional Street Lights along Highway',
    category: 'Street Lights',
    location: 'Steel Plant',
    status: 'Reported',
    reportedDate: '2026-07-25',
    description: 'A stretch of 6 consecutive street lights are completely dark, causing night safety concerns for pedestrians and commuters along the highway.',
    image: 'https://via.placeholder.com/900x500?text=Street+Lights',
  },
  {
    id: 5,
    title: 'Overflowing Sewage Drain Near Market',
    category: 'Drainage',
    location: 'NAD Junction',
    status: 'In Progress',
    reportedDate: '2026-07-21',
    description: 'Blocked underground drain causing waste water to spill onto the main commercial footpath, affecting local shopkeepers and passersby.',
    image: 'https://via.placeholder.com/900x500?text=Overflowing+Drain',
  },
  {
    id: 6,
    title: 'Illegal Plastic Waste Burning',
    category: 'Public Safety',
    location: 'Kurmannapalem',
    status: 'Reported',
    reportedDate: '2026-07-26',
    description: 'Open burning of commercial plastic waste happening every evening in vacant plots, releasing toxic fumes into nearby residential homes.',
    image: 'https://via.placeholder.com/900x500?text=Waste+Burning',
  },
  {
    id: 7,
    title: 'Uncovered Open Manhole on School Lane',
    category: 'Public Safety',
    location: 'Simhachalam',
    status: 'In Progress',
    reportedDate: '2026-07-23',
    description: 'Heavy concrete cover broken and removed. Open hole right along the primary route used daily by primary school children.',
    image: 'https://via.placeholder.com/900x500?text=Open+Manhole',
  },
  {
    id: 8,
    title: 'Broken Play Equipment & Overgrown Grass',
    category: 'Parks',
    location: 'Akkayyapalem',
    status: 'Resolved',
    reportedDate: '2026-07-15',
    description: 'Childrens park was neglected with broken swings and tall wild weeds. Maintenance work has been completed successfully.',
    image: 'https://via.placeholder.com/900x500?text=Park+Maintenance',
  },
  {
    id: 9,
    title: 'Tilting Electric Pole Near Bus Stop',
    category: 'Electricity',
    location: 'Dwaraka Nagar',
    status: 'In Progress',
    reportedDate: '2026-07-20',
    description: 'An aging wooden utility pole is leaning dangerously toward the roadway after a storm. Needs immediate structural support.',
    image: 'https://via.placeholder.com/900x500?text=Electric+Pole',
  },
  {
    id: 10,
    title: 'Garbage Dump Outside Primary School Gate',
    category: 'Waste Management',
    location: 'Seethammadhara',
    status: 'Reported',
    reportedDate: '2026-07-26',
    description: 'Unsanitary waste dumped right beside the primary school boundary wall, attracting stray animals and pests daily.',
    image: 'https://via.placeholder.com/900x500?text=School+Garbage',
  },
];

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find issue matching the route param
  const issue = ISSUES_DATA.find((item) => item.id === Number(id));

  // Placeholder action handler for UI buttons
  const handleAction = (actionName) => {
    alert(`${actionName}: Feature will be available after backend integration.`);
  };

  // Status Badge CSS Class Mapper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Reported':
        return 'details-status-badge status-reported';
      case 'In Progress':
        return 'details-status-badge status-in-progress';
      case 'Resolved':
        return 'details-status-badge status-resolved';
      default:
        return 'details-status-badge';
    }
  };

  // Fallback state if issue ID is invalid
  if (!issue) {
    return (
      <div className="issue-details-container">
        <div className="not-found-card">
          <div className="not-found-icon" aria-hidden="true">⚠️</div>
          <h2 className="not-found-title">Issue Not Found</h2>
          <p className="not-found-message">The requested issue does not exist or has been removed.</p>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/issues')}
          >
            ← Back to Issues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-details-container">
      {/* Top Header Section */}
      <header className="details-header">
        <button
          type="button"
          className="back-link-btn"
          onClick={() => navigate('/issues')}
        >
          ← Back to All Issues
        </button>
        <h1 className="details-page-title">Issue Details</h1>
        <p className="details-page-subtitle">
          View complete information about the reported community issue.
        </p>
      </header>

      {/* Main Details Card */}
      <main className="details-card">
        {/* Hero Image Section */}
        <div className="details-image-container">
          <img
            src={issue.image}
            alt={issue.title}
            className="details-image"
          />
          <span className={getStatusBadgeClass(issue.status)}>
            {issue.status}
          </span>
        </div>

        {/* Card Body Layout */}
        <div className="details-content-grid">
          {/* Main Information Column */}
          <section className="details-main-info">
            <div className="details-category-tag">{issue.category}</div>
            <h2 className="details-issue-title">{issue.title}</h2>

            <div className="details-section">
              <h3 className="section-heading">Description</h3>
              <p className="details-description">{issue.description}</p>
            </div>

            {/* Interactive Action Buttons */}
            <div className="details-actions">
              <button
                type="button"
                className="action-btn primary-action"
                onClick={() => handleAction('Verify Issue')}
              >
                Verify Issue
              </button>
              <button
                type="button"
                className="action-btn secondary-action"
                onClick={() => handleAction('Mark Helpful')}
              >
                Mark Helpful
              </button>
            </div>
          </section>

          {/* Side Info Panel */}
          <aside className="details-sidebar" aria-label="Issue Summary Information">
            <h3 className="sidebar-heading">Issue Information</h3>
            <dl className="info-list">
              <div className="info-item">
                <dt className="info-label">Issue ID</dt>
                <dd className="info-value">#{issue.id}</dd>
              </div>

              <div className="info-item">
                <dt className="info-label">Category</dt>
                <dd className="info-value">{issue.category}</dd>
              </div>

              <div className="info-item">
                <dt className="info-label">Location</dt>
                <dd className="info-value">{issue.location}</dd>
              </div>

              <div className="info-item">
                <dt className="info-label">Reported Date</dt>
                <dd className="info-value">{issue.reportedDate}</dd>
              </div>

              <div className="info-item">
                <dt className="info-label">Current Status</dt>
                <dd className="info-value">
                  <span className={`status-pill ${issue.status.toLowerCase().replace(' ', '-')}`}>
                    {issue.status}
                  </span>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
    </div>
  );
}