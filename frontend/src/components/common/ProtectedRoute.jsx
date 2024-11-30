import { createSelector } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { authenticateUser } from '../../utils/auth';
import LoadingOverlay from './LoadingOverlay';

// Selector for fetching authentication data
const selectAuthDetails = createSelector(
  (state) => state.auth,
  (auth) => ({
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
  })
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  // useDispatch for send action to Redux
  const dispatch = useDispatch();
  // pull up information about the current route
  const location = useLocation();

  const { isLoading, isAuthenticated, role } = useSelector(selectAuthDetails);

  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { isAuthenticated } = await authenticateUser(dispatch);
      if (!isAuthenticated) setShouldRedirect(true);
    };

    checkUserStatus();

    const intervalId = setInterval(checkUserStatus, 300000); // Set 5 minutes

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // If loading, show loading overlay until data is loaded
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // If not authenticated, redirect to login page and save the current location
  if (shouldRedirect || !isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        state={{ from: location }}
        replace
      />
    );
  }

  // If authenticated and allowed role, continue with the route
  if (role && allowedRoles.includes(role)) {
    return children;
  }

  // If authenticated but not allowed role, redirect to dashboard page
  return (
    <Navigate
      to={`/${role}/dashboard`}
      replace
    />
  );
};

export default ProtectedRoute;
