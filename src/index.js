// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';  // Registrar el SW

// Import reportWebVitals (optional)
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (e.g., reportWebVitals(console.log))
reportWebVitals();

if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then(function (permission) {
    if (permission === 'granted') {
      console.log('Permiso de notificaciones concedido.');
    } else {
      console.log('Permiso de notificaciones denegado.');
    }
  });
}