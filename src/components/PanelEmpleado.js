// src/components/PanelEmpleado.js

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './PanelEmpleado.css'; // Archivo de estilos

const PanelEmpleado = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [pagos, setPagos] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [error, setError] = useState('');

  // Estados para "Clientes por Profesional"
  const [profesionales, setProfesionales] = useState([]);
  const [selectedProfesional, setSelectedProfesional] = useState('');
  const [selectedFechaProfesional, setSelectedFechaProfesional] = useState(new Date());
  const [clientesProfesional, setClientesProfesional] = useState([]);

  // Funciones para manejar cambios
  const handleProfesionalChange = (e) => {
    const profesionalId = e.target.value;
    setSelectedProfesional(profesionalId);
  };

  const handleFechaProfesionalChange = (e) => {
    setSelectedFechaProfesional(new Date(e.target.value));
  };

  // Obtener pagos del día
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch('/api/empleado/pagos-dia', { 
          method: 'GET', 
          credentials: 'include' 
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener los pagos del día.');
        }

        const data = await response.json();
        setPagos(data.pagos);
        setTotalIngresos(data.total_ingresos);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isAuthenticated && user.rol === 'Empleado') {
      fetchPagos();
    }
  }, [isAuthenticated, user]);

  // Obtener lista de profesionales
  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const res = await fetch('/api/empleado/profesionales', { method: 'GET', credentials: 'include' });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al obtener los profesionales.');
        }
        const dataProfesionales = await res.json();
        setProfesionales(Array.isArray(dataProfesionales) ? dataProfesionales : []);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isAuthenticated && user.rol === 'Empleado') {
      fetchProfesionales();
    }
  }, [isAuthenticated, user]);

  // Obtener clientes por profesional
  useEffect(() => {
    const fetchClientesProfesional = async () => {
      if (selectedProfesional === '') {
        setClientesProfesional([]);
        return;
      }

      try {
        const fechaProfesional = selectedFechaProfesional.toISOString().split('T')[0];
        const res = await fetch(`/api/empleado/clientes-profesional?profesional_id=${selectedProfesional}&fecha=${fechaProfesional}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al obtener los clientes por profesional.');
        }

        const data = await res.json();
        setClientesProfesional(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isAuthenticated && user.rol === 'Empleado') {
      fetchClientesProfesional();
    }
  }, [selectedProfesional, selectedFechaProfesional, isAuthenticated, user]);

  if (!isAuthenticated || user.rol !== 'Empleado') {
    return <p>Acceso no autorizado</p>;
  }

  return (
    <div
      className="panel-empleado"
      style={{
        backgroundImage: 'url(./verde3.png)', // Ruta de la imagen
        backgroundSize: 'cover', // Ajusta la imagen para que cubra todo el fondo
        backgroundPosition: 'center', // Centra la imagen
        backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
      }}
    >
      <h1 className="title">Panel del Empleado</h1>
      {error && <p className="error">{error}</p>}

      {/* Sección de Pagos realizados hoy */}
      <h2>Pagos realizados hoy</h2>

      <table className="pagos-table">
        <thead>
          <tr className="text-center">
            <th>ID Pago</th>
            <th>Cliente</th>
            <th>Método de Pago</th>
            <th>Fecha de Pago</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id_pago}>
              <td>{pago.id_pago}</td>
              <td>{pago.cliente}</td>
              <td>{pago.metodo_pago}</td>
              <td>{pago.fecha_pago}</td>
              <td>${pago.monto.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-ingresos">
        <strong>Total Ingresado Hoy: </strong> ${totalIngresos.toFixed(2)}
      </div>

      {/* Sección de Clientes por Profesional */}
      <div className="empleado-section w-full mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Clientes por Profesional</h2>
        {/* Filtros */}
        <div className="mb-4 w-full max-w-md flex space-x-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">Seleccionar Profesional:</label>
            <select
              value={selectedProfesional}
              onChange={handleProfesionalChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Seleccionar Profesional --</option>
              {Array.isArray(profesionales) &&
                profesionales.map((profesional) => (
                  <option key={profesional.id_profesional} value={profesional.id_profesional}>
                    {profesional.nombre} {profesional.apellido}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium text-gray-700">Seleccionar Fecha:</label>
            <input
              type="date"
              value={selectedFechaProfesional.toISOString().split('T')[0]}
              onChange={handleFechaProfesionalChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        {/* Tabla de Clientes por Profesional */}
        <div className="overflow-y-auto max-h-96 bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-[rgba(107,189,108,0.8)] text-center text-white">
                <th className="py-2 px-4 border-b">Profesional</th>
                <th className="py-2 px-4 border-b">Fecha</th>
                <th className="py-2 px-4 border-b">Hora</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Apellido</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {Array.isArray(clientesProfesional) &&
                clientesProfesional.map((registro, index) => (
                  <tr key={`${registro.profesional}-${registro.fecha}-${registro.hora}-${index}`} className="hover:bg-red-50">
                    <td className="py-2 px-4 border-b">{registro.profesional}</td>
                    <td className="py-2 px-4 border-b">{registro.fecha}</td>
                    <td className="py-2 px-4 border-b">{registro.hora}</td>
                    <td className="py-2 px-4 border-b">{registro.nombre}</td>
                    <td className="py-2 px-4 border-b">{registro.apellido}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PanelEmpleado;
