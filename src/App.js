// src/App.js
import React from 'react';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Bienvenido al Portal del Spa Sentirse Bien
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  );
}

export default App;
