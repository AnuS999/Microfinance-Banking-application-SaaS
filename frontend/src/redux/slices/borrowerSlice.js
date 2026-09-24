import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosInstance';

export const fetchBorrowers = createAsyncThunk('borrowers/fetchBorrowers', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/borrowers');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch borrowers');
  }
});

export const addBorrower = createAsyncThunk('borrowers/addBorrower', async (borrowerData, { rejectWithValue }) => {
  try {
    const res = await API.post('/borrowers', borrowerData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add borrower');
  }
});

export const deleteBorrower = createAsyncThunk('borrowers/deleteBorrower', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/borrowers/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete borrower');
  }
});

const borrowerSlice = createSlice({
  name: 'borrowers',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBorrowers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBorrowers.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchBorrowers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addBorrower.fulfilled, (state, action) => { state.data.unshift(action.payload); })
      .addCase(deleteBorrower.fulfilled, (state, action) => {
        state.data = state.data.filter((b) => b._id !== action.payload);
      });
  },
});

export default borrowerSlice.reducer;