import { createSelector } from '@reduxjs/toolkit';

/**
 * Optimized Redux Selectors using Reselect
 * These selectors are memoized and only recompute when their inputs change
 * This prevents unnecessary re-renders and improves performance
 */

// Base selectors (input selectors)
const selectWidgetsState = (state) => state.widgets;
const selectDashboardState = (state) => state.dashboard;

// Memoized selectors for widgets
export const selectAllWidgets = createSelector(
  [selectWidgetsState],
  (widgetsState) => widgetsState.widgets
);

export const selectSelectedWidgetId = createSelector(
  [selectWidgetsState],
  (widgetsState) => widgetsState.selectedWidgetId
);

export const selectWidgetsCount = createSelector(
  [selectAllWidgets],
  (widgets) => widgets.length
);

export const selectSelectedWidget = createSelector(
  [selectAllWidgets, selectSelectedWidgetId],
  (widgets, selectedId) => 
    selectedId ? widgets.find(widget => widget.id === selectedId) : null
);

export const selectWidgetById = createSelector(
  [selectAllWidgets, (state, widgetId) => widgetId],
  (widgets, widgetId) => widgets.find(widget => widget.id === widgetId)
);

export const selectWidgetsByType = createSelector(
  [selectAllWidgets, (state, type) => type],
  (widgets, type) => widgets.filter(widget => widget.type === type)
);

export const selectLoadingWidgets = createSelector(
  [selectAllWidgets],
  (widgets) => widgets.filter(widget => widget.isLoading)
);

export const selectErrorWidgets = createSelector(
  [selectAllWidgets],
  (widgets) => widgets.filter(widget => widget.error)
);

export const selectWidgetsWithData = createSelector(
  [selectAllWidgets],
  (widgets) => widgets.filter(widget => widget.data && !widget.error)
);

// Memoized selectors for dashboard
export const selectLayout = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.layout
);

export const selectTheme = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.theme
);

export const selectIsEditMode = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.isEditMode
);

export const selectSidebarOpen = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.sidebarOpen
);

// Complex memoized selectors
export const selectWidgetStats = createSelector(
  [selectAllWidgets],
  (widgets) => ({
    total: widgets.length,
    loading: widgets.filter(w => w.isLoading).length,
    error: widgets.filter(w => w.error).length,
    success: widgets.filter(w => w.data && !w.error).length,
  })
);

export const selectWidgetsByCategory = createSelector(
  [selectAllWidgets],
  (widgets) => {
    return widgets.reduce((acc, widget) => {
      const category = widget.type || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(widget);
      return acc;
    }, {});
  }
);

// Performance-critical selector for grid layout
export const selectLayoutMap = createSelector(
  [selectLayout],
  (layout) => {
    return layout.reduce((acc, item) => {
      acc[item.i] = item;
      return acc;
    }, {});
  }
);

// Selector for widgets that need refresh
export const selectWidgetsNeedingRefresh = createSelector(
  [selectAllWidgets],
  (widgets) => {
    const now = Date.now();
    return widgets.filter(widget => {
      if (!widget.lastUpdated || !widget.refreshInterval) return false;
      const lastUpdate = new Date(widget.lastUpdated).getTime();
      return now - lastUpdate >= widget.refreshInterval;
    });
  }
);
