import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosInstance';
export const fetchLoans = createAsyncThunk('loans/fetchLoans', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/loans');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch loans');
  }
});

export const disburseLoan = createAsyncThunk('loans/disburseLoan', async (loanData, { rejectWithValue }) => {
  try {
    const res = await API.post('/loans/disburse', loanData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to disburse loan');
  }
});

export const markEmiPaid = createAsyncThunk('loans/markEmiPaid', async ({ loanId, installmentId }, { rejectWithValue }) => {
  try {
    const res = await API.patch(`/loans/${loanId}/pay/${installmentId}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update EMI status');
  }
});

const loanSlice = createSlice({
  name: 'loans',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => { state.loading = true; })
      .addCase(fetchLoans.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchLoans.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(disburseLoan.fulfilled, (state, action) => { state.data.unshift(action.payload); })
      .addCase(markEmiPaid.fulfilled, (state, action) => {
        const index = state.data.findIndex((loan) => loan._id === action.payload._id);
        if (index !== -1) state.data[index] = action.payload;
      });
  },
});

export default loanSlice.reducer;