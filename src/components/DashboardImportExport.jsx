/**
 * Dashboard Import/Export Component
 * 
 * UI for importing and exporting dashboard configurations
 */

import React, { useState, useRef } from 'react';
import useDashboardPersistence from '../hooks/useDashboardPersistence';

const DashboardImportExport = ({ onClose }) => {
  const {
    exportDashboard,
    exportToFile,
    importFromFile,
    clearDashboard,
    createBackup,
    listBackups,
    restoreBackup,
    getStorageInfo
  } = useDashboardPersistence();

  const [activeTab, setActiveTab] = useState('export');
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [backups, setBackups] = useState([]);
  const [storageInfo, setStorageInfo] = useState(null);
  const fileInputRef = useRef(null);

  // Load backups and storage info
  React.useEffect(() => {
    setBackups(listBackups());
    setStorageInfo(getStorageInfo());
  }, [listBackups, getStorageInfo]);

  const handleExportToFile = () => {
    const success = exportToFile();
    if (success) {
      alert('Dashboard exported successfully!');
    } else {
      alert('Failed to export dashboard');
    }
  };

  const handleExportToClipboard = async () => {
    try {
      const config = exportDashboard();
      const json = JSON.stringify(config, null, 2);
      await navigator.clipboard.writeText(json);
      alert('Dashboard configuration copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleImportFromFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    try {
      const result = await importFromFile(file);
      if (result.success) {
        setImportSuccess(true);
        setBackups(listBackups()); // Refresh backups
        setTimeout(() => {
          window.location.reload(); // Reload to apply changes
        }, 1500);
      } else {
        setImportError(result.error);
      }
    } catch (error) {
      setImportError(error.message);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleClearDashboard = () => {
    if (window.confirm('Are you sure you want to clear all dashboard data? This cannot be undone.')) {
      const success = clearDashboard();
      if (success) {
        alert('Dashboard cleared successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert('Failed to clear dashboard');
      }
    }
  };

  const handleCreateBackup = () => {
    const backupKey = createBackup();
    if (backupKey) {
      alert('Backup created successfully!');
      setBackups(listBackups()); // Refresh backups
    } else {
      alert('Failed to create backup');
    }
  };

  const handleRestoreBackup = (backupKey) => {
    if (window.confirm('Are you sure you want to restore this backup? Current dashboard will be replaced.')) {
      const result = restoreBackup(backupKey);
      if (result.success) {
        alert('Backup restored successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert(`Failed to restore backup: ${result.error}`);
      }
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Import/Export
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            📤 Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            📥 Import
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'backup'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            💾 Backups
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'storage'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            💿 Storage
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Export your dashboard configuration including all widgets and layouts.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleExportToFile}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Download as JSON File
                </button>

                <button
                  onClick={handleExportToClipboard}
                  className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  💡 Export Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Exported file includes all widgets, layouts, and settings</li>
                  <li>• Use this to backup or share your dashboard</li>
                  <li>• File is in JSON format and can be edited manually</li>
                </ul>
              </div>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Import a dashboard configuration from a JSON file.
              </p>

              {importSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-medium">Dashboard imported successfully! Reloading...</p>
                  </div>
                </div>
              )}

              {importError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2 text-red-800 dark:text-red-200">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Import failed</p>
                      <p className="text-sm mt-1">{importError}</p>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFromFile}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose JSON File
              </button>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  ⚠️ Warning
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Importing will replace your current dashboard configuration. Consider creating a backup first.
                </p>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Manage dashboard backups
                </p>
                <button
                  onClick={handleCreateBackup}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Create Backup
                </button>
              </div>

              {backups.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400">No backups available</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Create a backup to save your dashboard state
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {backups.map((backup) => (
                    <div
                      key={backup.key}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(backup.date)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {backup.widgetCount} widgets
                        </p>
                      </div>
                      <button
                        onClick={() => handleRestoreBackup(backup.key)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  💡 Backup Info
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Automatically keeps last 5 backups</li>
                  <li>• Backups are stored in browser localStorage</li>
                  <li>• Restoring will replace current dashboard</li>
                </ul>
              </div>
            </div>
          )}

          {/* Storage Tab */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Storage usage and management
              </p>

              {storageInfo && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Storage Usage
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Size:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatBytes(storageInfo.total)}
                        </span>
                      </div>
                      {Object.entries(storageInfo.items).map(([name, info]) => (
                        <div key={name} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{name}:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatBytes(info.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleClearDashboard}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All Dashboard Data
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                  ⚠️ Danger Zone
                </h4>
                <p className="text-sm text-red-800 dark:text-red-300">
                  Clearing dashboard data is permanent and cannot be undone. Make sure to export or backup first.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardImportExport;
