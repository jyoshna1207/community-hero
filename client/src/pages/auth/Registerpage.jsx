import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, 
  FiBriefcase, FiArrowRight, FiArrowLeft, FiShield, FiKey, FiCheck 
} from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { AuthInput } from '../../components/auth/AuthInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { Loader } from '../../components/auth/Loader';
import { Toast } from '../../components/auth/Toast';
import styles from './Registerpage.module.css';

const RegisterPage = () => {
  // Step 1: 'select_role' (shows the 4 options)
  // Step 2: 'form' (shows the actual registration form)
  const [currentStep, setCurrentStep] = useState('select_role');

  // Admin Code Verification State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [adminCodeError, setAdminCodeError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Citizen',
    wardId: 'WARD-04',
    wardName: '',
    municipality: 'Visakhapatnam Municipal Corporation',
    village: '',
    mandal: '',
    officialIdFile: null,
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

  const handleRoleSelection = (roleName) => {
    if (roleName === 'Admin') {
      setAdminCodeInput('');
      setAdminCodeError('');
      setAdminModalOpen(true);
      return;
    }
    setFormData((prev) => ({ ...prev, role: roleName }));
    setCurrentStep('form');
  };

  const handleVerifyAdminCode = (e) => {
    e.preventDefault();
    const cleanCode = adminCodeInput.trim().toUpperCase();
    // Accept standard demo admin codes
    if (cleanCode === 'ADMIN2026' || cleanCode === 'ADMIN123' || cleanCode === 'HERO_ADMIN' || cleanCode === 'ADMIN') {
      setAdminModalOpen(false);
      setFormData((prev) => ({ ...prev, role: 'Admin' }));
      setCurrentStep('form');
    } else {
      setAdminCodeError('Invalid admin authorization code. Please enter valid municipal credentials (e.g. ADMIN2026).');
    }
  };

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

    if (formData.role === 'Ward Officer' || formData.role === 'Department Officer') {
      if (!formData.officialIdFile) {
        newErrors.officialIdFile = 'Official Government ID proof is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const res = await register(formData);
    if (res.success) {
      setToastType('success');
      setToastMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        const userRole = (res.user?.role || formData.role || 'citizen').toLowerCase().trim();
        if (userRole.includes('ward') || userRole === 'officer' || userRole === 'ward_officer') {
          navigate('/ward-dashboard');
        } else if (userRole.includes('dept') || userRole.includes('district') || userRole === 'district_officer') {
          navigate('/department/department-dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
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
            <FaShieldAlt style={{ fontSize: '1.25rem' }} />
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>Community Hero</span>
            <span className={styles.brandTagline}>Civic Resolution Portal</span>
          </div>
        </Link>
      </div>

      {/* STAGE 1: 4 ROLE SELECTION CARDS */}
      {currentStep === 'select_role' ? (
        <div className={styles.heroicCard}>
          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>Create Account</h1>
            <p className={styles.cardSubtitle}>
              Select your role to register and access the platform.
            </p>
          </div>

          <div className={styles.portalOptionsList}>
            {/* 1. Citizen Option */}
            <div 
              className={`${styles.roleOptionCard} ${styles.citizenCard}`}
              onClick={() => handleRoleSelection('Citizen')}
            >
              <div className={styles.cardIcon}>👤</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Citizen</h3>
                  <span className={styles.roleTag}>Public</span>
                </div>
                <p>Report neighborhood issues, track repairs, and earn civic points.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </div>

            {/* 2. Ward Officer Option */}
            <div 
              className={`${styles.roleOptionCard} ${styles.officerCard}`}
              onClick={() => handleRoleSelection('Ward Officer')}
            >
              <div className={styles.cardIcon}>🛡️</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Ward Officer</h3>
                  <span className={styles.roleTag}>Admin</span>
                </div>
                <p>Verify reports, assign field tasks, and oversee ward queues.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </div>

            {/* 3. Department Option */}
            <div 
              className={`${styles.roleOptionCard} ${styles.departmentCard}`}
              onClick={() => handleRoleSelection('Department Officer')}
            >
              <div className={styles.cardIcon}>🏗️</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Department</h3>
                  <span className={styles.roleTag}>Field Team</span>
                </div>
                <p>Manage repair work orders, update progress, and submit completion.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </div>

            {/* 4. Admin Option (Requires Access Code) */}
            <div 
              className={`${styles.roleOptionCard} ${styles.adminCard}`}
              onClick={() => handleRoleSelection('Admin')}
            >
              <div className={styles.cardIcon}>⚙️</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Admin</h3>
                  <span className={styles.roleTag}>Security Code Required</span>
                </div>
                <p>Platform governance, analytics, ward settings, and audits.</p>
              </div>
              <div className={styles.cardArrow}><FiKey /></div>
            </div>
          </div>

          <p className={styles.footerText}>
            Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
          </p>
        </div>
      ) : (
        /* STAGE 2: ACTUAL REGISTRATION FORM */
        <div className={styles.heroicCard}>
          {/* Top back/change role control */}
          <div className={styles.formTopBar}>
            <button 
              type="button" 
              className={styles.btnChangeRole}
              onClick={() => setCurrentStep('select_role')}
            >
              <FiArrowLeft /> Change Role
            </button>
            <span className={styles.currentRoleBadge}>
              Registering as: <strong>{formData.role}</strong>
            </span>
          </div>

          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>
              {formData.role === 'Citizen' ? 'Citizen Registration' : `${formData.role} Registration`}
            </h1>
            <p className={styles.cardSubtitle}>
              {formData.role === 'Citizen' 
                ? 'Fill in your details to start reporting and solving issues in your area'
                : 'Complete official verification to access your municipal workspace'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <AuthInput
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="e.g. Ramesh Kumar"
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

            {/* Citizen-specific location inputs */}
            {formData.role === 'Citizen' && (
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>
                  📍 Location Details (For Localized Ward Routing)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <AuthInput
                    label="Mandal"
                    type="text"
                    name="mandal"
                    placeholder="e.g. Tuni Rural"
                    value={formData.mandal}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <AuthInput
                    label="Village / Town"
                    type="text"
                    name="village"
                    placeholder="e.g. Tuni"
                    value={formData.village}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <AuthInput
                  label="Ward Name / Number"
                  type="text"
                  name="wardName"
                  placeholder="e.g. Duvvada Ward 4"
                  value={formData.wardName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Officer & Department Official Verification */}
            {(formData.role === 'Ward Officer' || formData.role === 'Department Officer') && (
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>
                  🔒 Official Employee Verification
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.78rem', color: '#B45309', lineHeight: 1.4 }}>
                  Government personnel must provide employee credentials for verification.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Upload Official Employee ID (PDF or Image)</label>
                  <input 
                    type="file" 
                    accept=".pdf,image/*" 
                    onChange={(e) => setFormData({ ...formData, officialIdFile: e.target.files[0] })}
                    style={{
                      padding: '10px',
                      border: errors.officialIdFile ? '1.5px solid #DC2626' : '1.5px solid #FED7AA',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      fontSize: '0.85rem',
                      color: '#475569',
                      outline: 'none'
                    }}
                    disabled={isSubmitting}
                  />
                  {errors.officialIdFile && <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>{errors.officialIdFile}</span>}
                </div>
              </div>
            )}

            {/* Ward Officer specific fields */}
            {formData.role === 'Ward Officer' && (
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>Assigned Ward Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <AuthInput
                    label="Ward Number / ID"
                    type="text"
                    name="wardId"
                    placeholder="e.g. WARD-04"
                    value={formData.wardId}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <AuthInput
                    label="Ward Name"
                    type="text"
                    name="wardName"
                    placeholder="e.g. Duvvada Ward 4"
                    value={formData.wardName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <AuthInput
                  label="Municipality / City"
                  type="text"
                  name="municipality"
                  placeholder="e.g. Visakhapatnam Municipal Corporation"
                  value={formData.municipality}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Department specific fields */}
            {formData.role === 'Department Officer' && (
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>Department Division</h4>
                <AuthInput
                  label="Department Name"
                  type="text"
                  name="departmentName"
                  placeholder="e.g. Public Works Department (Roads / Sanitation)"
                  value={formData.departmentName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            )}

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
              {isSubmitting ? <Loader size="small" color="white" /> : `Create ${formData.role} Account`}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
          </p>
        </div>
      )}

      {/* ADMIN SECURITY CODE VERIFICATION MODAL */}
      {adminModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px 32px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(234, 88, 12, 0.25)',
            border: '1.5px solid #FED7AA'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(180deg, #FFEDD5 0%, #FED7AA 100%)',
                color: '#EA580C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                margin: '0 auto 14px',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.2)'
              }}>
                <FiShield />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                Admin Security Code
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', lineHeight: 1.45 }}>
                Enter the official municipal administrator authorization code to proceed.
              </p>
            </div>

            <form onSubmit={handleVerifyAdminCode}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Authorization Code
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="Enter security code (e.g. ADMIN2026)"
                    value={adminCodeInput}
                    onChange={(e) => {
                      setAdminCodeInput(e.target.value);
                      setAdminCodeError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: adminCodeError ? '1.5px solid #DC2626' : '1.5px solid #FED7AA',
                      outline: 'none',
                      fontSize: '0.95rem',
                      color: '#0F172A',
                      boxSizing: 'border-box'
                    }}
                    autoFocus
                  />
                </div>
                {adminCodeError ? (
                  <p style={{ margin: '6px 0 0 0', color: '#DC2626', fontSize: '0.8rem', fontWeight: 600 }}>
                    {adminCodeError}
                  </p>
                ) : (
                  <p style={{ margin: '6px 0 0 0', color: '#92400E', fontSize: '0.78rem', fontWeight: 600 }}>
                    💡 Municipal Demo Code: <strong>ADMIN2026</strong>
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#64748B',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                  }}
                >
                  Verify & Proceed →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;