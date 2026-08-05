import React from 'react';
import './AdminDashboardCards.css';

export default function AdminDashboardCards() {
  return (
    <div className="admin-dashboard-cards-container">
      <div className="dashboard-card">
        <h3>Total Users</h3>
        <p className="card-value">1,240</p>
      </div>
      <div className="dashboard-card">
        <h3>Total Issues</h3>
        <p className="card-value">340</p>
      </div>
      <div className="dashboard-card">
        <h3>Pending Approval</h3>
        <p className="card-value warning">45</p>
      </div>
      <div className="dashboard-card">
        <h3>Resolved Issues</h3>
        <p className="card-value success">260</p>
      </div>
    </div>
  );
}