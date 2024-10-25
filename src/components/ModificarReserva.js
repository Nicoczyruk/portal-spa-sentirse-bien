// src/components/ModificarReserva.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ModificarReserva = () => {
  const { id_turno } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // Servicios hardcoded (puedes extraerlos a un archivo común si lo prefieres)
  const services_data = {
    Masajes: [
      { id: 1, name: 'Anti-stress', description: 'Relajación profunda.', price: 40 },
      { id: 2, name: 'Descontracturantes', description: 'Alivio de tensiones musculares.', price: 50 },
      { id: 3, name: 'Masajes con piedras calientes', description: 'Terapia con piedras calientes.', price: 60 },
      { id: 4, name: 'Circulatorios', description: 'Mejora la circulación.', price: 55 },
    ],
    Belleza: [
      { id: 5, name: 'Lifting de pestaña', description: 'Realza tus pestañas.', price: 70 },
      { id: 6, name: 'Depilación facial', description: 'Elimina vello facial.', price: 30 },
      { id: 7, name: 'Belleza de manos y pies', description: 'Cuidado integral.', price: 45 },
    ],
    'Tratamientos Faciales': [
      { id: 8, name: 'Punta de Diamante', description: 'Exfoliación avanzada.', price: 80 },
      { id: 9, name: 'Limpieza profunda + Hidratación', description: 'Cuidado completo de la piel.', price: 90 },
      { id: 10, name: 'Crio frecuencia facial', description: 'Reafirmante y rejuvenecedor.', price: 100 },
    ],
    'Tratamientos Corporales': [
      { id: 11, name: 'VelaSlim', description: 'Reducción de medidas.', price: 120 },
      { id: 12, name: 'DermoHealth', description: 'Salud de la piel.', price: 110 },
      { id: 13, name: 'Criofrecuencia', description: 'Terapia de frío.', price: 115 },
      { id: 14, name: 'Ultracavitación', description: 'Eliminación de grasa localizada.', price: 105 },
    ],
  };

  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Obtener los datos actuales de la reserva
      const fetchReserva = async () => {
        try {
          const response = await fetch(`/api/cliente/reserva/${id_turno}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setFecha(data.fecha);
            setHora(data.hora);
            setServicioSeleccionado(data.nombre_servicio);
            // Generar horarios disponibles
            updateAvailableTimes(data.fecha);
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Error al obtener la reserva.');
          }
        } catch (error) {
          setError('Error al conectar con el servidor.');
        }
      };

      fetchReserva();
    }
  }, [isAuthenticated, navigate, id_turno]);

  // Función para generar los turnos cada 30 minutos de 8 AM a 8 PM
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 0;
    while (hour < 20 || (hour === 20 && minute === 0)) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
      minute += 30;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }
    return slots;
  };

  // Función para obtener las horas reservadas desde el backend
  const fetchReservedTimes = async (fechaSeleccionada) => {
    try {
      const response = await fetch(`/api/reservas/horas-reservadas/${fechaSeleccionada}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data.horas_reservadas;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al obtener las horas reservadas.');
        return [];
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
      return [];
    }
  };

  // Actualizar las horas disponibles cuando se selecciona una fecha
  const updateAvailableTimes = async (fechaSeleccionada) => {
    if (fechaSeleccionada) {
      const reservedTimes = await fetchReservedTimes(fechaSeleccionada);
      const allTimes = generateTimeSlots();
      // Excluir la hora actual de la reserva para permitir modificarla sin conflictos
      const reservedTimesExcluyendoActual = reservedTimes.filter((time) => time !== hora);
      const updatedTimes = allTimes.filter((time) => !reservedTimesExcluyendoActual.includes(time));
      setAvailableTimes(updatedTimes);
    } else {
      setAvailableTimes(generateTimeSlots());
    }
  };

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
    setHora(''); // Resetear la hora seleccionada al cambiar la fecha
    updateAvailableTimes(e.target.value);
  };

  const handleServicioChange = (e) => {
    setServicioSeleccionado(e.target.value);
  };

  const handleHoraChange = (e) => {
    setHora(e.target.value);
  };

  const handleModificar = async () => {
    const datosModificados = {};
    if (fecha && fecha !== '') datosModificados.fecha = fecha;
    if (hora && hora !== '') datosModificados.hora = hora;

    if (servicioSeleccionado && servicioSeleccionado !== '') {
      // Obtener el id_servicio basado en el nombre del servicio seleccionado
      const obtenerIdServicio = (nombreServicio) => {
        for (const categoria in services_data) {
          const servicio = services_data[categoria].find((s) => s.name === nombreServicio);
          if (servicio) return servicio.id;
        }
        return null;
      };

      const id_servicio = obtenerIdServicio(servicioSeleccionado);
      if (!id_servicio) {
        setError('Servicio seleccionado inválido.');
        setMensaje('');
        return;
      }
      datosModificados.id_servicio = id_servicio;
    }

    if (Object.keys(datosModificados).length === 0) {
      setError('No hay cambios para modificar.');
      setMensaje('');
      return;
    }

    try {
      const response = await fetch(`/api/cliente/modificar-reserva/${id_turno}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosModificados),
      });

      if (response.ok) {
        setMensaje('Reserva modificada exitosamente.');
        navigate('/historial-reservas'); // Redirigir al historial de reservas
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al modificar la reserva.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div
      className="flex-1 min-h-screen p-8 flex flex-col items-center"
      style={{
        backgroundImage: 'url(./verde3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
        Modificar Reserva
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {mensaje && <p className="text-green-500 mb-4">{mensaje}</p>}

      <div className="bg-[rgba(237,247,222,0.8)] p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Servicio */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Servicio:
          </label>
          <select
            value={servicioSeleccionado}
            onChange={handleServicioChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          >
            <option value="">Seleccione un servicio</option>
            {Object.keys(services_data).map((categoria) => (
              <optgroup label={categoria} key={categoria}>
                {services_data[categoria].map((servicio) => (
                  <option key={servicio.id} value={servicio.name}>
                    {servicio.name} - ${servicio.price}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha:
          </label>
          <input
            type="date"
            value={fecha}
            onChange={handleFechaChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            min={fecha} // No permitir cambiar a una fecha anterior a la original
          />
        </div>

        {/* Hora */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hora:
          </label>
          <select
            value={hora}
            onChange={handleHoraChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          >
            <option value="">Seleccione una hora</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleModificar}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          >
            Modificar Reserva
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModificarReserva;
