import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboardData: {},
  reports: [],
  metrics: {},
  charts: {},
  kpis: {},
  loading: false,
  error: null,
  dateRange: { start: null, end: null },
  filters: {},
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    setCharts: (state, action) => {
      state.charts = action.payload;
    },
    setKpis: (state, action) => {
      state.kpis = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { setDashboardData, setReports, setMetrics, setCharts, setKpis, setLoading, setError, setDateRange, setFilters } = analyticsSlice.actions;
export default analyticsSlice.reducer;
