// src/components/AdminHome.js

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './AdminHome.css'; 

const AdminHome = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [clientesDia, setClientesDia] = useState([]);
  const [clientesProfesional, setClientesProfesional] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('admin');

  useEffect(() => {
    setCurrentPage('admin');
    if (isAuthenticated && user.rol === 'admin') {
      const fetchData = async () => {
        try {
          const resClientes = await fetch('/api/admin/clientes', { method: 'GET', credentials: 'include' });
          const dataClientes = await resClientes.json();
          setClientes(dataClientes);

          const resClientesDia = await fetch('/api/admin/clientes-dia', { method: 'GET', credentials: 'include' });
          const dataClientesDia = await resClientesDia.json();
          setClientesDia(dataClientesDia);

          const resClientesProfesional = await fetch('/api/admin/clientes-profesional', { method: 'GET', credentials: 'include' });
          const dataClientesProfesional = await resClientesProfesional.json();
          setClientesProfesional(dataClientesProfesional);
        } catch (err) {
          setError('Error al cargar los datos');
        }
      };

      fetchData();
    }
  }, [isAuthenticated, user]);

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
      <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
        Panel de Administración
      </h1>

      {error && <p className="error text-red-500">{error}</p>}

      <div className="admin-section w-full mb-12">
        {/* Listado de Clientes */}
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Listado de Clientes</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
              {clientes.map(cliente => (
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
        {/* Clientes a Atender por Día */}
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Clientes a Atender por Día</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
              {clientesDia.map(registro => (
                <tr key={`${registro.fecha}-${registro.hora}-${registro.nombre_usuario}`} className="hover:bg-green-50">
                  <td className="py-2 px-4 border-b">{new Date(registro.fecha).toLocaleDateString()}</td>
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

      <div className="admin-section w-full">
        {/* Clientes por Profesional */}
        <h2 className="text-2xl font-semibold text-red-700 mb-4">Clientes por Profesional</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
              {clientesProfesional.map(registro => (
                <tr key={`${registro.profesional}-${registro.fecha}-${registro.hora}`} className="hover:bg-red-50">
                  <td className="py-2 px-4 border-b">{registro.profesional}</td>
                  <td className="py-2 px-4 border-b">{new Date(registro.fecha).toLocaleDateString()}</td>
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

export default AdminHome;
