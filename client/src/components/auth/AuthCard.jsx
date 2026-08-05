import React from 'react';
import { motion } from 'framer-motion';
import styles from './AuthCard.module.css';

export const AuthCard = ({ children, title, subtitle, className = '' }) => {
  return (
    <motion.div
      className={`${styles.authCard} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </motion.div>
  );
};