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
  demoEmail,
  demoPassword,
  demoBtnText = "Load Credentials",
  submitBtnText = "Login",
  emailLabel = "Email ID",
  passwordLabel = "Password",
  emailPlaceholder = "email@example.com",
  customSubmitClass,
  customDemoClass
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <button 
        type="button" 
        className={customDemoClass || styles.demoFillBtn} 
        onClick={() => {
          setEmail(demoEmail); 
          setPassword(demoPassword);
        }}
      >
        ⚡ {demoBtnText}
      </button>

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
