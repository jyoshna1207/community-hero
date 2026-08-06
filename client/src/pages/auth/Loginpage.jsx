import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { AuthCard } from '../../components/auth/AuthCard';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthIllustration } from '../../components/auth/AuthIllustration';
import { SocialLoginButton } from '../../components/auth/SocialLoginButton';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from './LoginPage.module.css';

  const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setIsSubmitting(true);

  setToastType("success");
  setToastMessage("Login successful! Redirecting...");

  let redirectPath = "/dashboard";

  if (email.toLowerCase().includes("admin")) {
    redirectPath = "/admin/dashboard";
  } else if (email.toLowerCase().includes("officer")) {
    redirectPath = "/officer/dashboard";
  } else if (email.toLowerCase().includes("department")) {
    redirectPath = "/department/dashboard";
  } else {
    redirectPath = "/dashboard";
  }

  setTimeout(() => {
    navigate(redirectPath);
    setIsSubmitting(false);
  }, 1000);
};
const handleSocialLogin = (provider) => {
  setToastType("success");
  setToastMessage(`${provider} login coming soon`);
};
  return (
    <div className={styles.authLayout}>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      
      <AuthIllustration />

      <div className={styles.formSection}>
        <AuthCard title="Welcome Back" subtitle="Sign in to continue solving hyperlocal issues in your community">
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
              {isSubmitting ? <Loader size="small" color="white" /> : 'Sign In'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>OR CONTINUE WITH</span>
          </div>

          <div className={styles.socialGrid}>
            <SocialLoginButton provider="google" onClick={() => handleSocialLogin('Google')} disabled={isSubmitting} />
            <SocialLoginButton provider="microsoft" onClick={() => handleSocialLogin('Microsoft')} disabled={isSubmitting} />
            <SocialLoginButton provider="github" onClick={() => handleSocialLogin('GitHub')} disabled={isSubmitting} />
          </div>

          <p className={styles.footerText}>
            Don't have an account? <Link to="/register" className={styles.link}>Create account</Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
};
export default LoginPage;