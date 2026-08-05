import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiMapPin, FiActivity } from 'react-icons/fi';
import styles from './AuthIllustration.module.css';

export const AuthIllustration = ({
  title = "Community Hero",
  tagline = "Hyperlocal Problem Solver & Civic Action Hub",
  features = [
    { icon: <FiMapPin />, text: "Report local issues instantly with geo-tagging" },
    { icon: <FiUsers />, text: "Collaborate directly with Ward & Department Officers" },
    { icon: <FiActivity />, text: "Real-time status tracking on civic resolutions" },
    { icon: <FiShield />, text: "Secure, verified role-based access control" },
  ]
}) => {
  return (
    <div className={styles.illustrationContainer}>
      <div className={styles.gradientOrbTop} />
      <div className={styles.gradientOrbBottom} />
      
      <div className={styles.contentWrapper}>
        <motion.div
          className={styles.brandBadge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>Community Empowerment Platform</span>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tagline}
        </motion.p>

        <div className={styles.featureList}>
          {features.map((feat, index) => (
            <motion.div
              key={index}
              className={styles.featureItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <div className={styles.featureIcon}>{feat.icon}</div>
              <span className={styles.featureText}>{feat.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};