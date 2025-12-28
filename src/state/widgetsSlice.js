import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  widgets: [],
  selectedWidgetId: null,
};

const widgetsSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    /**
     * Add a new widget to the dashboard
     * @param {Object} action.payload - Widget configuration
     */
    addWidget: {
      reducer: (state, action) => {
        state.widgets.push(action.payload);
      },
      prepare: (widgetConfig) => {
        return {
          payload: {
            id: nanoid(),
            title: widgetConfig.title || 'New Widget',
            type: widgetConfig.type, // 'table', 'chart', 'card'
            apiEndpoint: widgetConfig.apiEndpoint || '',
            apiKey: widgetConfig.apiKey || '',
            fields: widgetConfig.fields || [], // Selected fields to display
            refreshInterval: widgetConfig.refreshInterval || 60000, // ms
            chartType: widgetConfig.chartType || 'line', // 'line', 'candlestick', 'bar'
            timeInterval: widgetConfig.timeInterval || 'daily', // 'daily', 'weekly', 'monthly'
            filters: widgetConfig.filters || {},
            customSettings: widgetConfig.customSettings || {},
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            isLoading: false,
            error: null,
            data: null,
          },
        };
      },
    },

    /**
     * Remove a widget from the dashboard
     * @param {Object} action.payload - Widget ID
     */
    removeWidget: (state, action) => {
      state.widgets = state.widgets.filter((widget) => widget.id !== action.payload);
      if (state.selectedWidgetId === action.payload) {
        state.selectedWidgetId = null;
      }
    },

    /**
     * Update widget configuration
     * @param {Object} action.payload - { id, updates }
     */
    updateWidget: (state, action) => {
      const { id, updates } = action.payload;
      const widget = state.widgets.find((w) => w.id === id);
      if (widget) {
        Object.assign(widget, updates, {
          lastUpdated: new Date().toISOString(),
        });
      }
    },

    /**
     * Update widget data after API call
     * @param {Object} action.payload - { id, data, error }
     */
    updateWidgetData: (state, action) => {
      const { id, data, error } = action.payload;
      const widget = state.widgets.find((w) => w.id === id);
      if (widget) {
        widget.data = data;
        widget.error = error || null;
        widget.isLoading = false;
        widget.lastUpdated = new Date().toISOString();
      }
    },

    /**
     * Set widget loading state
     * @param {Object} action.payload - { id, isLoading }
     */
    setWidgetLoading: (state, action) => {
      const { id, isLoading } = action.payload;
      const widget = state.widgets.find((w) => w.id === id);
      if (widget) {
        widget.isLoading = isLoading;
      }
    },

    /**
     * Set widget error
     * @param {Object} action.payload - { id, error }
     */
    setWidgetError: (state, action) => {
      const { id, error } = action.payload;
      const widget = state.widgets.find((w) => w.id === id);
      if (widget) {
        widget.error = error;
        widget.isLoading = false;
      }
    },

    /**
     * Select a widget for editing
     * @param {Object} action.payload - Widget ID
     */
    selectWidget: (state, action) => {
      state.selectedWidgetId = action.payload;
    },

    /**
     * Deselect widget
     */
    deselectWidget: (state) => {
      state.selectedWidgetId = null;
    },

    /**
     * Duplicate a widget
     * @param {Object} action.payload - Widget ID to duplicate
     */
    duplicateWidget: (state, action) => {
      const widget = state.widgets.find((w) => w.id === action.payload);
      if (widget) {
        const newWidget = {
          ...widget,
          id: nanoid(),
          title: `${widget.title} (Copy)`,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        state.widgets.push(newWidget);
      }
    },

    /**
     * Load widgets from storage
     * @param {Object} action.payload - Array of widgets
     */
    loadWidgetsFromStorage: (state, action) => {
      state.widgets = action.payload;
    },
    
    /**
     * Restore widgets (alias for persistence compatibility)
     * @param {Object} action.payload - Array of widgets
     */
    restoreWidgets: (state, action) => {
      state.widgets = action.payload;
    },

    /**
     * Clear all widgets
     */
    clearAllWidgets: (state) => {
      state.widgets = [];
      state.selectedWidgetId = null;
    },

    /**
     * Reorder widgets
     * @param {Object} action.payload - Array of widget IDs in new order
     */
    reorderWidgets: (state, action) => {
      const orderedIds = action.payload;
      const orderedWidgets = [];
      orderedIds.forEach((id) => {
        const widget = state.widgets.find((w) => w.id === id);
        if (widget) {
          orderedWidgets.push(widget);
        }
      });
      state.widgets = orderedWidgets;
    },
  },
});

export const {
  addWidget,
  removeWidget,
  updateWidget,
  updateWidgetData,
  setWidgetLoading,
  setWidgetError,
  selectWidget,
  deselectWidget,
  duplicateWidget,
  loadWidgetsFromStorage,
  restoreWidgets,
  clearAllWidgets,
  reorderWidgets,
} = widgetsSlice.actions;

// Selectors
export const selectAllWidgets = (state) => state.widgets.widgets;
export const selectWidgetById = (state, widgetId) =>
  state.widgets.widgets.find((w) => w.id === widgetId);
export const selectSelectedWidgetId = (state) => state.widgets.selectedWidgetId;
export const selectSelectedWidget = (state) => {
  const id = state.widgets.selectedWidgetId;
  return id ? state.widgets.widgets.find((w) => w.id === id) : null;
};
export const selectWidgetsByType = (state, type) =>
  state.widgets.widgets.filter((w) => w.type === type);
export const selectWidgetsCount = (state) => state.widgets.widgets.length;

export default widgetsSlice.reducer;
