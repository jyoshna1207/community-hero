import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Issues.css';

// Realistic local dummy data array (minimum 10 items)
const DUMMY_ISSUES = [
  {
    id: 1,
    title: 'Garbage Dump Near Community Center',
    category: 'Waste Management',
    location: 'Gajuwaka',
    status: 'Reported',
    reportedDate: '2026-07-24',
    description: 'Unattended heap of household waste accumulating near the entrance of the community center, causing severe foul odor and health risks.',
    image: 'https://via.placeholder.com/400x250?text=Waste+Management',
  },
  {
    id: 2,
    title: 'Severe Pothole on Main Arterial Road',
    category: 'Roads',
    location: 'MVP Colony',
    status: 'In Progress',
    reportedDate: '2026-07-22',
    description: 'Deep pothole caused by recent heavy rains right at the central intersection. Poses high risk to two-wheelers during peak traffic.',
    image: 'https://via.placeholder.com/400x250?text=Road+Damage',
  },
  {
    id: 3,
    title: 'Pipeline Water Leakage on Street 4',
    category: 'Water Supply',
    location: 'Madhurawada',
    status: 'Resolved',
    reportedDate: '2026-07-18',
    description: 'Underground supply line burst leading to thousands of liters of clean water wastage daily. Repaired by civic authorities.',
    image: 'https://via.placeholder.com/400x250?text=Water+Leakage',
  },
  {
    id: 4,
    title: 'Non-Functional Street Lights along Highway',
    category: 'Street Lights',
    location: 'Steel Plant',
    status: 'Reported',
    reportedDate: '2026-07-25',
    description: 'A stretch of 6 consecutive street lights are completely dark, causing night safety concerns for pedestrians and commuters.',
    image: 'https://via.placeholder.com/400x250?text=Street+Lights',
  },
  {
    id: 5,
    title: 'Overflowing Sewage Drain Near Market',
    category: 'Drainage',
    location: 'NAD Junction',
    status: 'In Progress',
    reportedDate: '2026-07-21',
    description: 'Blocked underground drain causing black water to spill onto the main commercial footpath, affecting local shopkeepers.',
    image: 'https://via.placeholder.com/400x250?text=Overflowing+Drain',
  },
  {
    id: 6,
    title: 'Illegal Plastic Waste Burning',
    category: 'Public Safety',
    location: 'Kurmannapalem',
    status: 'Reported',
    reportedDate: '2026-07-26',
    description: 'Open burning of commercial plastic waste happening every evening in vacant plots, releasing toxic fumes into nearby homes.',
    image: 'https://via.placeholder.com/400x250?text=Waste+Burning',
  },
  {
    id: 7,
    title: 'Uncovered Open Manhole on School Lane',
    category: 'Public Safety',
    location: 'Simhachalam',
    status: 'In Progress',
    reportedDate: '2026-07-23',
    description: 'Heavy concrete cover broken and removed. Open hole right along the primary route used daily by primary school children.',
    image: 'https://via.placeholder.com/400x250?text=Open+Manhole',
  },
  {
    id: 8,
    title: 'Broken Play Equipment & Overgrown Grass',
    category: 'Parks',
    location: 'Akkayyapalem',
    status: 'Resolved',
    reportedDate: '2026-07-15',
    description: 'Childrens park was neglected with broken swings and tall wild weeds. Maintenance work has been completed successfully.',
    image: 'https://via.placeholder.com/400x250?text=Park+Maintenance',
  },
  {
    id: 9,
    title: 'Tilting Electric Pole Near Bus Stop',
    category: 'Electricity',
    location: 'Dwaraka Nagar',
    status: 'In Progress',
    reportedDate: '2026-07-20',
    description: 'An aging wooden utility pole is leaning dangerously toward the roadway after a storm. Needs immediate structural support.',
    image: 'https://via.placeholder.com/400x250?text=Electric+Pole',
  },
  {
    id: 10,
    title: 'Garbage Dump Outside Primary School Gate',
    category: 'Waste Management',
    location: 'Seethammadhara',
    status: 'Reported',
    reportedDate: '2026-07-26',
    description: 'Unsanitary waste dumped right beside the primary school boundary wall, attracting stray animals and pests daily.',
    image: 'https://via.placeholder.com/400x250?text=School+Garbage',
  },
];

const CATEGORY_OPTIONS = [
  'All Categories',
  'Waste Management',
  'Roads',
  'Water Supply',
  'Electricity',
  'Street Lights',
  'Drainage',
  'Public Safety',
  'Parks',
  'Other',
];

const STATUS_OPTIONS = ['All Status', 'Reported', 'In Progress', 'Resolved'];

export default function Issues() {
  const navigate = useNavigate();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Combined client-side filtering logic
  const filteredIssues = useMemo(() => {
    return DUMMY_ISSUES.filter((issue) => {
      // Search matching (Title, Category, or Location)
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        issue.title.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query);

      // Category matching
      const matchesCategory =
        selectedCategory === 'All Categories' ||
        issue.category === selectedCategory;

      // Status matching
      const matchesStatus =
        selectedStatus === 'All Status' || issue.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Navigate to detailed issue page
  const handleViewDetails = (issueId) => {
    navigate(`/issue/${issueId}`);
  };

  // Status Badge Class Helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Reported':
        return 'status-badge badge-reported';
      case 'In Progress':
        return 'status-badge badge-in-progress';
      case 'Resolved':
        return 'status-badge badge-resolved';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="issues-page-container">
      {/* Header Section */}
      <header className="issues-header">
        <h1 className="issues-title">Community Issues</h1>
        <p className="issues-subtitle">
          Browse reported issues in your locality and help improve your community.
        </p>
      </header>

      {/* Filter and Search Bar Section */}
      <section className="filter-bar-section" aria-label="Search and filter issues">
        <div className="filter-bar">
          {/* Search Input */}
          <div className="filter-item search-box-wrapper">
            <label htmlFor="search-input" className="sr-only">
              Search issues by title, category, or location
            </label>
            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="filter-item">
            <label htmlFor="category-select" className="filter-label">
              Category
            </label>
            <select
              id="category-select"
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="filter-item">
            <label htmlFor="status-select" className="filter-label">
              Status
            </label>
            <select
              id="status-select"
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Issues Grid / Empty State */}
      <main className="issues-content">
        {filteredIssues.length > 0 ? (
          <div className="issues-grid">
            {filteredIssues.map((issue) => (
              <article key={issue.id} className="issue-card">
                {/* Image & Status Badge */}
                <div className="card-image-wrapper">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="card-image"
                    loading="lazy"
                  />
                  <span className={getStatusBadgeClass(issue.status)}>
                    {issue.status}
                  </span>
                </div>

                {/* Card Content */}
                <div className="card-body">
                  <div className="card-meta-top">
                    <span className="card-category">{issue.category}</span>
                    <span className="card-date">{issue.reportedDate}</span>
                  </div>

                  <h2 className="card-title">{issue.title}</h2>

                  <div className="card-location">
                    <svg
                      className="location-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                    <span>{issue.location}</span>
                  </div>

                  <p className="card-description">{issue.description}</p>

                  <button
                    type="button"
                    className="view-details-btn"
                    onClick={() => handleViewDetails(issue.id)}
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="empty-state">
            <svg
              className="empty-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="empty-title">No issues found.</h3>
            <p className="empty-subtitle">Try changing your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}