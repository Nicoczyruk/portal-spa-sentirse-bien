// src/components/HistorialReservas.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const HistorialReservas = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.id_cliente) {
      navigate('/login'); // Redirigir al login si no está autenticado
      return;
    }

    const fetchHistorial = async () => {
      try {
        const response = await fetch('/api/reservas/historial', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setReservas(data.historial);
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error al obtener el historial de reservas.');
        }
      } catch (error) {
        setError('Error al conectar con el servidor.');
      }
    };

    fetchHistorial();
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex">
      {/* Sidebar ya está gestionada globalmente en App.js */}

      {/* Contenedor principal para la página de historial */}
      <div className="flex-1 min-h-screen p-8 flex flex-col items-center"
        style={{
          backgroundImage: 'url(./edicion7.png)', // Ruta de la imagen
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      > 
        <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
          Historial de Reservas
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="py-2 px-4 border-b">ID Turno</th>
                <th className="py-2 px-4 border-b">Fecha</th>
                <th className="py-2 px-4 border-b">Hora</th>
                <th className="py-2 px-4 border-b">Estado</th>
                <th className="py-2 px-4 border-b">Pago</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {reservas.length > 0 ? (
                reservas.map(reserva => (
                  <tr key={reserva.id_turno} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{reserva.id_turno}</td>
                    <td className="py-2 px-4 border-b">{reserva.fecha}</td>
                    <td className="py-2 px-4 border-b">{reserva.hora}</td>
                    <td className="py-2 px-4 border-b">{reserva.estado}</td>
                    <td className="py-2 px-4 border-b">{reserva.pago}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-2 px-4 border-b">No tienes reservas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorialReservas;
