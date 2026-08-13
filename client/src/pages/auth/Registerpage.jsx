import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { AuthInput } from '../../components/auth/AuthInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Citizen',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!termsAccepted) newErrors.terms = 'You must accept Terms & Conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const res = await register(formData.fullName, formData.email, formData.password, formData.role);
    if (res.success) {
      setToastType('success');
      setToastMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        const role = (formData.role || 'citizen').toLowerCase();
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'officer') navigate('/officer/dashboard');
        else if (role === 'department') navigate('/department/dashboard');
        else navigate('/dashboard');
        setIsSubmitting(false);
      }, 1200);
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authLayout}>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Top Header Branding */}
      <div className={styles.topHeaderWrapper}>
        <Link to="/" className={styles.topBrandHeader}>
          <div className={styles.brandShieldIcon}>
            <FaShieldAlt style={{ fontSize: '1.2rem' }} />
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>Community Hero</span>
            <span className={styles.brandTagline}>Civic Resolution Portal</span>
          </div>
        </Link>
      </div>

      {/* Centered Heroic Register Card */}
      <div className={styles.heroicCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Create Account</h1>
          <p className={styles.cardSubtitle}>
            Register to start reporting and solving problems in your area
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <AuthInput
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            icon={FiUser}
            disabled={isSubmitting}
          />

          <AuthInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={FiMail}
            disabled={isSubmitting}
          />

          <AuthInput
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={FiPhone}
            disabled={isSubmitting}
          />

          <div className={styles.roleGroup}>
            <label className={styles.roleLabel}>Account Type</label>
            <div className={styles.roleSelector}>
              {['Citizen', 'Ward Officer', 'Department Officer'].map((roleOption) => (
                <button
                  key={roleOption}
                  type="button"
                  className={`${styles.roleCard} ${formData.role === roleOption ? styles.activeRole : ''}`}
                  onClick={() => setFormData({ ...formData, role: roleOption })}
                >
                  <FiBriefcase className={styles.roleIcon} />
                  <span>{roleOption}</span>
                </button>
              ))}
            </div>
          </div>

          <AuthInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={FiLock}
            disabled={isSubmitting}
            rightElement={
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <PasswordStrength password={formData.password} />

          <AuthInput
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={FiLock}
            disabled={isSubmitting}
            rightElement={
              <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <div className={styles.termsGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>I agree to the <a href="#terms" className={styles.link}>Terms & Conditions</a> & <a href="#privacy" className={styles.link}>Privacy Policy</a></span>
            </label>
            {errors.terms && <span className={styles.errorText}>{errors.terms}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? <Loader size="small" color="white" /> : 'Create Account'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;