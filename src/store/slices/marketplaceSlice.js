import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listings: [],
  currentListing: null,
  bids: [],
  transactions: [],
  liveActivity: [],
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 1, perPage: 10, total: 0 },
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    setCurrentListing: (state, action) => {
      state.currentListing = action.payload;
    },
    setBids: (state, action) => {
      state.bids = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setLiveActivity: (state, action) => {
      state.liveActivity = action.payload;
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

export const { setListings, setCurrentListing, setBids, setTransactions, setLiveActivity, setLoading, setError, setFilters, setPagination } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
