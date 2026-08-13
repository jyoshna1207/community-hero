import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiChevronDown, FiList, FiMap, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { allIssuesData, categoriesList, statusList, priorityList } from './IssuesData';
import './Issues.css';

export default function Issues() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  const filteredIssues = allIssuesData.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="explore-issues-container">
      {/* SCREEN 4 HEADER */}
      <div className="explore-header">
        <h1>Explore Issues</h1>
        <p className="explore-subtitle">Find problems in your community</p>
      </div>

      {/* SEARCH BAR & FILTERS BAR */}
      <div className="explore-controls-card">
        <div className="explore-search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search issues, locations or categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="explore-filters-group">
          <div className="filter-dropdown">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">Category ▼</option>
              {categoriesList.filter(c => c !== 'All').map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="filter-dropdown">
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="All">Status ▼</option>
              {statusList.filter(s => s !== 'All').map((stat, idx) => <option key={idx} value={stat}>{stat}</option>)}
            </select>
          </div>

          <div className="filter-dropdown">
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
              <option value="All">Priority ▼</option>
              {priorityList.filter(p => p !== 'All').map((p, idx) => <option key={idx} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="filter-dropdown">
            <select>
              <option>Distance ▼</option>
              <option>Within 2 km</option>
              <option>Within 5 km</option>
              <option>Within 10 km</option>
            </select>
          </div>

          <div className="filter-dropdown">
            <select>
              <option>Date ▼</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>

          {/* VIEW MODE TOGGLE */}
          <div className="view-mode-toggle">
            <button 
              className={viewMode === 'list' ? 'toggle-btn active' : 'toggle-btn'} 
              onClick={() => setViewMode('list')}
            >
              <FiList /> List View
            </button>
            <button 
              className={viewMode === 'map' ? 'toggle-btn active' : 'toggle-btn'} 
              onClick={() => setViewMode('map')}
            >
              <FiMap /> Map View
            </button>
          </div>
        </div>
      </div>

      {/* MAP VIEW (~70% WIDTH WITH CLUSTERS & LEGEND) */}
      {viewMode === 'map' ? (
        <div className="map-view-layout">
          <div className="map-view-main">
            <div className="map-canvas-container">
              {/* Real Google Maps Embed View */}
              <iframe
                title="Google Maps Explore View"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '14px' }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(searchTerm.trim() ? searchTerm.trim() : 'Visakhapatnam, Andhra Pradesh')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>

              {/* Map Zoom Controls */}
              <div className="map-controls">
                <button><FiZoomIn /></button>
                <button><FiZoomOut /></button>
              </div>

              {/* Bottom Legend */}
              <div className="map-bottom-legend">
                <div className="legend-item">
                  <span className="legend-dot red"></span> Critical
                </div>
                <div className="legend-item">
                  <span className="legend-dot orange"></span> Pending
                </div>
                <div className="legend-item">
                  <span className="legend-dot blue"></span> In Progress
                </div>
                <div className="legend-item">
                  <span className="legend-dot green"></span> Resolved
                </div>
              </div>
            </div>
          </div>

          {/* Side List Panel */}
          <div className="map-side-panel">
            <h3>Nearby Reports ({filteredIssues.length})</h3>
            <div className="side-issues-list">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="side-issue-item">
                  <div className="side-item-top">
                    <h4>{issue.title}</h4>
                    <span className={`status-pill ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>{issue.status}</span>
                  </div>
                  <p className="side-item-loc">📍 {issue.location}</p>
                  <Link to={`/issues/${issue.id}`} className="side-item-link">View Details →</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW GRID */
        <div className="issues-grid-results">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card-item">
              <div className="card-top-row">
                <span className={`status-pill ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>{issue.status}</span>
                <span className="priority-pill">{issue.priority} Priority</span>
              </div>
              <h3>{issue.title}</h3>
              <p className="issue-desc-snippet">{issue.description || 'Civic infrastructure report logged by community resident.'}</p>
              <div className="issue-meta-details">
                <span>📍 {issue.location}</span>
                <span><FiCalendar /> {issue.date}</span>
              </div>
              <div className="card-footer-flex">
                <span className="category-tag">{issue.category}</span>
                <Link to={`/issues/${issue.id}`} className="view-details-btn">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}