import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Para obtener el estado de la navegación
import Sidebar from '../components/Sidebar'; // Importa el Sidebar si es necesario

const ReservaServicio = () => {
  const location = useLocation(); // Utiliza useLocation para obtener el servicio seleccionado
  const servicioInicial = location.state?.servicio || ''; // Obtener el servicio desde la navegación o dejar vacío

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(servicioInicial);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);

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

  useEffect(() => {
    setAvailableTimes(generateTimeSlots());
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleServicioChange = (e) => {
    setServicioSeleccionado(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!servicioSeleccionado) {
      alert('Por favor, selecciona un servicio.');
      return;
    }
    alert(`Reserva creada para el servicio ${servicioSeleccionado} el día ${selectedDate} a las ${selectedTime}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="flex">
      {/* Mostrar el sidebar solo si isSidebarOpen es true */}
      {isSidebarOpen && <Sidebar currentPage="reservas" />} 

      {/* Contenedor principal para la página de reserva */}
      <div className="flex-1 min-h-screen p-8 flex flex-col items-center"
        style={{
          backgroundImage: 'url(./edicion7.png)', // Ruta de la imagen
          backgroundSize: 'cover', // Ajusta la imagen para que cubra todo el fondo
          backgroundPosition: 'center', // Centra la imagen
          backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
        }}
      > 
        {/* Botón para abrir/cerrar el sidebar */}
        <button
          className="absolute top-4 left-4 p-2 bg-gray-800 text-white rounded hover:bg-blue-600 flex items-center z-10"
          onClick={toggleSidebar} 
        >
          <div className="flex flex-col space-y-1">
            <div className="h-1 w-8 bg-spa-verde-oscuro"></div>
            <div className="h-1 w-8 bg-spa-verde-oscuro"></div>
            <div className="h-1 w-8 bg-spa-verde-oscuro"></div>
          </div>
        </button>

        <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
          Reserva tu Servicio
        </h1>

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
              <option value="Masaje Relajante">Masaje Relajante</option>
              <option value="Tratamiento Facial">Tratamiento Facial</option>
              <option value="Aromaterapia">Aromaterapia</option>
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Reservar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservaServicio;