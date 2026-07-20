import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Importing react-icons/fi (Feather icons) for consistent modern design
import { FiMail, FiLock } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  // 1. Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State to track validation errors for each field
  const [errors, setErrors] = useState({});

  // 2. Handle input changes and dynamically clear error on type
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for the current field if user starts typing again
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    setErrors(newErrors);

    // Returns true if no validation errors exist
    return Object.keys(newErrors).length === 0;
  };

  // 4. Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert('Login Successful!');
      // Reset input fields after successful submission
      setFormData({
        email: '',
        password: '',
      });
      setErrors({});
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          {/* Fallback circular gradient logo */}
          <div className="logo-avatar" aria-hidden="true">
            CH
          </div>
          <h1 className="project-title">Community Hero</h1>
          <p className="project-subtitle">
            Welcome back! Login to continue making a difference.
          </p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
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
            <div className="label-with-link">
              <label htmlFor="password">Password</label>
              <a href="#forgot-password" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>
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

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        {/* Card Footer Link */}
        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;