/**
 * EmptyState Component
 * 
 * Reusable empty state display with different variants and actions
 */

import React from 'react';

const EmptyState = ({
  title = 'No data available',
  message = 'There is no data to display at the moment.',
  icon = 'inbox',
  action = null,
  actionLabel = 'Get Started',
  variant = 'default', // default, inline, minimal, illustration
  children = null,
  className = ''
}) => {
  // Icon components
  const icons = {
    inbox: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
    search: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    chart: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    folder: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    document: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    widget: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
      </svg>
    ),
    stock: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    filter: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
    box: (
      <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  };

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 ${className}`}>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        {action && (
          <button
            onClick={action}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{message}</p>
        {action && (
          <button
            onClick={action}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  // Illustration variant (larger, more visual)
  if (variant === 'illustration') {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        {/* Large illustration/icon */}
        <div className="mb-6 opacity-50">
          {React.cloneElement(icons[icon], { className: 'w-24 h-24 text-gray-400' })}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
          {message}
        </p>

        {/* Custom children or action button */}
        {children || (action && (
          <button
            onClick={action}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {actionLabel}
          </button>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 ${className}`}>
      {/* Icon */}
      <div className="mb-4 opacity-75">
        {icons[icon]}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-4">
        {message}
      </p>

      {/* Custom children or action button */}
      {children || (action && (
        <button
          onClick={action}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      ))}
    </div>
  );
};

// Specific empty state variants
export const NoSearchResults = ({ searchTerm, onClear, className }) => (
  <EmptyState
    title="No results found"
    message={`No results found for "${searchTerm}". Try adjusting your search.`}
    icon="search"
    action={onClear}
    actionLabel="Clear search"
    className={className}
  />
);

export const NoWidgets = ({ onAdd, className }) => (
  <EmptyState
    title="No widgets added"
    message="Get started by adding your first widget to the dashboard."
    icon="widget"
    action={onAdd}
    actionLabel="Add Widget"
    variant="illustration"
    className={className}
  />
);

export const NoStockData = ({ onRefresh, className }) => (
  <EmptyState
    title="No stock data"
    message="Unable to load stock data. Please try refreshing or check back later."
    icon="stock"
    action={onRefresh}
    actionLabel="Refresh"
    className={className}
  />
);

export const NoFilteredData = ({ onReset, className }) => (
  <EmptyState
    title="No matching data"
    message="No data matches your current filters. Try adjusting or clearing your filters."
    icon="filter"
    action={onReset}
    actionLabel="Reset Filters"
    className={className}
  />
);

export const EmptyDashboard = ({ onAddWidget, className }) => (
  <EmptyState
    title="Welcome to your dashboard"
    message="Your dashboard is empty. Add widgets to start tracking your favorite stocks and data."
    icon="widget"
    action={onAddWidget}
    actionLabel="Add Your First Widget"
    variant="illustration"
    className={className}
  >
    <div className="flex gap-3">
      <button
        onClick={onAddWidget}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Add Widget
      </button>
    </div>
  </EmptyState>
);

export default EmptyState;
