import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import AuthService from '../../../services/auth.service';

// Utilities functions to handle responses errors
const handleResponseError = (errors) => {
  return {
    response: errors.response.data,
    status: errors.response.status,
  };
};

// Async Thunks for login operations
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginUser(credentials);
      return response;
    } catch (error) {
      // Retun more detailed error information if available (e.g. , Axios error)
      return rejectWithValue(handleResponseError(error));
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.checkAuthenticated();
      return response;
    } catch (error) {
      return rejectWithValue(handleResponseError(error));
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.refreshToken();
      return response;
    } catch (error) {
      // Retun more detailed error information if available (e.g. , Axios error)
      return rejectWithValue(handleResponseError(error));
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
    isLoading: false,
    isAuthenticated: false, // Add  to track if user is authenticated
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.isAuthenticated = false; // set to false when logout is successful
      localStorage.removeItem('role');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('accessToken');
      AuthService.logout();
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const fulfilledLogin = (state, action) => {
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
      state.isAuthenticated = true;
      // Store user info in localStorage
      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('role', decodedToken.role);
      localStorage.setItem('accessToken', accessToken);
    };

    const rejectedLogin = (state, action) => {
      state.isLoading = false;
      state.error = {
        response: action.payload.response,
        status: action.payload.status,
      };
      state.isAuthenticated = false; // set to false when login fails or rejected
    };

    const fulfilledCheckAuth = (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = action.payload.success.isAuthenticated;
      state.role = action.payload.success.role;
    };

    const rejectedCheckAuth = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    const fulfilledRefreshToken = (state, action) => {
      const newAccessToken = action.payload.success.accessToken;
      const decodedToken = jwtDecode(newAccessToken);
      state.user = {
        id: decodedToken.id,
        role: decodedToken.role,
      };
      state.accessToken = newAccessToken;
      state.role = decodedToken.role;
      state.isAuthenticated = true;
      state.isLoading = false;
      // Update user info in localStorage
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('role', decodedToken.role);
    };

    const rejectedRefreshToken = (state) => {
      state.isLoading = false;
      state.error = {
        data: action.payload.data,
        status: action.payload.status,
      };
      state.isAuthenticated = false; // set to false when refreshToken fails or rejected
    };
    builder
      // Login
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilledLogin)
      .addCase(login.rejected, rejectedLogin)
      // Chech Auth
      .addCase(checkAuth.pending, pending)
      .addCase(checkAuth.fulfilled, fulfilledCheckAuth)
      .addCase(checkAuth.rejected, rejectedCheckAuth)
      // Refresh Token
      .addCase(refreshToken.pending, pending)
      .addCase(refreshToken.fulfilled, fulfilledRefreshToken)
      .addCase(refreshToken.rejected, rejectedRefreshToken);
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
