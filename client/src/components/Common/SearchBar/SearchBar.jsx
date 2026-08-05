import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search issues, locations...',
  onClear
}) {
  return (
    <div className="search-bar-wrapper">
      <FiSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-clear-btn" onClick={onClear} aria-label="Clear Search">
          <FiX />
        </button>
      )}
    </div>
  );
}