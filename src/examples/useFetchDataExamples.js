/**
 * Example Usage: useFetchData Hook
 * 
 * This file demonstrates various use cases for the intelligent data fetching system
 */

import useFetchData, { useFetchMultiple } from '../hooks/useFetchData';
import { getStockQuote, getChartData, getMultipleQuotes } from '../services';

// =============================================================================
// EXAMPLE 1: Basic Usage with Auto-Refresh
// =============================================================================

const StockQuoteWidget = ({ symbol }) => {
  const { data, isLoading, error, refetch, isStale } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    {
      cacheKey: `stock-quote-${symbol}`,
      cacheTTL: 60 * 1000, // 1 minute
      refreshInterval: 30 * 1000, // Refresh every 30 seconds
      enabled: !!symbol, // Only fetch if symbol is provided
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className={isStale ? 'opacity-50' : ''}>
        <h3>{data.symbol}</h3>
        <p>Price: ${data.price}</p>
        <p>Change: {data.changePercent}%</p>
      </div>
      <button onClick={refetch}>Refresh Now</button>
    </div>
  );
};

// =============================================================================
// EXAMPLE 2: With Callbacks and Error Handling
// =============================================================================

const ChartWidget = ({ symbol, interval }) => {
  const { data, isLoading, error, refetch } = useFetchData(
    () => getChartData(symbol, interval, 'alphavantage'),
    {
      cacheKey: `chart-${symbol}-${interval}`,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      refreshInterval: 2 * 60 * 1000, // Refresh every 2 minutes
      onSuccess: (data) => {
        console.log('Chart data loaded:', data.length, 'points');
      },
      onError: (error) => {
        console.error('Failed to load chart:', error);
        // Send to error tracking service
      },
      retryOnError: true,
      maxRetries: 3
    }
  );

  if (isLoading) return <div>Loading chart...</div>;
  
  if (error) {
    return (
      <div className="error">
        <p>{error.message}</p>
        {error.retryable && (
          <button onClick={refetch}>Try Again</button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Render chart with data */}
      <LineChart data={data} />
      <button onClick={refetch}>Refresh Chart</button>
    </div>
  );
};

// =============================================================================
// EXAMPLE 3: Stale-While-Revalidate Pattern
// =============================================================================

const WatchlistWidget = ({ symbols }) => {
  const { data, isLoading, isFetching, error, isStale } = useFetchData(
    () => getMultipleQuotes(symbols, 'finnhub'),
    {
      cacheKey: `watchlist-${symbols.join(',')}`,
      cacheTTL: 2 * 60 * 1000, // 2 minutes
      refreshInterval: 60 * 1000, // Refresh every 1 minute
      staleWhileRevalidate: true, // Show old data while fetching new
    }
  );

  return (
    <div>
      {isFetching && !isLoading && (
        <div className="updating-indicator">Updating...</div>
      )}
      
      {isLoading ? (
        <div>Loading watchlist...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className={isStale ? 'opacity-75' : ''}>
          {data.map(quote => (
            <div key={quote.symbol}>
              <span>{quote.symbol}</span>
              <span>${quote.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXAMPLE 4: Conditional Fetching
// =============================================================================

const ConditionalFetchExample = ({ symbol, shouldFetch }) => {
  const { data, isLoading, error, refetch } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    {
      cacheKey: `quote-${symbol}`,
      enabled: shouldFetch && !!symbol, // Only fetch when enabled and symbol exists
      refreshInterval: 0, // No auto-refresh
    }
  );

  if (!shouldFetch) {
    return <div>Fetch disabled</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>{data?.symbol}: ${data?.price}</p>
      <button onClick={refetch}>Manual Refresh</button>
    </div>
  );
};

// =============================================================================
// EXAMPLE 5: Multiple Data Sources (Parallel Fetching)
// =============================================================================

const DashboardWithMultipleSources = () => {
  const { data, isLoading, errors, refetchAll } = useFetchMultiple([
    {
      fetchFn: () => getStockQuote('AAPL', 'finnhub'),
      options: {
        cacheKey: 'quote-AAPL',
        cacheTTL: 60 * 1000,
        refreshInterval: 30 * 1000
      }
    },
    {
      fetchFn: () => getStockQuote('GOOGL', 'finnhub'),
      options: {
        cacheKey: 'quote-GOOGL',
        cacheTTL: 60 * 1000,
        refreshInterval: 30 * 1000
      }
    },
    {
      fetchFn: () => getChartData('AAPL', '1D', 'alphavantage'),
      options: {
        cacheKey: 'chart-AAPL-1D',
        cacheTTL: 5 * 60 * 1000,
        refreshInterval: 0 // No auto-refresh for charts
      }
    }
  ]);

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <button onClick={refetchAll}>Refresh All</button>
      
      {/* AAPL Quote */}
      {data['quote-AAPL'] && (
        <div>AAPL: ${data['quote-AAPL'].price}</div>
      )}
      {errors['quote-AAPL'] && (
        <div>Error loading AAPL: {errors['quote-AAPL'].message}</div>
      )}
      
      {/* GOOGL Quote */}
      {data['quote-GOOGL'] && (
        <div>GOOGL: ${data['quote-GOOGL'].price}</div>
      )}
      
      {/* AAPL Chart */}
      {data['chart-AAPL-1D'] && (
        <LineChart data={data['chart-AAPL-1D']} />
      )}
    </div>
  );
};

// =============================================================================
// EXAMPLE 6: Rate Limit Handling with Graceful Fallback
// =============================================================================

const RateLimitAwareWidget = ({ symbol }) => {
  const { data, isLoading, error, isStale } = useFetchData(
    () => getStockQuote(symbol, 'alphavantage'), // Alpha Vantage has strict rate limits
    {
      cacheKey: `quote-rate-limit-${symbol}`,
      cacheTTL: 60 * 1000,
      refreshInterval: 15 * 1000, // Aggressive polling
      staleWhileRevalidate: true // Keep showing old data on rate limit
    }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {error && error.type === 'rate_limit' ? (
        <div className="warning">
          <p>Rate limit reached. Showing cached data.</p>
          <p>Data will refresh automatically when limit resets.</p>
        </div>
      ) : error ? (
        <div className="error">{error.message}</div>
      ) : null}
      
      {data && (
        <div className={isStale ? 'stale-data' : ''}>
          <h3>{data.symbol}</h3>
          <p>Price: ${data.price}</p>
          {isStale && <span className="badge">Cached</span>}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXAMPLE 7: Dynamic Refresh Intervals
// =============================================================================

const DynamicRefreshWidget = ({ symbol, isMarketOpen }) => {
  // Faster refresh during market hours, slower when closed
  const refreshInterval = isMarketOpen 
    ? 10 * 1000  // 10 seconds during market hours
    : 5 * 60 * 1000; // 5 minutes when closed

  const { data, isLoading, error } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    {
      cacheKey: `dynamic-${symbol}`,
      cacheTTL: refreshInterval,
      refreshInterval: refreshInterval,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>{data.symbol}: ${data.price}</p>
      <small>
        Refresh interval: {refreshInterval / 1000}s
        {isMarketOpen ? ' (Market Open)' : ' (Market Closed)'}
      </small>
    </div>
  );
};

// =============================================================================
// EXAMPLE 8: Integration with Redux Widget System
// =============================================================================

import { useSelector, useDispatch } from 'react-redux';
import { updateWidgetData, setWidgetError, setWidgetLoading } from '../state/widgetsSlice';

const ReduxIntegratedWidget = ({ widgetId }) => {
  const dispatch = useDispatch();
  const widget = useSelector(state => 
    state.widgets.widgets.find(w => w.id === widgetId)
  );

  const { data, isLoading, error } = useFetchData(
    () => {
      // Fetch based on widget configuration
      const { apiEndpoint, symbol, interval } = widget.config;
      
      if (apiEndpoint === 'quote') {
        return getStockQuote(symbol, widget.apiSource);
      } else if (apiEndpoint === 'chart') {
        return getChartData(symbol, interval, widget.apiSource);
      }
    },
    {
      cacheKey: `widget-${widgetId}-${widget.config?.symbol}`,
      cacheTTL: widget.cacheTTL || 60 * 1000,
      refreshInterval: widget.refreshInterval || 0,
      enabled: !!widget.config?.symbol,
      onSuccess: (data) => {
        // Update Redux store
        dispatch(updateWidgetData({ id: widgetId, data }));
      },
      onError: (error) => {
        // Update Redux store with error
        dispatch(setWidgetError({ id: widgetId, error: error.message }));
      }
    }
  );

  // Sync loading state with Redux
  useEffect(() => {
    dispatch(setWidgetLoading({ id: widgetId, isLoading }));
  }, [isLoading, widgetId, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render widget based on data */}</div>;
};

// =============================================================================
// CACHE MANAGER UTILITIES
// =============================================================================

import cacheManager from '../utils/cacheManager';

// Clear specific cache entry
const clearCache = (cacheKey) => {
  cacheManager.delete(cacheKey);
};

// Clear all cache entries for a symbol
const clearSymbolCache = (symbol) => {
  cacheManager.invalidatePattern(new RegExp(`${symbol}`));
};

// Get cache statistics
const getCacheStats = () => {
  return cacheManager.getStats();
};

// Clear all cache
const clearAllCache = () => {
  cacheManager.clear();
};

export {
  StockQuoteWidget,
  ChartWidget,
  WatchlistWidget,
  ConditionalFetchExample,
  DashboardWithMultipleSources,
  RateLimitAwareWidget,
  DynamicRefreshWidget,
  ReduxIntegratedWidget,
  clearCache,
  clearSymbolCache,
  getCacheStats,
  clearAllCache
};
