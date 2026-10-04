import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { FiZap, FiMapPin, FiActivity, FiArrowRight, FiAward } from 'react-icons/fi';
import styles from './Loginpage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.hubLayout}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

      <div className={styles.splitWrapper}>
        {/* Left Side: About Community Hero */}
        <div className={styles.aboutSide}>
          <div className={styles.topBrandHeader}>
            <div className={styles.brandShieldIcon}>
              <FaShieldAlt style={{ fontSize: '1.35rem' }} />
            </div>
            <div className={styles.brandTextGroup}>
              <span className={styles.brandTitle}>Community Hero</span>
              <span className={styles.brandTagline}>Civic Resolution Portal</span>
            </div>
          </div>

          <div className={styles.aboutHero}>
            <div className={styles.pillBadge}>
              <FiZap /> Powered by Civic Vision AI
            </div>
            <h1 className={styles.aboutTitle}>
              Empowering Citizens.<br />
              <span className={styles.gradientText}>Transforming Neighborhoods.</span>
            </h1>
            <p className={styles.aboutDesc}>
              Community Hero bridges the gap between residents, ward officers, and municipal departments to report, triage, and resolve neighborhood civic issues with full real-time transparency.
            </p>
          </div>

          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div className={styles.hlIconBox}><FiZap /></div>
              <div>
                <h4>AI Multimodal Triage</h4>
                <p>Gemini Vision AI classifies hazards, assesses severity, and routes tickets in seconds.</p>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.hlIconBox}><FiMapPin /></div>
              <div>
                <h4>Hyperlocal Ward Routing</h4>
                <p>Pinpoint GPS location maps issues directly to your assigned municipal division.</p>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.hlIconBox}><FiActivity /></div>
              <div>
                <h4>Live Lifecycle Tracking</h4>
                <p>Transparent progress tracking from citizen reporting to verified field resolution.</p>
              </div>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.hlIconBox}><FiAward /></div>
              <div>
                <h4>Community Impact</h4>
                <p>Earn hero points, track neighborhood leaderboards, and see real change.</p>
              </div>
            </div>
          </div>

          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>12,400+</span>
              <span className={styles.statLabel}>Issues Solved</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>98.4%</span>
              <span className={styles.statLabel}>Ward Coverage</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>4.9/5</span>
              <span className={styles.statLabel}>Citizen Trust</span>
            </div>
          </div>
        </div>

        {/* Right Side: Different Login Options */}
        <div className={styles.optionsSide}>
          <div className={styles.optionsCardContainer}>
            <div className={styles.optionsHeader}>
              <h2 className={styles.optionsTitle}>Select Your Portal</h2>
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
    </div>
  );
};

export default LoginPage;