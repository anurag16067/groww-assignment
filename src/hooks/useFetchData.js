import { useState, useEffect, useRef, useCallback } from 'react';
import cacheManager from '../utils/cacheManager';
import { formatErrorMessage } from '../services/errorHandlers';
import { RateLimitError } from '../services/apiClient';

/**
 * useFetchData - Intelligent data fetching hook with caching and polling
 * 
 * Features:
 * - Automatic caching with configurable TTL
 * - Polling support with setInterval
 * - In-flight request deduplication
 * - Graceful fallback on rate limit errors
 * - Automatic cleanup on unmount
 * 
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Object} options - Configuration options
 * @param {string} options.cacheKey - Unique cache key (required)
 * @param {number} options.cacheTTL - Cache time-to-live in ms (default: 5min)
 * @param {number} options.refreshInterval - Polling interval in ms (0 = no polling)
 * @param {boolean} options.enabled - Whether to fetch data (default: true)
 * @param {boolean} options.staleWhileRevalidate - Use stale data while fetching (default: true)
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {boolean} options.retryOnError - Retry on error (default: false)
 * @param {number} options.maxRetries - Max retry attempts (default: 3)
 * @returns {Object} { data, isLoading, error, refetch, isStale, isFetching }
 */
export const useFetchData = (fetchFn, options = {}) => {
  const {
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    refreshInterval = 0,
    enabled = true,
    staleWhileRevalidate = true,
    onSuccess,
    onError,
    retryOnError = false,
    maxRetries = 3
  } = options;

  // State
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);

  // Refs
  const pollIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const lastSuccessfulDataRef = useRef(null);

  // Validate cacheKey
  if (!cacheKey) {
    throw new Error('useFetchData: cacheKey is required');
  }

  /**
   * Fetch data with caching and error handling
   */
  const fetchData = useCallback(async (isBackgroundRefresh = false) => {
    if (!enabled) return;

    // Check cache first
    const cachedData = cacheManager.get(cacheKey);
    
    if (cachedData !== null) {
      // Use cached data
      if (!isBackgroundRefresh) {
        setData(cachedData);
        setIsLoading(false);
        setError(null);
      }
      
      // Check if stale
      const stale = cacheManager.isStale(cacheKey);
      setIsStale(stale);
      
      // If stale and staleWhileRevalidate, fetch in background
      if (stale && staleWhileRevalidate) {
        setIsFetching(true);
      } else if (!stale) {
        // Fresh data, no need to fetch
        return;
      }
    } else {
      // No cache, show loading
      if (!isBackgroundRefresh) {
        setIsLoading(true);
      }
      setIsFetching(true);
    }

    try {
      // Use cache manager's getOrFetch to prevent duplicate calls
      const result = await cacheManager.getOrFetch(
        cacheKey,
        fetchFn,
        cacheTTL
      );

      if (!isMountedRef.current) return;

      // Update state
      setData(result);
      setError(null);
      setIsLoading(false);
      setIsFetching(false);
      setIsStale(false);
      
      // Store successful data for fallback
      lastSuccessfulDataRef.current = result;
      
      // Reset retry count on success
      retryCountRef.current = 0;

      // Success callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error('useFetchData error:', err);

      // Handle rate limit errors gracefully
      if (err instanceof RateLimitError) {
        const fallbackData = lastSuccessfulDataRef.current || cacheManager.get(cacheKey);
        
        if (fallbackData) {
          // Use cached/previous data and don't show error
          setData(fallbackData);
          setError(null);
          setIsStale(true);
          
          console.warn(
            `Rate limit exceeded for ${cacheKey}. Using cached data.`,
            `Next poll in ${refreshInterval}ms`
          );
        } else {
          // No fallback data available
          setError({
            message: 'API rate limit exceeded. Please try again later.',
            type: 'rate_limit',
            retryable: true
          });
        }
      } else {
        // Other errors
        const errorMessage = formatErrorMessage(err);
        setError({
          message: errorMessage,
          type: 'fetch_error',
          retryable: err.retryable || false,
          originalError: err
        });

        // Retry logic
        if (retryOnError && retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(
            `Retrying fetch for ${cacheKey} (${retryCountRef.current}/${maxRetries})...`
          );
          
          // Exponential backoff
          const delay = Math.pow(2, retryCountRef.current) * 1000;
          setTimeout(() => {
            if (isMountedRef.current) {
              fetchData(isBackgroundRefresh);
            }
          }, delay);
          
          return;
        }
      }

      setIsLoading(false);
      setIsFetching(false);

      // Error callback
      if (onError) {
        onError(err);
      }
    }
  }, [
    fetchFn,
    cacheKey,
    cacheTTL,
    enabled,
    staleWhileRevalidate,
    onSuccess,
    onError,
    retryOnError,
    maxRetries,
    refreshInterval
  ]);

  /**
   * Manual refetch
   */
  const refetch = useCallback(() => {
    // Clear cache for this key
    cacheManager.delete(cacheKey);
    
    // Reset state
    setIsLoading(true);
    setError(null);
    retryCountRef.current = 0;
    
    // Fetch
    return fetchData(false);
  }, [fetchData, cacheKey]);

  /**
   * Initial fetch on mount or when dependencies change
   */
  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    fetchData(false);
  }, [fetchData, enabled]);

  /**
   * Setup polling
   */
  useEffect(() => {
    if (!enabled || refreshInterval <= 0) return;

    // Clear existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    // Setup new interval
    pollIntervalRef.current = setInterval(() => {
      fetchData(true); // Background refresh
    }, refreshInterval);

    // Cleanup
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [fetchData, refreshInterval, enabled]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    isStale
  };
};

/**
 * useFetchMultiple - Fetch multiple data sources in parallel
 * 
 * Note: This is a simplified implementation. For production use,
 * consider creating individual hooks for each config at the component level
 * or using a library like React Query that handles multiple queries.
 * 
 * @param {Array<Object>} configs - Array of fetch configurations
 * @returns {Object} { data, isLoading, errors, refetchAll }
 */
export const useFetchMultiple = (configs = []) => {
  const [combinedData, setCombinedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const refetchFnsRef = useRef({});

  useEffect(() => {
    if (configs.length === 0) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const data = {};
    const errs = {};
    let completedCount = 0;

    // Fetch all in parallel
    configs.forEach(async (config) => {
      const cacheKey = config.options.cacheKey;
      
      try {
        const result = await cacheManager.getOrFetch(
          cacheKey,
          config.fetchFn,
          config.options.cacheTTL || 5 * 60 * 1000
        );
        
        if (isMounted) {
          data[cacheKey] = result;
        }
      } catch (error) {
        if (isMounted) {
          errs[cacheKey] = {
            message: formatErrorMessage(error),
            type: 'fetch_error',
            originalError: error
          };
        }
      } finally {
        completedCount++;
        
        if (isMounted && completedCount === configs.length) {
          setCombinedData(data);
          setErrors(errs);
          setIsLoading(false);
        }
      }
    });

    // Store refetch functions
    configs.forEach((config) => {
      refetchFnsRef.current[config.options.cacheKey] = () => {
        cacheManager.delete(config.options.cacheKey);
        // Trigger re-fetch by forcing effect re-run
        setCombinedData(prev => ({ ...prev }));
      };
    });

    return () => {
      isMounted = false;
    };
  }, [configs]);

  // Refetch all
  const refetchAll = useCallback(() => {
    Object.values(refetchFnsRef.current).forEach(fn => fn());
  }, []);

  return {
    data: combinedData,
    isLoading,
    errors,
    refetchAll
  };
};

export default useFetchData;
