import { createSlice } from '@reduxjs/toolkit';

// Create slice for notification
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    messages: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.messages.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
    clearNotification: (state) => {
      state.messages = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
