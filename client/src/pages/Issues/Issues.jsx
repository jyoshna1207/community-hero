import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Issues.css';

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

  // Issues & Async state
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Fetch issues from Backend API
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        setIssues(res.data);
      } catch (err) {
        console.error('Failed to fetch issues from backend:', err);
        setError('Failed to load issues from server. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Combined client-side filtering logic over fetched issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search matching (Title, Category, Location, or Description)
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        (issue.title && issue.title.toLowerCase().includes(query)) ||
        (issue.category && issue.category.toLowerCase().includes(query)) ||
        (issue.location && issue.location.toLowerCase().includes(query)) ||
        (issue.description && issue.description.toLowerCase().includes(query));

      // Category matching
      const matchesCategory =
        selectedCategory === 'All Categories' ||
        issue.category === selectedCategory;

      // Status matching
      const matchesStatus =
        selectedStatus === 'All Status' || issue.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [issues, searchTerm, selectedCategory, selectedStatus]);

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

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

      {/* Issues Grid / Empty / Loading State */}
      <main className="issues-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary, #94a3b8)' }}>
            <p style={{ fontSize: '1.1rem' }}>Loading reported issues from backend...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff4d4f' }}>
            <p>{error}</p>
          </div>
        ) : filteredIssues.length > 0 ? (
          <div className="issues-grid">
            {filteredIssues.map((issue) => (
              <article key={issue._id || issue.id} className="issue-card">
                {/* Image & Status Badge */}
                <div className="card-image-wrapper">
                  <img
                    src={issue.image || 'https://via.placeholder.com/400x250?text=Community+Issue'}
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
                    <span className="card-date">{formatDate(issue.reportedDate || issue.createdAt)}</span>
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
                    onClick={() => handleViewDetails(issue._id || issue.id)}
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