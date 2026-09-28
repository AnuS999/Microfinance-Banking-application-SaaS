import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosInstance';

// Safe LocalStorage recovery to prevent JSON.parse syntax errors on undefined/corrupt strings
const getUserFromStorage = () => {
  try {
    const item = localStorage.getItem('userInfo');
    if (!item || item === 'undefined' || item === 'null') return null;
    return JSON.parse(item);
  } catch (err) {
    console.error('Failed to parse userInfo from localStorage:', err);
    return null;
  }
};

const userFromStorage = getUserFromStorage();

// ==========================================
// ASYNC THUNKS
// ==========================================

// 1. User Login Thunk (Updated to normalize fullName/name)
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🚀 Login Thunk Triggered with:', credentials);
      const response = await API.post('/auth/login', credentials);
      console.log('✅ API Response Received:', response.data);
      
      const rawUser = response.data.user || {};
      
      // Backend se chahe 'fullName' aaye ya 'name', dono ko unify karlo
      const unifiedName = rawUser.fullName || rawUser.name || 'User';

      // Backend response se user object aur token ko combine karke store karein
      const userData = {
        ...rawUser,
        name: unifiedName,
        fullName: unifiedName,
        token: response.data.token
      };

      localStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('❌ Login Thunk Caught Error:', err);
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Login failed. Please check credentials.'
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
      const rawUser = response.data.user || response.data.data || {};
      
      const unifiedName = rawUser.fullName || rawUser.name || 'User';
      const dataToStore = {
        ...rawUser,
        name: unifiedName,
        fullName: unifiedName
      };

      localStorage.setItem('userInfo', JSON.stringify(dataToStore));
      return dataToStore;
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
      const response = await API.post('/auth/create-employee', userData);
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