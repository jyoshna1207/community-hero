import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importing react-icons/fi (Feather icons) for a clean modern aesthetic
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // 1. Form state management
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State to track validation errors for each field
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Handle input change and clear specific errors on user input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Dynamically clear the field error when user starts typing again
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
    setSubmitError('');
  };

  // 3. Form validation logic
  const validateForm = () => {
    const newErrors = {};

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    // Confirm Password Validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    // Form is valid if no error keys exist
    return Object.keys(newErrors).length === 0;
  };

  // 4. Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (validateForm()) {
      setIsSubmitting(true);
      const result = await register(formData.fullName, formData.email, formData.password);
      setIsSubmitting(false);

      if (result.success) {
        navigate('/profile');
      } else {
        setSubmitError(result.error);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header Section */}
        <div className="register-header">
          {/* Circular logo fallback */}
          <div className="logo-avatar" aria-hidden="true">
            CH
          </div>
          <h1 className="project-title">Community Hero</h1>
          <p className="project-subtitle">
            Join the community and make a difference.
          </p>
        </div>

        {/* API Error Notification */}
        {submitError && (
          <div className="submit-error-banner" role="alert" style={{
            background: 'rgba(255, 77, 79, 0.15)',
            border: '1px solid #ff4d4f',
            color: '#ff4d4f',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'left'
          }}>
            {submitError}
          </div>
        )}

        {/* Registration Form */}
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className={`input-wrapper ${errors.fullName ? 'has-error' : ''}`}>
              <FiUser className="input-icon" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={errors.fullName ? 'true' : 'false'}
              />
            </div>
            {errors.fullName && (
              <span className="error-text" role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Address Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className={`input-wrapper ${errors.email ? 'has-error' : ''}`}>
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
            </div>
            {errors.email && (
              <span className="error-text" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className={`input-wrapper ${errors.password ? 'has-error' : ''}`}>
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
            </div>
            {errors.password && (
              <span className="error-text" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={`input-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
              <FiCheckCircle className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
            </div>
            {errors.confirmPassword && (
              <span className="error-text" role="alert">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Card Footer Link */}
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;