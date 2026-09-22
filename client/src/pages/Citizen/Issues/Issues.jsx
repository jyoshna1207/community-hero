import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiSearch, FiMapPin, FiCalendar, FiList, FiMap, 
  FiPlusCircle, FiLoader, FiAlertCircle 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../../context/LanguageContext';
import './Issues.css';

// Andhra Pradesh State Geographic Coordinates & Overview
const AP_STATE_CENTER = { lat: 15.9129, lng: 79.7400 };
const AP_STATE_ZOOM = 7;

// Leaflet marker generator based on issue status with teardrop pin & pulse shadow
const createCustomMarker = (status, category) => {
  let color = '#EF4444'; // Red for Reported / Critical
  if (status === 'In Progress' || status === 'Under Review' || status === 'Assigned') color = '#F59E0B'; // Orange
  if (status === 'Resolved' || status === 'Solved' || status === 'Citizen Confirmed') color = '#10B981'; // Green

  return L.divIcon({
    className: 'ap-civic-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="
          width: 32px; height: 32px; 
          background: ${color}; 
          border: 2.5px solid #FFFFFF; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          display: flex; align-items: center; justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 13px; color: #FFFFFF; font-weight: 800;">📍</span>
        </div>
        <div style="
          width: 10px; height: 3px; 
          background: rgba(15,23,42,0.35); 
          border-radius: 50%; 
          margin-top: 2px;
          filter: blur(1px);
        "></div>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 36],
    popupAnchor: [0, -36]
  });
};

// Map controller to fly smoothly between full Andhra Pradesh overview and zoomed issue pins
function MapController({ centerCoords, zoomLevel }) {
  const map = useMap();
  useEffect(() => {
    if (centerCoords && centerCoords.lat != null && centerCoords.lng != null) {
      map.flyTo([centerCoords.lat, centerCoords.lng], zoomLevel || AP_STATE_ZOOM, { animate: true, duration: 1.2 });
    }
  }, [centerCoords, zoomLevel, map]);
  return null;
}

const AP_DISTRICTS = [
  { name: 'All Andhra Pradesh', coords: AP_STATE_CENTER, zoom: AP_STATE_ZOOM },
  { name: 'Visakhapatnam', coords: { lat: 17.6868, lng: 83.2185 }, zoom: 11 },
  { name: 'Kakinada', coords: { lat: 17.1917, lng: 82.3150 }, zoom: 11 },
  { name: 'Vijayawada / Krishna', coords: { lat: 16.5062, lng: 80.6480 }, zoom: 11 },
  { name: 'Guntur / Amaravati', coords: { lat: 16.3067, lng: 80.4365 }, zoom: 11 },
  { name: 'Tirupati / Rayalaseema', coords: { lat: 13.6288, lng: 79.4192 }, zoom: 11 },
];

