import React from 'react';
import './Filter.css';

export default function Filter({
  label,
  options = [],
  value,
  onChange,
}) {
  return (
    <div className="filter-container">
      {label && <label className="filter-label">{label}</label>}
      <div className="filter-select-wrapper">
        <select
          className="filter-select"
          value={value}
          onChange={onChange}
        >
          {options.map((option, index) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            return (
              <option key={index} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <div className="filter-chevron">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}