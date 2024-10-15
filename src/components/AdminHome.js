// src/components/AdminHome.js

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './AdminHome.css'; 

const AdminHome = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [clientesHoy, setClientesHoy] = useState([]);
  const [clientesProfesional, setClientesProfesional] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Nuevo estado para empleados
  const [selectedProfesional, setSelectedProfesional] = useState('');
  const [selectedFechaHoy, setSelectedFechaHoy] = useState(new Date());
  const [selectedFechaProfesional, setSelectedFechaProfesional] = useState(new Date());
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('admin');

  // Estados para modales
  const [isAddProfesionalOpen, setIsAddProfesionalOpen] = useState(false);
  const [isRemoveProfesionalOpen, setIsRemoveProfesionalOpen] = useState(false);
  const [isAddEmpleadoOpen, setIsAddEmpleadoOpen] = useState(false);
  const [isRemoveEmpleadoOpen, setIsRemoveEmpleadoOpen] = useState(false);

  // Estados para formularios
  const [newProfesional, setNewProfesional] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    email: '',
    telefono: '',
    nombre_usuario: '',
    password: ''
  });

  const [newEmpleado, setNewEmpleado] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    nombre_usuario: '',
    password: ''
  });

  useEffect(() => {
    setCurrentPage('admin');
    if (isAuthenticated && user.rol === 'admin') {
      const fetchData = async () => {
        try {
          // Obtener lista de clientes
          const resClientes = await fetch('/api/admin/clientes', { method: 'GET', credentials: 'include' });
          if (!resClientes.ok) {
            const errorData = await resClientes.json();
            throw new Error(errorData.error || 'Error al obtener los clientes.');
          }
          const dataClientes = await resClientes.json();
          setClientes(Array.isArray(dataClientes) ? dataClientes : []);

          // Obtener lista de profesionales
          const resProfesionales = await fetch('/api/admin/profesionales', { method: 'GET', credentials: 'include' });
          if (!resProfesionales.ok) {
            const errorDataProfesionales = await resProfesionales.json();
            throw new Error(errorDataProfesionales.error || 'Error al obtener los profesionales.');
          }
          const dataProfesionales = await resProfesionales.json();
          setProfesionales(Array.isArray(dataProfesionales) ? dataProfesionales : []);

          // Obtener lista de empleados
          const resEmpleados = await fetch('/api/admin/empleados', { method: 'GET', credentials: 'include' });
          if (!resEmpleados.ok) {
            const errorDataEmpleados = await resEmpleados.json();
            throw new Error(errorDataEmpleados.error || 'Error al obtener los empleados.');
          }
          const dataEmpleados = await resEmpleados.json();
          setEmpleados(Array.isArray(dataEmpleados) ? dataEmpleados : []);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchClientesHoy = async () => {
      try {
        const fechaHoy = selectedFechaHoy.toISOString().split('T')[0];
        const resClientesHoy = await fetch(`/api/admin/clientes-dia?fecha=${fechaHoy}`, { method: 'GET', credentials: 'include' });
        if (!resClientesHoy.ok) {
          const errorDataHoy = await resClientesHoy.json();
          throw new Error(errorDataHoy.error || 'Error al obtener los clientes de hoy.');
        }
        const dataClientesHoy = await resClientesHoy.json();
        setClientesHoy(Array.isArray(dataClientesHoy) ? dataClientesHoy : []);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isAuthenticated && user.rol === 'admin') {
      fetchClientesHoy();
    }
  }, [selectedFechaHoy, isAuthenticated, user]);

  useEffect(() => {
    const fetchClientesProfesional = async () => {
      if (selectedProfesional === '') {
        setClientesProfesional([]);
        return;
      }

      try {
        const fechaProfesional = selectedFechaProfesional.toISOString().split('T')[0];
        const res = await fetch(`/api/admin/clientes-profesional?profesional_id=${selectedProfesional}&fecha=${fechaProfesional}`, {
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

    if (isAuthenticated && user.rol === 'admin') {
      fetchClientesProfesional();
    }
  }, [selectedProfesional, selectedFechaProfesional, isAuthenticated, user]);

  // Funciones para manejar la selección de profesional
  const handleProfesionalChange = (e) => {
    const profesionalId = e.target.value;
    setSelectedProfesional(profesionalId);
  };

  // Funciones para manejar formularios de profesionales
  const handleAddProfesionalChange = (e) => {
    setNewProfesional({
      ...newProfesional,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProfesionalSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/add-profesional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newProfesional)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al agregar el profesional.');
      }

      const data = await res.json();
      alert(data.message);
      setIsAddProfesionalOpen(false);
      setNewProfesional({
        nombre: '',
        apellido: '',
        especialidad: '',
        email: '',
        telefono: '',
        nombre_usuario: '',
        password: ''
      });
      // Actualizar lista de profesionales
      const resProfesionales = await fetch('/api/admin/profesionales', { method: 'GET', credentials: 'include' });
      const dataProfesionales = await resProfesionales.json();
      setProfesionales(Array.isArray(dataProfesionales) ? dataProfesionales : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveProfesional = async (id_profesional) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este profesional?')) return;
    try {
      const res = await fetch('/api/admin/remove-profesional', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ id_profesional })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar el profesional.');
      }

      const data = await res.json();
      alert(data.message);
      setIsRemoveProfesionalOpen(false);
      // Actualizar lista de profesionales
      const resProfesionales = await fetch('/api/admin/profesionales', { method: 'GET', credentials: 'include' });
      const dataProfesionales = await resProfesionales.json();
      setProfesionales(Array.isArray(dataProfesionales) ? dataProfesionales : []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Funciones para manejar formularios de empleados
  const handleAddEmpleadoChange = (e) => {
    setNewEmpleado({
      ...newEmpleado,
      [e.target.name]: e.target.value
    });
  };

  const handleAddEmpleadoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/add-empleado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newEmpleado)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al agregar el empleado.');
      }

      const data = await res.json();
      alert(data.message);
      setIsAddEmpleadoOpen(false);
      setNewEmpleado({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        nombre_usuario: '',
        password: ''
      });
      // Actualizar lista de empleados
      const resEmpleados = await fetch('/api/admin/empleados', { method: 'GET', credentials: 'include' });
      const dataEmpleados = await resEmpleados.json();
      setEmpleados(Array.isArray(dataEmpleados) ? dataEmpleados : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveEmpleado = async (id_empleado) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) return;
    try {
      const res = await fetch('/api/admin/remove-empleado', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ id_empleado })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar el empleado.');
      }

      const data = await res.json();
      alert(data.message);
      setIsRemoveEmpleadoOpen(false);
      // Actualizar lista de empleados
      const resEmpleados = await fetch('/api/admin/empleados', { method: 'GET', credentials: 'include' });
      const dataEmpleados = await resEmpleados.json();
      setEmpleados(Array.isArray(dataEmpleados) ? dataEmpleados : []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated || user.rol !== 'admin') {
    return <p>Acceso no autorizado</p>;
  }

  return (
    <div
      className="flex-1 min-h-screen p-8 flex flex-col items-center"
      style={{
        backgroundImage: 'url(./edicion7.png)', // Mismo fondo que en Home.js
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >   
      <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-custom-opacity">
        Panel de Administración
      </h1>

      {error && <p className="error text-red-500">{error}</p>}

      {/* Botones para agregar/eliminar profesionales y empleados */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => setIsAddProfesionalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Profesional
        </button>
        <button
          onClick={() => setIsRemoveProfesionalOpen(true)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Eliminar Profesional
        </button>
        <button
          onClick={() => setIsAddEmpleadoOpen(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Empleado
        </button>
        <button
          onClick={() => setIsRemoveEmpleadoOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Eliminar Empleado
        </button>
      </div>

      {/* Modales */}
      {/* Agregar Profesional */}
      {isAddProfesionalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Agregar Profesional</h2>
            <form onSubmit={handleAddProfesionalSubmit}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={newProfesional.nombre}
                onChange={handleAddProfesionalChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={newProfesional.apellido}
                onChange={handleAddProfesionalChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="especialidad"
                placeholder="Especialidad"
                value={newProfesional.especialidad}
                onChange={handleAddProfesionalChange}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newProfesional.email}
                onChange={handleAddProfesionalChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={newProfesional.telefono}
                onChange={handleAddProfesionalChange}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre de Usuario"
                value={newProfesional.nombre_usuario}
                onChange={handleAddProfesionalChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={newProfesional.password}
                onChange={handleAddProfesionalChange}
                required
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddProfesionalOpen(false)}
                  className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Eliminar Profesional */}
      {isRemoveProfesionalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Eliminar Profesional</h2>
            <ul>
              {profesionales.length === 0 && <p>No hay profesionales para eliminar.</p>}
              {profesionales.map(profesional => (
                <li key={profesional.id_profesional} className="flex justify-between items-center mb-2">
                  <span>{profesional.nombre} {profesional.apellido}</span>
                  <button
                    onClick={() => handleRemoveProfesional(profesional.id_profesional)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsRemoveProfesionalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agregar Empleado */}
      {isAddEmpleadoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Agregar Empleado</h2>
            <form onSubmit={handleAddEmpleadoSubmit}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={newEmpleado.nombre}
                onChange={handleAddEmpleadoChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={newEmpleado.apellido}
                onChange={handleAddEmpleadoChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newEmpleado.email}
                onChange={handleAddEmpleadoChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={newEmpleado.telefono}
                onChange={handleAddEmpleadoChange}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={newEmpleado.direccion}
                onChange={handleAddEmpleadoChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre de Usuario"
                value={newEmpleado.nombre_usuario}
                onChange={handleAddEmpleadoChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={newEmpleado.password}
                onChange={handleAddEmpleadoChange}
                required
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddEmpleadoOpen(false)}
                  className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Eliminar Empleado */}
      {isRemoveEmpleadoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Eliminar Empleado</h2>
            <ul>
              {empleados.length === 0 && <p>No hay empleados para eliminar.</p>}
              {empleados.map(empleado => (
                <li key={empleado.id_cliente} className="flex justify-between items-center mb-2">
                  <span>{empleado.nombre} {empleado.apellido}</span>
                  <button
                    onClick={() => handleRemoveEmpleado(empleado.id_cliente)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsRemoveEmpleadoOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-section w-full mb-12">
        {/* Listado de Clientes */}
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Listado de Clientes</h2>
        <div className="overflow-y-auto max-h-96 bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-purple-200 text-center">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Apellido</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Teléfono</th>
                <th className="py-2 px-4 border-b">Dirección</th>
                <th className="py-2 px-4 border-b">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {Array.isArray(clientes) && clientes.map(cliente => (
                <tr key={cliente.id_cliente} className="hover:bg-purple-50">
                  <td className="py-2 px-4 border-b">{cliente.id_cliente}</td>
                  <td className="py-2 px-4 border-b">{cliente.nombre}</td>
                  <td className="py-2 px-4 border-b">{cliente.apellido}</td>
                  <td className="py-2 px-4 border-b">{cliente.email}</td>
                  <td className="py-2 px-4 border-b">{cliente.telefono}</td>
                  <td className="py-2 px-4 border-b">{cliente.direccion}</td>
                  <td className="py-2 px-4 border-b">{new Date(cliente.fecha_registro).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section w-full mb-12">
        {/* Clientes Hoy */}
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Clientes Hoy</h2>
        <div className="mb-4 w-full max-w-md">
          <label className="block mb-2 font-medium text-gray-700">Seleccionar Fecha:</label>
          <input
            type="date"
            value={selectedFechaHoy.toISOString().split('T')[0]}
            onChange={(e) => setSelectedFechaHoy(new Date(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="overflow-y-auto max-h-96 bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-green-200 text-center">
                <th className="py-2 px-4 border-b">Fecha</th>
                <th className="py-2 px-4 border-b">Hora</th>
                <th className="py-2 px-4 border-b">Servicio</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Apellido</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {Array.isArray(clientesHoy) && clientesHoy.map((registro, index) => (
                <tr key={`${registro.fecha}-${registro.hora}-${index}`} className="hover:bg-green-50">
                  <td className="py-2 px-4 border-b">{registro.fecha}</td>
                  <td className="py-2 px-4 border-b">{registro.hora}</td>
                  <td className="py-2 px-4 border-b">{registro.servicio}</td>
                  <td className="py-2 px-4 border-b">{registro.nombre}</td>
                  <td className="py-2 px-4 border-b">{registro.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section w-full mb-12">
        {/* Clientes por Profesional */}
        <h2 className="text-2xl font-semibold text-red-700 mb-4">Clientes por Profesional</h2>
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
              {Array.isArray(profesionales) && profesionales.map(profesional => (
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
              onChange={(e) => setSelectedFechaProfesional(new Date(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        {/* Tabla de Clientes por Profesional */}
        <div className="overflow-y-auto max-h-96 bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-red-200 text-center">
                <th className="py-2 px-4 border-b">Profesional</th>
                <th className="py-2 px-4 border-b">Fecha</th>
                <th className="py-2 px-4 border-b">Hora</th>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Apellido</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {Array.isArray(clientesProfesional) && clientesProfesional.map((registro, index) => (
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

      {/* Modal Eliminar Empleado */}
      {isRemoveEmpleadoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Eliminar Empleado</h2>
            <ul>
              {empleados.length === 0 && <p>No hay empleados para eliminar.</p>}
              {empleados.map(empleado => (
                <li key={empleado.id_cliente} className="flex justify-between items-center mb-2">
                  <span>{empleado.nombre} {empleado.apellido}</span>
                  <button
                    onClick={() => handleRemoveEmpleado(empleado.id_cliente)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsRemoveEmpleadoOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
