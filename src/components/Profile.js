// src/components/Perfil.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'

const Perfil = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('perfil');
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    useEffect(() =>{
        setCurrentPage('perfil');
    }, [])


  // Estado para el perfil
  const [nombre, setNombre] = useState('Ana Felicidad');
  const [email, setEmail] = useState('ana@spa.com');
  const [telefono, setTelefono] = useState('123-456-7890');
  const [direccion, setDireccion] = useState('Av. Bienestar 123, Ciudad Spa');

  // Estado para indicar si el formulario está en modo edición
  const [editando, setEditando] = useState(false);

  // Ejemplo de reservas
  const reservas = [
    {
      servicio: 'Masaje Relajante',
      fecha: '2024-09-01',
      estado: 'Completado',
    },
    {
      servicio: 'Tratamiento Facial',
      fecha: '2024-09-15',
      estado: 'Completado',
    },
    {
      servicio: 'Aromaterapia',
      fecha: '2024-09-20',
      estado: 'Cancelado',
    },
    {
      servicio: 'Masaje Descontracturante',
      fecha: '2024-09-25',
      estado: 'Completado',
    },
    {
      servicio: 'Sesión de Reflexología',
      fecha: '2024-09-30',
      estado: 'Pendiente',
    },
    // Puedes agregar más reservas aquí
  ];

  // Función para guardar cambios
  const handleGuardar = (e) => {
    e.preventDefault();
    setEditando(false);
    // Aquí puedes agregar la lógica para enviar los datos a tu backend o API
  };

  return (
    <div className = "flex">
        {isSidebarOpen && <Sidebar currentPage = {currentPage} /> }
        <div className="flex-1 bg-spa-verde-claro min-h-screen p-8 flex flex-col items-center">
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
        <div className="max-w-2xl w-full">
            {/* Tarjeta de Perfil */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
                Perfil de Usuario
            </h1>

            {editando ? (
                <form onSubmit={handleGuardar}>
                <div>
                    <label className="block mb-1">Nombre:</label>
                    <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2 mb-4"
                    />
                </div>
                <div>
                    <label className="block mb-1">Email:</label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2 mb-4"
                    />
                </div>
                <div>
                    <label className="block mb-1">Teléfono:</label>
                    <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2 mb-4"
                    />
                </div>
                <div>
                    <label className="block mb-1">Dirección:</label>
                    <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2 mb-4"
                    />
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
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
                <p><strong>Nombre:</strong> {nombre}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Teléfono:</strong> {telefono}</p>
                <p><strong>Dirección:</strong> {direccion}</p>
                <button onClick={() => setEditando(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                    Editar Perfil
                </button>
                </>
            )}
            </div>

            {/* Tarjetas de Reservas */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Historial de Reservas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservas.map((reserva, index) => (
                <div key={index} className="bg-gray-200 rounded-lg shadow p-4">
                    <h3 className="text-xl font-semibold">{reserva.servicio}</h3>
                    <p><strong>Fecha:</strong> {reserva.fecha}</p>
                    <p><strong>Estado:</strong> {reserva.estado}</p>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Perfil;
