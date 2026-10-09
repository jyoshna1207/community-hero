import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../components/auth/Toast';
import { Loader } from '../../components/auth/Loader';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [loadingRole, setLoadingRole] = useState(null);

  const handleInstantDemo = async (e, role, path) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingRole(role);
    const res = await loginAsDemo(role);
    if (res.success) {
      setToast({ message: `Access granted! Entering ${res.user?.name || role}...`, type: 'success' });
      setTimeout(() => {
        navigate(res.redirectPath || path);
      }, 600);
    } else {
      setToast({ message: res.error || 'Demo login failed.', type: 'error' });
      setLoadingRole(null);
    }
  };

  return (
    <div className={styles.hubLayout}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className={styles.backgroundAnimation}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

      <div className={styles.centerContainer}>
        {/* Brand Header */}
        <Link to="/" className={styles.topBrandHeader}>
          <div className={styles.brandShieldIcon}>
            <FaShieldAlt style={{ fontSize: '1.35rem' }} />
          </div>
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>Community Hero</span>
            <span className={styles.brandTagline}>Civic Resolution Portal</span>
          </div>
        </Link>

        {/* Dedicated Portal Selection Card */}
        <div className={styles.optionsCardContainer}>
          <div className={styles.optionsHeader}>
            <h1 className={styles.optionsTitle}>Select Your Portal</h1>
            <p className={styles.optionsSubtitle}>Choose your role or test any portal instantly via 1-Click Demo.</p>
          </div>

          <div className={styles.portalOptionsList}>
            <Link to="/login/citizen" className={`${styles.portalCard} ${styles.citizenCard}`}>
              <div className={styles.cardIcon}>👤</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Citizen Portal</h3>
                  <span className={styles.roleTag}>Public</span>
                  <button
                    type="button"
                    className={styles.quickDemoBtn}
                    onClick={(e) => handleInstantDemo(e, 'citizen', '/dashboard')}
                    title="1-Click Citizen Demo Login"
                  >
                    {loadingRole === 'citizen' ? <Loader size="small" color="#C2410C" /> : '⚡ 1-Click Demo'}
                  </button>
                </div>
                <p>Report issues, track repairs in real-time, and earn civic points.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </Link>

            <Link to="/login/officer" className={`${styles.portalCard} ${styles.officerCard}`}>
              <div className={styles.cardIcon}>🛡️</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Ward Officer</h3>
                  <span className={styles.roleTag}>Admin</span>
                  <button
                    type="button"
                    className={styles.quickDemoBtn}
                    onClick={(e) => handleInstantDemo(e, 'ward_officer', '/ward-dashboard')}
                    title="1-Click Ward Officer Demo Login"
                  >
                    {loadingRole === 'ward_officer' ? <Loader size="small" color="#C2410C" /> : '⚡ 1-Click Demo'}
                  </button>
                </div>
                <p>Verify reports, assign field tasks, and oversee ward queues.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </Link>

            <Link to="/login/department" className={`${styles.portalCard} ${styles.departmentCard}`}>
              <div className={styles.cardIcon}>🏗️</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Department</h3>
                  <span className={styles.roleTag}>Field Team</span>
                  <button
                    type="button"
                    className={styles.quickDemoBtn}
                    onClick={(e) => handleInstantDemo(e, 'district_officer', '/department/dashboard')}
                    title="1-Click Department Demo Login"
                  >
                    {loadingRole === 'district_officer' ? <Loader size="small" color="#C2410C" /> : '⚡ 1-Click Demo'}
                  </button>
                </div>
                <p>Manage repair work orders, update progress, and submit completion.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </Link>

            <Link to="/login/admin" className={`${styles.portalCard} ${styles.adminCard}`}>
              <div className={styles.cardIcon}>⚙️</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>System Admin</h3>
                  <span className={styles.roleTag}>Governance</span>
                  <button
                    type="button"
                    className={styles.quickDemoBtn}
                    onClick={(e) => handleInstantDemo(e, 'admin', '/admin/dashboard')}
                    title="1-Click System Admin Demo Login"
                  >
                    {loadingRole === 'admin' ? <Loader size="small" color="#C2410C" /> : '⚡ 1-Click Demo'}
                  </button>
                </div>
                <p>Complete platform governance, analytics, ward settings, and audits.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </Link>
          </div>

          <div className={styles.hubFooter}>
            <p>Don't have an account? <Link to="/register">Create Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;