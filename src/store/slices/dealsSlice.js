import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deals: [],
  currentDeal: null,
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 1, perPage: 10, total: 0 },
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDeals: (state, action) => {
      state.deals = action.payload;
    },
    setCurrentDeal: (state, action) => {
      state.currentDeal = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
  },
});

export const { setDeals, setCurrentDeal, setLoading, setError, setFilters, setPagination } = dealsSlice.actions;
export default dealsSlice.reducer;
