// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Automatically route any localhost API calls to VITE_API_URL in production
const PROD_API_BASE = import.meta.env.VITE_API_URL;
if (PROD_API_BASE) {
  const cleanProdBase = PROD_API_BASE.replace(/\/$/, '');
  axios.interceptors.request.use((config) => {
    if (config.url && config.url.includes('http://localhost:5000/api')) {
      config.url = config.url.replace('http://localhost:5000/api', cleanProdBase);
    } else if (config.url && config.url.startsWith('http://localhost:5000')) {
      config.url = config.url.replace('http://localhost:5000', cleanProdBase.replace(/\/api$/, ''));
    }
    return config;
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);