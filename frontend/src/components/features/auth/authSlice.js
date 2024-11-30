import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthService from '../../../services/auth.service';
import { setCacheData } from '../../../utils/cache';

// Async Thunks for login operations
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.loginUser(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error);
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
      // reject to authSlice
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  }
);

// Create slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: null,
    isLoading: false,
    isAuthenticated: false, // Add  to track if user is authenticated
    error: null,
  },
  reducers: {
    updateStatus: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false; // set to false when logout is successful
      localStorage.removeItem('authentication');
      AuthService.logout();
    },
  },
  extraReducers: (builder) => {
    const setLoadingAndClearError = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    builder
      // Login
      .addCase(login.pending, setLoadingAndClearError)
      .addCase(login.fulfilled, (state, action) => {
        console.log('fillLogin:', action.payload);
        const role = action.payload.data.success.role;
        const isAuthenticated = action.payload.data.success.isAuthenticated;
        state.isLoading = false;
        state.isAuthenticated = isAuthenticated;
        state.role = role;
        setCacheData('authentication', { isAuthenticated, role }, 15);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          response: action.payload.data,
          status: action.payload.status,
        };
        state.isAuthenticated = false; // set to false when login fails or rejected
      })
      // Chech Auth
      .addCase(checkAuth.pending, setLoadingAndClearError)
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated =
          action.payload.data.success?.isAuthenticated || false;
        state.role = action.payload.data.success?.role || null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshToken.pending, setLoadingAndClearError)
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          data: action.payload.data,
          status: action.payload.status,
        };
        state.isAuthenticated = false;
      });
  },
});

export const { updateStatus, logout } = authSlice.actions;
export default authSlice.reducer;
