import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="common-footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-brand">
            <FiShield className="footer-logo-icon" />
            <span>Community Hero</span>
          </div>
          <p className="footer-desc">
            Empowering citizens and local authorities to resolve community issues collaboratively and efficiently.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/issues">Browse Issues</Link></li>
            <li><Link to="/report-issue">Report Problem</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support & Contact</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/faq">FAQ & Help</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#github" aria-label="Github"><FiGithub /></a>
            <a href="#twitter" aria-label="Twitter"><FiTwitter /></a>
            <a href="#linkedin" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="#email" aria-label="Email"><FiMail /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Community Hero – Hyperlocal Problem Solver. All rights reserved.</p>
      </div>
    </footer>
  );
}