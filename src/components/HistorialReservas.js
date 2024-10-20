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
      <div
        className="flex-1 min-h-screen p-8 flex flex-col items-center"
        style={{
          backgroundImage: 'url(./verde3.png)', // Ruta de la imagen
          backgroundSize: 'cover', // Ajusta la imagen para que cubra todo el fondo
          backgroundPosition: 'center', // Centra la imagen
          backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
        }}
      >
        <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
          Historial de Reservas
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Advertencia de cancelación */}
        <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 w-full max-w-4xl">
          <div className="mr-2">
            <svg
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.516 11.607c.75 1.338-.213 3.044-1.742 3.044H3.483c-1.53 0-2.492-1.706-1.742-3.044L8.257 3.1zM9 13a1 1 0 102 0 1 1 0 00-2 0zm.25-4.75a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm">
            Recuerda que tus reservas serán <b>canceladas</b> automáticamente si no se pagan al menos 48 horas antes del turno.
          </p>
        </div>

        <div className="overflow-x-auto bg-[rgba(237,247,222,0.8)] shadow-md rounded-lg">
          <table className="min-w-full bg-[rgba(237,247,222,0.8)] border">
            <thead>
              <tr className="bg-[rgba(76,175,80,0.8)] text-center">
                <th className="py-2 px-4 border-b text-white">ID Turno</th>
                <th className="py-2 px-4 border-b text-white">Servicio</th> {/* Nueva columna */}
                <th className="py-2 px-4 border-b text-white">Fecha</th>
                <th className="py-2 px-4 border-b text-white">Hora</th>
                <th className="py-2 px-4 border-b text-white">Estado</th>
                <th className="py-2 px-4 border-b text-white">Pago</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {reservas.length > 0 ? (
                reservas.map((reserva) => (
                  <tr key={reserva.id_turno} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{reserva.id_turno}</td>
                    <td className="py-2 px-4 border-b">{reserva.servicio}</td> {/* Nueva celda */}
                    <td className="py-2 px-4 border-b">{reserva.fecha}</td>
                    <td className="py-2 px-4 border-b">{reserva.hora}</td>
                    <td className="py-2 px-4 border-b">{reserva.estado}</td>
                    <td className="py-2 px-4 border-b">{reserva.pago}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-2 px-4 border-b">
                    No tienes reservas.
                  </td>
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
