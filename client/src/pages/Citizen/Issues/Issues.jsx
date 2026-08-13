import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiSearch, FiMapPin, FiCalendar, FiList, FiMap, 
  FiPlusCircle, FiLoader 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { categoriesList, statusList, priorityList } from './IssuesData';
import './Issues.css';

// Leaflet marker generator based on issue status
const createCustomMarker = (status) => {
  let color = '#EF4444'; // Red for Reported / Critical
  if (status === 'In Progress' || status === 'Under Review' || status === 'Assigned') color = '#F59E0B'; // Orange
  if (status === 'Resolved' || status === 'Solved' || status === 'Citizen Confirmed') color = '#16A34A'; // Green

  return L.divIcon({
    className: 'explore-custom-marker',
    html: `
      <div style="
        width: 32px; height: 32px; 
        background: ${color}; 
        border: 2.5px solid white; 
        border-radius: 50%; 
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: 15px;
      ">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Map controller to fly smoothly to selected issue location
function MapController({ centerCoords }) {
  const map = useMap();
  useEffect(() => {
    if (centerCoords && centerCoords.lat != null && centerCoords.lng != null) {
      map.flyTo([centerCoords.lat, centerCoords.lng], 13, { animate: true, duration: 1 });
    }
  }, [centerCoords, map]);
  return null;
}

export default function Issues() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('Nearby'); // 'Nearby' or specific place
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIssueCoords, setActiveIssueCoords] = useState({ lat: 17.6868, lng: 83.2185 });
  const [activeSelectedId, setActiveSelectedId] = useState(null);

  useEffect(() => {
    const loadRealReportedIssues = async () => {
      setLoading(true);
      let combined = [];

      // 1. Load user's locally submitted reports from localStorage
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        const mappedLocal = local.map(item => ({
          id: item.id || item._id,
          _id: item.id || item._id,
          title: item.title,
          category: item.category,
          status: item.status || 'Reported',
          priority: item.priority || 'High',
          location: item.location,
          placeName: item.location ? item.location.split(',')[0].trim() : 'Your Location',
          latitude: Number(item.latitude ?? item.locationCoords?.lat ?? 17.281524),
          longitude: Number(item.longitude ?? item.locationCoords?.lng ?? 82.521632),
          isNearby: true,
          badgeLabel: 'Your Reported Location',
          date: item.date || 'Recently Reported',
          description: item.description
        }));
        combined = [...mappedLocal];
      } catch (e) {
        console.error("Local storage read error:", e);
      }

      // 2. Fetch real reported issues from backend database
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const apiMapped = res.data.map(item => ({
            id: item._id,
            _id: item._id,
            title: item.title,
            category: item.category,
            status: item.status || 'Reported',
            priority: item.aiSeverity || 'High',
            location: item.location,
            placeName: item.location ? item.location.split(',')[0].trim() : 'Local Ward Area',
            latitude: Number(item.latitude ?? item.locationCoords?.lat ?? 17.6868),
            longitude: Number(item.longitude ?? item.locationCoords?.lng ?? 83.2185),
            isNearby: (item.location || '').toLowerCase().includes('anuru') || (item.location || '').toLowerCase().includes('thondangi'),
            badgeLabel: (item.location || '').toLowerCase().includes('anuru') ? 'Nearby Location' : 'Reported Location',
            date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            description: item.description
          }));

          const existingIds = new Set(combined.map(i => i.id));
          apiMapped.forEach(i => {
            if (!existingIds.has(i.id)) combined.push(i);
          });
        }
      } catch (err) {
        console.error("Fetch database issues error:", err);
      }

      setAllIssues(combined);

      // Set initial map center to first issue coordinates if present
      if (combined.length > 0) {
        const firstWithCoords = combined.find(i => i.latitude && i.longitude) || combined[0];
        setActiveIssueCoords({ lat: firstWithCoords.latitude, lng: firstWithCoords.longitude });
      }

      setLoading(false);
    };

    loadRealReportedIssues();
  }, []);

  // Extract unique place names dynamically from really reported issues
  const uniquePlaces = Array.from(
    new Set(allIssues.map(i => i.placeName).filter(Boolean))
  );

  // Filter & Sort Logic: Only really reported issues, nearby first!
  const filteredAndSortedIssues = allIssues
    .filter(issue => {
      const locStr = (issue.location || '') + ' ' + (issue.placeName || '');
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || locStr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
      
      let matchesLocationFilter = true;
      if (selectedLocationFilter === 'Nearby') {
        matchesLocationFilter = true; // Show all, sorted nearby first
      } else if (selectedLocationFilter !== 'All') {
        matchesLocationFilter = locStr.toLowerCase().includes(selectedLocationFilter.toLowerCase());
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesLocationFilter;
    })
    .sort((a, b) => {
      // Prioritize nearby places first
      if (selectedLocationFilter === 'Nearby') {
        if (a.isNearby && !b.isNearby) return -1;
        if (!a.isNearby && b.isNearby) return 1;
      }
      return 0;
    });

  const handleIssueSelect = (issue) => {
    setActiveSelectedId(issue.id || issue._id);
    if (issue.latitude && issue.longitude) {
      setActiveIssueCoords({ lat: issue.latitude, lng: issue.longitude });
    }
  };

  return (
    <div className="explore-issues-container">
      {/* HEADER */}
      <div className="explore-header">
        <h1>Explore Reported Issues</h1>
        <p className="explore-subtitle">
          Real civic issues reported by citizens. Nearby reports are shown first.
        </p>
      </div>

      {/* SEARCH BAR & FILTERS BAR */}
      <div className="explore-controls-card">
        <div className="explore-search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search real reported issues by title or location address..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="explore-filters-group">
          {/* LOCATION FILTER */}
          <div className="filter-dropdown location-highlight-filter">
            <select 
              value={selectedLocationFilter} 
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
            >
              <option value="Nearby">📍 Nearby Places First</option>
              <option value="All">All Reported Places</option>
              {uniquePlaces.map((place, idx) => (
                <option key={idx} value={place}>{place}</option>
              ))}
            </select>
          </div>

          <div className="filter-dropdown">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {categoriesList.filter(c => c !== 'All').map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="filter-dropdown">
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-dropdown">
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Urgent">Urgent Priority</option>
            </select>
          </div>

          {/* VIEW MODE TOGGLE (MAP VIEW / LIST VIEW) */}
          <div className="view-mode-toggle">
            <button 
              className={viewMode === 'map' ? 'toggle-btn active' : 'toggle-btn'} 
              onClick={() => setViewMode('map')}
            >
              <FiMap /> Interactive Map View
            </button>
            <button 
              className={viewMode === 'list' ? 'toggle-btn active' : 'toggle-btn'} 
              onClick={() => setViewMode('list')}
            >
              <FiList /> List View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="explore-loading-card">
          <FiLoader className="spin-icon text-blue" />
          <p>Loading real reported issues...</p>
        </div>
      ) : filteredAndSortedIssues.length === 0 ? (
        <div className="no-issues-empty-state">
          <FiAlertCircle className="empty-icon" style={{ fontSize: '2.5rem', color: '#64748B' }} />
          <h3>No Really Reported Issues Found</h3>
          <p>There are no reported issues matching your filter. Be the first hero to report an issue!</p>
          <button className="btn-primary-report" onClick={() => navigate('/report-issue')}>
            <FiPlusCircle /> Report An Issue Now
          </button>
        </div>
      ) : viewMode === 'map' ? (
        /* MAP VIEW (LEAFLET + OPENSTREETMAP REAL PINS) */
        <div className="map-view-layout">
          <div className="map-view-main">
            <div className="map-canvas-container">
              <MapContainer
                center={[activeIssueCoords.lat, activeIssueCoords.lng]}
                zoom={12}
                scrollWheelZoom={true}
                className="leaflet-explore-canvas"
                style={{ width: '100%', height: '100%', borderRadius: '14px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController centerCoords={activeIssueCoords} />

                {/* Render pins ONLY for real reported issues */}
                {filteredAndSortedIssues.map((issue) => (
                  <Marker
                    key={issue.id || issue._id}
                    position={[issue.latitude, issue.longitude]}
                    icon={createCustomMarker(issue.status)}
                    eventHandlers={{
                      click: () => handleIssueSelect(issue)
                    }}
                  >
                    <Popup>
                      <div className="explore-popup-card">
                        {issue.isNearby && <span className="popup-nearby-badge">📍 {issue.badgeLabel}</span>}
                        <h4 style={{ margin: '4px 0', fontSize: '0.95rem', fontWeight: 800 }}>{issue.title}</h4>
                        <p style={{ margin: '2px 0 6px 0', fontSize: '0.8rem', color: '#64748B' }}>📍 {issue.location}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className={`status-pill ${issue.status ? issue.status.toLowerCase().replace(/\s+/g, '-') : 'reported'}`}>
                            {issue.status}
                          </span>
                          <Link to={`/track-report/${issue.id || issue._id}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#155EEF' }}>
                            Track Report →
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Bottom Legend */}
              <div className="map-bottom-legend">
                <div className="legend-item">
                  <span className="legend-dot red"></span> Reported / Critical
                </div>
                <div className="legend-item">
                  <span className="legend-dot orange"></span> In Progress
                </div>
                <div className="legend-item">
                  <span className="legend-dot green"></span> Resolved / Solved
                </div>
              </div>
            </div>
          </div>

          {/* Side Issues List (Real Reported Issues - Nearby Places Displayed First!) */}
          <div className="map-side-panel">
            <div className="side-panel-header">
              <h3>Reports ({filteredAndSortedIssues.length})</h3>
              <span className="nearby-first-tag">📍 Nearby Places First</span>
            </div>

            <div className="side-issues-list">
              {filteredAndSortedIssues.map((issue) => (
                <div 
                  key={issue.id || issue._id} 
                  className={`side-issue-item ${issue.isNearby ? 'is-nearby' : ''} ${activeSelectedId === (issue.id || issue._id) ? 'selected-card' : ''}`}
                  onClick={() => handleIssueSelect(issue)}
                >
                  <div className="side-item-top">
                    <h4>{issue.title}</h4>
                    <span className={`status-pill ${issue.status ? issue.status.toLowerCase().replace(/\s+/g, '-') : 'reported'}`}>
                      {issue.status}
                    </span>
                  </div>

                  {issue.isNearby && (
                    <div className="nearby-distance-chip">
                      📍 {issue.badgeLabel}
                    </div>
                  )}

                  <p className="side-item-loc">📍 {issue.location}</p>

                  <div className="side-item-footer">
                    <span className="category-mini-chip">{issue.category}</span>
                    <Link to={`/track-report/${issue.id || issue._id}`} className="side-item-link">
                      Track Report →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW GRID */
        <div className="issues-grid-results">
          {filteredAndSortedIssues.map((issue) => (
            <div key={issue.id || issue._id} className={`issue-card-item ${issue.isNearby ? 'nearby-border' : ''}`}>
              <div className="card-top-row">
                <span className={`status-pill ${issue.status ? issue.status.toLowerCase().replace(/\s+/g, '-') : 'reported'}`}>
                  {issue.status}
                </span>
                {issue.isNearby && <span className="nearby-flag">📍 {issue.badgeLabel}</span>}
              </div>

              <h3>{issue.title}</h3>
              <p className="issue-desc-snippet">{issue.description || 'Civic issue report logged by community resident.'}</p>
              
              <div className="issue-meta-details">
                <span>📍 {issue.location}</span>
                <span><FiCalendar /> {issue.date}</span>
              </div>

              <div className="card-footer-flex">
                <span className="category-tag">{issue.category}</span>
                <Link to={`/track-report/${issue.id || issue._id}`} className="view-details-btn">
                  Track Report →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}