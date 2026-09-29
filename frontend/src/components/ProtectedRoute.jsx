import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  // 1. Agar user logged in nahi hai, toh login page par redirect karein
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar specific roles allowed hain, toh case-insensitive check karein
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role ? user.role.toUpperCase() : '';
    const hasPermission = allowedRoles.map((r) => r.toUpperCase()).includes(userRole);

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  // 3. Sabhi checks pass hone par component render hone dein
  return <Outlet />;
};

export default ProtectedRoute;