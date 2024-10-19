// src/components/Perfil.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Perfil = () => {
  const { user } = useContext(AuthContext);

  // Estado para el perfil
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  // Estado para el historial de reservas
  const [reservas, setReservas] = useState([]);

  // Estado para indicar si el formulario está en modo edición
  const [editando, setEditando] = useState(false);

  // Estado para manejar errores
  const [error, setError] = useState('');

  useEffect(() => {
    // Función para obtener los datos del perfil
    const fetchPerfil = async () => {
      try {
        const response = await fetch('/api/cliente/perfil', {
          method: 'GET',
          credentials: 'include', // Importante para enviar cookies de sesión
        });

        if (response.ok) {
          const data = await response.json();
          // Actualizar los estados con los datos recibidos
          setNombre(data.nombre);
          setApellido(data.apellido);
          setEmail(data.email);
          setTelefono(data.telefono);
          setDireccion(data.direccion);
        } else {
          console.error('Error al obtener el perfil:', response.statusText);
          setError('Error al obtener los datos del perfil.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setError('Error al conectar con el servidor.');
      }
    };

    // Función para obtener el historial de reservas
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
          setError('Error al obtener el historial de reservas.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setError('Error al conectar con el servidor.');
      }
    };

    fetchPerfil();
    fetchReservas();
  }, []);

  // Función para guardar cambios
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cliente/actualizar-perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          telefono,
          direccion
        })
      });

      if (response.ok) {
        // Actualización exitosa
        setEditando(false);
        alert('Perfil actualizado correctamente');
      } else {
        // Manejar error
        console.error('Error al actualizar el perfil:', response.statusText);
        setError('Error al actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div
      className="flex-1 min-h-screen p-8 flex flex-col items-center"
      style={{
        backgroundImage: 'url(./edicion7.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
        Perfil de Usuario
      </h1>
      {error && <p className="error text-red-500 mb-4">{error}</p>}
      <div className="max-w-2xl w-full">
        {/* Tarjeta de Perfil */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {editando ? (
            <form onSubmit={handleGuardar}>
              <div>
                <label className="block mb-1">Nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mb-4"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Apellido:</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mb-4"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mb-4"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Teléfono:</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mb-4"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Dirección:</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mb-4"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="mt-4 ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <>
              <p className="mb-2">
                <strong>Nombre:</strong> {nombre} {apellido}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {email}
              </p>
              <p className="mb-2">
                <strong>Teléfono:</strong> {telefono}
              </p>
              <p className="mb-4">
                <strong>Dirección:</strong> {direccion}
              </p>
              <button
                onClick={() => setEditando(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
              >
                Editar Perfil
              </button>
            </>
          )}
        </div>

        {/* Tarjetas de Reservas */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
          <h2 className="text-2xl font-bold mb-4">Historial de Reservas</h2>
          {reservas.length === 0 ? (
            <p>No hay reservas disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservas.map((reserva, index) => (
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
      </div>
    </div>
  );
};

export default Perfil;
