import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, firstLogin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If password change is required, force redirect to /change-password
  if (firstLogin && location.pathname !== '/change-password') {
    // Only show toast once if not already on the page
    return <Navigate to="/change-password" replace />;
  }

  // If roles are restricted, verify role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error('Access Denied: Unauthorized role.');
    
    // Redirect to appropriate default dashboard
    if (user.role === 'ROLE_TPO') {
      return <Navigate to="/tpo/dashboard" replace />;
    } else if (user.role === 'ROLE_TP_MEMBER') {
      return <Navigate to="/tp/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
