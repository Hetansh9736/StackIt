import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Features/auth/authSlice'; // or whatever slices you use

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
