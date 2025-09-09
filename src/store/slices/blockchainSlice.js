import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  account: null,
  web3: null,
  connected: false,
  contracts: {},
  transactions: [],
  loading: false,
  error: null,
};

const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setWeb3: (state, action) => {
      state.web3 = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setContracts: (state, action) => {
      state.contracts = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAccount, setWeb3, setConnected, setContracts, setTransactions, setLoading, setError } = blockchainSlice.actions;
export default blockchainSlice.reducer;
