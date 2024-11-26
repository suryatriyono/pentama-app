import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  const shouldRedirect = useMemo(() => {
    // If the user is not authenticated redirect to the Authentication page
    if (!isAuthenticated) {
      return '/auth';
    }
    // If the user is authenticated but trying to access the Authentication page, redirect to dashboard
    if (location.pathname === '/auth') {
      return `/${role}/dashboard`;
    }
    // If role not allowed, redirect to dashboard
    if (!allowedRoles.includes(role)) {
      return `/${role}/dashboard`;
    }
  }, [isAuthenticated, location.pathname, role, allowedRoles]);

  if (shouldRedirect) {
    return (
      <Navigate
        to={shouldRedirect}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
