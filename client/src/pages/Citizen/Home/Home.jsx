import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiArrowRight, FiPlusCircle, FiCheckCircle, FiClock, FiUsers, 
  FiAlertTriangle, FiCheck, FiArrowUpRight, FiSearch, FiLayers, FiZap, FiTarget, FiHeart, FiZoomIn, FiZoomOut
} from 'react-icons/fi';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [activeMarker, setActiveMarker] = useState('marker-1');

  return (
    <div className="citizen-home-container">
      {/* SCREEN 1 — TWO-COLUMN HERO SECTION */}
      <section className="hero-landing-section">
        <div className="hero-grid-container">
          {/* Left Column ~42% width */}
          <div className="hero-text-column">
            <div className="hero-badge-tag">
              <FiMapPin className="pin-badge" /> Hyperlocal Resolution Portal
            </div>
            <h1 className="hero-main-title">
              Make Your <br />
              <span className="title-highlight">Community Better.</span>
            </h1>
            <p className="hero-support-text">
              Report local problems, track their progress, and see real change happen in your neighborhood.
            </p>
            <div className="hero-cta-group">
              <Link to="/report-issue" className="btn-hero-primary">
                Report an Issue
              </Link>
              <Link to="/issues" className="btn-hero-outline">
                Explore Issues
              </Link>
            </div>
          </div>

          {/* Right Column ~58% width: Interactive Community Map */}
          <div className="hero-map-column">
            <div className="interactive-map-frame">
              {/* Map SVG background graphic */}
              <div className="map-vector-bg">
                <div className="map-grid-overlay"></div>
                <div className="road-path-1"></div>
                <div className="road-path-2"></div>
                <div className="ward-zone zone-a">Duvvada Ward 12</div>
                <div className="ward-zone zone-b">Gajuwaka Ward 4</div>

                {/* Map Status Markers */}
                <div className="map-marker marker-critical" style={{ top: '22%', left: '30%' }}>
                  <span className="marker-dot red"></span>
                  <span className="marker-pulse red"></span>
                </div>

                <div className="map-marker marker-pending" style={{ top: '65%', left: '24%' }}>
                  <span className="marker-dot orange"></span>
                </div>

                <div className="map-marker marker-resolved" style={{ top: '75%', left: '72%' }}>
                  <span className="marker-dot green"></span>
                </div>

                {/* Active Selected Marker */}
                <div className="map-marker marker-active-blue" style={{ top: '38%', left: '55%' }}>
                  <span className="marker-dot blue"></span>
                  <span className="marker-pulse blue"></span>

                  {/* Floating Issue Card */}
                  <div className="floating-issue-card">
                    <div className="floating-card-header">
                      <h4>Broken Streetlight</h4>
                      <span className="status-pill in-progress">🔵 In Progress</span>
                    </div>
                    <p className="floating-card-location">📍 Duvvada Main Road</p>
                    <div className="floating-card-footer">
                      <div className="affected-avatars">
                        <div className="avatar-stack">
                          <span className="avatar-chip a1">A</span>
                          <span className="avatar-chip a2">M</span>
                          <span className="avatar-chip a3">R</span>
                        </div>
                        <span className="affected-count">32 people affected</span>
                      </div>
                      <Link to="/issues/1" className="floating-card-link">
                        View Issue →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Zoom Controls */}
              <div className="map-zoom-controls">
                <button aria-label="Zoom in"><FiZoomIn /></button>
                <div className="zoom-divider"></div>
                <button aria-label="Zoom out"><FiZoomOut /></button>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}