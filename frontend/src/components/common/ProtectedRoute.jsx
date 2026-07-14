import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * Reusable ProtectedRoute component.
 * Currently serves as a structural placeholder for JWT authentication.
 */
const ProtectedRoute = () => {
  // Mock authentication check - replace with real auth context or token verification
  const isAuthenticated = true; // localStorage.getItem('token') ? true : false;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export { ProtectedRoute };
