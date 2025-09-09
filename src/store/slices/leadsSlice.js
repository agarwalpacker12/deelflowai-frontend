import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  currentLead: null,
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 1, perPage: 10, total: 0 },
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload;
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

export const { setLeads, setCurrentLead, setLoading, setError, setFilters, setPagination } = leadsSlice.actions;
export default leadsSlice.reducer;
