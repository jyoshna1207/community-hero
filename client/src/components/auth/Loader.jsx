import React from 'react';
import styles from './Loader.module.css';

export const Loader = ({ size = 'medium', color = 'emerald' }) => {
  return (
    <div className={`${styles.spinnerContainer} ${styles[size]}`}>
      <div className={`${styles.spinner} ${styles[color]}`} />
    </div>
  );
};