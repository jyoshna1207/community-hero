import React from 'react';
import { aboutData } from './AboutData';
import './About.css';

export default function About() {
  return (
    <div className="about-page-container">
      <div className="about-hero">
        <h2>About Community Hero</h2>
        <p>{aboutData.overview}</p>
      </div>

      <div className="about-grid-split">
        <div className="about-card-box">
          <h3>Our Mission</h3>
          <p>{aboutData.mission}</p>
        </div>
        <div className="about-card-box">
          <h3>Core Objectives</h3>
          <ul>
            {aboutData.objectives.map((obj, idx) => <li key={idx}>{obj}</li>)}
          </ul>
        </div>
      </div>

      <div className="about-card-box">
        <h3>Technology Stack</h3>
        <div className="tech-tags-grid">
          {aboutData.techStack.map((tech, idx) => <span key={idx} className="tech-tag">{tech}</span>)}
        </div>
      </div>
    </div>
  );
}