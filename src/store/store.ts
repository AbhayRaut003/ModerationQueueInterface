import { configureStore } from '@reduxjs/toolkit';
import moderationReducer from './moderationSlice';
import toastReducer from './toastSlice';

export const store = configureStore({
  reducer: {
    moderation: moderationReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;