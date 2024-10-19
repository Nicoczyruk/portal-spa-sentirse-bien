import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  // Estado inicial basado en el valor de localStorage
  const [isOpen, setIsOpen] = useState(
    () => localStorage.getItem('sidebarOpen') === 'true' // Recupera el estado desde localStorage
  );

  useEffect(() => {
    // Guarda el estado en localStorage cada vez que cambie el estado del sidebar
    localStorage.setItem('sidebarOpen', isOpen);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        logout();
        navigate('/');
      } else {
        console.error('Error al cerrar sesión:', result.error);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  const path = location.pathname;
  let currentPage = '';
  if (path === '/home') currentPage = 'inicio';
  if (path === '/perfil') currentPage = 'perfil';
  if (path === '/reservar-servicio') currentPage = 'reservar-servicio';
  if (path === '/historial-reservas') currentPage = 'historial-reservas';
  if (path === '/pagos') currentPage = 'pagos';
  if (path === '/admin') currentPage = 'admin';
  if (path === '/informes') currentPage = 'informes';
  if (path === '/Empleado/pagos') currentPage = 'panel-Empleado';
  if (path === '/panelProfesional') currentPage = 'panel-Profesional'; // Nueva ruta

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <button
        className="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded hover:bg-blue-600 flex items-center z-50"
        onClick={() => setIsOpen(!isOpen)} // Cambia el estado al hacer clic
      >
        <div className="flex flex-col space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white text-gray-800 w-64 flex flex-col shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-40`}
      >
        {/* Fondo semi-transparente */}
        <div className="absolute inset-0 bg-[rgba(237,247,222,0.8)] bg-cover"></div>

        {/* Título de la Sidebar */}
        <div className="p-4 text-center text-2xl font-bold z-10 relative border-b">
          Menú
        </div>

        {/* Enlaces de navegación */}
        <nav className="flex-1 p-4 z-10 relative">
          <ul className="space-y-2">
            {user && user.rol === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'admin' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Panel Admin
                </Link>
              </li>
            )}

            {currentPage !== 'inicio' && (
              <li>
                <Link
                  to="/home"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'inicio' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Inicio
                </Link>
              </li>
            )}

            {currentPage !== 'perfil' && (
              <li>
                <Link
                  to="/perfil"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'perfil' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Mi perfil
                </Link>
              </li>
            )}

            {currentPage !== 'reservar-servicio' && user.rol === 'Cliente' && (
              <li>
                <Link
                  to="/reservar-servicio"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'reservar-servicio' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Reservar Servicio
                </Link>
              </li>
            )}

            {currentPage !== 'historial-reservas' && user.rol === 'Cliente' && (
              <li>
                <Link
                  to="/historial-reservas"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'historial-reservas' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Historial de Reservas
                </Link>
              </li>
            )}

            {currentPage !== 'pagos' && user.rol === 'Cliente' && (
              <li>
                <Link
                  to="/pagos"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'pagos' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Pagos
                </Link>
              </li>
            )}

            {currentPage !== 'informes' && ['admin', 'Empleado'].includes(user.rol) && (
              <li>
                <Link
                  to="/informes"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'informes' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Informes
                </Link>
              </li>
            )}

            {currentPage !== 'panelempleado' && ['admin', 'Empleado'].includes(user.rol) && (
              <li>
                <Link
                  to="/panelEmpleado"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'panel-Empleado' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Panel Empleado
                </Link>
              </li>
            )}

            {currentPage !== 'panelprofesional' && user.rol === 'Profesional' && (
              <li>
                <Link
                  to="/panelprofesional"
                  className={`block p-2 hover:bg-gray-300 rounded ${
                    currentPage === 'panel-profesional' ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Panel Profesional
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="mt-4 w-full bg-red-600 text-white p-2 rounded-full hover:bg-red-500"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
