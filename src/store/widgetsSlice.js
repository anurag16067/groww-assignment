/**
 * Widgets Redux Slice
 * 
 * Manages widget state with persistence support
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  widgets: [],
  layout: [],
  selectedWidget: null,
  isLoading: false,
  error: null
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    // Add widget
    addWidget: (state, action) => {
      const widget = {
        ...action.payload,
        id: action.payload.id || `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      state.widgets.push(widget);
      
      // Add to layout
      const layoutItem = {
        i: widget.id,
        x: (state.widgets.length * 2) % 12,
        y: Infinity,
        w: action.payload.width || 4,
        h: action.payload.height || 4,
        minW: 2,
        minH: 2
      };
      state.layout.push(layoutItem);
    },

    // Update widget
    updateWidget: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.widgets.findIndex(w => w.id === id);
      if (index !== -1) {
        state.widgets[index] = {
          ...state.widgets[index],
          ...updates,
          updatedAt: Date.now()
        };
      }
    },

    // Remove widget
    removeWidget: (state, action) => {
      const id = action.payload;
      state.widgets = state.widgets.filter(w => w.id !== id);
      state.layout = state.layout.filter(l => l.i !== id);
    },

    // Update layout
    updateLayout: (state, action) => {
      state.layout = action.payload;
    },

    // Select widget
    selectWidget: (state, action) => {
      state.selectedWidget = action.payload;
    },

    // Restore widgets (from localStorage)
    restoreWidgets: (state, action) => {
      state.widgets = action.payload;
    },

    // Restore layout (from localStorage)
    restoreLayout: (state, action) => {
      state.layout = action.payload;
    },

    // Clear all
    clearAll: (state) => {
      state.widgets = [];
      state.layout = [];
      state.selectedWidget = null;
      state.error = null;
    },

    // Set loading
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  addWidget,
  updateWidget,
  removeWidget,
  updateLayout,
  selectWidget,
  restoreWidgets,
  restoreLayout,
  clearAll,
  setLoading,
  setError,
  clearError
} = widgetsSlice.actions;

export default widgetsSlice.reducer;
