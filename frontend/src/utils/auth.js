import {
  checkAuth,
  refreshToken,
  updateStatus,
} from '../components/features/auth/authSlice';
import { getCacheData, setCacheData } from './cache';

export const authenticateUser = async (dispatch) => {
  const cachedAuth = getCacheData('authentication');

  if (cachedAuth) {
    dispatch(updateStatus(cachedAuth));
    return cachedAuth;
  } else {
    try {
      const response = await dispatch(checkAuth()).unwrap();
      const { isAuthenticated, role } = response?.data.success;
      setCacheData('authentication', { isAuthenticated, role }, 15);
      dispatch(updateStatus({ isAuthenticated, role }));
      return { isAuthenticated, role };
    } catch {
      return await handleRefreshToken(dispatch);
    }
  }
};

const handleRefreshToken = async (dispatch) => {
  try {
    const response = await dispatch(refreshToken()).unwrap();
    const { isAuthenticated, role } = response?.data.success;
    setCacheData('authentication', { isAuthenticated, role }, 15);
    dispatch(updateStatus({ isAuthenticated, role }));
    return { isAuthenticated, role };
  } catch (error) {
    console.error('Failed to refresh token:', error);
    dispatch(updateStatus({ isAuthenticated: false, role: null }));
    return { isAuthenticated: false, role: null };
  }
};
