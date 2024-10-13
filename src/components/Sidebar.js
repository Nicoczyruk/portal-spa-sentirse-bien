// src/components/Sidebar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Importa AuthContext

const Sidebar = ({ currentPage }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Obtiene logout del contexto

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Importante para enviar cookies de sesión
      });

      const result = await response.json();

      if (response.ok) {
        logout(); // Actualiza el estado de autenticación en el frontend
        navigate('/'); // Redirige al inicio de sesión
      } else {
        console.error('Error al cerrar sesión:', result.error);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  return (
    <div className="bg-white text-gray-800 w-64 h-screen flex flex-col relative">
      {/* Sidebar blanco */}
      <div className="absolute inset-0 bg-[rgb(237_247_222/0.8)] bg-cover"></div>
      <div className="p-4 text-center text-2xl font-bold z-10 relative">Menú</div>
      {/* Texto sobre la imagen */}
      <nav className="flex-1 z-10 relative">
        <ul className="space-y-2 p-4">
          {currentPage !== 'inicio' && (
            <li>
              <Link to="/home" className="block p-2 hover:bg-gray-300 rounded">
                Inicio
              </Link>
            </li>
          )}
          {currentPage !== 'perfil' && (
            <li>
              <Link to="/perfil" className="block p-2 hover:bg-gray-300 rounded">
                Mi perfil
              </Link>
            </li>
          )}
          {currentPage !== 'reservas' && (
            <li>
              <Link to="/reservas" className="block p-2 hover:bg-gray-300 rounded">
                Reservar Servicio
              </Link>
            </li>
          )}
          <li>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600 text-white p-2 rounded-full hover:bg-red-500"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
