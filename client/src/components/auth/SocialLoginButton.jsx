import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft, BsGithub } from 'react-icons/bs';
import styles from './SocialLoginButton.module.css';

export const SocialLoginButton = ({ provider, onClick, disabled }) => {
  const getProviderDetails = () => {
    switch (provider) {
      case 'google':
        return { name: 'Google', icon: <FcGoogle />, className: styles.google };
      case 'microsoft':
        return { name: 'Microsoft', icon: <BsMicrosoft style={{ color: '#00a4ef' }} />, className: styles.microsoft };
      case 'github':
        return { name: 'GitHub', icon: <BsGithub style={{ color: '#24292e' }} />, className: styles.github };
      default:
        return { name: 'Google', icon: <FcGoogle />, className: styles.google };
    }
  };

  const { name, icon, className } = getProviderDetails();

  return (
    <button
      type="button"
      className={`${styles.socialBtn} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>Continue with {name}</span>
    </button>
  );
};