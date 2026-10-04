import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import styles from './Loginpage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.hubLayout}>
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
            <p className={styles.optionsSubtitle}>Choose your role to access your dedicated dashboard.</p>
          </div>

          <div className={styles.portalOptionsList}>
            <Link to="/login/citizen" className={`${styles.portalCard} ${styles.citizenCard}`}>
              <div className={styles.cardIcon}>👤</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTitleRow}>
                  <h3>Citizen Portal</h3>
                  <span className={styles.roleTag}>Public</span>
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
                </div>
                <p>Complete platform governance, analytics, ward settings, and audits.</p>
              </div>
              <div className={styles.cardArrow}><FiArrowRight /></div>
            </Link>
          </div>

          <div className={styles.hubFooter}>
            <p>Don't have an account? <Link to="/register">Create a Citizen Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;