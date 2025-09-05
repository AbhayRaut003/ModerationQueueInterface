import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ToastNotification } from '../types';

interface ToastState {
  notifications: ToastNotification[];
}

const initialState: ToastState = {
  notifications: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      const toast: ToastNotification = {
        ...action.payload,
        id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      state.notifications.push(toast);
    },
    
    removeToast: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearAllToasts: (state) => {
      state.notifications = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export default toastSlice.reducer;