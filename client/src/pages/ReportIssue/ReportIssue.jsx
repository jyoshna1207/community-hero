import React, { useState } from 'react';
import './ReportIssue.css';

const INITIAL_FORM_STATE = {
  title: '',
  category: '',
  description: '',
  location: '',
  image: null,
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
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate individual field rules
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required.';
        } else if (value.trim().length < 5) {
          error = 'Title must be at least 5 characters long.';
        }
        break;

      case 'category':
        if (!value) {
          error = 'Please select a category.';
        }
        break;

      case 'description':
        if (!value.trim()) {
          error = 'Description is required.';
        } else if (value.trim().length < 20) {
          error = 'Description must be at least 20 characters long.';
        } else if (value.trim().length > 500) {
          error = 'Description cannot exceed 500 characters.';
        }
        break;

      case 'location':
        if (!value.trim()) {
          error = 'Location is required.';
        }
        break;

      case 'image':
        if (!value) {
          error = 'An image is required.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Run validation across all fields
  const validateForm = () => {
    const newErrors = {};

    newErrors.title = validateField('title', formData.title);
    newErrors.category = validateField('category', formData.category);
    newErrors.description = validateField('description', formData.description);
    newErrors.location = validateField('location', formData.location);
    newErrors.image = validateField('image', formData.image);

    // Remove empty error keys
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle standard text, select, and textarea input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error dynamically as the user types/selects
    if (errors[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  // Handle file select, validation, and preview setup
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please upload a valid image file (.jpg, .jpeg, or .png).',
      }));
      return;
    }

    // Update form state
    setFormData((prev) => ({ ...prev, image: file }));

    // Generate local image preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear error
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;

    setIsSubmitting(true);

    // Simulated API call reset delay
    setTimeout(() => {
      alert('Issue submitted successfully!');

      // Reset state
      setFormData(INITIAL_FORM_STATE);
      setImagePreview(null);
      setErrors({});
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="report-issue-container">
      <div className="report-issue-card">
        {/* Header Section */}
        <header className="report-issue-header">
          <h1 className="report-issue-title">Report a Community Issue</h1>
          <p className="report-issue-subtitle">
            Notice something broken or in need of attention in your neighborhood? Let us know so local authorities and community leaders can solve it together.
          </p>
        </header>

        {/* Form Section */}
        <form className="report-issue-form" onSubmit={handleSubmit} noValidate>
          {/* Issue Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Issue Title <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Deep pothole near Main Street crossroad"
              value={formData.title}
              onChange={handleChange}
              aria-invalid={!!errors.title}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="category"
              name="category"
              className={`form-select ${errors.category ? 'input-error' : ''}`}
              value={formData.category}
              onChange={handleChange}
              aria-invalid={!!errors.category}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required-star">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe the issue in detail (e.g., exact spot, potential hazards, how long it has been present)..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              aria-invalid={!!errors.description}
            />
            <div className="textarea-footer">
              {errors.description ? (
                <span className="error-text">{errors.description}</span>
              ) : (
                <span className="hint-text">Minimum 20 characters</span>
              )}
              <span className="char-count">{formData.description.length}/500</span>
            </div>
          </div>

          {/* Upload Image */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Upload Image <span className="required-star">*</span>
            </label>
            
            {!imagePreview ? (
              <div className={`file-upload-box ${errors.image ? 'input-error' : ''}`}>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={handleImageChange}
                  className="file-input-hidden"
                />
                <label htmlFor="image" className="file-upload-label">
                  <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Click or drag image to upload (.jpg, .jpeg, .png)</span>
                </label>
              </div>
            ) : (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Issue preview" className="image-preview" />
                <div className="image-info-bar">
                  <span className="image-filename">{formData.image?.name}</span>
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            {errors.image && <span className="error-text">{errors.image}</span>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className={`form-input ${errors.location ? 'input-error' : ''}`}
              placeholder="Enter area/location (e.g., Sector 4, near Central Park entrance)"
              value={formData.location}
              onChange={handleChange}
              aria-invalid={!!errors.location}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Report Issue'}
          </button>
        </form>
      </div>
    </div>
  );
}