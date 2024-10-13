// src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

// src/components/PrivateRoute.js

const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated } = useContext(AuthContext);
  
    if (isAuthenticated === null) {
      // Puedes mostrar un indicador de carga o nada mientras verificas la autenticación
      return null;
    }
  
    return isAuthenticated ? <Element /> : <Navigate to="/" />;
  };
  

export default PrivateRoute;
