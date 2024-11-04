import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(
    () => localStorage.getItem('sidebarOpen') === 'true'
  );

  // Estado para almacenar el evento beforeinstallprompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInstallAvailable, setIsInstallAvailable] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', isOpen);
  }, [isOpen]);

  useEffect(() => {
    // Detectar si el dispositivo es móvil
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(userAgent)) {
        return true;
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
      }
      return false;
    };

    setIsMobile(checkIfMobile());

    // Escuchar el evento beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallAvailable(true); // Indica que la opción de instalación está disponible
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!isMobile) {
      alert('No está en un dispositivo móvil');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
      } else {
        console.log('Usuario rechazó la instalación');
      }
      setDeferredPrompt(null);
      setIsInstallAvailable(false); // Opcional: Ocultar el botón después de la acción
    } else {
      alert('La opción de instalación no está disponible en este momento');
    }
  };

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
  if (path === '/panelProfesional') currentPage = 'panel-Profesional';

  return (
    <>
      <button
        className="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded hover:bg-blue-600 flex items-center z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </div>
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-white text-gray-800 w-64 flex flex-col shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-40`}
      >
        <div className="absolute inset-0 bg-[rgba(237,247,222,0.8)] bg-cover"></div>

        <div className="p-4 text-center text-2xl font-bold z-10 relative border-b">
          Menú
        </div>

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

            {/* Botón para instalar la PWA */}
            <li>
              <button
                onClick={handleInstallClick}
                className={`block p-2 hover:bg-gray-300 rounded w-full text-left`}
              >
                Instala nuestra app móvil
              </button>
            </li>

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

        {/* Footer con los nombres del grupo */}
        <div className="p-4 text-center text-gray-600 text-sm">
          <span className="cursor-pointer group relative">
            Created by Grupo 6
            <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded p-2 mt-2">
              <ul className="text-gray-800">
                <li>Giovanni Pellizari</li>
                <li>Czyruk Nicolas</li>
                <li>Aguirre Gonzalo</li>
              </ul>
            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
