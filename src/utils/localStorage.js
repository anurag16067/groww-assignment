/**
 * LocalStorage utility for persisting Redux state
 */

const STORAGE_KEY = 'finboard_state';

/**
 * Load state from localStorage
 * @returns {Object|undefined} Parsed state or undefined if not found
 */
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

/**
 * Save state to localStorage
 * @param {Object} state - Redux state to save
 */
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

/**
 * Clear state from localStorage
 */
export const clearState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing state from localStorage:', err);
  }
};

/**
 * Export dashboard configuration
 * @param {Object} state - State to export
 * @returns {string} JSON string
 */
export const exportConfig = (state) => {
  return JSON.stringify(state, null, 2);
};

/**
 * Import dashboard configuration
 * @param {string} configJson - JSON string to import
 * @returns {Object|null} Parsed config or null on error
 */
export const importConfig = (configJson) => {
  try {
    return JSON.parse(configJson);
  } catch (err) {
    console.error('Error importing config:', err);
    return null;
  }
};
