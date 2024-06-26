import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'; // Replace with your correct context path

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { role } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      element={
        role && roles.includes(role) ? (
          <Component />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
  );
};

export default PrivateRoute;
