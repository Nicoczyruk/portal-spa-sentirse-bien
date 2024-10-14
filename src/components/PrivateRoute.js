// src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const PrivateRoute = ({ element: Component, roles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated === null) {
    // Puedes mostrar un loader aquí mientras se verifica la autenticación
    return <div className="text-center mt-10">Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de login
    return <Navigate to="/" />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.rol)) {
    // Si el usuario no tiene el rol requerido, redirigir a una página de acceso denegado o a home
    return <Navigate to="/home" />;
  }

  // Si está autenticado y tiene el rol necesario, renderizar el componente
  return <Component />;
};

export default PrivateRoute;
