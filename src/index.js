// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import the register function from serviceWorkerRegistration
import { register } from './serviceWorkerRegistration';

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
