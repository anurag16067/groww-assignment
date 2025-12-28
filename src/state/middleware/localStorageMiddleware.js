import { saveState } from '../../utils/localStorage';

/**
 * Redux middleware to persist state to localStorage
 * Throttles saves to avoid excessive writes
 */
let saveTimeout = null;
const SAVE_DELAY = 1000; // 1 second debounce

export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Debounce save to localStorage
  saveTimeout = setTimeout(() => {
    const state = store.getState();
    saveState({
      dashboard: state.dashboard,
      widgets: state.widgets,
    });
  }, SAVE_DELAY);

  return result;
};

export default localStorageMiddleware;
