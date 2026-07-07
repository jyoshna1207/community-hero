import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaHandsHelping, FaHeart, FaLeaf, FaShieldAlt } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  // Animation variants for staggered child elements (Left Content)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delays subsequent text animations for a premium effect
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        
        {/* LEFT SIDE: Typography & CTA Buttons */}
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Small Badge */}
          <motion.div className="hero-badge" variants={itemVariants}>
            <span className="badge-dot"></span> Building Better Communities
          </motion.div>

          {/* Main Heading */}
          <motion.h1 className="hero-heading" variants={itemVariants}>
            Empowering Communities, <br />
            <span>One Hero</span> at a Time.
          </motion.h1>

          {/* Supporting Paragraph */}
          <motion.p className="hero-description" variants={itemVariants}>
            Join Community Hero to connect with neighbors, seamlessly organize local activities, 
            and discover meaningful volunteer opportunities. Together, we make it easy to report 
            neighborhood issues, care for our environment, and drive lasting social impact right where you live.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="hero-actions" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/register" className="hero-btn btn-primary" aria-label="Get started with Community Hero">
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/about" className="hero-btn btn-secondary" aria-label="Learn more about how it works">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Interactive Grid Illustration Placeholder */}
        <div className="hero-graphics-container">
          <motion.div 
            className="hero-illustration-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -12, 0] // Creates a smooth floating effect
            }}
            transition={{
              opacity: { duration: 0.8 },
              y: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
              }
            }}
          >
            {/* Center Core Identity Card */}
            <div className="grid-card core-card">
              <div className="card-icon-wrapper core-icon">🤝</div>
              <h3>Community Hero</h3>
              <p>Active Ecosystem</p>
            </div>

            {/* Individual Impact Pill Cards */}
            <div className="grid-card Feature-pill cp-1">
              <FaUsers className="icon-blue" />
              <span>Community Hub</span>
            </div>

            <div className="grid-card Feature-pill cp-2">
              <FaHandsHelping className="icon-green" />
              <span>Volunteering</span>
            </div>

            <div className="grid-card Feature-pill cp-3">
              <FaHeart className="icon-pink" />
              <span>Helping People</span>
            </div>

            <div className="grid-card Feature-pill cp-4">
              <FaLeaf className="icon-emerald" />
              <span>Environment</span>
            </div>

            <div className="grid-card Feature-pill cp-5">
              <FaShieldAlt className="icon-amber" />
              <span>Local Safety</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;