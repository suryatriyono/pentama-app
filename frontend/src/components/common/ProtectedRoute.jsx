import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { refreshToken } from '../features/auth/authSlice';
import LoadingOverlay from './LoadingOverlay';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoading } = useSelector((state) => state.auth);

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const accessToken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  const isTokenValid = () => {
    if (!accessToken) {
      return false;
    }
    try {
      const decodeToken = jwtDecode(accessToken);
      return decodeToken.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (!isTokenValid()) {
      dispatch(refreshToken())
        .unwrap()
        .then()
        .catch(() => {
          setShouldRedirect(true);
        });
    }
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
