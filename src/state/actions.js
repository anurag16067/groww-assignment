/**
 * Action creators for loading state from localStorage
 */
import { loadDashboardFromStorage } from './dashboardSlice';
import { loadWidgetsFromStorage } from './widgetsSlice';
import { loadState } from '../utils/localStorage';

/**
 * Load all persisted state from localStorage
 * Dispatch this action on app initialization
 */
export const loadPersistedState = () => (dispatch) => {
  const state = loadState();
  
  if (state) {
    if (state.dashboard) {
      dispatch(loadDashboardFromStorage(state.dashboard));
    }
    if (state.widgets?.widgets) {
      dispatch(loadWidgetsFromStorage(state.widgets.widgets));
    }
  }
};

export default loadPersistedState;
