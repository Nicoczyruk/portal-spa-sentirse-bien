// src/components/Home.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('inicio');
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() =>{
    setCurrentPage('inicio');
  }, []);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar currentPage = {currentPage}/>} {/* Renderiza la sidebar solo si isSidebarOpen es true */}
      <div className="flex-1 bg-spa-verde-claro min-h-screen p-8 flex flex-col items-center"> {/* Contenedor principal */}
        
        {/* Botón hamburguesa en la parte superior izquierda */}
        <button
          className="absolute top-4 left-4 p-2 bg-gray-800 text-white rounded hover:bg-blue-600 flex items-center z-10"
          onClick={toggleSidebar} // Agrega el evento de clic al botón
        >
          <div className="flex flex-col space-y-1">
            <div className="h-1 w-8 bg-spa-verde-oscuro"></div>
            <div className="h-1 w-8 bg-spa-verde-oscuro"></div>
            <div className="h-1 w-8 bg-spa-verde-oscuro"></div>
          </div>
        </button>
        
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Bienvenido al Portal del Spa Sentirse Bien
        </h1>

        <img
          src="./logo.png"
          alt="Logo del Spa"
          style={{ width: '300px', height: '200px' }}
          className="mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"> {/* Asegúrate de que el grid ocupe todo el ancho */}
          {/* Tarjeta 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">Masaje Relajante</h2>
            <p className="text-gray-700">
              Disfruta de un masaje relajante para aliviar el estrés y las tensiones.
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600">
              Reservar
            </button>
          </div>
          {/* Tarjeta 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Tratamiento Facial</h2>
            <p className="text-gray-700">
              Revitaliza tu piel con nuestros tratamientos faciales personalizados.
            </p>
            <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600">
              Reservar
            </button>
          </div>
          {/* Tarjeta 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">Aromaterapia</h2>
            <p className="text-gray-700">
              Experimenta la relajación profunda con nuestras sesiones de aromaterapia.
            </p>
            <button className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600">
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
