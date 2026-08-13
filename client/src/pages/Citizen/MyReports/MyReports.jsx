import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiCalendar, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { myReportsData } from './MyReportsData';
import './MyReports.css';

export default function MyReports() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      let combined = [];

      // 1. Load locally saved reports submitted by user
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        combined = [...local];
      } catch (e) {
        console.error("Local storage error:", e);
      }

      // 2. Load API reports if authenticated
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/issues/my-reports', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && res.data.length > 0) {
            const apiMapped = res.data.map(item => ({
              id: item._id,
              _id: item._id,
              title: item.title,
              category: item.category,
              status: item.status || 'Reported',
              priority: item.aiSeverity || 'High',
              location: item.location,
              latitude: item.latitude || item.locationCoords?.lat,
              longitude: item.longitude || item.locationCoords?.lng,
              date: new Date(item.createdAt || item.reportedDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            }));

            const existingIds = new Set(combined.map(r => r.id));
            apiMapped.forEach(item => {
              if (!existingIds.has(item.id)) {
                combined.push(item);
              }
            });
          }
        } catch (err) {
          console.error("Fetch my reports error:", err);
        }
      }

      // 3. Fallback dummy data if no submitted reports
      if (combined.length === 0) {
        combined = myReportsData;
      }

      setReports(combined);
    };

    loadReports();
  }, [token]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      const updated = reports.filter(r => r.id !== id && r._id !== id);
      setReports(updated);
      try {
        const local = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        const filteredLocal = local.filter(r => r.id !== id && r._id !== id);
        localStorage.setItem('my_submitted_reports', JSON.stringify(filteredLocal));
      } catch (e) {
        console.error("Delete local storage error:", e);
      }
    }
  };

  const filteredReports = reports.filter(r => {
    const titleMatch = (r.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const locMatch = (r.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || locMatch;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="my-reports-container">
      <div className="reports-header">
        <h2>My Submitted Reports</h2>
        <p>Manage and track the progress of all issues you have reported to your ward & district officers.</p>
      </div>

      <div className="filters-card">
        <div className="search-box-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search my reports by title or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Filter by Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="dash-table my-reports-table">
          <thead>
            <tr>
              <th>Issue Title & Location</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Reported Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((rep) => (
                <tr key={rep.id || rep._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {rep.image && (
                        <img 
                          src={rep.image} 
                          alt={rep.title} 
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid #E2E8F0' }} 
                        />
                      )}
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{rep.title}</strong>
                        {rep.location && (
                          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <FiMapPin style={{ color: '#EF4444' }} />
                            <span>{rep.location}</span>
                          </div>
                        )}
                        {rep.latitude && rep.longitude && (
                          <div style={{ fontSize: '0.75rem', color: '#155EEF', fontFamily: 'monospace', marginTop: '2px' }}>
                            Lat: {Number(rep.latitude).toFixed(4)} | Lng: {Number(rep.longitude).toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{rep.category}</td>
                  <td><span className={`status-badge-custom ${rep.status ? rep.status.toLowerCase().replace(/\s+/g, '-') : 'reported'}`}>{rep.status}</span></td>
                  <td>{rep.priority || 'High'}</td>
                  <td><FiCalendar /> {rep.date}</td>
                  <td>
                    <div className="action-buttons-group">
                      <Link to={`/track-report/${rep.id || rep._id}`} className="action-icon-btn view" title="View Details"><FiEye /></Link>
                      <button onClick={() => handleDelete(rep.id || rep._id)} className="action-icon-btn delete" title="Delete"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}