import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiMapPin, FiZap } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address or mobile is required.';
    } else if (!emailRegex.test(formData.email) && !/^\d{10}$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    const result = await register('Jyoshna Kosana', 'jyoshna@example.com', 'password123');
    setIsSubmitting(false);
    if (result.success) {
      navigate('/profile');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-card">
        {/* Left Column: Form Section */}
        <div className="auth-form-column">
          <div className="brand-header">
            <div className="brand-logo-icon">
              <FiMapPin />
            </div>
            <div className="brand-title-group">
              <span className="brand-name">Community Hero</span>
              <span className="brand-tagline">Hyperlocal Problem Solver</span>
            </div>
          </div>

          <div className="auth-title-section">
            <h1 className="auth-heading">Create Account</h1>
            <p className="auth-subheading">Join our community and help solve local issues.</p>
          </div>

          {submitError && <div className="auth-error-banner">{submitError}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Full Name Field */}
            <div className="form-field-group">
              <label htmlFor="fullName">Full Name</label>
              <div className={`input-field-wrapper ${errors.fullName ? 'has-field-error' : ''}`}>
                <FiUser className="field-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.fullName && <span className="field-error-text">{errors.fullName}</span>}
            </div>

            {/* Email Field */}
            <div className="form-field-group">
              <label htmlFor="email">Email or Mobile Number</label>
              <div className={`input-field-wrapper ${errors.email ? 'has-field-error' : ''}`}>
                <FiMail className="field-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email or mobile"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <span className="field-error-text">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-field-group">
              <label htmlFor="password">Password</label>
              <div className={`input-field-wrapper ${errors.password ? 'has-field-error' : ''}`}>
                <FiLock className="field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="field-error-text">{errors.password}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="form-field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={`input-field-wrapper ${errors.confirmPassword ? 'has-field-error' : ''}`}>
                <FiLock className="field-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error-text">{errors.confirmPassword}</span>}
            </div>

            {/* Terms Checkbox */}
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms" className="checkbox-label">
                I agree to the <a href="#terms" className="legal-link">Terms & Conditions</a> and <a href="#privacy" className="legal-link">Privacy Policy</a>
              </label>
            </div>
            {errors.agreeTerms && <span className="field-error-text">{errors.agreeTerms}</span>}

            {/* Submit Register Button */}
            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Register'} <FiArrowRight className="btn-arrow-icon" />
            </button>

            {/* OR Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>

            {/* Continue with Google */}
            <button type="button" className="btn-google" onClick={handleGoogleRegister}>
              <FcGoogle className="google-icon" /> Continue with Google
            </button>
          </form>

          <div className="auth-bottom-switch">
            <p>
              Already have an account? <Link to="/login" className="auth-switch-link">Login</Link>
            </p>
          </div>
        </div>

        {/* Right Column: Visual Hero Section */}
        <div className="auth-visual-column">
          <div className="visual-headline-box">
            <h2 className="visual-headline">Be the hero<br /><span className="headline-green">your community</span><br />needs.</h2>
          </div>

          <div className="visual-illustration-container">
            <img src="/hero_illustration.png" alt="Community Hero Register" className="hero-illustration-img" />

            {/* Status Tracker Pills */}
            <div className="status-pill-list">
              <div className="status-tracker-pill pill-reported">
                <FiCheckCircle /> Issue Reported!
              </div>
              <div className="status-tracker-pill pill-review">
                ⏳ Under Review
              </div>
              <div className="status-tracker-pill pill-progress">
                🛠️ In Progress
              </div>
              <div className="status-tracker-pill pill-resolved">
                ✅ Resolved
              </div>
            </div>

            {/* Small actions, big impact box */}
            <div className="impact-quote-box">
              <div className="quote-icon"><FiZap /></div>
              <div className="quote-text">Small actions, big impact. Solve problems together!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;