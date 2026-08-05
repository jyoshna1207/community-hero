import React from 'react';
import './CitizenDashboardCards.css';

export default function CitizenDashboardCards() {
  return (
    <div className="citizen-dashboard-cards-container">
      <div className="dashboard-card">
        <h3>My Reports</h3>
        <p className="card-value">12</p>
      </div>
      <div className="dashboard-card">
        <h3>In Progress</h3>
        <p className="card-value warning">3</p>
      </div>
      <div className="dashboard-card">
        <h3>Resolved Reports</h3>
        <p className="card-value success">9</p>
      </div>
      <div className="dashboard-card">
        <h3>Community Score</h3>
        <p className="card-value">85%</p>
      </div>
    </div>
  );
}