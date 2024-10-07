// src/components/Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ currentPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Cambia esto a la ruta de logout si es necesario
  };

  return (
    <div className="bg-gray-800 text-white w-64 h-screen flex flex-col">
      <div className="p-4 text-center text-2xl font-bold">Menú</div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          {currentPage !== 'inicio' && (
            <li>
              <Link to="/home" className="block p-2 hover:bg-gray-700 rounded">
                Inicio
              </Link>
            </li>
          )}
          {currentPage !== 'perfil' && (
            <li>
              <Link to="/perfil" className="block p-2 hover:bg-gray-700 rounded">
                Mi perfil
              </Link>
            </li>
          )}
          <li>
            <Link to="/reservas" className="block p-2 hover:bg-gray-700 rounded">
              Reservar Servicio
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-600 text-white p-2 rounded hover:bg-red-500"
            >
              Cerrar Sesión
            </button>
          </li>
          {/* Agrega más opciones según sea necesario */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
