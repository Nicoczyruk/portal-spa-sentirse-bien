// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    nombre_usuario: '',
    password: '',
    rol: 'Cliente', // Predeterminado a Cliente
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.status === 201) {
        // Registro exitoso, redirigir al login
        navigate('/');
      } else {
        // Mostrar error
        setError(result.error);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="bg-spa-verde-oscuro min-h-screen flex justify-center items-center"
    style={{
      backgroundImage: 'url(./verde3.png)', // Ruta de la imagen
      backgroundSize: 'cover', // Ajusta la imagen para que cubra todo el fondo
      backgroundPosition: 'center', // Centra la imagen
      backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
    }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo del Spa" className="w-34 h-24 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center mb-4">Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre:</label>
            <input
              type="text"
              name="nombre"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Apellido:</label>
            <input
              type="text"
              name="apellido"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Dirección:</label>
            <input
              type="text"
              name="direccion"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre de Usuario:</label>
            <input
              type="text"
              name="nombre_usuario"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.nombre_usuario}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña:</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
