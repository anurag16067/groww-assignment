/**
 * Error Handlers for API Services
 */

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // Handle different error types
  if (error.name === 'RateLimitError') {
    return 'API rate limit exceeded. Please wait a moment and try again.';
  }

  if (error.name === 'NetworkError') {
    return 'Network connection failed. Please check your internet connection.';
  }

  if (error.statusCode === 401 || error.statusCode === 403) {
    return 'Authentication failed. Please check your API key.';
  }

  if (error.statusCode === 404) {
    return 'Requested data not found.';
  }

  if (error.statusCode >= 500) {
    return 'Server error. Please try again later.';
  }

  // Return the error message or a default
  return error.message || 'An error occurred while fetching data.';
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error) => {
  // Don't retry on rate limit or auth errors
  if (error.name === 'RateLimitError') return false;
  if (error.statusCode === 401 || error.statusCode === 403) return false;
  
  // Retry on network errors and 5xx errors
  if (error.name === 'NetworkError') return true;
  if (error.statusCode >= 500) return true;
  
  return false;
};

/**
 * Log error for debugging (in development only)
 */
export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.error(`[API Error${context ? ` - ${context}` : ''}]:`, {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack,
    });
  }
};

/**
 * Handle API error and return user-friendly message
 */
export const handleAPIError = (error, context = '') => {
  logError(error, context);
  const message = formatErrorMessage(error);
  
  return {
    error: true,
    message,
    retryable: isRetryableError(error),
    originalError: error,
  };
};

/**
 * Create error notification object for UI
 */
export const createErrorNotification = (error, context = '') => {
  const errorInfo = handleAPIError(error, context);
  
  return {
    type: 'error',
    title: 'Error Loading Data',
    message: errorInfo.message,
    duration: 5000,
    actions: errorInfo.retryable ? [
      {
        label: 'Retry',
        action: 'retry',
      }
    ] : [],
  };
};

/**
 * Validate API key existence
 */
export const validateAPIKeys = () => {
  const errors = [];

  const alphaVantageKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
  const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;

  if (!alphaVantageKey || alphaVantageKey === 'demo' || alphaVantageKey === 'your_alpha_vantage_key_here') {
    errors.push({
      service: 'Alpha Vantage',
      message: 'Alpha Vantage API key is missing or invalid. Get a free key at https://www.alphavantage.co/support/#api-key',
    });
  }

  if (!finnhubKey || finnhubKey === 'demo' || finnhubKey === 'your_finnhub_key_here') {
    errors.push({
      service: 'Finnhub',
      message: 'Finnhub API key is missing or invalid. Get a free key at https://finnhub.io/register',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check API health
 */
export const checkAPIHealth = async () => {
  const health = {
    alphaVantage: { status: 'unknown', message: '' },
    finnhub: { status: 'unknown', message: '' },
  };

  // Check Alpha Vantage
  try {
    const avModule = await import('./alphaVantage');
    await avModule.getQuote('IBM');
    health.alphaVantage.status = 'healthy';
    health.alphaVantage.message = 'Connected successfully';
  } catch (error) {
    health.alphaVantage.status = 'error';
    health.alphaVantage.message = formatErrorMessage(error);
  }

  // Check Finnhub
  try {
    const fhModule = await import('./finnhub');
    await fhModule.getQuote('AAPL');
    health.finnhub.status = 'healthy';
    health.finnhub.message = 'Connected successfully';
  } catch (error) {
    health.finnhub.status = 'error';
    health.finnhub.message = formatErrorMessage(error);
  }

  return health;
};

/**
 * Get suggested action for error
 */
export const getSuggestedAction = (error) => {
  if (error.name === 'RateLimitError') {
    return 'Wait a few minutes before making more requests, or upgrade your API plan for higher limits.';
  }

  if (error.statusCode === 401 || error.statusCode === 403) {
    return 'Check your .env file and ensure your API keys are correct and valid.';
  }

  if (error.name === 'NetworkError') {
    return 'Check your internet connection and try again.';
  }

  if (error.statusCode >= 500) {
    return 'The API service is experiencing issues. Please try again in a few minutes.';
  }

  return 'Try refreshing the widget or check the console for more details.';
};

export default {
  formatErrorMessage,
  isRetryableError,
  logError,
  handleAPIError,
  createErrorNotification,
  validateAPIKeys,
  checkAPIHealth,
  getSuggestedAction,
};
