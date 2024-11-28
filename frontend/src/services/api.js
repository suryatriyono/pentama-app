import axios from 'axios';

// Create axios instance with basic configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/pentama-api', // Base URL for any API requests
  withCredentials: true, // Enable credentials
});

// Added introspection to insert automatic token every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Reject request if there was an error
  }
);

export default API;
