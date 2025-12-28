# Intelligent Data Fetching System

A comprehensive data fetching solution for React applications with built-in caching, polling, and graceful error handling.

## 🚀 Features

### Core Capabilities
- ✅ **Automatic Caching** - TTL-based cache with configurable expiration
- ✅ **Smart Polling** - setInterval-based auto-refresh with configurable intervals
- ✅ **Request Deduplication** - Prevents duplicate API calls for the same resource
- ✅ **Stale-While-Revalidate** - Show cached data while fetching fresh data
- ✅ **Rate Limit Handling** - Graceful fallback to cached data on API limits
- ✅ **Retry Logic** - Exponential backoff retry on transient failures
- ✅ **Memory Management** - Automatic cleanup of expired cache entries
- ✅ **TypeScript Ready** - Full type definitions (add .d.ts if needed)

---

## 📦 Components

### 1. CacheManager (`/src/utils/cacheManager.js`)

A singleton cache manager with TTL support and in-flight request tracking.

#### Key Methods

```javascript
import cacheManager from '../utils/cacheManager';

// Get cached data
const data = cacheManager.get('cache-key');

// Set data with TTL (5 minutes)
cacheManager.set('cache-key', data, 5 * 60 * 1000);

// Check if key exists and is valid
const exists = cacheManager.has('cache-key');

// Get or fetch with deduplication
const result = await cacheManager.getOrFetch(
  'cache-key',
  async () => fetchData(),
  5 * 60 * 1000 // TTL
);

// Check if data is stale (>50% of TTL elapsed)
const isStale = cacheManager.isStale('cache-key');

// Delete specific key
cacheManager.delete('cache-key');

// Clear all cache
cacheManager.clear();

// Invalidate by pattern
cacheManager.invalidatePattern(/^stock-quote-/);

// Get statistics
const stats = cacheManager.getStats();
// { size: 42, maxSize: 200, expired: 3, valid: 39, inFlight: 2 }
```

#### Configuration

```javascript
import { CacheManager } from '../utils/cacheManager';

const customCache = new CacheManager({
  maxSize: 500,              // Max cache entries (default: 200)
  defaultTTL: 10 * 60 * 1000, // Default TTL: 10 min
  cleanupInterval: 30 * 1000   // Cleanup every 30 sec
});
```

---

### 2. useFetchData Hook (`/src/hooks/useFetchData.js`)

A React hook for intelligent data fetching with caching and polling.

#### Basic Usage

```javascript
import useFetchData from '../hooks/useFetchData';
import { getStockQuote } from '../services';

const MyComponent = ({ symbol }) => {
  const { data, isLoading, error, refetch, isStale } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    {
      cacheKey: `quote-${symbol}`,
      cacheTTL: 60 * 1000,        // Cache for 1 minute
      refreshInterval: 30 * 1000,  // Refresh every 30 seconds
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>{data.symbol}: ${data.price}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cacheKey` | string | **required** | Unique identifier for cached data |
| `cacheTTL` | number | 300000 | Cache time-to-live in milliseconds (5 min) |
| `refreshInterval` | number | 0 | Auto-refresh interval in ms (0 = disabled) |
| `enabled` | boolean | true | Enable/disable fetching |
| `staleWhileRevalidate` | boolean | true | Show stale data while fetching |
| `onSuccess` | function | undefined | Success callback |
| `onError` | function | undefined | Error callback |
| `retryOnError` | boolean | false | Retry failed requests |
| `maxRetries` | number | 3 | Maximum retry attempts |

#### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `data` | any | Fetched data |
| `isLoading` | boolean | Initial loading state |
| `isFetching` | boolean | Background fetching state |
| `error` | object\|null | Error object with message, type, retryable |
| `refetch` | function | Manual refetch function |
| `isStale` | boolean | Whether cached data is stale |

---

## 🎯 Usage Examples

### Example 1: Auto-Refreshing Stock Quote

```javascript
const StockWidget = ({ symbol }) => {
  const { data, isLoading, error, isStale } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    {
      cacheKey: `quote-${symbol}`,
      cacheTTL: 60 * 1000,
      refreshInterval: 30 * 1000, // Poll every 30 seconds
    }
  );

  return (
    <div className={isStale ? 'opacity-50' : ''}>
      {isLoading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h3>{data.symbol}</h3>
          <p>${data.price}</p>
          <p className={data.change >= 0 ? 'text-green' : 'text-red'}>
            {data.changePercent}%
          </p>
        </>
      )}
    </div>
  );
};
```

### Example 2: Conditional Fetching

```javascript
const ConditionalWidget = ({ symbol, enabled }) => {
  const { data, isLoading, refetch } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    {
      cacheKey: `quote-${symbol}`,
      enabled: enabled && !!symbol, // Only fetch when enabled
      refreshInterval: 0, // Manual refresh only
    }
  );

  return (
    <div>
      {!enabled && <p>Widget disabled</p>}
      {enabled && isLoading && <p>Loading...</p>}
      {enabled && data && <p>{data.symbol}: ${data.price}</p>}
      <button onClick={refetch} disabled={!enabled}>
        Refresh
      </button>
    </div>
  );
};
```

