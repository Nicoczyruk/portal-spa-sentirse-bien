// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { register } from './serviceWorkerRegistration';  // Registrar el SW

// Import reportWebVitals (optional)
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker
register();

// If you want to start measuring performance in your app, pass a function
// to log results (e.g., reportWebVitals(console.log))
reportWebVitals();
