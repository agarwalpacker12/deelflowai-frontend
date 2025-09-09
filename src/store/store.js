import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import leadsSlice from './slices/leadsSlice';
import propertiesSlice from './slices/propertiesSlice';
import dealsSlice from './slices/dealsSlice';
import campaignsSlice from './slices/campaignsSlice';
import aiSlice from './slices/aiSlice';
import blockchainSlice from './slices/blockchainSlice';
import psychologySlice from './slices/psychologySlice';
import marketplaceSlice from './slices/marketplaceSlice';
import analyticsSlice from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    leads: leadsSlice,
    properties: propertiesSlice,
    deals: dealsSlice,
    campaigns: campaignsSlice,
    ai: aiSlice,
    blockchain: blockchainSlice,
    psychology: psychologySlice,
    marketplace: marketplaceSlice,
    analytics: analyticsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['blockchain.web3', 'blockchain.contract'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Type exports for TypeScript (if needed, convert to .ts file)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
