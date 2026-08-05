import React, { useState } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { allIssuesData, categoriesList, statusList, priorityList } from './IssuesData';
import './Issues.css';

export default function Issues() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const filteredIssues = allIssuesData.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="issues-page-container">
      <div className="issues-header">
        <h2>Community Issues Directory</h2>
        <p>Browse and track all reported civic problems across municipal wards.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="filters-card">
        <div className="search-box-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categoriesList.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              {statusList.map((stat, idx) => <option key={idx} value={stat}>{stat}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
              {priorityList.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="issues-grid-results">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card-item">
              <div className="card-top-row">
                <span className={`status-badge-custom ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>{issue.status}</span>
                <span className="priority-pill">{issue.priority}</span>
              </div>
              <h3>{issue.title}</h3>
              <p className="issue-desc-snippet">{issue.description}</p>
              <div className="issue-meta-details">
                <span><FiMapPin /> {issue.location}</span>
                <span><FiCalendar /> {issue.date}</span>
              </div>
              <div className="card-footer-flex">
                <span className="category-tag">{issue.category}</span>
                <Link to={`/issues/${issue.id}`} className="view-details-btn">View Details →</Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results-box">
            <p>No issues found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="pagination-placeholder">
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">Next →</button>
      </div>
    </div>
  );
}