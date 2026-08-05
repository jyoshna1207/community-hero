// 4. File path: src/components/common/Breadcrumb.jsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="hero-breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

          return (
            <li key={routeTo} className={isLast ? 'breadcrumb-item active' : 'breadcrumb-item'}>
              <span className="breadcrumb-separator">&gt;</span>
              {isLast ? (
                <span>{formattedName}</span>
              ) : (
                <Link to={routeTo}>{formattedName}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}