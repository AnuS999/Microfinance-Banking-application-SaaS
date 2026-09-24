import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosInstance';

// LocalStorage se existing user session recover karein
const userFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// ==========================================
// ASYNC THUNKS
// ==========================================

// 1. User Login Thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', credentials);
      // Successful login par local storage update karein
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please check credentials.'
      );
    }
  }
);

// 2. Self Registration Thunk
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', userData);
      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed.'
      );
    }
  }
);

// 3. Admin/Agent via System User Account Creation Thunk
export const registerUserAccount = createAsyncThunk(
  'auth/registerUserAccount',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', userData);
      // Naye created user se current active session overwrite NAHI karenge
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create system user account.'
      );
    }
  }
);

// ==========================================
// AUTH SLICE DEFINITION
// ==========================================

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    // Logout Action
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.user = null;
      state.error = null;
    },
    // Clear Error State Action
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN HANDLERS ---
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- SELF REGISTER HANDLERS ---
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- SYSTEM USER CREATION HANDLERS ---
      .addCase(registerUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;