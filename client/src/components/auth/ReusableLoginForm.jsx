import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthInput } from './AuthInput';
import { Loader } from './Loader';
import styles from './ReusableLoginForm.module.css';

export const ReusableLoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  onSubmit,
  onQuickDemoLogin,
  demoEmail,
  demoPassword,
  demoBtnText = "1-Click Demo Login",
  submitBtnText = "Login",
  emailLabel = "Email ID",
  passwordLabel = "Password",
  emailPlaceholder = "email@example.com",
  customSubmitClass,
  customDemoClass
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setEmail(demoEmail);
    setPassword(demoPassword);
    if (onQuickDemoLogin) {
      onQuickDemoLogin(demoEmail, demoPassword);
    } else if (onSubmit) {
      onSubmit(e, demoEmail, demoPassword);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button 
          type="button" 
          className={customDemoClass || styles.demoFillBtn} 
          onClick={handleDemoClick}
          disabled={isSubmitting}
          style={{ flex: 1, margin: 0 }}
        >
          ⚡ {demoBtnText}
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail(demoEmail);
            setPassword(demoPassword);
          }}
          disabled={isSubmitting}
          title="Auto-fill demo credentials only"
          style={{
            padding: '8px 12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            color: '#475569',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Fill Form
        </button>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        <AuthInput
          label={emailLabel}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={FiMail}
          disabled={isSubmitting}
          placeholder={emailPlaceholder}
        />
        <AuthInput
          label={passwordLabel}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={FiLock}
          disabled={isSubmitting}
          placeholder="••••••••"
          rightElement={
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          }
        />
        <button type="submit" className={customSubmitClass || styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? <Loader size="small" color="white" /> : submitBtnText}
        </button>
      </form>
    </>
  );
};
