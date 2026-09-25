import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './SharedLoginLayout.module.css';
import { Toast } from './Toast';

export const SharedLoginLayout = ({ 
  children, 
  toast, 
  onCloseToast, 
  title, 
  subtitle, 
  icon, 
  graphicsTitle, 
  graphicsSubtitle, 
  illustrations, 
  isProfessional = false 
}) => {
  return (
    <div className={`${styles.pageLayout} ${isProfessional ? styles.professional : styles.standard}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={onCloseToast} />}
      
      <div className={styles.backButtonRow}>
        <Link to="/login" className={styles.backButton}>
          <FiArrowLeft /> Back to Portals
        </Link>
      </div>

      <div className={styles.loginContainer}>
        <div className={styles.graphicsSide}>
          <div className={styles.graphicsContent}>
            <h2>{graphicsTitle}</h2>
            <p>{graphicsSubtitle}</p>
            <div className={styles.illustration}>
              {illustrations.map((ill, i) => (
                <div key={i} className={styles[`floatingItem${i+1}`]}>{ill}</div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formSide}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle}>{icon}</div>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.subtitle}>{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
