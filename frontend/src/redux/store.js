import { configureStore } from '@reduxjs/toolkit';
import itemReducer from './slices/itemSlice';
import loanReducer from './slices/loanSlice';
import borrowerReducer from './slices/borrowerSlice';

export const store = configureStore({
  reducer: {
    items: itemReducer,
    loans: loanReducer,
    borrowers: borrowerReducer,
  },
});