import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import LoadingOverlay from '../components/common/LoadingOverlay';
import ProtectedRoute from '../components/common/ProtectedRoute';
import routes from '../config/roles';

// lazy load components
const AuthenticationPage = lazy(() =>
  import('../pages/auth/AuthenticationPage')
);

const AppRouter = () => {
  const { isLoading } = useSelector((state) => state.auth);
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {isLoading && <LoadingOverlay />}
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          {/* Authentication */}
          <Route
            path="/auth"
            element={<AuthenticationPage />}
          />

          {/* Route for Admin */}
          {routes.admin.map((route) => {
            <Route
              key={route.path}
              path={`/admin/${route.path}`}
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <route.component />
                </ProtectedRoute>
              }
            />;
          })}

          {/* Redirect if not route match */}
          <Route
            path="*"
            element={
              <Navigate
                to="/auth"
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
