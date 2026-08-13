import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiSearch, FiMapPin, FiCalendar, FiList, FiMap, 
  FiCheckCircle, FiAlertCircle, FiNavigation, FiFilter, FiCrosshair 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
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

// Map controller to fly to selected issue location
function MapController({ centerCoords }) {
  const map = useMap();
  useEffect(() => {
    if (centerCoords && centerCoords.lat != null && centerCoords.lng != null) {
      map.flyTo([centerCoords.lat, centerCoords.lng], 13, { animate: true, duration: 1 });
    }
  }, [centerCoords, map]);
  return null;
}

const SAMPLE_PLACES_ISSUES = [
  {
    id: "EXP-101",
    _id: "EXP-101",
    title: "Street Light Not Working in Anuru",
    category: "Street Lights",
    status: "Reported",
    priority: "High",
    location: "Anuru, Thondangi, Kakinada, Andhra Pradesh, India",
    placeName: "Anuru / Kakinada",
    latitude: 17.281524,
    longitude: 82.521632,
    isNearby: true,
    distanceText: "1.2 km away",
    date: "12 Aug 2026",
    description: "Street light is not working in Anuru main street, causing dark safety hazard at night."
  },
  {
    id: "EXP-102",
    _id: "EXP-102",
    title: "Water Pipeline Leakage at Thondangi Cross",
    category: "Water Supply",
    status: "In Progress",
    priority: "High",
    location: "Thondangi, Kakinada District, Andhra Pradesh, India",
    placeName: "Anuru / Kakinada",
    latitude: 17.2650,
    longitude: 82.5110,
    isNearby: true,
    distanceText: "3.5 km away",
    date: "10 Aug 2026",
    description: "Main underground drinking water line leaking onto the walkway near Thondangi junction."
  },
  {
    id: "EXP-103",
    _id: "EXP-103",
    title: "Large Pothole Near Duvvada Main Road",
    category: "Roads",
    status: "In Progress",
    priority: "Urgent",
    location: "Duvvada Main Road, Visakhapatnam, Andhra Pradesh",
    placeName: "Duvvada / Visakhapatnam",
    latitude: 17.6868,
    longitude: 83.2185,
    isNearby: false,
    distanceText: "45 km away",
    date: "08 Aug 2026",
    description: "Deep pothole hazard near Duvvada main crossroad causing vehicular congestion."
  },
  {
    id: "EXP-104",
    _id: "EXP-104",
    title: "Garbage Dump Overflow near Gajuwaka Market",
    category: "Waste Management",
    status: "Reported",
    priority: "High",
    location: "Gajuwaka Market Junction, Visakhapatnam, Andhra Pradesh",
    placeName: "Gajuwaka",
    latitude: 17.6890,
    longitude: 83.2050,
    isNearby: false,
    distanceText: "48 km away",
    date: "11 Aug 2026",
    description: "Overflowing waste bins near commercial market area requiring immediate sanitation crew."
  },
  {
    id: "EXP-105",
    _id: "EXP-105",
    title: "Water Pipeline Burst on Tuni Main Road",
    category: "Water Supply",
    status: "Resolved",
    priority: "High",
    location: "Tuni Bypass Road, East Godavari, Andhra Pradesh",
    placeName: "Tuni",
    latitude: 17.3550,
    longitude: 82.5480,
    isNearby: false,
    distanceText: "12 km away",
    date: "05 Aug 2026",
    description: "Leaking pipeline repaired by municipal team in Tuni township."
  },
  {
    id: "EXP-106",
    _id: "EXP-106",
    title: "Unlit Streetlights Dark Corridor in MVP Colony",
    category: "Street Lights",
    status: "Reported",
    priority: "Medium",
    location: "MVP Colony 5th Lane, Visakhapatnam, Andhra Pradesh",
    placeName: "MVP Colony",
    latitude: 17.7412,
    longitude: 83.3312,
    isNearby: false,
    distanceText: "55 km away",
    date: "09 Aug 2026",
    description: "A stretch of streetlights dark during evening hours along the residential lane."
  }
];

