import React, { useState } from 'react';
import { FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import { categoriesList, wardsList, priorityList } from './ReportIssueData';
import './ReportIssue.css';

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Waste Management',
    description: '',
    location: '',
    ward: 'Ward 1',
    priority: 'Medium',
    image: null
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: 'Waste Management',
      description: '',
      location: '',
      ward: 'Ward 1',
      priority: 'Medium',
      image: null
    });
    setSubmitted(false);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      setErrorMsg('Please fill in all required fields (Title, Location, Description).');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <div className="report-issue-container">
      <div className="report-header">
        <h2>Report a Civic Issue</h2>
        <p>Help local authorities fix problems in your neighborhood quickly by providing accurate details.</p>
      </div>

      {submitted ? (
        <div className="success-message-card">
          <FiCheckCircle className="success-icon" />
          <h3>Issue Submitted Successfully!</h3>
          <p>Your report has been logged and assigned tracking ID <strong>#REP-9821</strong>. Local ward officers have been notified.</p>
          <button onClick={handleReset} className="btn-primary">Report Another Issue</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="report-form-card">
          {errorMsg && <div className="error-alert">{errorMsg}</div>}

          <div className="form-group">
            <label>Issue Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Large pothole near main crossroad" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categoriesList.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ward *</label>
              <select name="ward" value={formData.ward} onChange={handleChange}>
                {wardsList.map((w, idx) => (
                  <option key={idx} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location / Landmark *</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="e.g. Near Central Park Gate 2, Street 4" 
            />
          </div>

          <div className="form-group">
            <label>Priority Level *</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              {priorityList.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea 
              name="description" 
              rows="4" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Provide specific details about the problem and how long it has persisted..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Image Evidence Placeholder</label>
            <div className="image-upload-placeholder">
              <FiUploadCloud className="upload-icon" />
              <span>Drag & drop image here or click to browse</span>
              <span className="upload-hint">(Supports JPG, PNG up to 10MB)</span>
            </div>
          </div>

          <div className="form-buttons-flex">
            <button type="button" onClick={handleReset} className="btn-secondary-outline">Reset Form</button>
            <button type="submit" className="btn-primary">Submit Report</button>
          </div>
        </form>
      )}
    </div>
  );
}