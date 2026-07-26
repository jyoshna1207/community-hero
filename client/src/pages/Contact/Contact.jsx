import React from 'react';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaQuestionCircle,
  FaLightbulb,
  FaBug
} from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const contactDetails = [
    {
      icon: <FaEnvelope className="contact-icon" />,
      title: 'Email',
      value: 'support@communityhero.com'
    },
    {
      icon: <FaPhoneAlt className="contact-icon" />,
      title: 'Phone',
      value: '+91 98765 43210'
    },
    {
      icon: <FaMapMarkerAlt className="contact-icon" />,
      title: 'Location',
      value: 'Visakhapatnam, Andhra Pradesh'
    },
    {
      icon: <FaClock className="contact-icon" />,
      title: 'Working Hours',
      value: 'Monday – Saturday: 9:00 AM – 6:00 PM'
    }
  ];

  const whyContactPoints = [
    {
      icon: <FaQuestionCircle className="why-icon" />,
      title: 'General Questions',
      description: 'Inquire about platform features, community guidelines, or general usage.'
    },
    {
      icon: <FaLightbulb className="why-icon" />,
      title: 'Project Suggestions',
      description: 'Share your innovative ideas to help improve local community engagement.'
    },
    {
      icon: <FaBug className="why-icon" />,
      title: 'Report Platform Issues',
      description: 'Let us know if you encounter any technical bugs or display errors.'
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        
        {/* Page Header */}
        <header className="contact-header">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Have a question, suggestion, or feedback? We'd love to hear from you.
          </p>
        </header>

        {/* Two-Column Main Layout */}
        <div className="contact-grid">
          
          {/* Left Section - Contact Info Card */}
          <section className="contact-info-card">
            <h2 className="section-heading">Get In Touch</h2>
            <div className="contact-info-list">
              {contactDetails.map((item, index) => (
                <div key={index} className="contact-info-item">
                  <div className="icon-wrapper">{item.icon}</div>
                  <div className="info-content">
                    <span className="info-title">{item.title}</span>
                    <p className="info-value">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Section - Feedback Form */}
          <section className="feedback-form-card">
            <h2 className="section-heading">Send Feedback</h2>
            <form className="feedback-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Write your feedback or message..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <span>Send Message</span>
                <FaPaperPlane className="btn-icon" />
              </button>
            </form>
          </section>

        </div>

        {/* Optional Info Card - Why Contact Us */}
        <section className="why-contact-card">
          <h2 className="section-heading text-center">Why Contact Us?</h2>
          <div className="why-grid">
            {whyContactPoints.map((point, index) => (
              <div key={index} className="why-item">
                <div className="why-icon-wrapper">{point.icon}</div>
                <h3 className="why-title">{point.title}</h3>
                <p className="why-description">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;