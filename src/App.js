// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Pagos from './components/Pagos';
import Informes from './components/Informes'; 
import PanelEmpleado from './components/PanelEmpleado';
import PanelProfesional from './components/PanelProfesional';


function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthContext.Consumer>
          {({ isAuthenticated }) => (
            <div className="flex">
              {/* Renderizar Sidebar solo si el usuario está autenticado */}
              {isAuthenticated && useLocation.pathname !== '/' && <Sidebar />}

              {/* Contenedor principal para las rutas */}
              <div className="flex-1">
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Rutas protegidas */}
                  <Route path="/home" element={<PrivateRoute element={Home} />} />
                  <Route path="/perfil" element={<PrivateRoute element={Profile} />} />
                  <Route path="/admin" element={<PrivateRoute element={AdminHome} roles={['admin']} />} />
                  <Route path="/reservar-servicio" element={<PrivateRoute element={ReservaServicio} roles={['Cliente']} />} />
                  <Route path="/historial-reservas" element={<PrivateRoute element={HistorialReservas} roles={['Cliente']} />} />
                  <Route path="/pagos" element={<PrivateRoute element={Pagos} roles={['Cliente']} />} />
                  <Route path="/informes" element={<PrivateRoute element={Informes} roles={['admin', 'Empleado']} />} />
                  <Route path="/panelempleado" element={<PrivateRoute element={PanelEmpleado} roles={['admin', 'Empleado']} />} />
                  <Route path="/panelprofesional" element={<PrivateRoute element={PanelProfesional} roles={['Profesional']} />} />
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
