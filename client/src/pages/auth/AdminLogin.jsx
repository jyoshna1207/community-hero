import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { AuthInput } from '../../components/auth/AuthInput';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import { SharedLoginLayout } from '../../components/auth/SharedLoginLayout';
import { ReusableLoginForm } from '../../components/auth/ReusableLoginForm';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
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
      setToast({ message: `Access granted, ${res.user.name}.`, type: 'success' });
      setTimeout(() => {
        navigate(res.redirectPath || '/admin/dashboard');
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
      title="System Admin"
      subtitle="Restricted Access. Authorized personnel only."
      icon={<FiShield />}
      graphicsTitle="Command Center"
      graphicsSubtitle="Complete governance, analytics, and platform control for the community."
      illustrations={['⚙️', '📊', '🛡️']}
      isProfessional={true}
    >
      <ReusableLoginForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isSubmitting={isSubmitting}
        onSubmit={handleLoginSubmit}
        demoEmail="admin@hero.com"
        demoPassword="password123"
        demoBtnText="Load Admin Credentials"
        submitBtnText="Authorize Access"
        emailLabel="Admin ID (Email)"
        passwordLabel="Passcode"
        emailPlaceholder="admin@hero.com"
      />
    </SharedLoginLayout>
  );
};

export default AdminLogin;