export default function Issues() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('Nearby'); // 'Nearby', 'Anuru', 'Duvvada', 'Gajuwaka', 'Tuni', 'All'
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  const [allIssues, setAllIssues] = useState([]);
  const [activeIssueCoords, setActiveIssueCoords] = useState({ lat: 17.4000, lng: 82.8000 });
  const [activeSelectedId, setActiveSelectedId] = useState(null);

  useEffect(() => {
    const loadAllIssues = async () => {
      let combined = [];

      // 1. Load locally submitted reports by user
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
          placeName: item.location ? item.location.split(',')[0] : 'Your Location',
          latitude: Number(item.latitude ?? item.locationCoords?.lat ?? 17.281524),
          longitude: Number(item.longitude ?? item.locationCoords?.lng ?? 82.521632),
          isNearby: true,
          distanceText: '📍 Your Reported Location',
          date: item.date || 'Today',
          description: item.description
        }));
        combined = [...mappedLocal];
      } catch (e) {
        console.error("Local storage error:", e);
      }

      // 2. Fetch API issues if backend online
      try {
        const res = await axios.get('http://localhost:5000/api/issues');
        if (res.data && res.data.length > 0) {
          const apiMapped = res.data.map(item => ({
            id: item._id,
            _id: item._id,
            title: item.title,
            category: item.category,
            status: item.status || 'Reported',
            priority: item.aiSeverity || 'High',
            location: item.location,
            placeName: item.location ? item.location.split(',')[0] : 'Local Area',
            latitude: Number(item.latitude ?? item.locationCoords?.lat ?? 17.6868),
            longitude: Number(item.longitude ?? item.locationCoords?.lng ?? 83.2185),
            isNearby: (item.location || '').toLowerCase().includes('anuru') || (item.location || '').toLowerCase().includes('thondangi'),
            distanceText: (item.location || '').toLowerCase().includes('anuru') ? '1.2 km away' : 'Nearby',
            date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            description: item.description
          }));

          const existingIds = new Set(combined.map(i => i.id));
          apiMapped.forEach(i => {
            if (!existingIds.has(i.id)) combined.push(i);
          });
        }
      } catch (err) {
        console.error("Fetch API issues error:", err);
      }

      // Merge with sample places dataset to showcase diverse locations
      const existingIds = new Set(combined.map(i => i.id));
      SAMPLE_PLACES_ISSUES.forEach(sample => {
        if (!existingIds.has(sample.id)) {
          combined.push(sample);
        }
      });

      setAllIssues(combined);

      // Set initial map center to first nearby issue or default coordinates
      const firstNearby = combined.find(i => i.isNearby);
      if (firstNearby) {
        setActiveIssueCoords({ lat: firstNearby.latitude, lng: firstNearby.longitude });
      }
    };

    loadAllIssues();
  }, []);

  // Filter & Sort Logic: NEARBY PLACES SHOWN FIRST!
  const filteredAndSortedIssues = allIssues
    .filter(issue => {
      const locStr = (issue.location || '') + ' ' + (issue.placeName || '');
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || locStr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
      
      let matchesLocationFilter = true;
      if (selectedLocationFilter === 'Nearby') {
        matchesLocationFilter = true; // Show all, but sorted nearby first
      } else if (selectedLocationFilter !== 'All') {
        matchesLocationFilter = locStr.toLowerCase().includes(selectedLocationFilter.toLowerCase());
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesLocationFilter;
    })
    .sort((a, b) => {
      // "FIRST ONLY SHOW NEARBY PLACES"
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
        <h1>Explore Community Issues</h1>
        <p className="explore-subtitle">
          View issues reported by citizens from different places. Nearby places are prioritized first.
        </p>
      </div>

      {/* SEARCH BAR & FILTERS BAR */}
      <div className="explore-controls-card">
        <div className="explore-search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search issues by title, landmark or place (e.g. Anuru, Duvvada, Gajuwaka, Tuni)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="explore-filters-group">
          {/* LOCATION FILTER: NEARBY PLACES FIRST */}
          <div className="filter-dropdown location-highlight-filter">
            <select 
              value={selectedLocationFilter} 
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
            >
              <option value="Nearby">📍 Nearby Places First</option>
              <option value="Anuru">Anuru / Kakinada</option>
              <option value="Duvvada">Duvvada / Visakhapatnam</option>
              <option value="Gajuwaka">Gajuwaka</option>
              <option value="Tuni">Tuni Township</option>
              <option value="MVP">MVP Colony</option>
              <option value="All">All Places</option>
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

      {/* MAP VIEW (LEAFLET + OPENSTREETMAP INTERACTIVE MAP WITH PINS ACROSS PLACES) */}
      {viewMode === 'map' ? (
        <div className="map-view-layout">
          <div className="map-view-main">
            <div className="map-canvas-container">
              <MapContainer
                center={[activeIssueCoords.lat, activeIssueCoords.lng]}
                zoom={11}
                scrollWheelZoom={true}
                className="leaflet-explore-canvas"
                style={{ width: '100%', height: '100%', borderRadius: '14px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController centerCoords={activeIssueCoords} />

                {/* Render pins for all issues across different places */}
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
                        {issue.isNearby && <span className="popup-nearby-badge">📍 Nearby Location</span>}
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

          {/* Side Issues List (Nearby Places Displayed First!) */}
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
                      📍 Nearby ({issue.distanceText || 'Current Area'})
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
                {issue.isNearby && <span className="nearby-flag">📍 Nearby Location</span>}
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