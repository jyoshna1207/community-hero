import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartLine, FaExclamationTriangle, FaCloudRain, FaLightbulb, FaShieldAlt, FaWater, FaRoad } from 'react-icons/fa';
import './Insights.css';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/issues/insights');
        setInsights(res.data);
      } catch (err) {
        console.error('Failed to load insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="insights-page-container">
      <header className="insights-header">
        <div className="header-icon-badge cyan-badge">
          <FaChartLine className="insights-header-icon" />
        </div>
        <h1 className="insights-title">AI Predictive Infrastructure Insights</h1>
        <p className="insights-subtitle">
          Intelligent machine learning analysis predicting high-risk zones, seasonal hazard patterns, and municipal repair priority.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.2rem' }}>Running AI Predictive Infrastructure Analysis...</p>
        </div>
      ) : (
        <>
          {/* Top Impact Banner */}
          <section className="impact-banner-grid">
            <div className="impact-card">
              <div className="impact-icon-wrapper water-bg">
                <FaWater className="impact-icon" />
              </div>
              <div className="impact-info">
                <span className="impact-value">18,500 L</span>
                <span className="impact-label">Clean Water Saved</span>
              </div>
            </div>

            <div className="impact-card">
              <div className="impact-icon-wrapper road-bg">
                <FaRoad className="impact-icon" />
              </div>
              <div className="impact-info">
                <span className="impact-value">34 Seams</span>
                <span className="impact-label">Potholes Repaired</span>
              </div>
            </div>

            <div className="impact-card">
              <div className="impact-icon-wrapper light-bg">
                <FaLightbulb className="impact-icon" />
              </div>
              <div className="impact-info">
                <span className="impact-value">52 Grid Bulbs</span>
                <span className="impact-label">Streetlights Restored</span>
              </div>
            </div>

            <div className="impact-card">
              <div className="impact-icon-wrapper score-bg">
                <FaShieldAlt className="impact-icon" />
              </div>
              <div className="impact-info">
                <span className="impact-value">89 / 100</span>
                <span className="impact-label">Civic Health Index</span>
              </div>
            </div>
          </section>

          {/* Hotspot Predictions */}
          <section className="insights-section-card">
            <h2 className="section-title">
              <FaExclamationTriangle className="title-icon text-amber" /> High-Risk Infrastructure Hotspots
            </h2>
            <p className="section-desc">AI risk models evaluated based on historical report clusters, weather telemetry, and citizen verifications.</p>

            <div className="hotspot-grid">
              {insights?.hotspots?.map((item, idx) => (
                <div key={idx} className="hotspot-card">
                  <div className="hotspot-header">
                    <span className="zone-name">{item.zone}</span>
                    <span className={`risk-badge ${item.riskLevel.includes('Critical') ? 'badge-critical' : 'badge-high'}`}>
                      {item.riskLevel}
                    </span>
                  </div>
                  <div className="hotspot-body">
                    <div className="hotspot-detail-item">
                      <span className="detail-label">Primary Risk Factor:</span>
                      <span className="detail-value">{item.primaryIssue}</span>
                    </div>
                    <div className="hotspot-detail-item">
                      <span className="detail-label">AI Recommended Intervention:</span>
                      <span className="detail-value text-emerald">{item.recommendedAction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Seasonal Forecast Section */}
          <section className="insights-section-card">
            <h2 className="section-title">
              <FaCloudRain className="title-icon text-blue" /> Seasonal Hazard Forecast & Risk Timeline
            </h2>
            <div className="seasonal-list">
              {insights?.seasonalForecast?.map((item, idx) => (
                <div key={idx} className="seasonal-item">
                  <h3 className="seasonal-title">{item.season}</h3>
                  <p className="seasonal-desc">{item.forecast}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
