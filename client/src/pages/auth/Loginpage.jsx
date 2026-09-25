import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.hubLayout}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

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

      <div className={styles.hubContent}>
        <div className={styles.hubHeader}>
          <h1 className={styles.hubTitle}>Select Your Portal</h1>
          <p className={styles.hubSubtitle}>Choose your role to access the appropriate dashboard.</p>
        </div>

        <div className={styles.portalGrid}>
          <Link to="/login/citizen" className={`${styles.portalCard} ${styles.citizenCard}`}>
            <div className={styles.cardIcon}>👤</div>
            <div className={styles.cardInfo}>
              <h3>Citizen Portal</h3>
              <p>Report issues, track progress, and help your community thrive.</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>

          <Link to="/login/officer" className={`${styles.portalCard} ${styles.officerCard}`}>
            <div className={styles.cardIcon}>🛡️</div>
            <div className={styles.cardInfo}>
              <h3>Ward Officer</h3>
              <p>Verify reports, assign tasks, and oversee ward operations.</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>

          <Link to="/login/department" className={`${styles.portalCard} ${styles.departmentCard}`}>
            <div className={styles.cardIcon}>🏗️</div>
            <div className={styles.cardInfo}>
              <h3>Department</h3>
              <p>Manage infrastructure repairs and on-ground deployment.</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>

          <Link to="/login/admin" className={`${styles.portalCard} ${styles.adminCard}`}>
            <div className={styles.cardIcon}>⚙️</div>
            <div className={styles.cardInfo}>
              <h3>System Admin</h3>
              <p>Complete governance, analytics, and platform control.</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </Link>
        </div>

        <div className={styles.hubFooter}>
          <p>Don't have an account? <Link to="/register">Create a Citizen Account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;