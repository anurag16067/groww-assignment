/**
 * Redux Store Configuration
 * 
 * Configures Redux store with middleware and persistence
 */

import { configureStore } from '@reduxjs/toolkit';
import widgetsReducer from './widgetsSlice';

const store = configureStore({
  reducer: {
    widgets: widgetsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['widgets/restoreWidgets', 'widgets/restoreLayout'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
