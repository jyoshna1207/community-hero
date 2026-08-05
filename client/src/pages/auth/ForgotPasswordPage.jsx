import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { AuthCard } from '../../components/auth/AuthCard';
import { AuthInput } from '../../components/auth/AuthInput';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from './ForgotPasswordPage.module.css';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return;
    }
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastType('success');
      setToastMessage('Password reset link sent to your email!');
      setTimeout(() => navigate('/verify-email'), 1500);
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      
      <AuthCard title="Forgot Password?" subtitle="Enter your registered email address and we'll send you a link to reset your password.">
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            icon={FiMail}
            disabled={isSubmitting}
          />

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <Loader size="small" color="white" /> : 'Send Reset Link'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/login" className={styles.backLink}>
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};