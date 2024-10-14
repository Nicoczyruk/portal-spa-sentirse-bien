// src/components/Login.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Importa el contexto

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Obtiene la función login del contexto
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Importante para enviar y recibir cookies de sesión
        body: JSON.stringify(data)
      });

      const result = await response.json();

      console.log('response.status:', response.status);
      console.log('response.ok:', response.ok);
      console.log('result:', result);

      if (response.ok) {
        // Inicio de sesión exitoso
        // Obtener la información del usuario
        const resMe = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (resMe.ok) {
          const dataMe = await resMe.json();
          login(dataMe.user); // Actualiza el estado de autenticación con la información del usuario
          navigate('/home'); // Redirige al usuario
        } else {
          setError('Error al obtener la información del usuario.');
        }
      } else {
        // Mostrar error
        setError(result.error);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error al conectar con el servidor');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="bg-spa-verde-oscuro min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo del Spa" className="w-34 h-24 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Correo Electrónico:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>¿No tienes una cuenta?</p>
          <button
            onClick={handleRegisterRedirect}
            className="mt-2 text-blue-600 hover:underline"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
