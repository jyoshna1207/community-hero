import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

export default function CreateEvent() {
  const navigate = useNavigate();

  // State for all form fields
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxVolunteers: '',
  });

  // State for validation errors and success status
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes dynamically by field name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear specific field error when the user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // Perform form validation
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time for accurate date comparison

    // Event Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Event Title is required.';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Event Title must be at least 5 characters long.';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Event Date is required.';
    } else {
      const selectedDate = new Date(formData.date);
      // Adjust timezone offset to compare raw dates correctly
      const adjustedSelectedDate = new Date(
        selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
      );
      if (adjustedSelectedDate < today) {
        newErrors.date = 'Event Date cannot be in the past.';
      }
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = 'Event Time is required.';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters long.';
    }

    // Maximum Volunteers validation
    if (!formData.maxVolunteers) {
      newErrors.maxVolunteers = 'Maximum Volunteers is required.';
    } else if (Number(formData.maxVolunteers) <= 0) {
      newErrors.maxVolunteers = 'Volunteers count must be greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (validateForm()) {
      // Success feedback
      setSuccessMessage('Event created successfully!');

      // Reset state fields
      setFormData({
        title: '',
        category: '',
        date: '',
        time: '',
        location: '',
        description: '',
        maxVolunteers: '',
      });

      // Clear any leftover errors
      setErrors({});

      // Scroll smoothly to top of card to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="create-event-container">
      {/* Top Navigation */}
      <div className="navigation-bar">
        <button
          className="btn-back"
          onClick={() => navigate('/events')}
          type="button"
        >
          &larr; Back to Events
        </button>
      </div>

      {/* Main Form Card */}
      <div className="create-event-card">
        <header className="form-header">
          <h1>Create Community Event</h1>
          <p>Organize an initiative and invite local volunteers to join hands.</p>
        </header>

        {/* Global Success Banner */}
        {successMessage && (
          <div className="alert-success">
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="event-form">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">
              Event Title <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Neighborhood Park Clean-up"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'input-error' : ''}
            >
              <option value="">Select a Category</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Plantation">Plantation</option>
              <option value="Awareness">Awareness</option>
            </select>
            {errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
          </div>

          {/* Grid Row: Date & Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                Date <span className="required-star">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time">
                Time <span className="required-star">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={errors.time ? 'input-error' : ''}
              />
              {errors.time && <span className="error-text">{errors.time}</span>}
            </div>
          </div>

          {/* Grid Row: Location & Max Volunteers */}
          <div className="form-row">
            <div className="form-group flex-2">
              <label htmlFor="location">
                Location <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g., Central Community Center"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'input-error' : ''}
              />
              {errors.location && (
                <span className="error-text">{errors.location}</span>
              )}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="maxVolunteers">
                Max Volunteers <span className="required-star">*</span>
              </label>
              <input
                type="number"
                id="maxVolunteers"
                name="maxVolunteers"
                placeholder="e.g., 20"
                min="1"
                value={formData.maxVolunteers}
                onChange={handleChange}
                className={errors.maxVolunteers ? 'input-error' : ''}
              />
              {errors.maxVolunteers && (
                <span className="error-text">{errors.maxVolunteers}</span>
              )}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required-star">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Provide details about the event, what volunteers should bring, and schedule..."
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'input-error' : ''}
            ></textarea>
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          {/* Submit Action */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}