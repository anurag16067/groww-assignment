import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTheme,
  selectIsEditMode,
  toggleTheme,
  toggleEditMode,
} from './state/dashboardSlice';
import { addWidget, selectWidgetsCount, selectWidget as selectWidgetAction, updateWidget, selectSelectedWidget, selectSelectedWidgetId } from './state/widgetsSlice';
import DashboardGrid from './components/DashboardGrid';
import useDashboardPersistence from './hooks/useDashboardPersistence';
import DashboardImportExport from './components/DashboardImportExport';
import WidgetConfigPanel from './components/WidgetConfigPanel';
import { Loader } from './components/ui';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isEditMode = useSelector(selectIsEditMode);
  const widgetsCount = useSelector(selectWidgetsCount);
  const selectedWidgetId = useSelector(selectSelectedWidgetId);
  const selectedWidget = useSelector(selectSelectedWidget);
  
  const [showImportExport, setShowImportExport] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  
  // Dashboard persistence
  const {
    isLoading: isDashboardLoading,
    isSaving,
    lastSaved,
    exportToFile,
  } = useDashboardPersistence();

  // Apply theme to document with smooth transition
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
    }
  }, [theme]);

  // Open config panel when a widget is selected for editing
  useEffect(() => {
    if (selectedWidgetId && selectedWidget) {
      setShowConfigPanel(true);
    }
  }, [selectedWidgetId, selectedWidget]);

  // Show loader while dashboard is loading from localStorage
  if (isDashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  // Open config panel to add a new widget
  const handleAddWidget = () => {
    // Clear selection before adding new widget
    dispatch(selectWidgetAction(null));
    setShowConfigPanel(true);
  };

  // Handle config panel close
  const handleConfigPanelClose = () => {
    setShowConfigPanel(false);
    dispatch(selectWidgetAction(null)); // Clear selection
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  FinBoard
                </h1>
              </div>
              
              {/* Auto-save Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                }`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {isSaving ? 'Saving...' : lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Saved'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Add Widget Button */}
              <button
                onClick={handleAddWidget}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Add Widget</span>
              </button>
              
              {/* Export Button */}
              <button
                onClick={exportToFile}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                title="Export dashboard"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </button>
              
              {/* Import/Export Button */}
              <button
                onClick={() => setShowImportExport(true)}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                title="Import/Export dashboard"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </button>

              {/* Edit Mode Toggle */}
              <button
                onClick={() => dispatch(toggleEditMode())}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                  isEditMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>{isEditMode ? 'Done' : 'Edit'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Edit Mode Banner */}
          {isEditMode && (
            <div className="mt-3 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <span className="font-semibold">Edit Mode Active:</span> Drag
                and resize widgets. Click &ldquo;Done&rdquo; when finished.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-hidden">
        <DashboardGrid />
      </main>

      {/* Import/Export Modal */}
      {showImportExport && (
        <DashboardImportExport 
          onClose={() => setShowImportExport(false)} 
        />
      )}

      {/* Widget Configuration Panel */}
      {showConfigPanel && (
        <WidgetConfigPanel
          widgetId={selectedWidgetId}
          onClose={handleConfigPanelClose}
          isNewWidget={!selectedWidgetId}
        />
      )}
    </div>
  );
}

export default App;
