// src/components/PanelProfesional.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './PanelProfesional.css';

const PanelProfesional = () => {
  const { user } = useContext(AuthContext);
  const [turnos, setTurnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTurnos = async (fecha) => {
      try {
        const response = await fetch(`/api/profesional/turnos?fecha=${fecha}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setTurnos(data);
        } else {
          setError(data.error || 'Error al obtener los turnos.');
        }
      } catch (err) {
        setError('Error de conexión.');
      }
    };

    fetchTurnos(selectedDate);
  }, [selectedDate]);

  return (
    <div className="panel-profesional flex-1 min-h-screen p-8 flex flex-col items-center bg-white"
    style={{
      backgroundImage: 'url(./verde3.png)', // Ruta de la imagen
      backgroundSize: 'cover', // Ajusta la imagen para que cubra todo el fondo
      backgroundPosition: 'center', // Centra la imagen
      backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
    }}
    >
      <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
        Panel Profecional
      </h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Seleccionar Fecha:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-y-auto max-h-96 w-full max-w-4xl bg-white shadow-md rounded-lg">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-blue-200 text-center">
              <th className="py-2 px-4 border-b">Fecha</th>
              <th className="py-2 px-4 border-b">Hora</th>
              <th className="py-2 px-4 border-b">Servicio</th>
              <th className="py-2 px-4 border-b">Cliente</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {turnos.map((turno, index) => (
              <tr key={`${turno.fecha}-${turno.hora}-${index}`} className="hover:bg-blue-50">
                <td className="py-2 px-4 border-b">{turno.fecha}</td>
                <td className="py-2 px-4 border-b">{turno.hora}</td>
                <td className="py-2 px-4 border-b">{turno.servicio}</td>
                <td className="py-2 px-4 border-b">
                  {turno.cliente}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelProfesional;
