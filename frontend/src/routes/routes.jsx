import { lazy, Suspense } from 'react';
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
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('role');

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
