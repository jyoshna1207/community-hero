import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyReports.css';

// Mock logged-in user name
const LOGGED_IN_USER = 'Jyoshna';

// Dummy dataset containing issues from multiple users
const INITIAL_ISSUES = [
  {
    id: 1,
    title: 'Pothole on Main Road',
    category: 'Roads',
    location: 'MVP Colony',
    status: 'In Progress',
    reportedDate: '2026-07-22',
    reportedBy: 'Jyoshna',
    description: 'Deep pothole right at the intersection causing major traffic delays during peak hours.',
    image: 'https://via.placeholder.com/400x250?text=Pothole+Main+Road',
  },
  {
    id: 2,
    title: 'Garbage Dump Near Park',
    category: 'Waste Management',
    location: 'Gajuwaka',
    status: 'Reported',
    reportedDate: '2026-07-24',
    reportedBy: 'Jyoshna',
    description: 'Unattended pile of plastic and organic waste accumulating near the kids play area.',
    image: 'https://via.placeholder.com/400x250?text=Garbage+Dump',
  },
  {
    id: 3,
    title: 'Broken Street Light',
    category: 'Street Lights',
    location: 'Madhurawada',
    status: 'Reported',
    reportedDate: '2026-07-25',
    reportedBy: 'Rahul',
    description: 'Street light bulb shattered and completely unlit for past 4 days.',
    image: 'https://via.placeholder.com/400x250?text=Street+Light',
  },
  {
    id: 4,
    title: 'Water Leakage from Main Line',
    category: 'Water Supply',
    location: 'Steel Plant',
    status: 'Resolved',
    reportedDate: '2026-07-18',
    reportedBy: 'Jyoshna',
    description: 'Clean drinking water leaking continuously from underground municipal pipe junction.',
    image: 'https://via.placeholder.com/400x250?text=Water+Leakage',
  },
  {
    id: 5,
    title: 'Overflowing Drain in Market Area',
    category: 'Drainage',
    location: 'NAD Junction',
    status: 'In Progress',
    reportedDate: '2026-07-21',
    reportedBy: 'Priya',
    description: 'Black sewage water spilling onto commercial footpath near grocery stores.',
    image: 'https://via.placeholder.com/400x250?text=Overflowing+Drain',
  },
  {
    id: 6,
    title: 'Electric Pole Damage',
    category: 'Electricity',
    location: 'Dwaraka Nagar',
    status: 'In Progress',
    reportedDate: '2026-07-20',
    reportedBy: 'Jyoshna',
    description: 'Utility pole leaning dangerously toward road after recent heavy windstorm.',
    image: 'https://via.placeholder.com/400x250?text=Electric+Pole',
  },
  {
    id: 7,
    title: 'Open Manhole Near Bus Stop',
    category: 'Public Safety',
    location: 'Simhachalam',
    status: 'Reported',
    reportedDate: '2026-07-23',
    reportedBy: 'Anil',
    description: 'Missing concrete lid poses extreme hazard for night commuters.',
    image: 'https://via.placeholder.com/400x250?text=Open+Manhole',
  },
  {
    id: 8,
    title: 'Park Maintenance & Lawn Mowing',
    category: 'Parks',
    location: 'Akkayyapalem',
    status: 'Resolved',
    reportedDate: '2026-07-15',
    reportedBy: 'Jyoshna',
    description: 'Wild weeds and broken benches in public park require urgent municipal attention.',
    image: 'https://via.placeholder.com/400x250?text=Park+Maintenance',
  },
  {
    id: 9,
    title: 'Illegal Garbage Burning',
    category: 'Public Safety',
    location: 'Kurmannapalem',
    status: 'Reported',
    reportedDate: '2026-07-26',
    reportedBy: 'Suresh',
    description: 'Commercial plastic waste being burned openly during late evenings.',
    image: 'https://via.placeholder.com/400x250?text=Garbage+Burning',
  },
  {
    id: 10,
    title: 'Road Crack Near School Gate',
    category: 'Roads',
    location: 'Seethammadhara',
    status: 'Reported',
    reportedDate: '2026-07-26',
    reportedBy: 'Jyoshna',
    description: 'Deep road fissure widening near primary school entry gate, hazardous for school buses.',
    image: 'https://via.placeholder.com/400x250?text=Road+Crack',
  },
];

export default function MyReports() {
  const navigate = useNavigate();

  // Initialize state filtering only for the logged in user ("Jyoshna")
  const [userReports, setUserReports] = useState(() =>
    INITIAL_ISSUES.filter((issue) => issue.reportedBy === LOGGED_IN_USER)
  );

  // Edit action handler
  const handleEdit = (issueTitle) => {
    alert(`Editing "${issueTitle}": Edit feature will be available after backend integration.`);
  };

  // Delete action handler with state removal
  const handleDelete = (id, title) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the report: "${title}"?`
    );

    if (isConfirmed) {
      setUserReports((prevReports) =>
        prevReports.filter((report) => report.id !== id)
      );
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

  return (
    <div className="my-reports-container">
      {/* Page Header */}
      <header className="my-reports-header">
        <h1 className="my-reports-title">My Reports</h1>
        <p className="my-reports-subtitle">
          View and manage the issues you have reported.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="my-reports-content">
        {userReports.length > 0 ? (
          <div className="my-reports-grid">
            {userReports.map((report) => (
              <article key={report.id} className="my-report-card">
                {/* Image Container with Badge */}
                <div className="my-card-image-wrapper">
                  <img
                    src={report.image}
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
                    <span className="my-card-date">{report.reportedDate}</span>
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
                      onClick={() => handleDelete(report.id, report.title)}
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