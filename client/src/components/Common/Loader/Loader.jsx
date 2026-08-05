// 3. File path: src/components/common/Loader.jsx

import React from 'react';
import './Loader.css';

export default function Loader({ text = 'Loading Community Hero...' }) {
  return (
    <div className="hero-loader-overlay">
      <div className="hero-spinner-container">
        <div className="hero-spinner"></div>
        <p className="hero-loader-text">{text}</p>
      </div>
    </div>
  );
}