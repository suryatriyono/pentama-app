import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../../../services/auth.service';

// Async Thunks for login operations
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error) {
      // Retun more detailed error information if available (e.g. , Axios error)
      return rejectWithValue(error);
    }
  }
);

// Create slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null,
    accessToken: null,
    error: null,
    isLoading: false,
    isAuthenticated: false, // Add  to track if user is authenticated
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.isAuthenticated = false; // set to false when logout is successful
      // Clear localStorage if tokens or user info are stored there
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken } = action.payload.success;

        // Docode the accessToken to get the user information
        const decodedToken = jwtDecode(accessToken);
        state.user = {
          id: decodedToken.id,
          role: decodedToken.role,
        };
        state.role = decodedToken.role;
        state.accessToken = accessToken;
        state.isAuthenticated = true; // set to true when login is successful
        // Store the accessToken in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('role', decodedToken.role);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // set to false when login fails or rejected
      });
  },
});

export default authSlice.reducer;
