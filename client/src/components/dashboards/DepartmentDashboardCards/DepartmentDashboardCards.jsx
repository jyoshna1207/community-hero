import React from 'react';
import './DepartmentDashboardCards.css';

export default function DepartmentDashboardCards() {
  return (
    <div className="department-dashboard-cards-container">
      <div className="dashboard-card">
        <h3>Assigned Jobs</h3>
        <p className="card-value">18</p>
      </div>
      <div className="dashboard-card">
        <h3>In Progress</h3>
        <p className="card-value warning">7</p>
      </div>
      <div className="dashboard-card">
        <h3>Completed Work</h3>
        <p className="card-value success">9</p>
      </div>
      <div className="dashboard-card">
        <h3>Delayed Tasks</h3>
        <p className="card-value danger">2</p>
      </div>
    </div>
  );
}