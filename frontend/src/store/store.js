import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../components/features/auth/authSlice';
import notificationReducer from '../components/features/notification/notificationSlice';

// Cretae store instance used Redux Toolkit
const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serialization check for ease of  configuration
    }),
  devTools: process.env.NODE_ENV !== 'production', // Activated Redux DevTools in Development mode only
});

export { store };
