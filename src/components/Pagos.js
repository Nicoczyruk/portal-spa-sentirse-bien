// src/components/Pagos.js

import React, { useState, useEffect } from 'react';

const Pagos = () => {
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [pagosRealizados, setPagosRealizados] = useState([]);
  const [selectedPago, setSelectedPago] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    nombre: '',
    vencimiento: '',
    cvc: '',
    tipo: 'credito', // 'credito' o 'debito'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Función para obtener pagos pendientes
  const fetchPagosPendientes = async () => {
    try {
      const response = await fetch('/api/cliente/pagos-pendientes', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener los pagos pendientes.');
      }

      const data = await response.json();
      setPagosPendientes(data.pagos_pendientes);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error al conectar con el servidor.');
    }
  };

  // Función para obtener pagos realizados
  const fetchPagosRealizados = async () => {
    try {
      const response = await fetch('/api/cliente/pagos-realizados', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener los pagos realizados.');
      }

      const data = await response.json();
      setPagosRealizados(data.pagos_realizados);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error al conectar con el servidor.');
    }
  };

  // Cargar los pagos pendientes y realizados al montar el componente
  useEffect(() => {
    fetchPagosPendientes();
    fetchPagosRealizados();
  }, []);

  const handlePagar = (pago) => {
    setSelectedPago(pago);
    setModalVisible(true);
  };

  const handleConfirmarPago = async () => {
    // Validación básica de los campos de la tarjeta
    if (
      !tarjeta.numero ||
      !tarjeta.nombre ||
      !tarjeta.vencimiento ||
      !tarjeta.cvc ||
      !tarjeta.tipo
    ) {
      setError('Por favor, completa todos los campos del pago.');
      setSuccess(''); // Limpiar mensaje de éxito
      return;
    }

    // Opcional: Validaciones adicionales de formato pueden añadirse aquí

    try {
      const response = await fetch(`/api/cliente/pagar-reserva/${selectedPago.id_pago}`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(tarjeta), // Enviar el objeto tarjeta completo
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Error al procesar el pago.');
        setSuccess(''); // Limpiar mensaje de éxito
        return; // Salir de la función si hay un error
      }

      // Si no hubo error, procesar la respuesta correctamente
      const result = await response.json();
      setSuccess('Pago realizado exitosamente.');
      setError(''); // Limpiar mensaje de error
      setPagosPendientes(pagosPendientes.filter((pago) => pago.id_pago !== selectedPago.id_pago));
      setPagosRealizados([...pagosRealizados, selectedPago]);
      setModalVisible(false); // Cerrar modal después de pago exitoso
      // Volver a cargar los pagos después de un pago exitoso
      await fetchPagosPendientes();
      await fetchPagosRealizados();
    } catch (error) {
      setError('Error al conectar con el servidor.');
      setSuccess(''); // Limpiar mensaje de éxito
    }
  };

  const handleDescargarFactura = (idFactura) => {
    window.open(`/api/cliente/factura/${idFactura}`, '_blank');
  };

  // Función para pagar todos los pagos pendientes
  const handlePagarTodos = async () => {
    // Validación básica de los campos de la tarjeta
    if (
      !tarjeta.numero ||
      !tarjeta.nombre ||
      !tarjeta.vencimiento ||
      !tarjeta.cvc ||
      !tarjeta.tipo
    ) {
      setError('Por favor, completa todos los campos del pago.');
      setSuccess(''); // Limpiar mensaje de éxito
      return;
    }

    // Opcional: Validaciones adicionales de formato pueden añadirse aquí

    try {
      const response = await fetch('/api/cliente/pagar-todos', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(tarjeta), // Enviar el objeto tarjeta completo
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Error al procesar los pagos.');
        setSuccess(''); // Limpiar mensaje de éxito
        return; // Salir de la función si hay un error
      }

      // Si no hubo error, procesar la respuesta correctamente
      const result = await response.json();
      setSuccess('Todos los pagos se realizaron exitosamente.');
      setError(''); // Limpiar mensaje de error
      setPagosPendientes([]);
      setPagosRealizados([...pagosRealizados, ...result.facturas]);
      setModalVisible(false); 
      await fetchPagosRealizados();
    } catch (error) {
      setError('Error al conectar con el servidor.');
      setSuccess(''); 
    }
  };

  // Calcular el total de pagos pendientes
  const totalPendiente = pagosPendientes.reduce((acc, pago) => {
    const monto = parseFloat(pago.monto);  
    return !isNaN(monto) ? acc + monto : acc;  
  }, 0);

  return (
    <div className="flex">
      <div className="flex-1 min-h-screen p-8 flex flex-col items-center bg-gray-50">
        <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
          Pagos
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Lista de pagos pendientes */}
        <div className="mb-8 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Pagos Pendientes</h2>
            {pagosPendientes.length > 0 && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => {
                  setSelectedPago('todos');
                  setModalVisible(true);
                }}
              >
                Pagar Todos
              </button>
            )}
          </div>
          <ul>
            {pagosPendientes.map((pago) => (
              <li key={pago.id_pago} className="mb-4 p-6 bg-white shadow rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">Servicio: {pago.servicio}</p>
                  <p>Fecha: {pago.fecha} - Hora: {pago.hora}</p>
                  <p>Monto: ${!isNaN(parseFloat(pago.monto)) ? parseFloat(pago.monto).toFixed(2) : 'N/A'}</p>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={() => handlePagar(pago)}
                >
                  Pagar
                </button>
              </li>
            ))}
          </ul>
          {pagosPendientes.length > 0 && (
            <p className="mt-4 text-xl font-semibold">Total Pendiente: ${totalPendiente.toFixed(2)}</p>
          )}
        </div>

        {/* Lista de pagos realizados */}
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">Pagos Realizados</h2>
          <ul>
            {pagosRealizados.map((pago) => (
              <li key={pago.id_factura} className="mb-4 p-6 bg-gray-100 shadow rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">Servicio: {pago.servicio}</p>
                  <p>Fecha: {pago.fecha} - Hora: {pago.hora}</p>
                  {/* Si el monto es válido, lo mostramos. Si no, omitimos el campo */}
                  {pago.total ? (
                    <p>Total: ${!isNaN(parseFloat(pago.total)) ? parseFloat(pago.total).toFixed(2) : 'N/A'}</p>
                  ) : null}
                </div>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={() => handleDescargarFactura(pago.id_factura)}
                >
                  Descargar Factura
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal de pago */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6 text-center">Detalles del Pago</h2>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Tipo de tarjeta</span>
                  <select
                    value={tarjeta.tipo}
                    onChange={(e) => setTarjeta({ ...tarjeta, tipo: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="credito">Tarjeta de Crédito</option>
                    <option value="debito">Tarjeta de Débito</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">Número de tarjeta</span>
                  <input
                    type="text"
                    value={tarjeta.numero}
                    onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                    className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19" // 16 dígitos + 3 espacios opcionales
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Nombre en la tarjeta</span>
                  <input
                    type="text"
                    value={tarjeta.nombre}
                    onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value })}
                    className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Nombre completo"
                  />
                </label>

                <div className="flex space-x-4">
                  <label className="block flex-1">
                    <span className="text-gray-700">Fecha de vencimiento</span>
                    <input
                      type="text"
                      value={tarjeta.vencimiento}
                      onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })}
                      className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                  </label>
                  <label className="block flex-1">
                    <span className="text-gray-700">CVC</span>
                    <input
                      type="text"
                      value={tarjeta.cvc}
                      onChange={(e) => setTarjeta({ ...tarjeta, cvc: e.target.value })}
                      className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      placeholder="123"
                      maxLength="4"
                    />
                  </label>
                </div>

                {/* Mostrar el total pendiente si se está pagando todos */}
                {selectedPago === 'todos' ? (
                  <p className="text-lg font-semibold">Total a Pagar: ${totalPendiente.toFixed(2)}</p>
                ) : null}

                <button
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg w-full"
                  onClick={selectedPago === 'todos' ? handlePagarTodos : handleConfirmarPago}
                >
                  {selectedPago === 'todos' ? 'Confirmar Pago de Todos' : 'Confirmar Pago'}
                </button>

                <button
                  className="text-gray-500 mt-4 w-full"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagos;
