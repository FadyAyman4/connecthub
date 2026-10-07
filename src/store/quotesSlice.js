import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRandomQuote } from '../services/quoteService';

export const fetchQuote = createAsyncThunk(
  'quotes/fetchQuote',
  async (_, { rejectWithValue }) => {
    try {
      return await getRandomQuote();
    } catch (err) {
      return rejectWithValue('Unable to load data. Please try again.');
    }
  }
);

const initialState = {
  currentQuote: null,
  loading: false,
  error: null,
};

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuote = action.payload;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default quotesSlice.reducer;