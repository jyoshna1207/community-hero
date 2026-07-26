import React from 'react';
import './Button.css';

export default function Button({
  text,
  type = 'button',
  onClick,
  disabled = false,
  icon = null,
  variant = 'primary',
}) {
  return (
    <button
      type={type}
      className={`custom-btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{text}</span>
    </button>
  );
}