import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthCard } from '../../components/auth/AuthCard';
import { AuthInput } from '../../components/auth/AuthInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from './ResetPasswordPage.module.css';

export const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'New password is required';
    else if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastType('success');
      setToastMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      <AuthCard title="Reset Password" subtitle="Please enter your new password below.">
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <AuthInput
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={FiLock}
            disabled={isSubmitting}
            rightElement={
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <PasswordStrength password={formData.password} />

          <AuthInput
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={FiLock}
            disabled={isSubmitting}
            rightElement={
              <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <Loader size="small" color="white" /> : 'Reset Password'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/login" className={styles.link}>Back to Login</Link>
        </div>
      </AuthCard>
    </div>
  );
};