import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './AuthContext';

const ProtectedRoute = ({ roles }) => {
  const { isLogged, role, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isLogged) {
    return <Navigate to="/login" />;
  }


  if (roles && !roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
