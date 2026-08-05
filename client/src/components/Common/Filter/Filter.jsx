import React from 'react';
import { FiFilter } from 'react-icons/fi';
import './Filter.css';

export default function Filter({
  filters = [],
  values = {},
  onChange
}) {
  return (
    <div className="filter-container">
      <div className="filter-header-icon">
        <FiFilter />
      </div>
      {filters.map((filter, index) => (
        <div key={index} className="filter-group">
          <select
            className="filter-select"
            value={values[filter.name] || ''}
            onChange={(e) => onChange(filter.name, e.target.value)}
          >
            <option value="">{filter.placeholder || `All ${filter.label}`}</option>
            {filter.options.map((opt, i) => (
              <option key={i} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}