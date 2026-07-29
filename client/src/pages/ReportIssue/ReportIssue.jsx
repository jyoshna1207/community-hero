import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaRobot, FaMapMarkerAlt, FaVideo, FaImage, FaBolt, FaCheckCircle } from 'react-icons/fa';
import './ReportIssue.css';

const INITIAL_FORM_STATE = {
  title: '',
  category: '',
  description: '',
  location: '',
  locationCoords: { lat: 17.6868, lng: 83.2185 },
  image: null,
  video: null,
};

const CATEGORIES = [
  'Waste Management',
  'Roads',
  'Water Supply',
  'Electricity',
  'Street Lights',
  'Drainage',
  'Public Safety',
  'Parks',
  'Other',
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  
  // AI Auto-Classification State
  const [aiData, setAiData] = useState(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Validate field rules
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'title':
        if (!value.trim()) error = 'Title is required.';
        else if (value.trim().length < 5) error = 'Title must be at least 5 characters long.';
        break;
      case 'category':
        if (!value) error = 'Please select a category.';
        break;
      case 'description':
        if (!value.trim()) error = 'Description is required.';
        else if (value.trim().length < 20) error = 'Description must be at least 20 characters long.';
        break;
      case 'location':
        if (!value.trim()) error = 'Location is required.';
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.title = validateField('title', formData.title);
    newErrors.category = validateField('category', formData.category);
    newErrors.description = validateField('description', formData.description);
    newErrors.location = validateField('location', formData.location);

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');

    if (errors[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  // AI Auto-Analysis Handler
  const handleAiAnalyze = async () => {
    if (!formData.title && !formData.description) {
      setSubmitError('Please enter a title or description first for the AI scanner to analyze.');
      return;
    }

    setIsAnalyzingAi(true);
    setSubmitError('');

    try {
      const res = await axios.post('http://localhost:5000/api/issues/ai-analyze', {
        title: formData.title,
        description: formData.description,
      });

      setAiData(res.data);
      setFormData((prev) => ({
        ...prev,
        category: res.data.category || prev.category,
      }));
    } catch (err) {
      console.error('AI analysis error:', err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Detect GPS Location
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: `GPS: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Detected)`,
          locationCoords: { lat: latitude, lng: longitude },
        }));
        setDetectingGps(false);
      },
      (err) => {
        console.error('GPS error:', err);
        setFormData((prev) => ({
          ...prev,
          location: 'MVP Colony Main Intersection, Visakhapatnam',
          locationCoords: { lat: 17.7412, lng: 83.3312 },
        }));
        setDetectingGps(false);
      }
    );
  };

  // Media Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, video: file }));

    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit Handler with +50 XP Reward
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!user || !token) {
      setSubmitError('You must be logged in to report an issue. Please log in first.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        locationCoords: formData.locationCoords,
        image: imagePreview || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
        video: videoPreview || '',
        aiSeverity: aiData?.aiSeverity || 'High',
        aiPriorityScore: aiData?.aiPriorityScore || 85,
        aiEstimatedDays: aiData?.aiEstimatedDays || 2,
        aiTags: aiData?.aiTags || ['#CitizenReport', '#CommunityHero'],
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post('http://localhost:5000/api/issues', payload, config);

      if (res.status === 201) {
        setSubmitSuccess('🎉 Issue submitted! You earned +50 Hero XP Points!');
        setFormData(INITIAL_FORM_STATE);
        setImagePreview(null);
        setVideoPreview(null);
        setAiData(null);

        setTimeout(() => navigate('/issues'), 1800);
      }
    } catch (err) {
      console.error('Submit issue error:', err);
      const errMsg = err.response?.data?.message || 'Failed to submit report. Please try again.';
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-issue-container">
      <div className="report-issue-card">
        <header className="report-issue-header">
          <div className="xp-reward-badge">
            <FaBolt className="bolt-icon" /> +50 XP Reward
          </div>
          <h1 className="report-issue-title">Report a Hyperlocal Issue</h1>
          <p className="report-issue-subtitle">
            Upload photos, video proof, and use AI scanning to notify municipal authorities and earn Hero Points!
          </p>
        </header>

        {submitError && <div className="error-banner">{submitError}</div>}
        {submitSuccess && <div className="success-banner">{submitSuccess}</div>}

        <form className="report-issue-form" onSubmit={handleSubmit} noValidate>
          {/* Issue Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">Issue Title <span className="required-star">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Severe Pothole near MVP Colony main junction"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description & Details <span className="required-star">*</span></label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe the issue in detail (e.g., exact spot, depth of pothole, water leakage rate, hazard level)..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* AI Scanner Button & Banner */}
          <div className="ai-scanner-section">
            <button
              type="button"
              className="btn-ai-scan"
              onClick={handleAiAnalyze}
              disabled={isAnalyzingAi || isSubmitting}
            >
              <FaRobot className="robot-icon" />
              {isAnalyzingAi ? 'Analyzing with AI Engine...' : '🤖 Auto-Analyze & Classify with AI'}
            </button>

            {aiData && (
              <div className="ai-result-box">
                <div className="ai-result-header">
                  <span className="ai-badge">AI Analysis Result</span>
                  <span className="ai-score">Priority Score: <strong>{aiData.aiPriorityScore}/100</strong></span>
                </div>
                <div className="ai-tags-row">
                  <span className={`ai-severity-chip ${aiData.aiSeverity.toLowerCase()}`}>
                    Severity: {aiData.aiSeverity}
                  </span>
                  {aiData.aiTags?.map((tag, idx) => (
                    <span key={idx} className="ai-tag-chip">{tag}</span>
                  ))}
                </div>
                <p className="ai-dept-info">Suggested Department: <strong>{aiData.suggestedDept}</strong> (Est. Fix: {aiData.aiEstimatedDays} Days)</p>
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category <span className="required-star">*</span></label>
            <select
              id="category"
              name="category"
              className={`form-select ${errors.category ? 'input-error' : ''}`}
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Location & GPS Button */}
          <div className="form-group">
            <div className="location-label-row">
              <label htmlFor="location" className="form-label">Location / Landmark <span className="required-star">*</span></label>
              <button type="button" className="btn-gps" onClick={handleDetectGps} disabled={detectingGps}>
                <FaMapMarkerAlt /> {detectingGps ? 'Locating...' : 'Detect GPS Location'}
              </button>
            </div>
            <input
              type="text"
              id="location"
              name="location"
              className={`form-input ${errors.location ? 'input-error' : ''}`}
              placeholder="e.g., Gajuwaka Main Road, near Community Center"
              value={formData.location}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label"><FaImage /> Photo Upload</label>
            {!imagePreview ? (
              <div className="file-upload-box">
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="file-input-hidden" />
                <label htmlFor="image" className="file-upload-label">Click or Drag Photo to Upload (.jpg, .png)</label>
              </div>
            ) : (
              <div className="media-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="media-preview" />
                <button type="button" className="remove-media-btn" onClick={() => setImagePreview(null)}>Remove Photo</button>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="form-group">
            <label className="form-label"><FaVideo /> Video Proof Upload (Optional)</label>
            {!videoPreview ? (
              <div className="file-upload-box">
                <input type="file" id="video" accept="video/*" onChange={handleVideoChange} className="file-input-hidden" />
                <label htmlFor="video" className="file-upload-label">Click or Drag Short Video Clip (.mp4, .webm)</label>
              </div>
            ) : (
              <div className="media-preview-wrapper">
                <video src={videoPreview} controls className="media-preview" />
                <button type="button" className="remove-media-btn" onClick={() => setVideoPreview(null)}>Remove Video</button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Report...' : '🚀 Submit Report & Claim +50 XP'}
          </button>
        </form>
      </div>
    </div>
  );
}