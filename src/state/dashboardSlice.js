import { createSlice } from '@reduxjs/toolkit';

// Load theme from localStorage or system preference
const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('finboard_theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
};

const initialState = {
  layout: [], // Grid layout configuration for react-grid-layout
  theme: getInitialTheme(), // 'light' or 'dark' - loaded from storage or system preference
  sidebarOpen: true,
  isEditMode: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /**
     * Update grid layout positions
     * @param {Object} action.payload - Array of layout items
     */
    updateLayout: (state, action) => {
      state.layout = action.payload;
    },

    /**
     * Toggle theme between light and dark
     */
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Persist theme to localStorage
      try {
        localStorage.setItem('finboard_theme', state.theme);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    },

    /**
     * Set specific theme
     * @param {Object} action.payload - 'light' or 'dark'
     */
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Persist theme to localStorage
      try {
        localStorage.setItem('finboard_theme', state.theme);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    },

    /**
     * Toggle sidebar visibility
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    /**
     * Set sidebar state
     * @param {Object} action.payload - boolean
     */
    setSidebar: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    /**
     * Toggle edit mode for drag and drop
     */
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },

    /**
     * Set edit mode
     * @param {Object} action.payload - boolean
     */
    setEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    /**
     * Load dashboard state from storage
     * @param {Object} action.payload - Dashboard state object
     */
    loadDashboardFromStorage: (state, action) => {
      return { ...state, ...action.payload };
    },

    /**
     * Reset dashboard to initial state
     */
    resetDashboard: () => {
      return initialState;
    },
  },
});

export const {
  updateLayout,
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebar,
  toggleEditMode,
  setEditMode,
  loadDashboardFromStorage,
  resetDashboard,
} = dashboardSlice.actions;

// Selectors
export const selectLayout = (state) => state.dashboard.layout;
export const selectTheme = (state) => state.dashboard.theme;
export const selectSidebarOpen = (state) => state.dashboard.sidebarOpen;
export const selectIsEditMode = (state) => state.dashboard.isEditMode;

export default dashboardSlice.reducer;
