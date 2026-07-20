import React, { useState } from 'react';
// Importing react-icons/fi (Feather icons) for a clean modern aesthetic
import { FiUser, FiMail, FiLock, FiCheckCircle } from 'react-icons/fi';
import './Register.css';

const Register = () => {
  // 1. Form state management
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State to track validation errors for each field
  const [errors, setErrors] = useState({});

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
    // Requires: >=8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must contain an uppercase letter, lowercase letter, number, and special character.';
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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert('Registration Successful!');
      // Reset form after successful submission
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
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
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>

        {/* Card Footer Link */}
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <a href="#login" className="login-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;