import React from 'react';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search issues...',
}) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}