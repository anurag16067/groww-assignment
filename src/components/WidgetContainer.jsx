import { useDispatch } from 'react-redux';
import { removeWidget, selectWidget } from '../state/widgetsSlice';

/**
 * WidgetContainer - Wrapper component for dashboard widgets
 * Provides common widget functionality: header, remove, edit, etc.
 */
const WidgetContainer = ({ widget, children, isEditMode }) => {
  const dispatch = useDispatch();

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Are you sure you want to remove "${widget.title}"?`)) {
      dispatch(removeWidget(widget.id));
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(selectWidget(widget.id));
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className={`flex items-center space-x-2 flex-1 min-w-0 widget-drag-handle ${
          isEditMode ? 'cursor-move' : ''
        }`}>
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
                onMouseDown={(e) => e.stopPropagation()}
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
                onMouseDown={(e) => e.stopPropagation()}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 overflow-auto p-4">
        {widget.error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-500 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">
                {widget.error}
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Widget Footer - Last Updated */}
      {widget.lastUpdated && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default WidgetContainer;