### Example 3: Rate Limit Handling

```javascript
const RateLimitSafeWidget = ({ symbol }) => {
  const { data, error, isStale } = useFetchData(
    () => getStockQuote(symbol, 'alphavantage'), // Strict rate limits
    {
      cacheKey: `quote-${symbol}`,
      cacheTTL: 60 * 1000,
      refreshInterval: 15 * 1000, // Aggressive polling
      staleWhileRevalidate: true, // Keep showing old data
    }
  );

  return (
    <div>
      {error?.type === 'rate_limit' && (
        <div className="warning">
          Rate limit exceeded. Showing cached data.
        </div>
      )}
      
      {data && (
        <div className={isStale ? 'opacity-75' : ''}>
          <p>{data.symbol}: ${data.price}</p>
          {isStale && <span className="badge">Cached</span>}
        </div>
      )}
    </div>
  );
};
```

### Example 4: With Callbacks

```javascript
const ChartWidget = ({ symbol, interval }) => {
  const { data, error, refetch } = useFetchData(
    () => getChartData(symbol, interval, 'alphavantage'),
    {
      cacheKey: `chart-${symbol}-${interval}`,
      cacheTTL: 5 * 60 * 1000,
      onSuccess: (data) => {
        console.log(`✓ Loaded ${data.length} data points`);
        // Update analytics, etc.
      },
      onError: (error) => {
        console.error('Chart error:', error);
        // Send to error tracking
      },
      retryOnError: true,
      maxRetries: 3,
    }
  );

  return (
    <div>
      {error && (
        <div className="error">
          <p>{error.message}</p>
          {error.retryable && (
            <button onClick={refetch}>Retry</button>
          )}
        </div>
      )}
      {data && <LineChart data={data} />}
    </div>
  );
};
```

### Example 5: Dynamic Refresh Intervals

```javascript
const DynamicRefreshWidget = ({ symbol, isMarketOpen }) => {
  // Faster polling during market hours
  const refreshInterval = isMarketOpen ? 10 * 1000 : 5 * 60 * 1000;

  const { data, isLoading } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    {
      cacheKey: `dynamic-${symbol}`,
      cacheTTL: refreshInterval,
      refreshInterval: refreshInterval,
    }
  );

  return (
    <div>
      {isLoading ? <p>Loading...</p> : <p>{data?.symbol}: ${data?.price}</p>}
      <small>
        {isMarketOpen ? '⚡ Live (10s)' : '💤 Slower (5m)'}
      </small>
    </div>
  );
};
```

### Example 6: Integration with Redux

```javascript
import { useDispatch } from 'react-redux';
import { updateWidgetData, setWidgetError } from '../state/widgetsSlice';

const ReduxWidget = ({ widgetId, config }) => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useFetchData(
    () => getStockQuote(config.symbol, config.apiSource),
    {
      cacheKey: `widget-${widgetId}`,
      cacheTTL: config.cacheTTL || 60 * 1000,
      refreshInterval: config.refreshInterval || 0,
      onSuccess: (data) => {
        dispatch(updateWidgetData({ id: widgetId, data }));
      },
      onError: (error) => {
        dispatch(setWidgetError({ id: widgetId, error: error.message }));
      },
    }
  );

  // Component rendering...
};
```

---

## 🔧 Advanced Patterns

### Pattern 1: Cache Invalidation

```javascript
import cacheManager from '../utils/cacheManager';

// Clear specific cache
const handleSymbolChange = (newSymbol) => {
  cacheManager.delete(`quote-${oldSymbol}`);
  setSymbol(newSymbol);
};

// Clear all caches for a symbol
const handleClearSymbol = (symbol) => {
  cacheManager.invalidatePattern(new RegExp(symbol));
};

// Clear all cache on logout
const handleLogout = () => {
  cacheManager.clear();
  logout();
};
```

### Pattern 2: Prefetching

```javascript
import { getStockQuote } from '../services';
import cacheManager from '../utils/cacheManager';

// Prefetch data on hover
const handleMouseEnter = async (symbol) => {
  await cacheManager.getOrFetch(
    `quote-${symbol}`,
    () => getStockQuote(symbol, 'finnhub'),
    60 * 1000
  );
};

// Component will load instantly from cache
<button onMouseEnter={() => handleMouseEnter('AAPL')}>
  View AAPL
</button>
```

### Pattern 3: Background Sync

```javascript
const BackgroundSync = ({ symbols }) => {
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      // Silently update cache for all symbols
      for (const symbol of symbols) {
        try {
          await cacheManager.getOrFetch(
            `quote-${symbol}`,
            () => getStockQuote(symbol, 'finnhub'),
            60 * 1000
          );
        } catch (error) {
          console.warn(`Failed to sync ${symbol}`);
        }
      }
    }, 30 * 1000); // Every 30 seconds

    return () => clearInterval(syncInterval);
  }, [symbols]);

  return null; // Background component
};
```

