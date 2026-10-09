import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { AuthInput } from '../../components/auth/AuthInput';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import { SharedLoginLayout } from '../../components/auth/SharedLoginLayout';
import { ReusableLoginForm } from '../../components/auth/ReusableLoginForm';
import styles from './CitizenLogin.module.css';

const CitizenLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e, directEmail, directPassword) => {
    if (e && e.preventDefault) e.preventDefault();
    const emailToUse = directEmail || email;
    const passwordToUse = directPassword || password;
    if (!emailToUse || !passwordToUse) return;
    
    setIsSubmitting(true);
    const res = await login(emailToUse, passwordToUse);

    if (res.success) {
      setToast({ message: `Welcome back, ${res.user?.name || 'Citizen'}!`, type: 'success' });
      setTimeout(() => {
        navigate(res.redirectPath || '/dashboard');
      }, 700);
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
      <ReusableLoginForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isSubmitting={isSubmitting}
        onSubmit={handleLoginSubmit}
        onQuickDemoLogin={(em, pw) => handleLoginSubmit(null, em, pw)}
        demoEmail="citizen@hero.com"
        demoPassword="password123"
        demoBtnText="1-Click Citizen Demo"
        submitBtnText="Enter Citizen Portal"
        emailLabel="Email Address"
        passwordLabel="Password"
        emailPlaceholder="citizen@hero.com"
      />
    </SharedLoginLayout>
  );
};

export default CitizenLogin;
