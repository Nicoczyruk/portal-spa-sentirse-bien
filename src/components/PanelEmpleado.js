// src/components/PanelEmpleado.js

import React, { useEffect, useState } from 'react';
import './PanelEmpleado.css'; // Archivo de estilos

const PanelEmpleado = () => {
  const [pagos, setPagos] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [error, setError] = useState('');

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

    fetchPagos();
  }, []);

  return (
    <div className="panel-empleado"
    style={{
      backgroundImage: 'url(./verde3.png)', // Ruta de la imagen
      backgroundSize: 'cover', // Ajusta la imagen para que cubra todo el fondo
      backgroundPosition: 'center', // Centra la imagen
      backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
    }}
    >
      <h1 className="title">
        Pagos realizados hoy
      </h1>
      {error && <p className="error">{error}</p>}

      <table className="pagos-table">
        <thead>
          <tr className='text-center'>
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
    </div>
  );
};

export default PanelEmpleado;
