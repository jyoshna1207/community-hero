import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShieldOff, FiHome, FiLogIn } from 'react-icons/fi';
import styles from './UnauthorizedPage.module.css';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.errorCode}>403</div>
        <div className={styles.iconWrapper}>
          <FiShieldOff />
        </div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.description}>
          You do not have the required permissions to access this dashboard or page. Please contact your administrator or switch to an authorized role.
        </p>

        <div className={styles.buttonGroup}>
          <button onClick={() => navigate('/')} className={styles.homeBtn}>
            <FiHome /> Go Home
          </button>
          <button onClick={() => navigate('/login')} className={styles.loginBtn}>
            <FiLogIn /> Go Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};