import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { ROLES } from '../config/permissions';

const ProtectedRoute = ({ 
  isLoggedIn, 
  user, 
  allowedRoles, 
  children,
  loadingComponent 
}) => {
  const location = useLocation();
  const role = user?.role?.toLowerCase();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role === ROLES.ROOT) {
    return children;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;