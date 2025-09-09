import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversation: null,
  aiStatus: 'idle',
  insights: {},
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    setAiStatus: (state, action) => {
      state.aiStatus = action.payload;
    },
    setInsights: (state, action) => {
      state.insights = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setConversations, setCurrentConversation, setAiStatus, setInsights, setLoading, setError } = aiSlice.actions;
export default aiSlice.reducer;
