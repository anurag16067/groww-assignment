import axios from 'axios';

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends APIError {
  constructor(message = 'Rate limit exceeded. Please try again later.') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Network Error
 */
export class NetworkError extends APIError {
  constructor(message = 'Network error. Please check your connection.') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/**
 * Create Axios instance with default configuration
 */
const createApiClient = (baseURL, timeout = 30000) => {
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Log request in development
      if (import.meta.env.DEV) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log(`[API Response] ${response.config.url}`, response.status);
      }
      return response;
    },
    (error) => {
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        // Rate limit error
        if (status === 429) {
          return Promise.reject(new RateLimitError(
            data?.message || 'API rate limit exceeded'
          ));
        }

        // Other API errors
        return Promise.reject(new APIError(
          data?.message || error.message || 'An error occurred',
          status,
          data
        ));
      } else if (error.request) {
        // Request made but no response received (network error)
        return Promise.reject(new NetworkError(
          'Unable to reach the server. Please check your internet connection.'
        ));
      } else {
        // Something else happened
        return Promise.reject(new APIError(
          error.message || 'An unexpected error occurred',
          500
        ));
      }
    }
  );

  return client;
};

/**
 * Retry logic for failed requests
 */
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on rate limit or client errors (4xx except 429)
      if (error instanceof RateLimitError || 
          (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429)) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};

/**
 * Cache for API responses
 */
class ResponseCache {
  constructor(ttl = 60000) { // Default 1 minute TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache is still valid
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

export const responseCache = new ResponseCache();

/**
 * Make cached request
 */
export const cachedRequest = async (cacheKey, requestFn, cacheTTL) => {
  // Check cache first
  const cached = responseCache.get(cacheKey);
  if (cached) {
    if (import.meta.env.DEV) {
      console.log(`[Cache Hit] ${cacheKey}`);
    }
    return cached;
  }

  // Make request
  const response = await requestFn();

  // Cache the response
  if (cacheTTL) {
    const cache = new ResponseCache(cacheTTL);
    cache.set(cacheKey, response);
    responseCache.cache.set(cacheKey, cache.cache.get(cacheKey));
  } else {
    responseCache.set(cacheKey, response);
  }

  return response;
};

export default createApiClient;
