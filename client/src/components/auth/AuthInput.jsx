import React, { forwardRef } from 'react';
import styles from './AuthInput.module.css';

export const AuthInput = forwardRef(({
  label,
  error,
  icon: Icon,
  rightElement,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        {Icon && <span className={styles.leftIcon}><Icon /></span>}
        <input
          ref={ref}
          className={`${styles.inputField} ${Icon ? styles.withLeftIcon : ''} ${rightElement ? styles.withRightElement : ''}`}
          {...props}
        />
        {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';