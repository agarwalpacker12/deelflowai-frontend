import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 1, perPage: 10, total: 0 },
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action) => {
      state.properties = action.payload;
    },
    setCurrentProperty: (state, action) => {
      state.currentProperty = action.payload;
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

export const { setProperties, setCurrentProperty, setLoading, setError, setFilters, setPagination } = propertiesSlice.actions;
export default propertiesSlice.reducer;