### Pattern 4: Optimistic Updates

```javascript
const OptimisticWidget = ({ symbol }) => {
  const { data, refetch } = useFetchData(
    () => getStockQuote(symbol, 'finnhub'),
    { cacheKey: `quote-${symbol}` }
  );

  const handleOptimisticUpdate = async () => {
    // Show optimistic UI
    cacheManager.set(`quote-${symbol}`, {
      ...data,
      price: data.price + 0.01, // Optimistic change
    }, 60 * 1000);

    // Trigger real fetch
    await refetch();
  };

  return <button onClick={handleOptimisticUpdate}>Buy</button>;
};
```

---

## 🎨 Best Practices

### 1. Cache Key Naming

```javascript
// ✅ Good: Descriptive and unique
cacheKey: `quote-${symbol}`
cacheKey: `chart-${symbol}-${interval}-${source}`
cacheKey: `watchlist-${userId}-${symbols.join(',')}`

// ❌ Bad: Too generic or ambiguous
cacheKey: 'data'
cacheKey: symbol
cacheKey: `${symbol}${interval}` // No delimiter
```

### 2. TTL Selection

```javascript
// Real-time data: Short TTL
cacheTTL: 10 * 1000 // 10 seconds

// Frequently updated: Medium TTL
cacheTTL: 60 * 1000 // 1 minute

// Stable data: Long TTL
cacheTTL: 10 * 60 * 1000 // 10 minutes

// Static data: Very long TTL
cacheTTL: 24 * 60 * 60 * 1000 // 24 hours
```

### 3. Refresh Intervals

```javascript
// Match or exceed cache TTL
cacheTTL: 60 * 1000,
refreshInterval: 30 * 1000, // ✅ Refresh before expiry

// Or use no polling for stable data
cacheTTL: 10 * 60 * 1000,
refreshInterval: 0, // ✅ Manual refresh only
```

### 4. Error Handling

```javascript
const { data, error } = useFetchData(fetchFn, {
  cacheKey: 'my-data',
  onError: (error) => {
    // Log to monitoring service
    if (error instanceof RateLimitError) {
      console.warn('Rate limited, using cache');
    } else if (error.status >= 500) {
      reportError(error);
    }
  },
  retryOnError: true, // Retry on transient failures
  maxRetries: 3,
});
```

---

## 🚨 Common Pitfalls

### 1. Missing Cache Key Dependencies

```javascript
// ❌ Bad: Symbol change won't trigger new fetch
cacheKey: 'quote'

// ✅ Good: Include all dependencies
cacheKey: `quote-${symbol}`
```

### 2. Aggressive Polling

```javascript
// ❌ Bad: Too frequent, will hit rate limits
refreshInterval: 1000 // Every second

// ✅ Good: Reasonable interval
refreshInterval: 30 * 1000 // Every 30 seconds
```

### 3. Memory Leaks

```javascript
// ✅ Good: Hook handles cleanup automatically
const { data } = useFetchData(fetchFn, options);

// ❌ Bad: Manual setInterval without cleanup
useEffect(() => {
  const interval = setInterval(fetch, 1000);
  // Missing: return () => clearInterval(interval);
}, []);
```

---

## 📊 Performance Tips

1. **Use staleWhileRevalidate** for better UX
   ```javascript
   staleWhileRevalidate: true // Show old data instantly
   ```

2. **Batch requests** when possible
   ```javascript
   // Instead of 5 separate calls, batch them
   await getMultipleQuotes(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']);
   ```

3. **Prefetch on interaction**
   ```javascript
   <button onMouseEnter={() => prefetchData(symbol)}>
     View {symbol}
   </button>
   ```

4. **Monitor cache stats**
   ```javascript
   useEffect(() => {
     const stats = cacheManager.getStats();
     if (stats.size > stats.maxSize * 0.9) {
       console.warn('Cache nearly full');
     }
   }, []);
   ```

---

## 🧪 Testing

```javascript
import { renderHook, waitFor } from '@testing-library/react';
import useFetchData from './useFetchData';
import cacheManager from '../utils/cacheManager';

describe('useFetchData', () => {
  beforeEach(() => {
    cacheManager.clear();
  });

  it('fetches and caches data', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ price: 100 });
    
    const { result } = renderHook(() =>
      useFetchData(mockFetch, { cacheKey: 'test' })
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ price: 100 });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Second call uses cache
    const { result: result2 } = renderHook(() =>
      useFetchData(mockFetch, { cacheKey: 'test' })
    );

    await waitFor(() => {
      expect(result2.current.data).toEqual({ price: 100 });
      expect(mockFetch).toHaveBeenCalledTimes(1); // Still 1!
    });
  });
});
```

---

## 📝 License

MIT

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
