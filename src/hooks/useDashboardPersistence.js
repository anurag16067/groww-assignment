/**
 * useDashboardPersistence Hook
 * 
 * React hook for dashboard persistence with localStorage
 */

import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreWidgets, selectAllWidgets, clearAllWidgets } from '../state/widgetsSlice';
import DashboardStorage from '../utils/dashboardStorage';

const useDashboardPersistence = () => {
  const dispatch = useDispatch();
  const widgets = useSelector(selectAllWidgets);
  const layout = useSelector(state => state.dashboard?.layout || []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  /**
   * Load dashboard from localStorage on mount
   */
  useEffect(() => {
    const loadDashboard = () => {
      try {
        setIsLoading(true);
        
        // Load widgets
        const savedWidgets = DashboardStorage.loadWidgets();
        if (savedWidgets && savedWidgets.length > 0) {
          // Dispatch action to restore widgets
          dispatch(restoreWidgets(savedWidgets));
        }

        // Load layout (if you have layout in dashboard slice)
        const savedLayout = DashboardStorage.loadLayout();
        if (savedLayout && savedLayout.length > 0) {
          // Dispatch action to restore layout if available
          // dispatch({ type: 'dashboard/restoreLayout', payload: savedLayout });
        }

        console.log('Dashboard loaded from localStorage');
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [dispatch]);

  /**
   * Auto-save dashboard when widgets or layout change
   */
  useEffect(() => {
    // Skip saving during initial load
    if (isLoading) return;

    const saveDashboard = async () => {
      try {
        setIsSaving(true);
        
        // Save with debounce
        await new Promise(resolve => setTimeout(resolve, 500));
        
        DashboardStorage.saveWidgets(widgets);
        DashboardStorage.saveLayout(layout);
        
        setLastSaved(new Date());
        console.log('Dashboard auto-saved');
      } catch (error) {
        console.error('Failed to auto-save dashboard:', error);
      } finally {
        setIsSaving(false);
      }
    };

    saveDashboard();
  }, [widgets, layout, isLoading]);

  /**
   * Manual save
   */
  const save = useCallback(() => {
    try {
      DashboardStorage.saveWidgets(widgets);
      DashboardStorage.saveLayout(layout);
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('Failed to save dashboard:', error);
      return false;
    }
  }, [widgets, layout]);

  /**
   * Export dashboard as JSON
   */
  const exportDashboard = useCallback(() => {
    return DashboardStorage.exportDashboard();
  }, []);

  /**
   * Export dashboard as file download
   */
  const exportToFile = useCallback(() => {
    return DashboardStorage.exportToFile();
  }, []);

  /**
   * Import dashboard from JSON
   */
  const importDashboard = useCallback((config) => {
    const result = DashboardStorage.importDashboard(config);
    
    if (result.success) {
      // Reload dashboard
      const savedWidgets = DashboardStorage.loadWidgets();
      const savedLayout = DashboardStorage.loadLayout();
      
      if (savedWidgets) {
        dispatch(restoreWidgets(savedWidgets));
      }
      if (savedLayout) {
        // dispatch({ type: 'dashboard/restoreLayout', payload: savedLayout });
      }
    }
    
    return result;
  }, [dispatch]);

  /**
   * Import dashboard from file
   */
  const importFromFile = useCallback(async (file) => {
    try {
      const config = await DashboardStorage.importFromFile(file);
      
      // Reload dashboard
      const savedWidgets = DashboardStorage.loadWidgets();
      const savedLayout = DashboardStorage.loadLayout();
      
      if (savedWidgets) {
        dispatch(restoreWidgets(savedWidgets));
      }
      if (savedLayout) {
        // dispatch({ type: 'dashboard/restoreLayout', payload: savedLayout });
      }
      
      return { success: true, data: config };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  /**
   * Clear all dashboard data
   */
  const clearDashboard = useCallback(() => {
    const success = DashboardStorage.clearAll();
    if (success) {
      // Clear Redux state
      dispatch(clearAllWidgets());
    }
    return success;
  }, [dispatch]);

  /**
   * Create backup
   */
  const createBackup = useCallback(() => {
    return DashboardStorage.createBackup();
  }, []);

  /**
   * List backups
   */
  const listBackups = useCallback(() => {
    return DashboardStorage.listBackups();
  }, []);

  /**
   * Restore from backup
   */
  const restoreBackup = useCallback((backupKey) => {
    const result = DashboardStorage.restoreBackup(backupKey);
    
    if (result.success) {
      // Reload dashboard
      const savedWidgets = DashboardStorage.loadWidgets();
      const savedLayout = DashboardStorage.loadLayout();
      
      if (savedWidgets) {
        dispatch(restoreWidgets(savedWidgets));
      }
      if (savedLayout) {
        // dispatch({ type: 'dashboard/restoreLayout', payload: savedLayout });
      }
    }
    
    return result;
  }, [dispatch]);

  /**
   * Get storage info
   */
  const getStorageInfo = useCallback(() => {
    return DashboardStorage.getStorageInfo();
  }, []);

  return {
    // State
    isLoading,
    isSaving,
    lastSaved,
    
    // Actions
    save,
    exportDashboard,
    exportToFile,
    importDashboard,
    importFromFile,
    clearDashboard,
    
    // Backup
    createBackup,
    listBackups,
    restoreBackup,
    
    // Info
    getStorageInfo
  };
};

export default useDashboardPersistence;
