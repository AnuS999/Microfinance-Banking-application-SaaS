import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axiosInstance';

// Async Thunks for API Calls
export const fetchItems = createAsyncThunk('items/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/items');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch items');
  }
});

export const addItem = createAsyncThunk('items/addItem', async (newItem, { rejectWithValue }) => {
  try {
    const response = await API.post('/items', newItem);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to add item');
  }
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/items/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete item');
  }
});

const itemSlice = createSlice({
  name: 'items',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Item
      .addCase(addItem.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      // Delete Item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
      });
  },
});

export default itemSlice.reducer;