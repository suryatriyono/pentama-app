import API from './api';

// Utility functions to handle response errors
const handleResponseError = (errors) => {
  return {
    response: errors.response,
  };
};

export const registerUser = async (data) => {
  try {
    const response = await API.post('/register', data);
    return response.data;
  } catch (error) {
    throw handleResponseError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw handleResponseError(error);
  }
};

export const checkAuthenticated = async () => {
  try {
    const response = await API.get('/check-authenticated');
    return response.data;
  } catch (error) {
    throw handleResponseError(error);
  }
};

export const refreshToken = async () => {
  try {
    const response = await API.post('/refresh-token');
    return response.data;
  } catch (error) {
    throw handleResponseError(error);
  }
};

export const logout = async () => {
  try {
    await API.post('/logout');
    return;
  } catch (error) {
    throw handleResponseError(error);
  }
};

export default {
  registerUser,
  loginUser,
  checkAuthenticated,
  logout,
  refreshToken,
};
