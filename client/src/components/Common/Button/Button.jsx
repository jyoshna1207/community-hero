import React from 'react';
import './Button.css';

export default function Button({
  text,
  variant = 'primary',
  icon = null,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) {
  return (
    <button
      type={type}
      className={`common-btn btn-${variant} ${loading ? 'btn-loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          <span className="btn-text">{text}</span>
        </>
      )}
    </button>
  );
}