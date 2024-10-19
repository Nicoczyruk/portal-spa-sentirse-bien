// src/components/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const handleServiceSelect = (servicio) => {
    navigate('/reservas', { state: { servicio } });
  };

  const [currentPage, setCurrentPage] = useState('inicio');
  const [reservas, setReservas] = useState([]); // Estado para las reservas
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario

  useEffect(() => {
    setCurrentPage('inicio');
    fetchReservas(); // Llama a la función para obtener reservas
    fetchUserRole(); // Llama a la función para obtener el rol del usuario
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await fetch('/api/cliente/reservas', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setReservas(data.reservas); // Suponiendo que el backend devuelve un objeto con una propiedad 'reservas'
      } else {
        console.error('Error al obtener las reservas:', response.statusText);
        setError('Error al obtener las reservas.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error al conectar con el servidor.');
    }
  };

  // Función actualizada para obtener el rol del usuario
  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/auth/current-user', { // Cambia esta URL según sea necesario
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.rol); // Asume que rol se encuentra en el objeto devuelto
      } else {
        console.error('Error al obtener el rol del usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  // Función para filtrar reservas en los próximos 7 días
  const obtenerReservasProximos7Dias = () => {
    const hoy = new Date();
    const sieteDiasDesdeAhora = new Date(hoy);
    sieteDiasDesdeAhora.setDate(hoy.getDate() + 7);

    return reservas.filter((reserva) => {
      const fechaReserva = new Date(reserva.fecha);
      return fechaReserva >= hoy && fechaReserva <= sieteDiasDesdeAhora;
    });
  };

  return (
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
        Bienvenido al Portal del Spa Sentirse Bien
      </h1>

      <img
        src="./logo.png"
        alt="Logo del Spa"
        style={{ width: '300px', height: '200px' }}
        className="mb-4"
      />

      {/* Mostrar recordatorio de reservas solo si el usuario no es admin */}
      {userRole !== 'admin' && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 w-full">
          <h2 className="text-2xl font-bold mb-4">Recordatorio de Turnos</h2>
          {error && <p className="text-red-500">{error}</p>}
          {reservas.length === 0 ? (
            <p>No hay reservas disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {obtenerReservasProximos7Dias().map((reserva, index) => (
                <div key={index} className="bg-gray-200 rounded-lg shadow p-4">
                  <h3 className="text-xl font-semibold">{reserva.servicio}</h3>
                  <p>
                    <strong>Fecha y Hora:</strong> {reserva.fecha} {reserva.hora.replace(/:\d{2}$/, '')}
                  </p>
                  <p>
                    <strong>Estado:</strong> {reserva.estado}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

       {/* Apartado de Noticias */}
<div className="bg-white rounded-lg shadow-lg p-6 mb-8 w-full">
  <h2 className="text-2xl font-bold mb-4">Noticias del Mundo del Spa</h2>
  
  {/* Primera noticia */}
  <div className="flex items-center gap-4 mb-8"> {/* Añadimos mb-8 para crear espacio entre noticias */}
    <img
      src="./spacerveza.png"
      alt="Noticia Spa"
      style={{ width: '200px', height: '150px', objectFit: 'cover' }}
      className="rounded-lg"
    />
    <div>
      <p className="mb-4">Los spa de cerveza que son tendencia en el mundo y sus posibles beneficios</p>
      <a
        href="https://www.eltiempo.com/cultura/gente/los-spa-de-cerveza-que-son-tendencia-en-el-mundo-y-sus-posibles-beneficios-843380"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Leer más
      </a>
    </div>
  </div>

  {/* Segunda noticia */}
  <div className="flex items-center gap-4 mb-8"> {/* mb-8 también aquí para separación */}
    <img
      src="./spalujoso.jpeg"
      alt="Noticia Spa"
      style={{ width: '200px', height: '150px', objectFit: 'cover' }}
      className="rounded-lg"
    />
    <div>
      <p className="mb-4">Los ‘spas’ más lujosos del mundo para ir a descansar</p>
      <a
        href="https://www.eltiempo.com/vida/viajar/spas-de-lujo-en-europa-estados-unidos-y-asia-860638"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Leer más
      </a>
    </div>
  </div>

  {/* Tercera noticia */}
  <div className="flex items-center gap-4"> {/* Sin mb-8 si no quieres más después */}
    <img
      src="./spaserpiente.jpeg"
      alt="Noticia Spa"
      style={{ width: '200px', height: '150px', objectFit: 'cover' }}
      className="rounded-lg"
    />
    <div>
      <p className="mb-4">¿Relajación? Escalofriantes masajes con serpientes causan polémica</p>
      <a
        href="https://www.eltiempo.com/cultura/gente/video-en-egipto-un-spa-ofrece-masajes-con-serpientes-557919"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Leer más
      </a>
    </div>
  </div>
</div>




      {/* Tarjetas de servicios... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {/* Aquí van las tarjetas de los servicios */}
      </div>
    </div>
  );
};

export default Home;