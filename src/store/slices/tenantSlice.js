import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tenants: [],
  currentTenant: null,
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 1, perPage: 10, total: 0 },
};

const tenantSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    setTenants: (state, action) => {
      state.tenants = action.payload;
    },
    setCurrentTenant: (state, action) => {
      state.currentTenant = action.payload;
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

export const {
  setTenants,
  setCurrentTenant,
  setLoading,
  setError,
  setFilters,
  setPagination,
} = tenantSlice.actions;
export default tenantSlice.reducer;
