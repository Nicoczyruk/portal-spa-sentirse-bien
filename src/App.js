// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import ReservaServicio from './components/ReservaServicio';
import HistorialReservas from './components/HistorialReservas';
import Register from './components/Register';
import AdminHome from './components/AdminHome'; 
import Sidebar from './components/Sidebar';
import { AuthProvider, AuthContext } from './AuthContext'; 
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthContext.Consumer>
          {({ isAuthenticated }) => (
            <div className="flex">
              {/* Renderizar Sidebar solo si el usuario está autenticado */}
              {isAuthenticated && <Sidebar />}

              {/* Contenedor principal para las rutas */}
              <div className="flex-1">
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Rutas protegidas */}
                  <Route path="/home" element={<PrivateRoute element={Home} />} />
                  <Route path="/perfil" element={<PrivateRoute element={Profile} />} />
                  <Route path="/reservar-servicio" element={<PrivateRoute element={ReservaServicio} />} />
                  <Route path="/historial-reservas" element={<PrivateRoute element={HistorialReservas} />} />

                  {/* Ruta protegida para AdminHome */}
                  <Route path="/admin" element={<PrivateRoute element={AdminHome} roles={['admin']} />} />
                </Routes>
              </div>
            </div>
          )}
        </AuthContext.Consumer>
      </Router>
    </AuthProvider>
  );
}

export default App;
