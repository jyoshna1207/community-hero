import React from 'react';
import './OfficerDashboardCards.css';

export default function OfficerDashboardCards() {
  return (
    <div className="officer-dashboard-cards-container">
      <div className="dashboard-card">
        <h3>Pending Verification</h3>
        <p className="card-value warning">8</p>
      </div>
      <div className="dashboard-card">
        <h3>Assigned Today</h3>
        <p className="card-value">5</p>
      </div>
      <div className="dashboard-card">
        <h3>Verified Today</h3>
        <p className="card-value success">12</p>
      </div>
      <div className="dashboard-card">
        <h3>Escalated Issues</h3>
        <p className="card-value danger">2</p>
      </div>
    </div>
  );
}