import { configureStore } from '@reduxjs/toolkit';
import itemReducer from './slices/itemSlice';
import borrowerReducer from './slices/borrowerSlice';
import loanReducer from './slices/loanSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    items: itemReducer,
    borrowers: borrowerReducer,
    loans: loanReducer,
    auth: authReducer,
  },
});