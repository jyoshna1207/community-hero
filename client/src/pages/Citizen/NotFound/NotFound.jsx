import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <FiAlertTriangle className="not-found-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary">Go Back Home</Link>
      </div>
    </div>
  );
}