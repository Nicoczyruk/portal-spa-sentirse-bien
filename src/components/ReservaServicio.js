// src/components/ReservaServicio.js

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';


const ReservaServicio = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  // Servicios hardcoded
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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Generar los turnos cada 30 minutos de 8 AM a 8 PM
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

  // Restringir la selección de fechas a partir de 72 horas
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getTime() + 72 * 60 * 60 * 1000);
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, '0');
    const day = String(minDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.id_cliente) {
      navigate('/login'); // Redirigir al login si no está autenticado
      return;
    }

    setAvailableTimes(generateTimeSlots());
  }, [isAuthenticated, user, navigate]);

  // Función para obtener las horas reservadas desde el backend
  const fetchReservedTimes = async (fecha) => {
    try {
      const response = await fetch(`/api/reservas/horas-reservadas/${fecha}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data.horas_reservadas;
      } else if (response.status === 401) {
        navigate('/login');
        return [];
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al obtener las horas reservadas.');
        return [];
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      setError('Error al conectar con el servidor.');
      return [];
    }
  };

  // Actualizar las horas disponibles cuando se selecciona una fecha
  useEffect(() => {
    const updateAvailableTimes = async () => {
      if (selectedDate) {
        const reservedTimes = await fetchReservedTimes(selectedDate);
        const allTimes = generateTimeSlots();
        const updatedTimes = allTimes.filter(time => !reservedTimes.includes(time));
        setAvailableTimes(updatedTimes);
      } else {
        setAvailableTimes(generateTimeSlots());
      }
    };

    updateAvailableTimes();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(''); // Resetear la hora seleccionada al cambiar la fecha
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleServicioChange = (e) => {
    setServicioSeleccionado(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!servicioSeleccionado || !selectedDate || !selectedTime) {
      setError('Por favor, completa todos los campos.');
      setSuccess('');
      return;
    }

    // Obtener el id_servicio basado en el nombre del servicio seleccionado
    const obtenerIdServicio = (nombreServicio) => {
      for (const categoria in services_data) {
        const servicio = services_data[categoria].find(s => s.name === nombreServicio);
        if (servicio) return servicio.id;
      }
      return null;
    };

    const id_servicio = obtenerIdServicio(servicioSeleccionado);
    if (!id_servicio) {
      setError('Servicio seleccionado inválido.');
      setSuccess('');
      return;
    }

    // Preparar los datos de la reserva
    const reservaData = {
      fecha: selectedDate,
      hora: selectedTime,
      id_servicio: id_servicio,
    };

    try {
      const response = await fetch('/api/reservas/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reservaData)
      });

      const result = await response.json();

      if (response.status === 201) {
        setSuccess('Reserva creada exitosamente.');
        setError('');
        // Actualizar las horas disponibles
        setAvailableTimes(prevTimes => prevTimes.filter(time => time !== selectedTime));
        // Resetear el formulario
        setSelectedDate('');
        setSelectedTime('');
        setServicioSeleccionado('');
        // Redirigir al historial de reservas
        navigate('/historial-reservas');
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        setError(result.error || 'Error al crear la reserva.');
        setSuccess('');
      }
    } catch (error) {
      setError('Error al conectar con el servidor.');
      setSuccess('');
    }
  };

  return (
    <div className="flex">
      {/* Sidebar ya está gestionada globalmente en App.js */}

      {/* Contenedor principal para la página de reserva */}
      <div className="flex-1 min-h-screen p-8 flex flex-col items-center"
        style={{
          backgroundImage: 'url(./edicion7.png)', // Ruta de la imagen
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      > 
        <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
          Reserva tu Servicio
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          {/* Selección de servicio */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Elige un servicio:
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              value={servicioSeleccionado}
              onChange={handleServicioChange}
              required
            >
              <option value="">Selecciona un servicio</option>
              {Object.keys(services_data).map(categoria => (
                <optgroup label={categoria} key={categoria}>
                  {services_data[categoria].map(servicio => (
                    <option key={servicio.id} value={servicio.name}>
                      {servicio.name} - ${servicio.price}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Selección de fecha */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Selecciona una fecha:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
              min={getMinDate()}
            />
          </div>

          {/* Selección de hora */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Selecciona una hora:
            </label>
            <select
              value={selectedTime}
              onChange={handleTimeChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
              disabled={!selectedDate} // Deshabilitar si no hay fecha seleccionada
            >
              <option value="">Selecciona un horario</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de reserva */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
          >
            Reservar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservaServicio;
