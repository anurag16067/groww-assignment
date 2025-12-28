/**
 * Dashboard Persistence Utility
 * 
 * Handles saving and loading dashboard state to/from localStorage
 */

const STORAGE_KEYS = {
  WIDGETS: 'finboard_widgets',
  LAYOUT: 'finboard_layout',
  SETTINGS: 'finboard_settings',
  THEME: 'finboard_theme',
  VERSION: 'finboard_version'
};

const CURRENT_VERSION = '1.0.0';

/**
 * Storage Manager for dashboard persistence
 */
class DashboardStorage {
  /**
   * Save widgets to localStorage
   */
  static saveWidgets(widgets) {
    try {
      const data = {
        widgets,
        timestamp: Date.now(),
        version: CURRENT_VERSION
      };
      localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save widgets:', error);
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
      }
      return false;
    }
  }

  /**
   * Load widgets from localStorage
   */
  static loadWidgets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WIDGETS);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Version compatibility check
      if (parsed.version !== CURRENT_VERSION) {
        console.warn('Widget data version mismatch, migrating...');
        return this.migrateWidgets(parsed);
      }

      return parsed.widgets || [];
    } catch (error) {
      console.error('Failed to load widgets:', error);
      return null;
    }
  }

  /**
   * Save layout to localStorage
   */
  static saveLayout(layout) {
    try {
      const data = {
        layout,
        timestamp: Date.now(),
        version: CURRENT_VERSION
      };
      localStorage.setItem(STORAGE_KEYS.LAYOUT, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save layout:', error);
      return false;
    }
  }

  /**
   * Load layout from localStorage
   */
  static loadLayout() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAYOUT);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Version compatibility check
      if (parsed.version !== CURRENT_VERSION) {
        console.warn('Layout data version mismatch, migrating...');
        return this.migrateLayout(parsed);
      }

      return parsed.layout || [];
    } catch (error) {
      console.error('Failed to load layout:', error);
      return null;
    }
  }

  /**
   * Save dashboard settings
   */
  static saveSettings(settings) {
    try {
      const data = {
        settings,
        timestamp: Date.now(),
        version: CURRENT_VERSION
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  /**
   * Load dashboard settings
   */
  static loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return null;

      const parsed = JSON.parse(data);
      return parsed.settings || null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }

  /**
   * Save theme preference
   */
  static saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch (error) {
      console.error('Failed to save theme:', error);
      return false;
    }
  }

  /**
   * Load theme preference
   */
  static loadTheme() {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'light' || theme === 'dark') {
        return theme;
      }
      // Check system preference if no saved theme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch (error) {
      console.error('Failed to load theme:', error);
      return 'light';
    }
  }

  /**
   * Export complete dashboard configuration
   */
  static exportDashboard() {
    try {
      const widgets = this.loadWidgets();
      const layout = this.loadLayout();
      const settings = this.loadSettings();
      const theme = this.loadTheme();

      const dashboardConfig = {
        version: CURRENT_VERSION,
        exportedAt: new Date().toISOString(),
        widgets: widgets || [],
        layout: layout || [],
        settings: settings || {},
        theme: theme || 'light'
      };

      return dashboardConfig;
    } catch (error) {
      console.error('Failed to export dashboard:', error);
      return null;
    }
  }

  /**
   * Import dashboard configuration
   */
  static importDashboard(dashboardConfig) {
    try {
      // Validate config
      if (!dashboardConfig || typeof dashboardConfig !== 'object') {
        throw new Error('Invalid dashboard configuration');
      }

      // Version check and migration if needed
      if (dashboardConfig.version !== CURRENT_VERSION) {
        console.warn('Importing dashboard with different version, attempting migration...');
        dashboardConfig = this.migrateDashboard(dashboardConfig);
      }

      // Save imported data
      if (dashboardConfig.widgets) {
        this.saveWidgets(dashboardConfig.widgets);
      }
      if (dashboardConfig.layout) {
        this.saveLayout(dashboardConfig.layout);
      }
      if (dashboardConfig.settings) {
        this.saveSettings(dashboardConfig.settings);
      }
      if (dashboardConfig.theme) {
        this.saveTheme(dashboardConfig.theme);
      }

      return {
        success: true,
        data: dashboardConfig
      };
    } catch (error) {
      console.error('Failed to import dashboard:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Export dashboard as JSON file
   */
  static exportToFile() {
    try {
      const config = this.exportDashboard();
      if (!config) {
        throw new Error('Failed to export dashboard');
      }

      const json = JSON.stringify(config, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `finboard-dashboard-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Failed to export to file:', error);
      return false;
    }
  }

  /**
   * Import dashboard from JSON file
   */
  static async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          const result = this.importDashboard(config);
          
          if (result.success) {
            resolve(result.data);
          } else {
            reject(new Error(result.error));
          }
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Clear all dashboard data
   */
  static clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear dashboard data:', error);
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  static getStorageInfo() {
    try {
      let totalSize = 0;
      const info = {};

      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const data = localStorage.getItem(key);
        const size = data ? new Blob([data]).size : 0;
        totalSize += size;
        info[name] = {
          size,
          exists: !!data
        };
      });

      return {
        total: totalSize,
        items: info,
        quota: this.estimateQuota()
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return null;
    }
  }

  /**
   * Estimate localStorage quota (approximate)
   */
  static estimateQuota() {
    try {
      // Most browsers have 5-10MB quota
      // This is an approximation
      const test = 'a'.repeat(1024); // 1KB
      let size = 0;
      
      try {
        for (let i = 0; i < 10000; i++) {
          localStorage.setItem('__test__' + i, test);
          size += 1024;
        }
      } catch (e) {
        // Quota exceeded
      } finally {
        // Clean up test data
        for (let i = 0; i < 10000; i++) {
          localStorage.removeItem('__test__' + i);
        }
      }
      
      return size;
    } catch (error) {
      return null;
    }
  }

  /**
   * Migrate widgets from older version
   */
  static migrateWidgets(oldData) {
    // Add migration logic for future versions
    console.log('Migrating widgets from version', oldData.version, 'to', CURRENT_VERSION);
    return oldData.widgets || [];
  }

  /**
   * Migrate layout from older version
   */
  static migrateLayout(oldData) {
    // Add migration logic for future versions
    console.log('Migrating layout from version', oldData.version, 'to', CURRENT_VERSION);
    return oldData.layout || [];
  }

  /**
   * Migrate complete dashboard from older version
   */
  static migrateDashboard(oldConfig) {
    // Add migration logic for future versions
    console.log('Migrating dashboard from version', oldConfig.version, 'to', CURRENT_VERSION);
    return {
      ...oldConfig,
      version: CURRENT_VERSION
    };
  }

  /**
   * Create backup of current state
   */
  static createBackup() {
    try {
      const config = this.exportDashboard();
      const backupKey = `finboard_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(config));
      
      // Keep only last 5 backups
      this.cleanupOldBackups();
      
      return backupKey;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }

  /**
   * List available backups
   */
  static listBackups() {
    try {
      const backups = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('finboard_backup_')) {
          const data = localStorage.getItem(key);
          const parsed = JSON.parse(data);
          backups.push({
            key,
            timestamp: parseInt(key.replace('finboard_backup_', '')),
            date: new Date(parsed.exportedAt),
            widgetCount: parsed.widgets?.length || 0
          });
        }
      }
      return backups.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Restore from backup
   */
  static restoreBackup(backupKey) {
    try {
      const data = localStorage.getItem(backupKey);
      if (!data) {
        throw new Error('Backup not found');
      }
      
      const config = JSON.parse(data);
      return this.importDashboard(config);
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clean up old backups (keep last 5)
   */
  static cleanupOldBackups() {
    try {
      const backups = this.listBackups();
      if (backups.length > 5) {
        backups.slice(5).forEach(backup => {
          localStorage.removeItem(backup.key);
        });
      }
    } catch (error) {
      console.error('Failed to cleanup backups:', error);
    }
  }
}

export default DashboardStorage;
export { STORAGE_KEYS, CURRENT_VERSION };
