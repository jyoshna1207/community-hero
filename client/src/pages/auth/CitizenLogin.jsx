import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { AuthInput } from '../../components/auth/AuthInput';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import { SharedLoginLayout } from '../../components/auth/SharedLoginLayout';
import styles from './CitizenLogin.module.css';

const CitizenLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    const res = await login(email, password);

    if (res.success) {
      setToast({ message: `Welcome back, ${res.user.name}!`, type: 'success' });
      setTimeout(() => {
        navigate(res.redirectPath || '/dashboard');
      }, 900);
    } else {
      setToast({ message: res.error || 'Login failed.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  return (
    <SharedLoginLayout
      toast={toast}
      onCloseToast={() => setToast(null)}
      title="Citizen Login"
      subtitle="Welcome back, hero."
      icon="👤"
      graphicsTitle="Empower Your Community"
      graphicsSubtitle="Report issues, track repairs, and make a real impact in your neighborhood."
      illustrations={['📍', '🏠', '🌳']}
      isProfessional={false}
    >
      <button type="button" className={styles.demoFillBtn} onClick={() => {setEmail('citizen@hero.com'); setPassword('password123');}}>
        ⚡ Quick Fill Demo Citizen
      </button>

      <form onSubmit={handleLoginSubmit} className={styles.form}>
        <AuthInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={FiMail}
          disabled={isSubmitting}
          placeholder="citizen@hero.com"
        />
        <AuthInput
          label="Password"
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
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? <Loader size="small" color="white" /> : 'Enter Citizen Portal'}
        </button>
      </form>
    </SharedLoginLayout>
  );
};

export default CitizenLogin;
