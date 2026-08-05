import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './Contact.css';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h2>Get in Touch with Municipal Support</h2>
        <p>Have questions, feedback, or need assistance? Reach out to our ward support team.</p>
      </div>

      <div className="contact-grid-split">
        <div className="contact-info-card">
          <h3>Contact Information</h3>
          <div className="contact-info-item">
            <FiPhone className="c-icon" />
            <div>
              <strong>Helpline</strong>
              <p>+1 (800) 555-HERO</p>
            </div>
          </div>
          <div className="contact-info-item">
            <FiMail className="c-icon" />
            <div>
              <strong>Email Support</strong>
              <p>support@communityhero.org</p>
            </div>
          </div>
          <div className="contact-info-item">
            <FiMapPin className="c-icon" />
            <div>
              <strong>Headquarters</strong>
              <p>Municipal Civic Center, Ward 1, Metropolis</p>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <h3>Send Us a Message</h3>
          {sent ? (
            <div className="success-feedback">
              <FiCheckCircle className="success-icon" />
              <h4>Message Sent!</h4>
              <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" required placeholder="Jyoshna Kosana" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="jyoshna@example.com" />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" required placeholder="Ward assistance inquiry" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="4" required placeholder="Type your message here..."></textarea>
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}