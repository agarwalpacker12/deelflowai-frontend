import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  behaviorData: {},
  triggers: [],
  analytics: {},
  userProfile: {},
  conversionMetrics: {},
  loading: false,
  error: null,
};

const psychologySlice = createSlice({
  name: 'psychology',
  initialState,
  reducers: {
    setBehaviorData: (state, action) => {
      state.behaviorData = action.payload;
    },
    setTriggers: (state, action) => {
      state.triggers = action.payload;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setConversionMetrics: (state, action) => {
      state.conversionMetrics = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBehaviorData, setTriggers, setAnalytics, setUserProfile, setConversionMetrics, setLoading, setError } = psychologySlice.actions;
export default psychologySlice.reducer;
