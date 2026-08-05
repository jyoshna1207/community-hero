import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiList, FiCheckCircle, FiClock, FiUsers, FiAlertTriangle, FiShield, FiTrendingUp } from 'react-icons/fi';
import { homeStats, featureCards, latestIssues, successStories } from './HomeData';
import './Home.css';

export default function Home() {
  return (
    <div className="citizen-home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge"><FiShield /> Hyperlocal Problem Solver</span>
          <h1>Transform Your Community Together</h1>
          <p>Report civic issues instantly, track resolution progress in real-time, and collaborate with local authorities to build cleaner, safer neighborhoods.</p>
          <div className="hero-buttons">
            <Link to="/report-issue" className="btn-primary">
              <FiPlusCircle /> Report Issue
            </Link>
            <Link to="/issues" className="btn-secondary">
              <FiList /> View Issues
            </Link>
          </div>
        </div>
        <div className="hero-stats-preview">
          <div className="preview-stat-card">
            <h3>{homeStats.resolvedCount}</h3>
            <span>Issues Resolved</span>
          </div>
          <div className="preview-stat-card">
            <h3>{homeStats.responseRate}</h3>
            <span>Response Rate</span>
          </div>
        </div>
      </section>

      {/* Statistics Cards Section */}
      <section className="stats-grid-section">
        <div className="stat-card-item">
          <FiAlertTriangle className="stat-icon warning" />
          <div>
            <h3>{homeStats.totalIssues}</h3>
            <p>Total Issues</p>
          </div>
        </div>
        <div className="stat-card-item">
          <FiCheckCircle className="stat-icon success" />
          <div>
            <h3>{homeStats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card-item">
          <FiClock className="stat-icon pending" />
          <div>
            <h3>{homeStats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card-item">
          <FiUsers className="stat-icon users" />
          <div>
            <h3>{homeStats.citizens}</h3>
            <p>Active Citizens</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How Community Hero Works</h2>
        <p className="section-subtitle">Empowering citizens to drive neighborhood improvements in 3 simple steps</p>
        <div className="features-grid">
          {featureCards.map((feat) => (
            <div key={feat.id} className="feature-card">
              <div className="feat-icon-wrapper">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Community Issues */}
      <section className="latest-issues-section">
        <div className="section-header-flex">
          <h2>Latest Community Issues</h2>
          <Link to="/issues" className="view-all-link">View All Issues →</Link>
        </div>
        <div className="issues-mini-grid">
          {latestIssues.map((issue) => (
            <div key={issue.id} className="mini-issue-card">
              <span className={`status-pill ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>{issue.status}</span>
              <h4>{issue.title}</h4>
              <p className="mini-location">📍 {issue.location}</p>
              <Link to={`/issues/${issue.id}`} className="details-link">View Details</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories-section">
        <h2>Community Success Stories</h2>
        <div className="stories-grid">
          {successStories.map((story) => (
            <div key={story.id} className="story-card">
              <img src={story.image} alt={story.title} />
              <div className="story-content">
                <h4>{story.title}</h4>
                <p>{story.description}</p>
                <span className="story-ward">Ward: {story.ward}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of active citizens reporting problems and transforming their communities today.</p>
          <Link to="/report-issue" className="btn-primary-large">Report an Issue Now</Link>
        </div>
      </section>
    </div>
  );
}