import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { AuthInput } from '../../components/auth/AuthInput';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from '../auth/LoginPage.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (emailToUse, passwordToUse) => {
    setIsSubmitting(true);
    const res = await login(emailToUse, passwordToUse);

    if (res.success) {
      setToastType('success');
      setToastMessage(`Welcome back, ${res.user.name}! Redirecting to dashboard...`);
      setTimeout(() => {
        navigate(res.redirectPath || '/dashboard');
        setIsSubmitting(false);
      }, 900);
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Login failed. Please check credentials.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    handleLoginSubmit(email, password);
  };

  return (
    <div className={styles.authLayout}>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Top Header Branding */}
      <div className={styles.topHeaderWrapper}>
        <Link to="/" className={styles.topBrandHeader}>
          <div className={styles.brandShieldIcon}>
            <FaShieldAlt style={{ fontSize: '1.2rem' }} />
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>Community Hero</span>
            <span className={styles.brandTagline}>Civic Resolution Portal</span>
          </div>
        </Link>
      </div>

      {/* Centered Heroic Login Card */}
      <div className={styles.heroicCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Welcome Back</h1>
          <p className={styles.cardSubtitle}>
            Sign in to log issues, track ward progress, and earn impact points
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={FiMail}
            disabled={isSubmitting}
          />

          <AuthInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={FiLock}
            disabled={isSubmitting}
            rightElement={
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <Loader size="small" color="white" /> : 'Sign In to Portal'}
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account? <Link to="/register" className={styles.link}>Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;