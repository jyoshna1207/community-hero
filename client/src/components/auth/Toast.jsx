import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
import styles from './Toast.module.css';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`${styles.toast} ${styles[type]}`}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: '0.2' }}
        >
          <div className={styles.iconWrapper}>
            {type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          </div>
          <span className={styles.message}>{message}</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};