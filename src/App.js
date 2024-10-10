// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Asegúrate de que la ruta sea correcta
import Home from './components/Home'
import Profile from './components/Profile'
import ReservaServicio from './components/ReservaServicio';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Esta es la ruta para el Login */}
        <Route path="/home" element = {<Home />} />
        <Route path="/perfil" element = {<Profile />} />
        <Route path="/reservas" element={<ReservaServicio />} />
        {/* Aquí puedes agregar otras rutas en el futuro */}
      </Routes>
    </Router>
  );
}

export default App;
