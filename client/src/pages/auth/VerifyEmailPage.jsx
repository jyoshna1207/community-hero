import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { AuthCard } from '../../components/auth/AuthCard';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from './VerifyEmailPage.module.css';

export const VerifyEmailPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setToastType('success');
      setToastMessage('Verification email re-sent successfully!');
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      <AuthCard>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <FiMail className={styles.mailIcon} />
            <div className={styles.badge}><FiCheckCircle /></div>
          </div>

          <h2 className={styles.title}>Verify Your Email</h2>
          <p className={styles.description}>
            We've sent a verification link to your email address. Please check your inbox and click the link to activate your Community Hero account.
          </p>

          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? <Loader size="small" color="emerald" /> : 'Resend Email'}
          </button>

          <div className={styles.footer}>
            <Link to="/login" className={styles.backLink}>
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};