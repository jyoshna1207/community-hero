import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiPlusCircle } from 'react-icons/fi';
import Button from '../Button/Button';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">Hyperlocal Problem Solver</span>
          <h1 className="hero-title">Transform Your Community Together</h1>
          <p className="hero-subtitle">
            Report civic issues instantly, track resolution progress in real-time, and collaborate with local authorities to build cleaner, safer neighborhoods.
          </p>
          <div className="hero-btn-group">
            <Button 
              text="Report Issue" 
              variant="primary" 
              icon={<FiPlusCircle />} 
              onClick={() => navigate('/report-issue')} 
            />
            <Button 
              text="View Issues" 
              variant="outline" 
              icon={<FiArrowRight />} 
              onClick={() => navigate('/issues')} 
            />
          </div>
        </div>
        <div className="hero-illustration">
          <div className="illustration-card shadow-card">
            <div className="mock-stat-box">
              <span className="mock-number">1,420+</span>
              <span className="mock-label">Issues Resolved</span>
            </div>
            <div className="mock-stat-box">
              <span className="mock-number">98%</span>
              <span className="mock-label">Response Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}