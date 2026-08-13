import React, { useState } from 'react';
import { 
  FiCheckCircle, FiUploadCloud, FiAlertTriangle, FiDroplet, 
  FiTrash2, FiSun, FiWind, FiHome, FiHelpCircle, FiCheck, FiMapPin 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import AddLocationPicker from '../../../components/Common/AddLocationPicker/AddLocationPicker';
import './ReportIssue.css';

export default function ReportIssue() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Road Damage');
  const [locationAddress, setLocationAddress] = useState('Duvvada, Visakhapatnam, Andhra Pradesh');
  const [locationCoords, setLocationCoords] = useState({ latitude: 17.6868, longitude: 83.2185 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [issueDetails, setIssueDetails] = useState({
    title: 'Large Pothole Near Main Road',
    description: '',
    photo: null
  });

  const categories = [
    { name: 'Road Damage', icon: <FiAlertTriangle /> },
    { name: 'Water Leakage', icon: <FiDroplet /> },
    { name: 'Garbage & Waste', icon: <FiTrash2 /> },
    { name: 'Streetlight', icon: <FiSun /> },
    { name: 'Drainage', icon: <FiWind /> },
    { name: 'Infrastructure', icon: <FiHome /> },
    { name: 'Other Issue', icon: <FiHelpCircle /> },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const [submittedReportId, setSubmittedReportId] = useState('CH-2026-00124');

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    const generatedId = `CH-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport = {
      _id: generatedId,
      id: generatedId,
      title: issueDetails.title || 'Civic Issue Report',
      category: selectedCategory === 'Road Damage' ? 'Roads' : selectedCategory,
      description: issueDetails.description || 'Reported civic issue requiring municipal attention at specified location.',
      location: locationAddress,
      latitude: locationCoords.latitude,
      longitude: locationCoords.longitude,
      locationCoords: { lat: locationCoords.latitude, lng: locationCoords.longitude },
      status: 'Reported',
      priority: 'High',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    try {
      const payload = {
        title: newReport.title,
        category: newReport.category,
        description: newReport.description,
        location: locationAddress,
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        locationCoords: { lat: locationCoords.latitude, lng: locationCoords.longitude }
      };

      if (token) {
        const res = await axios.post('http://localhost:5000/api/issues', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && res.data._id) {
          newReport._id = res.data._id;
          newReport.id = res.data._id;
        }
      }
    } catch (err) {
      console.error("Submit issue error:", err);
    } finally {
      try {
        const existing = JSON.parse(localStorage.getItem('my_submitted_reports') || '[]');
        localStorage.setItem('my_submitted_reports', JSON.stringify([newReport, ...existing]));
      } catch (e) {
        console.error("Storage error:", e);
      }

      setSubmittedReportId(newReport.id);
      setIsSubmitting(false);
      setCurrentStep(4);
    }
  };

  return (
    <div className="report-guided-page">
      {/* STEP PROGRESS INDICATOR (1 — 2 — 3 — 4) */}
      <div className="progress-stepper">
        <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>
          {currentStep > 1 ? <FiCheck /> : '1'}
        </div>
        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>

        <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>
          {currentStep > 2 ? <FiCheck /> : '2'}
        </div>
        <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>

        <div className={`step-circle ${currentStep >= 3 ? 'active' : ''}`}>
          {currentStep > 3 ? <FiCheck /> : '3'}
        </div>
        <div className={`step-line ${currentStep >= 4 ? 'active' : ''}`}></div>

        <div className={`step-circle ${currentStep === 4 ? 'active' : ''}`}>
          4
        </div>
      </div>

      {/* STEP 1: CATEGORY SELECTOR */}
      {currentStep === 1 && (
        <div className="guided-step-card animate-fade-in">
          <h1>What's the issue?</h1>
          <p className="guided-subtitle">Select the category</p>

          <div className="category-2col-grid">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className={`category-item-card ${selectedCategory === cat.name ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="cat-icon-box">{cat.icon}</div>
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>

          <div className="guided-actions-footer">
            <button className="btn-guided-next" onClick={handleNext}>
              Continue to Location →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ADD LOCATION (LEAFLET + REACT-LEAFLET + OSM) */}
      {currentStep === 2 && (
        <div className="guided-step-card animate-fade-in" style={{ padding: '20px' }}>
          <AddLocationPicker 
            initialAddress={locationAddress}
            initialCoords={{ latitude: locationCoords.latitude, longitude: locationCoords.longitude }}
            onLocationSelect={({ latitude, longitude, lat, lng, address }) => {
              const selectedLat = latitude ?? lat;
              const selectedLng = longitude ?? lng;
              setLocationAddress(address);
              setLocationCoords({ latitude: selectedLat, longitude: selectedLng });
            }}
          />

          <div className="guided-actions-footer" style={{ marginTop: '16px' }}>
            <button className="btn-guided-back" onClick={handleBack}>
              ← Back
            </button>
            <button className="btn-guided-next" onClick={handleNext}>
              Confirm Location →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS & PHOTO UPLOAD */}
      {currentStep === 3 && (
        <div className="guided-step-card animate-fade-in">
          <h1>Add Details & Photo</h1>
          <p className="guided-subtitle">Provide context to help officers verify quickly</p>

          {/* Confirmed Location Badge */}
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
              <FiMapPin /> Confirmed Problem Location
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803D' }}>{locationAddress}</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.825rem', fontFamily: 'monospace', color: '#166534' }}>
              <span>Latitude: {locationCoords.latitude?.toFixed(6)}</span>
              <span>Longitude: {locationCoords.longitude?.toFixed(6)}</span>
            </div>
          </div>

          <div className="guided-form-group">
            <label>Issue Title</label>
            <input 
              type="text" 
              value={issueDetails.title}
              onChange={(e) => setIssueDetails({...issueDetails, title: e.target.value})}
              placeholder="e.g. Large pothole near main road"
            />
          </div>

          <div className="guided-form-group">
            <label>Description</label>
            <textarea 
              rows="4" 
              value={issueDetails.description}
              onChange={(e) => setIssueDetails({...issueDetails, description: e.target.value})}
              placeholder="Describe the issue size, hazard, or how long it has persisted..."
            ></textarea>
          </div>

          <div className="guided-form-group">
            <label>Photo Evidence</label>
            <div className="photo-upload-box">
              <FiUploadCloud className="upload-icon" />
              <span>Tap or drag photo evidence here</span>
            </div>
          </div>

          <div className="guided-actions-footer">
            <button className="btn-guided-back" onClick={handleBack} disabled={isSubmitting}>
              ← Back
            </button>
            <button className="btn-guided-next" onClick={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Report...' : 'Submit Report 🎉'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REPORT SUCCESS SCREEN */}
      {currentStep === 4 && (
        <div className="success-screen-card animate-fade-in">
          <div className="large-green-checkmark">
            <FiCheckCircle />
          </div>

          <h1>Report Submitted Successfully 🎉</h1>
          <p className="success-subtitle">
            Your report has been submitted to {(() => {
              if (!locationAddress) return 'the local Ward & District Officers';
              const parts = locationAddress.split(',').map(p => p.trim()).filter(Boolean);
              if (parts.length === 0) return 'the local Ward & District Officers';
              const locality = parts[0];
              const district = parts.length >= 3 ? parts[2] : (parts.length >= 2 ? parts[1] : null);
              if (district && district !== locality) {
                return `${locality} Ward Officers & ${district} District Officers`;
              }
              return `${locality} Ward & District Officers`;
            })()}.
          </p>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 16px',
            margin: '16px 0',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>SAVED COORDINATES:</p>
            <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 700, color: '#155EEF' }}>
              Latitude: {locationCoords.latitude?.toFixed(6)} | Longitude: {locationCoords.longitude?.toFixed(6)}
            </p>
          </div>

          <div className="report-id-pill">
            <span className="id-label">Report ID:</span>
            <span className="id-value">{submittedReportId}</span>
          </div>

          <div className="success-cta-group">
            <button className="btn-track-report" onClick={() => navigate(`/track-report/${submittedReportId}`)}>
              Track Your Report
            </button>
            <button className="btn-back-home" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}