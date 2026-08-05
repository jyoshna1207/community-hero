import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiShield, FiMapPin, FiZap } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address or mobile is required.';
    } else if (!emailRegex.test(formData.email) && !/^\d{10}$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email or 10-digit mobile number.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const result = await login(formData.email, formData.password);
        setIsSubmitting(false);

        if (!result || result.success || result === true) {
          navigate('/profile');
        } else {
          setSubmitError(result.error || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        setIsSubmitting(false);
        setSubmitError(err.message || 'An error occurred during login.');
      }
    }
  };

  const handleQuickDemoLogin = async () => {
    setFormData({ email: 'jyoshna@example.com', password: 'password123' });
    setIsSubmitting(true);
    const result = await login('jyoshna@example.com', 'password123');
    setIsSubmitting(false);
    if (!result || result.success) {
      navigate('/profile');
    }
  };

  const handleGoogleLogin = () => {
    handleQuickDemoLogin();
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
            <h1 className="auth-heading">Welcome Back!</h1>
            <p className="auth-subheading">Login to continue making our community better.</p>
          </div>

          {submitError && <div className="auth-error-banner">{submitError}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email or Mobile Field */}
            <div className="form-field-group">
              <label htmlFor="email">Email or Mobile Number</label>
              <div className={`input-field-wrapper ${errors.email ? 'has-field-error' : ''}`}>
                <FiMail className="field-icon" />
                <input
                  type="text"
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
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="#forgot" className="link-forgot">Forgot Password?</a>
              </div>
              <div className={`input-field-wrapper ${errors.password ? 'has-field-error' : ''}`}>
                <FiLock className="field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
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

            {/* Primary Login Button */}
            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'} <FiArrowRight className="btn-arrow-icon" />
            </button>

            {/* OR Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>

            {/* Continue with Google */}
            <button type="button" className="btn-google" onClick={handleGoogleLogin}>
              <FcGoogle className="google-icon" /> Continue with Google
            </button>

            {/* Quick Demo Helper */}
            <button type="button" className="btn-quick-demo" onClick={handleQuickDemoLogin}>
              <FiZap /> 1-Click Quick Demo Sign In
            </button>
          </form>

          <div className="auth-bottom-switch">
            <p>
              Don't have an account? <Link to="/register" className="auth-switch-link">Register now</Link>
            </p>
          </div>
        </div>

        {/* Right Column: Visual Hero Section */}
        <div className="auth-visual-column">
          <div className="visual-headline-box">
            <h2 className="visual-headline">Together, let's<br /><span className="headline-green">fix what we see,</span><br />build what we love.</h2>
          </div>

          <div className="visual-illustration-container">
            <img src="/hero_illustration.png" alt="Community Hero App Illustration" className="hero-illustration-img" />
            
            {/* Floating Tags */}
            <div className="floating-tag tag-pothole">🕳️ Pothole</div>
            <div className="floating-tag tag-water">💧 Water Leakage</div>
            <div className="floating-tag tag-light">💡 Damaged Streetlight</div>

            {/* Impact Quote Box */}
            <div className="impact-quote-box">
              <div className="quote-icon"><FiCheckCircle /></div>
              <div className="quote-text">Your report can create a real change in your neighborhood.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;