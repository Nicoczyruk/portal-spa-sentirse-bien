// src/components/HistorialReservas.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const HistorialReservas = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.id_cliente) {
      navigate('/login'); // Redirigir al login si no está autenticado
      return;
    }

    const fetchReservas = async () => {
      try {
        const response = await fetch('/api/cliente/reservas', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setReservas(data.reservas);
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error al obtener las reservas.');
        }
      } catch (error) {
        setError('Error al conectar con el servidor.');
      }
    };

    fetchReservas();
  }, [isAuthenticated, user, navigate]);

  // Función para cancelar una reserva
  const cancelarReserva = async (id_turno) => {
    try {
      const response = await fetch(`/api/cliente/cancelar-reserva/${id_turno}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setMensaje('Reserva cancelada exitosamente.');
        // Actualizar la lista de reservas
        setReservas(reservas.filter((reserva) => reserva.id_turno !== id_turno));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al cancelar la reserva.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
    }
  };

  // Función para modificar una reserva
  const modificarReserva = (id_turno) => {
    // Redirigir a una página o mostrar un modal para modificar la reserva
    navigate(`/modificar-reserva/${id_turno}`);
  };

  return (
    <div className="flex">
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
        {mensaje && <p className="text-green-500 mb-4">{mensaje}</p>}

        {/* Advertencia de cancelación */}
        <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 w-full max-w-4xl">
          <div className="mr-2">
            {/* Ícono de advertencia */}
          </div>
          <p className="text-sm">
            Recuerda que tus reservas serán <b>canceladas</b> automáticamente si no se pagan al menos 48 horas antes del turno.
          </p>
        </div>

        <div className="overflow-x-auto bg-[rgba(237,247,222,0.8)] shadow-md rounded-lg">
          <table className="min-w-full bg-[rgba(237,247,222,0.8)] border">
            <thead>
              <tr className="bg-[rgba(76,175,80,0.8)] text-center">
                <th className="py-2 px-4 border-b text-white">Servicio</th>
                <th className="py-2 px-4 border-b text-white">Fecha</th>
                <th className="py-2 px-4 border-b text-white">Hora</th>
                <th className="py-2 px-4 border-b text-white">Estado</th>
                <th className="py-2 px-4 border-b text-white">Pago</th>
                <th className="py-2 px-4 border-b text-white">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {reservas.length > 0 ? (
                reservas.map((reserva) => (
                  <tr key={reserva.id_turno} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{reserva.servicio}</td>
                    <td className="py-2 px-4 border-b">{reserva.fecha}</td>
                    <td className="py-2 px-4 border-b">{reserva.hora}</td>
                    <td className="py-2 px-4 border-b">{reserva.estado}</td>
                    <td className="py-2 px-4 border-b">{reserva.pago}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => modificarReserva(reserva.id_turno)}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 ${reserva.estado === 'Realizado' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={reserva.estado === 'Realizado' || reserva.pago !== 'Pendiente'}
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => cancelarReserva(reserva.id_turno)}
                        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ${reserva.estado === 'Realizado' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={reserva.estado === 'Realizado'}
                      >
                        Cancelar
                      </button>
                    </td>
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
