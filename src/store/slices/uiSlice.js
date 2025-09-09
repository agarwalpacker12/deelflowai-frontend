import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'dark',
  loading: false,
  notifications: [],
  modals: {},
  activeTab: 'dashboard',
  searchQuery: '',
  filters: {},
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
  },
  viewMode: 'grid', // grid, list, table
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modals[action.payload.name] = {
        isOpen: true,
        data: action.payload.data || null,
      };
    },
    closeModal: (state, action) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false;
      }
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSorting: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setActiveTab,
  setSearchQuery,
  setFilters,
  clearFilters,
  setPagination,
  setViewMode,
  setSorting,
} = uiSlice.actions;

export const selectUI = (state) => state.ui;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectLoading = (state) => state.ui.loading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectFilters = (state) => state.ui.filters;
export const selectPagination = (state) => state.ui.pagination;
export const selectViewMode = (state) => state.ui.viewMode;
export const selectSorting = (state) => ({ sortBy: state.ui.sortBy, sortOrder: state.ui.sortOrder });

export default uiSlice.reducer;
