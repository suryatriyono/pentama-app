import API from './api';

export const registerUser = async (data) => {
  try {
    const response = await API.post('/register', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export default {
  loginUser,
  logoutUser,
  registerUser,
};
