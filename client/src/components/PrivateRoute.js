import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', fontSize:'2rem' }}>💅</div>;
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
