import { createSelector } from '@reduxjs/toolkit';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import LoadingOverlay from '../components/common/LoadingOverlay';
import ProtectedRoute from '../components/common/ProtectedRoute';
import routes from '../config/roles';
import { authenticateUser } from '../utils/auth';

// lazy load components
const AuthenticationPage = lazy(() =>
  import('../pages/auth/AuthenticationPage')
);

const selectAuthDetails = createSelector(
  (state) => state.auth,
  (auth) => ({
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
  })
);

const AppRouter = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, role } = useSelector(selectAuthDetails);

  useEffect(() => {
    const checkUserStatus = async () => {
      await authenticateUser(dispatch);
    };

    checkUserStatus();

    const intervalId = setInterval(checkUserStatus, 300000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Logic for hendling routes based on user authentication and role
  const getRedirectPath = () => {
    if (isAuthenticated) {
      return `/${role}/dashboard`;
    }
    return '/auth';
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          {/* Authentication */}
          <Route
            path="/auth"
            element={
              isAuthenticated ? (
                <Navigate to={getRedirectPath()} />
              ) : (
                <AuthenticationPage />
              )
            }
          />

          {/* Route for Admin */}
          {routes.admin.map((route) => (
            <Route
              key={route.path}
              path={`/admin/${route.path}`}
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Hendling unmatch routes */}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? getRedirectPath() : '/auth'}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
