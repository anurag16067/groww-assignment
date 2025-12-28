import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import widgetsReducer from './widgetsSlice';
import { loadState } from '../utils/localStorage';
import localStorageMiddleware from './middleware/localStorageMiddleware';

// Load persisted state from localStorage
const persistedState = loadState();

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    widgets: widgetsReducer,
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['widgets/addWidget'],
      },
    }).concat(localStorageMiddleware),
});

export default store;
