/**
 * ErrorState Component
 * 
 * Reusable error display with different variants and retry functionality
 */

import React from 'react';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data. Please try again.',
  error = null,
  onRetry = null,
  variant = 'default', // default, inline, minimal, fullScreen
  showDetails = false,
  icon = 'alert',
  className = ''
}) => {
  // Icon components
  const icons = {
    alert: (
      <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    network: (
      <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
      </svg>
    ),
    server: (
      <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  };

  // Get error details
  const errorMessage = error?.message || message;
  const errorStatus = error?.status || error?.code;
  const errorStack = error?.stack;

  // Variant styles
  if (variant === 'inline') {
    return (
      <div className={`flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {title}
          </p>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            {errorMessage}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-red-700 dark:text-red-400 underline hover:no-underline mt-2"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === 'fullScreen') {
    return (
      <div className={`fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 ${className}`}>
        <div className="max-w-md mx-auto px-6 text-center">
          {icons[icon]}
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
          {errorStatus && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Error Code: {errorStatus}
            </p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {/* Icon */}
      <div className="mb-4">
        {icons[icon]}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-1">
        {errorMessage}
      </p>

      {/* Error Status */}
      {errorStatus && (
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Error Code: {errorStatus}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
      </div>

      {/* Error Details (expandable) */}
      {showDetails && errorStack && (
        <details className="mt-6 w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
            Show technical details
          </summary>
          <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {errorStack}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
};

// Specific error variants
export const NetworkError = ({ onRetry, className }) => (
  <ErrorState
    title="Connection Error"
    message="Unable to connect to the server. Please check your internet connection and try again."
    icon="network"
    onRetry={onRetry}
    className={className}
  />
);

export const ServerError = ({ onRetry, className }) => (
  <ErrorState
    title="Server Error"
    message="The server encountered an error. Our team has been notified. Please try again later."
    icon="server"
    onRetry={onRetry}
    className={className}
  />
);

export const NotFoundError = ({ className }) => (
  <ErrorState
    title="Not Found"
    message="The resource you're looking for doesn't exist or has been removed."
    icon="error"
    className={className}
  />
);

export const RateLimitError = ({ onRetry, retryAfter, className }) => (
  <ErrorState
    title="Too Many Requests"
    message={`You've made too many requests. ${retryAfter ? `Please try again after ${retryAfter} seconds.` : 'Please try again later.'}`}
    icon="alert"
    onRetry={onRetry}
    className={className}
  />
);

export default ErrorState;
