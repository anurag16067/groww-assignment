/**
 * Dashboard Persistence Demo
 * 
 * Interactive demonstration of dashboard persistence features
 */

import React, { useState } from 'react';
import useDashboardPersistence from '../hooks/useDashboardPersistence';
import DashboardImportExport from '../components/DashboardImportExport';
import { Loader } from '../components/ui';

const DashboardPersistenceDemo = () => {
  const {
    isLoading,
    isSaving,
    lastSaved,
    save,
    exportDashboard,
    exportToFile,
    clearDashboard,
    createBackup,
    listBackups,
    restoreBackup,
    getStorageInfo
  } = useDashboardPersistence();

  const [showImportExport, setShowImportExport] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);
  const [backups, setBackups] = useState([]);

  const refreshInfo = () => {
    setStorageInfo(getStorageInfo());
    setBackups(listBackups());
  };

  React.useEffect(() => {
    refreshInfo();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Persistence Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test localStorage, export/import, and backup features
          </p>
        </div>

        {/* Status Bar */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isSaving ? 'Saving...' : 'Saved'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last saved: {formatDate(lastSaved)}
              </div>
            </div>
            <button
              onClick={save}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save Now
            </button>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Export/Import */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Export/Import</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Save or load config</p>
              </div>
            </div>
            <button
              onClick={() => setShowImportExport(true)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Open Panel
            </button>
          </div>

          {/* Quick Export */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Quick Export</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Download JSON</p>
              </div>
            </div>
            <button
              onClick={() => {
                const success = exportToFile();
                if (success) alert('Dashboard exported!');
              }}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Download
            </button>
          </div>

          {/* Create Backup */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Create Backup</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Save snapshot</p>
              </div>
            </div>
            <button
              onClick={() => {
                const key = createBackup();
                if (key) {
                  alert('Backup created!');
                  refreshInfo();
                }
              }}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create
            </button>
          </div>

          {/* Clear Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Clear Data</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Reset dashboard</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm('Clear all data?')) {
                  clearDashboard();
                  refreshInfo();
                }
              }}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Storage Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Storage Usage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💿 Storage Usage
            </h3>
            {storageInfo && (
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size:</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatBytes(storageInfo.total)}
                  </span>
                </div>
                {Object.entries(storageInfo.items).map(([name, info]) => (
                  <div key={name} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{name}:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatBytes(info.size)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backups */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                💾 Backups ({backups.length})
              </h3>
              <button
                onClick={refreshInfo}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Refresh
              </button>
            </div>
            {backups.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                No backups available
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {backups.map((backup) => (
                  <div
                    key={backup.key}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {formatDate(backup.date)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {backup.widgetCount} widgets
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Restore this backup?')) {
                          restoreBackup(backup.key);
                        }
                      }}
                      className="ml-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              ✨ Auto-Save
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Dashboard automatically saves to localStorage when you make changes. No manual save needed!
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">
              💾 Persistence
            </h4>
            <p className="text-sm text-green-800 dark:text-green-300">
              Your dashboard state persists across page reloads and browser sessions automatically.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">
              🔄 Import/Export
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Export your dashboard as JSON to backup or share. Import to restore or clone dashboards.
            </p>
          </div>
        </div>
      </div>

      {/* Import/Export Modal */}
      {showImportExport && (
        <DashboardImportExport onClose={() => {
          setShowImportExport(false);
          refreshInfo();
        }} />
      )}
    </div>
  );
};

export default DashboardPersistenceDemo;
