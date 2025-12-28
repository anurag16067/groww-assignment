/**
 * BaseWidget - Common wrapper for all widget types
 * Handles loading, error states, and provides consistent styling
 */
const BaseWidget = ({ 
  data, 
  loading, 
  error, 
  config, 
  children,
  emptyMessage = 'No data available'
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-3"
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center max-w-md">
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
          <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
            Error loading data
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {typeof error === 'string' ? error : error?.message || 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Configure this widget to display data
          </p>
        </div>
      </div>
    );
  }

  // Render children with data
  return <div className="h-full w-full">{children}</div>;
};

export default BaseWidget;
