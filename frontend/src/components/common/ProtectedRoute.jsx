import { createSelector } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { getCacheData, setCacheData } from '../../utils/cache';
import {
  checkAuth,
  refreshToken,
  updateStatus,
} from '../features/auth/authSlice';
import LoadingOverlay from './LoadingOverlay';

const selectAuthDetails = createSelector(
  (state) => state.auth,
  (auth) => ({
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
  })
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoading, isAuthenticated, role } = useSelector(selectAuthDetails);

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const checkAuthSatus = async () => {
    const cachedAuth = getCacheData('authentication');

    if (cachedAuth) {
      dispatch(updateStatus(cachedAuth));
      return cachedAuth;
    } else {
      try {
        const response = await dispatch(checkAuth()).unwrap();
        const { isAuthenticated, role } = response.success;
        setCacheData('authentication', { isAuthenticated, role }, 15);
        dispatch(updateStatus({ isAuthenticated, role }));
        return { isAuthenticated, role };
      } catch (error) {
        try {
          const response = await dispatch(refreshToken()).unwrap();
          const { isAuthenticated, role } = response.success;
          setCacheData('authentication', { isAuthenticated, role }, 15);
          dispatch(updateStatus({ isAuthenticated, role }));
          return { isAuthenticated, role };
        } catch (error) {
          setShouldRedirect(true);
          dispatch(updateStatus({ isAuthenticated: false, role: null }));
          return { isAuthenticated: false, role: null };
        }
      }
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      await checkAuthSatus();
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
