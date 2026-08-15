import React from 'react';
import { 
  FiClipboard, FiAlertCircle, FiClock, FiCheckCircle, 
  FiAlertTriangle, FiActivity, FiShield 
} from 'react-icons/fi';
import './OfficerDashboardCards.css';

export default function OfficerDashboardCards({ metrics = {} }) {
  const {
    total = 0,
    pendingVerification = 0,
    inProgress = 0,
    resolved = 0,
    critical = 0,
  } = metrics;

  return (
    <div className="kpi-cards-grid officer-kpi-grid">
      {/* Card 1: Total Reports */}
      <div className="kpi-card">
        <div className="kpi-val-group">
          <span className="kpi-num">{total}</span>
          <p className="kpi-label">Total Ward Reports</p>
        </div>
        <div className="kpi-trend trend-blue">
          <FiClipboard /> <span>Citizen logged issues in ward</span>
        </div>
      </div>

      {/* Card 2: Pending Verification */}
      <div className="kpi-card">
        <div className="kpi-val-group">
          <span className="kpi-num">{pendingVerification}</span>
          <p className="kpi-label">Pending Verification</p>
        </div>
        <div className="kpi-trend trend-orange">
          <FiAlertCircle /> <span>Awaiting officer inspection</span>
        </div>
      </div>

      {/* Card 3: In Progress */}
      <div className="kpi-card">
        <div className="kpi-val-group">
          <span className="kpi-num">{inProgress}</span>
          <p className="kpi-label">In Progress</p>
        </div>
        <div className="kpi-trend trend-blue">
          <FiClock /> <span>Under active repair by departments</span>
        </div>
      </div>

      {/* Card 4: Resolved */}
      <div className="kpi-card">
        <div className="kpi-val-group">
          <span className="kpi-num">{resolved}</span>
          <p className="kpi-label">Resolved & Verified</p>
        </div>
        <div className="kpi-trend trend-up">
          <FiCheckCircle /> <span>Successfully closed resolutions</span>
        </div>
      </div>
    </div>
  );
}