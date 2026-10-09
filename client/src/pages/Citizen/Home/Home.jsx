import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiArrowRight, FiPlusCircle, FiCheckCircle, FiClock, FiUsers, 
  FiAlertTriangle, FiCheck, FiArrowUpRight, FiSearch, FiLayers, FiZap, FiTarget, FiHeart, FiZoomIn, FiZoomOut
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeMarker, setActiveMarker] = useState('marker-1');

  const role = (user?.role || '').toLowerCase().trim();
  const isAdmin = role === 'admin';
  const isOfficer = role.includes('ward') || role === 'officer' || role === 'ward_officer';
  const isDept = role.includes('district') || role.includes('dept') || role === 'department';
  const userDashboardPath = isAdmin 
    ? '/admin/dashboard' 
    : isOfficer 
    ? '/ward-dashboard' 
    : isDept 
    ? '/department/dashboard' 
    : '/dashboard';

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
              Report local civic problems, track their repair progress in real time, and see tangible change happen in your neighborhood.
            </p>

            <div className="hero-cta-group">
              {user ? (
                <>
                  <Link to={userDashboardPath} className="btn-hero-primary">
                    Go to My Dashboard →
                  </Link>
                  <Link to="/report-issue" className="btn-hero-outline">
                    <FiPlusCircle style={{ marginRight: '6px' }} /> Report an Issue
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/report-issue" className="btn-hero-primary">
                    Report an Issue
                  </Link>
                  <Link to="/issues" className="btn-hero-outline">
                    Explore Issues Map
                  </Link>
                  <Link to="/login" style={{ padding: '12px 18px', color: '#D97706', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                    Select Portal →
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column ~58% width: Interactive Community Map Graphic */}
          <div className="hero-map-column">
            <div className="interactive-map-frame">
              {/* Map SVG background graphic */}
              <div className="map-vector-bg">
                <div className="map-grid-overlay"></div>
                <div className="road-path-1"></div>
                <div className="road-path-2"></div>
                <div className="ward-zone zone-a">Thondangi Mandal</div>
                <div className="ward-zone zone-b">Pydikonda Ward</div>

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
                    <p className="floating-card-location">📍 Pydikonda Main Road</p>
                    <div className="floating-card-footer">
                      <div className="affected-avatars">
                        <div className="avatar-stack">
                          <span className="avatar-chip a1">A</span>
                          <span className="avatar-chip a2">M</span>
                          <span className="avatar-chip a3">R</span>
                        </div>
                        <span className="affected-count">32 people affected</span>
                      </div>
                      <Link to="/issues" className="floating-card-link">
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

        {/* Live Impact Statistics Bar */}
        <div className="hero-stats-bar">
          <div className="stat-box">
            <h2>12,500+</h2>
            <p>Civic Issues Resolved</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <h2>98.4%</h2>
            <p>SLA Resolution Rate</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <h2>&lt; 36 hrs</h2>
            <p>Average Inspection Turnaround</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <h2>100%</h2>
            <p>Photographic Proof Verification</p>
          </div>
        </div>
      </section>

      {/* SCREEN 2 — HOW IT WORKS FLOW */}
      <section className="how-it-works-dark-section">
        <div className="dark-section-container">
          <div className="dark-header">
            <h2>How Community Hero Works</h2>
            <p>Transparent civic accountability from initial citizen report to verified municipal completion.</p>
          </div>

          <div className="steps-flow-grid">
            <div className="step-card">
              <div className="step-num-badge">STEP 01</div>
              <div className="step-icon-circle">📍</div>
              <h3>Spot & Report</h3>
              <p>Snap a photo or record voice description. Auto geo-tagged with GPS coordinates and routed to the ward team.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-num-badge">STEP 02</div>
              <div className="step-icon-circle">🛡️</div>
              <h3>Officer Verification</h3>
              <p>Ward Inspector validates the civic defect, assesses urgency rating, and assigns ticket to maintenance branch.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-num-badge">STEP 03</div>
              <div className="step-icon-circle">⚡</div>
              <h3>Municipal Action</h3>
              <p>Assigned work crews fix the road, water line, or streetlight with real-time milestone progress updates.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-num-badge">STEP 04</div>
              <div className="step-icon-circle">✅</div>
              <h3>Citizen Confirmation</h3>
              <p>Resolution photo uploaded for community review. Citizens vote to verify completed repair work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN 3 — DEDICATED PORTAL SELECTION HUB */}
      <section style={{ maxWidth: '1400px', margin: '56px auto', padding: '0 24px 64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Select Your Workspace Portal
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Choose your role to access specialized telemetry, issue dispatch queues, and administrative tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
          {/* Citizen Portal Card */}
          <div style={{ background: '#FFFFFF', border: '1.5px solid #FED7AA', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              👤
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Citizen Portal</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Report neighborhood potholes, broken streetlights, and pipeline leaks. Track live status in your ward.
              </p>
            </div>
            <Link to="/login/citizen" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
              Enter Citizen Portal →
            </Link>
          </div>

          {/* Ward Officer Portal Card */}
          <div style={{ background: '#FFFFFF', border: '1.5px solid #BFDBFE', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              🛡️
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Ward Officer</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Inspect filed reports in your ward, verify priority scores, and dispatch repairs to municipal crews.
              </p>
            </div>
            <Link to="/login/officer" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
              Enter Officer Portal →
            </Link>
          </div>

          {/* Department Portal Card */}
          <div style={{ background: '#FFFFFF', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              🏗️
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Department Operations</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Public Works, Sanitation & Water teams manage repair orders, update progress, and log proof photos.
              </p>
            </div>
            <Link to="/login/department" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
              Enter Department Portal →
            </Link>
          </div>

          {/* Admin Portal Card */}
          <div style={{ background: '#FFFFFF', border: '1.5px solid #FECACA', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(220, 38, 38, 0.08)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              🏛️
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>Municipal Admin</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                City-wide resolution telemetry, ward heatmaps, SLA turnaround auditing, and personnel control.
              </p>
            </div>
            <Link to="/login/admin" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}>
              Enter Admin Portal →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}