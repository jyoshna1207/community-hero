import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { AuthInput } from '../../components/auth/AuthInput';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from './LoginPage.module.css';

const LoginPage = () => {
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
            Sign in to log issues, track ward progress, and manage civic resolutions.
          </p>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
            ⚡ Instant Demo Login (Click Any Role)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleLoginSubmit('citizen@hero.com', 'password123')}
              disabled={isSubmitting}
              style={{
                padding: '8px 10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1e293b',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>👤</span>
              <div>
                <div>Citizen</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>Report & Track</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLoginSubmit('officer@hero.com', 'password123')}
              disabled={isSubmitting}
              style={{
                padding: '8px 10px',
                background: '#ffffff',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#92400e',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🛡️</span>
              <div>
                <div>Ward Officer</div>
                <div style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 500 }}>Verify & Assign</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLoginSubmit('dept@hero.com', 'password123')}
              disabled={isSubmitting}
              style={{
                padding: '8px 10px',
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1e40af',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🏗️</span>
              <div>
                <div>Department</div>
                <div style={{ fontSize: '0.68rem', color: '#3b82f6', fontWeight: 500 }}>Deploy & Resolve</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLoginSubmit('admin@hero.com', 'password123')}
              disabled={isSubmitting}
              style={{
                padding: '8px 10px',
                background: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#991b1b',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>⚙️</span>
              <div>
                <div>Admin</div>
                <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 500 }}>Full Governance</div>
              </div>
            </button>
          </div>
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

export default LoginPage;