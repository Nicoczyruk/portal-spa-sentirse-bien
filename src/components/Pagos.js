// src/components/Pagos.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './pagos.css';

const Pagos = () => {
  const location = useLocation();
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
  const [applyDiscount, setApplyDiscount] = useState(location.state?.applyDiscount || false);
  const isMobile = window.innerWidth <= 768; // Verificar si es dispositivo móvil

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
      setPagosPendientes(data.pagos_pendientes || []);
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
      setPagosRealizados(data.pagos_realizados || []);
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

    try {
      const response = await fetch(`/api/cliente/pagar-reserva/${selectedPago.id_pago}`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ ...tarjeta, applyDiscount: applyDiscount && isMobile }), // Enviar también si el descuento debe aplicarse
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Error al procesar el pago.');
        setSuccess(''); // Limpiar mensaje de éxito
        return;
      }

      // Si no hubo error, procesar la respuesta correctamente
      const result = await response.json();
      setSuccess('Pago realizado exitosamente.');
      setError(''); // Limpiar mensaje de error

      // Resetear applyDiscount después de pago exitoso
      setApplyDiscount(false);

      setModalVisible(false); // Cerrar modal después de pago exitoso

      // Actualizar los pagos pendientes y realizados
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

    try {
      const response = await fetch('/api/cliente/pagar-todos', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ ...tarjeta, applyDiscount: applyDiscount && isMobile }), // Enviar también si el descuento debe aplicarse
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Error al procesar los pagos.');
        setSuccess(''); // Limpiar mensaje de éxito
        return;
      }

      const result = await response.json();
      setSuccess('Todos los pagos se realizaron exitosamente.');
      setError(''); // Limpiar mensaje de error

      // Resetear applyDiscount después de pago exitoso
      setApplyDiscount(false);

      setModalVisible(false);

      // Actualizar los pagos pendientes y realizados
      await fetchPagosPendientes();
      await fetchPagosRealizados();
    } catch (error) {
      setError('Error al conectar con el servidor.');
      setSuccess('');
    }
  };

  // Calcular el total de pagos pendientes, aplicando el descuento solo al último pago si es necesario
  const totalPendiente = pagosPendientes?.reduce((acc, pago, index) => {
    let monto = parseFloat(pago.monto) || 0;
    const esUltimoPago = index === pagosPendientes.length - 1; // Verificar si es el último pago
    if (esUltimoPago && applyDiscount && isMobile) {
      monto *= 0.9; // Aplicar 10% de descuento
    }
    return acc + monto;
  }, 0) || 0;

  return (
    <div className="flex">
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
          Pagos
        </h1>

        {/* Banner condicional de alerta */}
        {applyDiscount && isMobile && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-8 w-full max-w-lg">
            <p className="text-center">
              Si abandonas esta sección mientras tu descuento está activo, lo perderás.
            </p>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Lista de pagos pendientes */}
        <div className="mb-8 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Pagos Pendientes</h2>
            {pagosPendientes.length > 0 && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
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
            {pagosPendientes?.map((pago, index) => {
              const esUltimoPago = index === pagosPendientes.length - 1; // Verificar si es el último pago
              const montoBase = parseFloat(pago.monto) || 0;
              const montoConDescuento =
                esUltimoPago && applyDiscount && isMobile ? montoBase * 0.9 : montoBase;

              return (
                <li
                  key={pago.id_pago}
                  className="mb-4 p-6 bg-[rgba(237,247,222,0.8)] shadow rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">Servicio: {pago.servicio}</p>
                    <p>
                      Fecha: {pago.fecha} - Hora: {pago.hora}
                    </p>
                    <p>Monto: ${!isNaN(montoConDescuento) ? montoConDescuento.toFixed(2) : 'N/A'}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
                    onClick={() => handlePagar(pago)}
                  >
                    Pagar
                  </button>
                </li>
              );
            })}
          </ul>

          {pagosPendientes.length > 0 && (
            <p className="mt-4 text-xl font-semibold">Total Pendiente: ${totalPendiente.toFixed(2)}</p>
          )}
        </div>

        {/* Lista de pagos realizados */}
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">Pagos Realizados</h2>
          <ul>
            {pagosRealizados?.map((pago) => (
              <li
                key={pago.id_factura || pago.id_pago}
                className="mb-4 p-6 bg-[rgba(237,247,222,0.8)] shadow rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Servicio: {pago.servicio}</p>
                  <p>
                    Fecha: {pago.fecha} - Hora: {pago.hora}
                  </p>
                  <p>
                    Total: $
                    {!isNaN(parseFloat(pago.total))
                      ? parseFloat(pago.total).toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => handleDescargarFactura(pago.id_factura || pago.id_pago)}
                >
                  Descargar Factura
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal de pago */}
        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Detalles del Pago</h2>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Tipo de tarjeta</span>
                  <select
                    value={tarjeta.tipo}
                    onChange={(e) => setTarjeta({ ...tarjeta, tipo: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
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
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, '');
                      const formateado = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setTarjeta({ ...tarjeta, numero: formateado });
                    }}
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Nombre en la tarjeta</span>
                  <input
                    type="text"
                    value={tarjeta.nombre}
                    onChange={(e) =>
                      setTarjeta({ ...tarjeta, nombre: e.target.value.replace(/[^a-zA-Z\s]/g, '') })
                    }
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Nombre completo"
                  />
                </label>

                <div className="flex space-x-4">
                  <label className="block flex-1">
                    <span className="text-gray-700">Fecha de vencimiento</span>
                    <input
                      type="text"
                      value={tarjeta.vencimiento}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length > 4) {
                          value = value.substring(0, 4);
                        }
                        if (value.length >= 3) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setTarjeta({ ...tarjeta, vencimiento: value });
                      }}
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="MM/AA"
                      maxLength="5"
                      inputMode="numeric"
                    />
                  </label>
                  <label className="block flex-1">
                    <span className="text-gray-700">CVC</span>
                    <input
                      type="text"
                      value={tarjeta.cvc}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length > 3) {
                          value = value.substring(0, 3);
                        }
                        setTarjeta({ ...tarjeta, cvc: value });
                      }}
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="123"
                      maxLength="3"
                      inputMode="numeric"
                    />
                  </label>
                </div>

                {selectedPago === 'todos' ? (
                  <p className="text-lg font-semibold">Total a Pagar: ${totalPendiente.toFixed(2)}</p>
                ) : null}

                <button
                  className="mt-4 ml-4 px-4 py-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500"
                  onClick={selectedPago === 'todos' ? handlePagarTodos : handleConfirmarPago}
                >
                  {selectedPago === 'todos' ? 'Confirmar Pago de Todos' : 'Confirmar Pago'}
                </button>

                <button
                  className="mt-4 ml-4 px-4 py-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-500"
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
