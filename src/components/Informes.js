// src/components/Informes.js

import React, { useState } from 'react';

const Informes = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoInforme, setTipoInforme] = useState('ingresos');
  const [error, setError] = useState('');
  const [resultados, setResultados] = useState([]);

  // Función para validar el formato de la fecha DD/MM/AAAA
  const validarFormatoFecha = (fecha) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return regex.test(fecha);
  };

  // Función para validar los días y meses
  const validarDiaMes = (fecha) => {
    const partes = fecha.split('/');
    if (partes.length !== 3) return false;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const año = parseInt(partes[2], 10);

    // Validar mes
    if (mes < 1 || mes > 12) {
      setError('El mes debe estar entre 01 y 12.');
      return false;
    }

    // Validar día
    if (dia < 1 || dia > 31) {
      setError('El día debe estar entre 01 y 31.');
      return false;
    }

    // Opcional: Validar día según el mes (ejemplo simplificado)
    const mesesCon30Dias = [4, 6, 9, 11];
    if (mesesCon30Dias.includes(mes) && dia > 30) {
      setError(`El mes ${mes} tiene solo 30 días.`);
      return false;
    }

    // Validar año (opcional, por ejemplo, no permitir años anteriores a 1900)
    if (año < 1900 || año > 2100) {
      setError('El año debe estar entre 1900 y 2100.');
      return false;
    }

    return true;
  };

  // Función para formatear la fecha automáticamente
  const formatearFecha = (value) => {
    // Eliminar cualquier caracter que no sea dígito
    const digits = value.replace(/\D/g, '');
    let formatted = '';

    if (digits.length > 0) {
      formatted += digits.substring(0, 2);
    }
    if (digits.length >= 3) {
      formatted += '/' + digits.substring(2, 4);
    }
    if (digits.length >= 5) {
      formatted += '/' + digits.substring(4, 8);
    }

    return formatted;
  };

  const handleFechaInicioChange = (e) => {
    const input = e.target.value;
    const formatted = formatearFecha(input);
    setFechaInicio(formatted);
    setError(''); // Limpiar errores al cambiar la fecha
  };

  const handleFechaFinChange = (e) => {
    const input = e.target.value;
    const formatted = formatearFecha(input);
    setFechaFin(formatted);
    setError(''); // Limpiar errores al cambiar la fecha
  };

  const handleGenerarInforme = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor, completa ambas fechas.');
      return;
    }

    if (!validarFormatoFecha(fechaInicio) || !validarFormatoFecha(fechaFin)) {
      setError('Las fechas deben estar en formato DD/MM/AAAA.');
      return;
    }

    if (!validarDiaMes(fechaInicio) || !validarDiaMes(fechaFin)) {
      // El mensaje de error ya se establece en validarDiaMes
      return;
    }

    const endpoint = tipoInforme === 'ingresos' ? '/api/informes/ingresos' : '/api/informes/servicios-profesional';
    const body = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar el informe');
      }

      const data = await response.json();
      setResultados(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDescargarPDF = async () => {
    const endpoint = tipoInforme === 'ingresos' ? '/api/informes/ingresos-pdf' : '/api/informes/servicios-profesional-pdf';
    const body = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al descargar el informe');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tipoInforme}_informe_${fechaInicio}_a_${fechaFin}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen p-8 flex flex-col items-center"
    style={{
      backgroundImage: 'url(./verde3.png)', // Ruta de la imagen
      backgroundSize: 'cover', // Ajusta la imagen para que cubra todo el fondo
      backgroundPosition: 'center', // Centra la imagen
      backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
    }}
    >
      <h1 className="text-4xl font-semibold text-center text-black mb-8 p-4 shadow-lg rounded-full bg-[rgba(237,247,222,0.8)]">
        Generar Informe
      </h1>

      <div className="bg-[rgba(237,247,222,0.8)] p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Fecha Inicio */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Inicio:</label>
          <input
            type="text"
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            placeholder="DD/MM/AAAA"
            maxLength="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Fecha Fin */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Fin:</label>
          <input
            type="text"
            value={fechaFin}
            onChange={handleFechaFinChange}
            placeholder="DD/MM/AAAA"
            maxLength="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        {/* Tipo de Informe */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Informe:</label>
          <select
            value={tipoInforme}
            onChange={(e) => setTipoInforme(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          >
            <option value="ingresos">Ingresos por tipo de pago</option>
            <option value="servicios">Servicios realizados por profesional</option>
          </select>
        </div>

        {/* Botón para Generar Informe */}
        <button
          onClick={handleGenerarInforme}
          className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
        >
          Generar Informe
        </button>
      </div>

      {/* Tabla de Resultados */}
      {resultados.length > 0 && (
        <>
          <div className="mt-8 w-full max-w-md overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-[rgba(76,175,80,0.8)] text-white">
                  {tipoInforme === 'ingresos' ? (
                    <>
                      <th className="px-4 py-2">Método de Pago</th>
                      <th className="px-4 py-2">Total Ingresos</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2">Profesional</th>
                      <th className="px-4 py-2">Servicio</th>
                      <th className="px-4 py-2">Total Servicios</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {resultados.map((row, index) => (
                  <tr key={index} className="border-t">
                    {tipoInforme === 'ingresos' ? (
                      <>
                        <td className="px-4 py-2">{row.metodo_pago}</td>
                        <td className="px-4 py-2">${row.total}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{row.nombre} {row.apellido}</td>
                        <td className="px-4 py-2">{row.servicio}</td>
                        <td className="px-4 py-2">{row.total_servicios}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón para Descargar Informe */}
          <button
            onClick={handleDescargarPDF}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-2"
          >
            Descargar Informe
          </button>
        </>
      )}
    </div>
  );
};

export default Informes;
