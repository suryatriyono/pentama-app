import API from './api';

// Utility functions to handle response errors
const handleResponseError = (errors) => {
  // console.log('Auth Service Res: ', errors.response);
  return {
    data: errors.response.data,
    status: errors.response.status,
  };
};

const handleResponseSuccess = (response) => {
  return {
    data: response.data,
    status: response.status,
  };
};

export const registerUser = async (data) => {
  try {
    const response = await API.post('/register', data);
    return handleResponseSuccess(response);
  } catch (error) {
    console.log(error);
    throw handleResponseError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/login', credentials);
    return handleResponseSuccess(response);
  } catch (error) {
    throw handleResponseError(error);
  }
};

export const checkAuthenticated = async () => {
  try {
    const response = await API.get('/check-authenticated');
    return handleResponseSuccess(response);
  } catch (error) {
    console.log(error);
    throw handleResponseError(error);
  }
};

export const refreshToken = async () => {
  try {
    const response = await API.post('/refresh-token');
    return handleResponseSuccess(response);
  } catch (error) {
    console.log(error);
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