export default function Issues() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [selectedDistrict, setSelectedDistrict] = useState('All Andhra Pradesh');

  const [allIssues, setAllIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIssueCoords, setActiveIssueCoords] = useState(AP_STATE_CENTER);
  const [mapZoom, setMapZoom] = useState(AP_STATE_ZOOM);
  const [activeSelectedId, setActiveSelectedId] = useState(null);

  useEffect(() => {
    const loadRealReportedIssues = async () => {
      setLoading(true);
      let combined = [];

      // 1. Load user's locally submitted reports from localStorage
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        const mappedLocal = local.map((item, idx) => ({
          id: item.id || item._id,
          _id: item.id || item._id,
          title: item.title,
          category: item.category,
          status: item.status || 'Reported',
          location: item.location,
          reporterName: item.reporterName || (idx % 2 === 0 ? 'Anusha P.' : 'Rajesh Kumar'),
          latitude: Number(item.latitude ?? item.locationCoords?.lat ?? 17.281524),
          longitude: Number(item.longitude ?? item.locationCoords?.lng ?? 82.521632),
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
          const apiMapped = res.data.map((item, idx) => ({
            id: item._id,
            _id: item._id,
            title: item.title,
            category: item.category,
            status: item.status || 'Reported',
            location: item.location,
            reporterName: item.user?.name || item.reporterName || (idx % 2 === 0 ? 'Suresh Varma' : 'Kavitha Reddy'),
            latitude: Number(item.latitude ?? item.locationCoords?.lat ?? 17.6868),
            longitude: Number(item.longitude ?? item.locationCoords?.lng ?? 83.2185),
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

      // Default state: Keep full compressed Andhra Pradesh state overview (Zoom 7) with pins
      setActiveIssueCoords(AP_STATE_CENTER);
      setMapZoom(AP_STATE_ZOOM);

      setLoading(false);
    };

    loadRealReportedIssues();
  }, []);

  // Filter issues based on search term and district
  const filteredIssues = allIssues.filter(issue => {
    const locStr = issue.location || '';
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || locStr.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDistrict = true;
    if (selectedDistrict !== 'All Andhra Pradesh') {
      const dKey = selectedDistrict.split(' ')[0].toLowerCase();
      matchesDistrict = locStr.toLowerCase().includes(dKey) || (issue.title || '').toLowerCase().includes(dKey);
    }
    
    return matchesSearch && matchesDistrict;
  });

  const handleIssueSelect = (issue) => {
    setActiveSelectedId(issue.id || issue._id);
    if (issue.latitude && issue.longitude) {
      setActiveIssueCoords({ lat: issue.latitude, lng: issue.longitude });
      setMapZoom(13); // Zoom into the clicked issue pin
    }
  };

  const handleResetAPOverview = () => {
    setActiveSelectedId(null);
    setSelectedDistrict('All Andhra Pradesh');
    setActiveIssueCoords(AP_STATE_CENTER);
    setMapZoom(AP_STATE_ZOOM);
  };

  const handleSelectDistrict = (dist) => {
    setSelectedDistrict(dist.name);
    setActiveSelectedId(null);
    setActiveIssueCoords(dist.coords);
    setMapZoom(dist.zoom);
  };

  return (
    <div className="explore-issues-container">
      {/* PURPOSE HERO BANNER */}
      <div className="portal-purpose-banner citizen-theme">
        <div className="banner-left-content">
          <div className="banner-role-tag">
            <FiMap /> {language === 'te' ? 'పౌర భౌగోళిక మ్యాప్' : language === 'hi' ? 'नागरिक भू-स्थानिक मानचित्र' : 'Citizen Geo-Spatial Telemetry'}
          </div>
          <h1>{t('mapBannerTitle')}</h1>
          <p>
            {t('mapBannerDesc')}
          </p>
        </div>
        <div className="banner-actions">
          <button className="banner-btn-primary" onClick={handleResetAPOverview}>
            {t('mapResetBtn')}
          </button>
          <button className="banner-btn-secondary" onClick={() => navigate('/report-issue')}>
            <FiPlusCircle /> {t('mapReportInWard')}
          </button>
        </div>
      </div>

      {/* DISTRICT QUICK FOCUS TABS */}
      <div className="ap-districts-bar">
        <span className="districts-label">{t('mapRegionLabel')}</span>
        <div className="districts-scroll-list">
          {AP_DISTRICTS.map((dist, idx) => (
            <button
              key={idx}
              className={`district-pill ${selectedDistrict === dist.name ? 'active' : ''}`}
              onClick={() => handleSelectDistrict(dist)}
            >
              {dist.name}
            </button>
          ))}
        </div>
      </div>

      {/* CLEAN SIMPLE SEARCH BAR & VIEW TOGGLE */}
      <div className="explore-controls-card">
        <div className="explore-search-row">
          <div className="explore-search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={t('mapSearchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-mode-toggle">
            <button 
              className={viewMode === 'map' ? 'toggle-btn active' : 'toggle-btn'} 
              onClick={() => setViewMode('map')}
            >
              <FiMap /> {t('mapViewMode')}
            </button>
            <button 
              className={viewMode === 'list' ? 'toggle-btn active' : 'toggle-btn'} 
              onClick={() => setViewMode('list')}
            >
              <FiList /> {t('listViewMode')}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="explore-loading-card">
          <FiLoader className="spin-icon text-blue" />
          <p>Loading Andhra Pradesh state issues map...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="no-issues-empty-state">
          <FiAlertCircle className="empty-icon" style={{ fontSize: '2.5rem', color: '#64748B' }} />
          <h3>No Reported Issues Found in {selectedDistrict}</h3>
          <p>There are no reported issues in this filter yet. Be the first hero to report an issue!</p>
          <button className="btn-primary-report" onClick={() => navigate('/report-issue')}>
            <FiPlusCircle /> Report An Issue Now
          </button>
        </div>
      ) : viewMode === 'map' ? (
        /* MAP VIEW (LEAFLET + ANDHRA PRADESH COMPRESSED VIEW WITH PINS) */
        <div className="map-view-layout">
          <div className="map-view-main">
            <div className="map-canvas-container">
              {/* Floating state badge & Reset View button */}
              <div className="map-top-control-bar">
                <button 
                  className="btn-reset-ap"
                  onClick={handleResetAPOverview}
                  title="Reset zoom to full Andhra Pradesh view"
                >
                  {t('mapResetBtn')}
                </button>
                <span className="ap-state-badge">
                  📍 Andhra Pradesh • {filteredIssues.length} {language === 'te' ? 'పిన్‌లు' : language === 'hi' ? 'पिन' : 'Pins'}
                </span>
              </div>

              <MapContainer
                center={[activeIssueCoords.lat, activeIssueCoords.lng]}
                zoom={mapZoom}
                minZoom={6}
                maxZoom={18}
                scrollWheelZoom={true}
                className="leaflet-explore-canvas"
                style={{ width: '100%', height: '100%', borderRadius: '14px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController centerCoords={activeIssueCoords} zoomLevel={mapZoom} />

                {/* Render pins for reported issues with exact coordinates */}
                {filteredIssues.map((issue) => (
                  <Marker
                    key={issue.id || issue._id}
                    position={[issue.latitude, issue.longitude]}
                    icon={createCustomMarker(issue.status, issue.category)}
                    eventHandlers={{
                      click: () => handleIssueSelect(issue)
                    }}
                  >
                    <Popup>
                      <div className="explore-popup-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span className={`status-pill ${issue.status ? issue.status.toLowerCase().replace(/\s+/g, '-') : 'reported'}`}>
                            {issue.status}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>{issue.category}</span>
                        </div>
                        <h4 style={{ margin: '4px 0', fontSize: '0.95rem', fontWeight: 800 }}>{issue.title}</h4>
                        <p style={{ margin: '2px 0 3px 0', fontSize: '0.78rem', color: '#334155' }}>👤 {t('reportedBy')}: <strong>{issue.reporterName}</strong></p>
                        <p style={{ margin: '2px 0 6px 0', fontSize: '0.8rem', color: '#64748B' }}>📍 {issue.location}</p>
                        <div style={{ fontSize: '0.72rem', color: '#155EEF', fontFamily: 'monospace', marginBottom: '8px' }}>
                          Lat: {Number(issue.latitude).toFixed(4)} | Lng: {Number(issue.longitude).toFixed(4)}
                        </div>
                        <Link to={`/track-report/${issue.id || issue._id}`} style={{ display: 'inline-block', padding: '5px 10px', background: '#155EEF', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                          {t('trackDetails')}
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Bottom Legend */}
              <div className="map-bottom-legend">
                <div className="legend-item">
                  <span className="legend-dot red"></span> {t('legendReported')}
                </div>
                <div className="legend-item">
                  <span className="legend-dot orange"></span> {t('legendInProgress')}
                </div>
                <div className="legend-item">
                  <span className="legend-dot green"></span> {t('legendResolved')}
                </div>
              </div>
            </div>
          </div>

          {/* Side Issues List */}
          <div className="map-side-panel">
            <div className="side-panel-header">
              <h3>{language === 'te' ? 'సమస్యల జాబితా' : language === 'hi' ? 'समस्याओं की सूची' : 'Reported Issues'} ({filteredIssues.length})</h3>
            </div>

            <div className="side-issues-list">
              {filteredIssues.length === 0 ? (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748B' }}>
                  <FiAlertCircle size={36} style={{ marginBottom: '10px', color: '#94A3B8' }} />
                  <h4 style={{ margin: '0 0 6px 0', color: '#1E293B', fontWeight: 700 }}>No Reported Issues</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>Be the first hero to report a fresh civic issue in your ward!</p>
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <div 
                    key={issue.id || issue._id} 
                    className={`side-issue-item ${activeSelectedId === (issue.id || issue._id) ? 'selected-card' : ''}`}
                    onClick={() => handleIssueSelect(issue)}
                  >
                    <div className="side-item-top">
                      <h4>{issue.title}</h4>
                      <span className={`status-pill ${issue.status ? issue.status.toLowerCase().replace(/\s+/g, '-') : 'reported'}`}>
                        {issue.status}
                      </span>
                    </div>

                    <p className="side-item-loc">📍 {issue.location}</p>

                    <div className="side-item-footer">
                      <span className="category-mini-chip">{issue.category}</span>
                      <Link to={`/track-report/${issue.id || issue._id}`} className="side-item-link">
                        Track Report →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW GRID */
        <div className="issues-grid-results">
          {filteredIssues.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px border-gray-100', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <FiAlertCircle size={48} style={{ marginBottom: '12px', color: '#94A3B8' }} />
              <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontWeight: 700 }}>No Issues Reported Yet</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 16px auto' }}>All existing issues have been removed. Click below to submit a fresh report!</p>
              <Link to="/report-issue" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#155EEF', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>
                <FiPlusCircle /> Report New Issue
              </Link>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id || issue._id} className="issue-card-item">
                <div className="card-top-row">
                  <span className={`status-pill ${issue.status ? issue.status.toLowerCase().replace(/\s+/g, '-') : 'reported'}`}>
                    {issue.status}
                  </span>
                  <span className="category-tag">{issue.category}</span>
                </div>

                <h3>{issue.title}</h3>
                <p className="issue-desc-snippet">{issue.description || 'Civic issue report logged by community resident.'}</p>
                
                <div className="issue-meta-details">
                  <span>👤 {t('reportedBy')}: <strong>{issue.reporterName}</strong></span>
                  <span>📍 {issue.location}</span>
                  <span><FiCalendar /> {issue.date}</span>
                </div>

                <div className="card-footer-flex">
                  <Link to={`/track-report/${issue.id || issue._id}`} className="view-details-btn">
                    Track Report →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}