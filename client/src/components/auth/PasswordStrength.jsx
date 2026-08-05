import React from 'react';
import styles from './PasswordStrength.module.css';

export const PasswordStrength = ({ password = '' }) => {
  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);

  const getLabel = () => {
    switch (strength) {
      case 0: return { text: '', color: 'transparent' };
      case 1: return { text: 'Weak', color: '#ef4444' };
      case 2: return { text: 'Fair', color: '#f59e0b' };
      case 3: return { text: 'Good', color: '#3b82f6' };
      case 4: return { text: 'Strong', color: '#10b981' };
      default: return { text: '', color: 'transparent' };
    }
  };

  const { text, color } = getLabel();

  return (
    <div className={styles.container}>
      <div className={styles.bars}>
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={styles.bar}
            style={{
              backgroundColor: level <= strength ? color : '#e5e7eb',
            }}
          />
        ))}
      </div>
      {text && (
        <span className={styles.label} style={{ color }}>
          {text} password
        </span>
      )}
    </div>
  );
};