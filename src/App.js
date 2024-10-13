// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Importa el AuthProvider
import PrivateRoute from './components/PrivateRoute'; // Importa PrivateRoute
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import ReservaServicio from './components/ReservaServicio';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Ruta de login */}
          <Route path="/register" element={<Register />} />
          {/* Rutas protegidas */}
          <Route path="/home" element={<PrivateRoute element={Home} />} />
          <Route path="/perfil" element={<PrivateRoute element={Profile} />} />
          <Route path="/reservas" element={<PrivateRoute element={ReservaServicio} />} />
          {/* Aquí puedes agregar otras rutas en el futuro */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
