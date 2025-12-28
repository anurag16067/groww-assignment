import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { removeWidget, selectWidget } from '../state/widgetsSlice';

/**
 * WidgetContainer - Optimized wrapper component for dashboard widgets
 * Memoized to prevent unnecessary re-renders
 * Uses useCallback for event handlers
 */
const WidgetContainer = memo(({ widget, children, isEditMode }) => {
  const dispatch = useDispatch();

  // Memoize handlers to prevent re-creation on every render
  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove "${widget.title}"?`)) {
      dispatch(removeWidget(widget.id));
    }
  }, [dispatch, widget.id, widget.title]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    dispatch(selectWidget(widget.id));
  }, [dispatch, widget.id]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
            {widget.title}
          </h3>
          {widget.isLoading && (
            <div className="flex items-center">
              <svg
                className="animate-spin h-4 w-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        {/* Widget Actions */}
        <div className="flex items-center space-x-1">
          {isEditMode && (
            <>
              <button
                onClick={handleEdit}
                className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Edit widget"
              >
                <svg
                  className="w-4 h-4"
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
              </button>
              <button
                onClick={handleRemove}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Remove widget"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 overflow-hidden">
        {widget.error ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium">
                Error loading widget
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {widget.error}
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Widget Footer (optional metadata) */}
      {widget.lastUpdated && !widget.isLoading && !widget.error && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these specific props change
  return (
    prevProps.widget.id === nextProps.widget.id &&
    prevProps.widget.title === nextProps.widget.title &&
    prevProps.widget.isLoading === nextProps.widget.isLoading &&
    prevProps.widget.error === nextProps.widget.error &&
    prevProps.widget.lastUpdated === nextProps.widget.lastUpdated &&
    prevProps.isEditMode === nextProps.isEditMode &&
    prevProps.children === nextProps.children
  );
});

WidgetContainer.displayName = 'WidgetContainer';

export default WidgetContainer;
