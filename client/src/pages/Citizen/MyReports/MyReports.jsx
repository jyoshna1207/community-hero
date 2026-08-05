import React, { useState } from 'react';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { myReportsData } from './MyReportsData';
import './MyReports.css';

export default function MyReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reports, setReports] = useState(myReportsData);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="my-reports-container">
      <div className="reports-header">
        <h2>My Submitted Reports</h2>
        <p>Manage and track the progress of all issues you have reported to the municipal authorities.</p>
      </div>

      <div className="filters-card">
        <div className="search-box-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search my reports..." 
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
              <th>Issue Title</th>
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
                <tr key={rep.id}>
                  <td><strong>{rep.title}</strong></td>
                  <td>{rep.category}</td>
                  <td><span className={`status-badge-custom ${rep.status.toLowerCase().replace(/\s+/g, '-')}`}>{rep.status}</span></td>
                  <td>{rep.priority}</td>
                  <td><FiCalendar /> {rep.date}</td>
                  <td>
                    <div className="action-buttons-group">
                      <Link to={`/issues/${rep.id}`} className="action-icon-btn view" title="View"><FiEye /></Link>
                      <button className="action-icon-btn edit" title="Edit"><FiEdit /></button>
                      <button onClick={() => handleDelete(rep.id)} className="action-icon-btn delete" title="Delete"><FiTrash2 /></button>
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