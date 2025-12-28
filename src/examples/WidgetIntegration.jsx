/**
 * Integration Guide: useFetchData with FinBoard Widgets
 * 
 * This file shows how to integrate the intelligent data fetching system
 * with existing FinBoard widget components
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetchData from '../hooks/useFetchData';
import { updateWidgetData, setWidgetError, setWidgetLoading } from '../state/widgetsSlice';
import {
  getStockQuote,
  getChartData,
  getMultipleQuotes,
  getStockTableData,
  getWatchlistData,
  getFinanceCardData
} from '../services';

// =============================================================================
// WIDGET DATA FETCHER WRAPPER
// =============================================================================

/**
 * WidgetDataFetcher - Wrapper component that handles data fetching for widgets
 * Integrates useFetchData with Redux widget state
 */
const WidgetDataFetcher = ({ widgetId, children }) => {
  const dispatch = useDispatch();
  const widget = useSelector(state =>
    state.widgets.widgets.find(w => w.id === widgetId)
  );

  // Determine fetch function based on widget type
  const getFetchFunction = () => {
    const { type, apiEndpoint, apiSource, symbol, symbols, fields, timeInterval, chartType } = widget;

    switch (type) {
      case 'finance-card':
        return () => getFinanceCardData(symbol, apiSource);

      case 'stock-table':
        return () => getStockTableData(symbols || [], apiSource);

      case 'line-chart':
        return () => getChartData(symbol, timeInterval || '1D', apiSource);

      case 'candlestick-chart':
        return () => getChartData(symbol, timeInterval || '1D', apiSource);

      case 'watchlist':
        return () => getWatchlistData(symbols || [], apiSource);

      default:
        return () => Promise.resolve(null);
    }
  };

  // Generate cache key based on widget config
  const getCacheKey = () => {
    const { type, symbol, symbols, timeInterval, chartType } = widget;
    const symbolKey = symbol || (symbols && symbols.join(',')) || 'default';
    return `widget-${type}-${symbolKey}-${timeInterval || 'default'}-${chartType || 'default'}`;
  };

  // Fetch data using hook
  const { data, isLoading, error, refetch, isStale, isFetching } = useFetchData(
    getFetchFunction(),
    {
      cacheKey: getCacheKey(),
      cacheTTL: widget.cacheTTL || 60 * 1000, // Default 1 minute
      refreshInterval: widget.refreshInterval || 0, // Default no auto-refresh
      enabled: !!(widget.symbol || widget.symbols?.length > 0),
      staleWhileRevalidate: true,
      onSuccess: (data) => {
        dispatch(updateWidgetData({ id: widgetId, data }));
      },
      onError: (error) => {
        dispatch(setWidgetError({ id: widgetId, error: error.message }));
      },
      retryOnError: true,
      maxRetries: 3
    }
  );

  // Sync loading state with Redux
  React.useEffect(() => {
    dispatch(setWidgetLoading({ id: widgetId, isLoading }));
  }, [isLoading, widgetId, dispatch]);

  // Pass data and handlers to children
  return children({
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    isStale,
    widget
  });
};

// =============================================================================
// ENHANCED WIDGET COMPONENTS
// =============================================================================

/**
 * Enhanced FinanceCard with Data Fetching
 */
export const FinanceCardWithData = ({ widgetId }) => {
  return (
    <WidgetDataFetcher widgetId={widgetId}>
      {({ data, isLoading, error, refetch, isStale }) => {
        if (isLoading) {
          return (
            <div className="finance-card loading">
              <div className="skeleton-loader" />
            </div>
          );
        }

        if (error) {
          return (
            <div className="finance-card error">
              <p>{error.message}</p>
              <button onClick={refetch}>Retry</button>
            </div>
          );
        }

        return (
          <div className={`finance-card ${isStale ? 'stale' : ''}`}>
            <div className="finance-card-header">
              <h3>{data?.symbol}</h3>
              {isStale && <span className="badge">Cached</span>}
            </div>
            <div className="finance-card-content">
              <div className="metric price">
                <span className="label">Price</span>
                <span className="value">${data?.price?.toFixed(2)}</span>
              </div>
              <div className={`metric change ${data?.change >= 0 ? 'positive' : 'negative'}`}>
                <span className="label">Change</span>
                <span className="value">
                  {data?.change >= 0 ? '+' : ''}{data?.changePercent?.toFixed(2)}%
                </span>
              </div>
              <div className="metric volume">
                <span className="label">Volume</span>
                <span className="value">{data?.volume?.toLocaleString()}</span>
              </div>
            </div>
            <button className="refresh-btn" onClick={refetch}>
              ↻ Refresh
            </button>
          </div>
        );
      }}
    </WidgetDataFetcher>
  );
};

/**
 * Enhanced StockTable with Data Fetching
 */
export const StockTableWithData = ({ widgetId }) => {
  return (
    <WidgetDataFetcher widgetId={widgetId}>
      {({ data, isLoading, isFetching, error, refetch, isStale }) => {
        if (isLoading) {
          return <div className="stock-table loading">Loading table...</div>;
        }

        if (error) {
          return (
            <div className="stock-table error">
              <p>Error: {error.message}</p>
              <button onClick={refetch}>Retry</button>
            </div>
          );
        }

        return (
          <div className="stock-table">
            <div className="table-header">
              <h3>Stock Data</h3>
              <div className="table-actions">
                {isFetching && <span className="updating">Updating...</span>}
                {isStale && <span className="badge">Stale</span>}
                <button onClick={refetch} disabled={isFetching}>
                  Refresh
                </button>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(stock => (
                  <tr key={stock.symbol}>
                    <td>{stock.symbol}</td>
                    <td>${stock.price?.toFixed(2)}</td>
                    <td className={stock.change >= 0 ? 'positive' : 'negative'}>
                      {stock.changePercent?.toFixed(2)}%
                    </td>
                    <td>{stock.volume?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }}
    </WidgetDataFetcher>
  );
};

/**
 * Enhanced LineChart with Data Fetching
 */
export const LineChartWithData = ({ widgetId }) => {
  return (
    <WidgetDataFetcher widgetId={widgetId}>
      {({ data, isLoading, error, refetch, isStale, widget }) => {
        if (isLoading) {
          return <div className="chart loading">Loading chart...</div>;
        }

        if (error) {
          return (
            <div className="chart error">
              <p>Error: {error.message}</p>
              <button onClick={refetch}>Retry</button>
            </div>
          );
        }

        return (
          <div className={`chart-container ${isStale ? 'stale' : ''}`}>
            <div className="chart-header">
              <h3>{widget.symbol} - {widget.timeInterval}</h3>
              {isStale && <span className="badge">Cached</span>}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
            <button onClick={refetch}>Refresh Chart</button>
          </div>
        );
      }}
    </WidgetDataFetcher>
  );
};

/**
 * Enhanced Watchlist with Data Fetching and Auto-Refresh
 */
export const WatchlistWithData = ({ widgetId }) => {
  const widget = useSelector(state =>
    state.widgets.widgets.find(w => w.id === widgetId)
  );

  // Use aggressive refresh for watchlist (every 10 seconds during market hours)
  const isMarketOpen = true; // TODO: Implement market hours check
  const refreshInterval = isMarketOpen ? 10 * 1000 : 60 * 1000;

  return (
    <WidgetDataFetcher widgetId={widgetId}>
      {({ data, isLoading, isFetching, error, refetch, isStale }) => {
        if (isLoading) {
          return <div className="watchlist loading">Loading watchlist...</div>;
        }

        if (error) {
          // Show error but keep old data if available
          return (
            <div className="watchlist">
              {error.type === 'rate_limit' ? (
                <div className="warning">
                  Rate limit reached. Showing cached data.
                </div>
              ) : (
                <div className="error">
                  <p>{error.message}</p>
                  <button onClick={refetch}>Retry</button>
                </div>
              )}
              {data && (
                <div className="watchlist-items stale">
                  {data.map(item => (
                    <WatchlistItem key={item.symbol} data={item} />
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="watchlist">
            <div className="watchlist-header">
              <h3>Watchlist</h3>
              <div className="status">
                {isFetching && <span className="updating">●</span>}
                {isStale && <span className="badge">Cached</span>}
                <button onClick={refetch} disabled={isFetching}>
                  ↻
                </button>
              </div>
            </div>
            <div className="watchlist-items">
              {data?.map(item => (
                <div key={item.symbol} className="watchlist-item">
                  <div className="item-symbol">{item.symbol}</div>
                  <div className="item-price">${item.price?.toFixed(2)}</div>
                  <div className={`item-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                    {item.change >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
            <div className="watchlist-footer">
              <small>
                {isMarketOpen ? '⚡ Live updates (10s)' : '💤 Slower updates (1m)'}
              </small>
            </div>
          </div>
        );
      }}
    </WidgetDataFetcher>
  );
};

// =============================================================================
// USAGE IN WIDGET FACTORY
// =============================================================================

/**
 * Updated WidgetFactory to use enhanced components
 */
export const WidgetFactoryWithDataFetching = ({ widget }) => {
  const WIDGET_COMPONENTS = {
    'finance-card': FinanceCardWithData,
    'stock-table': StockTableWithData,
    'line-chart': LineChartWithData,
    'candlestick-chart': LineChartWithData, // Reuse with different chartType
    'watchlist': WatchlistWithData,
  };

  const Component = WIDGET_COMPONENTS[widget.type];

  if (!Component) {
    return <div>Unknown widget type: {widget.type}</div>;
  }

  return <Component widgetId={widget.id} />;
};

// =============================================================================
// USAGE IN DASHBOARD GRID
// =============================================================================

/**
 * Updated DashboardGrid to use WidgetFactoryWithDataFetching
 */
import { ResponsiveGridLayout } from 'react-grid-layout';

export const DashboardGridWithDataFetching = () => {
  const layout = useSelector(state => state.dashboard.layout);
  const widgets = useSelector(state => state.widgets.widgets);
  const dispatch = useDispatch();

  const handleLayoutChange = (newLayout) => {
    dispatch(updateLayout(newLayout));
  };

  return (
    <ResponsiveGridLayout
      className="dashboard-grid"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={handleLayoutChange}
      isDraggable={true}
      isResizable={true}
    >
      {widgets.map(widget => (
        <div key={widget.id} data-grid={layout.find(l => l.i === widget.id)}>
          <WidgetContainer
            widget={widget}
            onRemove={() => dispatch(removeWidget(widget.id))}
          >
            <WidgetFactoryWithDataFetching widget={widget} />
          </WidgetContainer>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

// =============================================================================
// CUSTOM HOOKS FOR SPECIFIC USE CASES
// =============================================================================

/**
 * Hook for fetching single stock quote with auto-refresh
 */
export const useStockQuote = (symbol, options = {}) => {
  return useFetchData(
    () => getStockQuote(symbol, options.source || 'finnhub'),
    {
      cacheKey: `quote-${symbol}`,
      cacheTTL: options.cacheTTL || 60 * 1000,
      refreshInterval: options.refreshInterval || 30 * 1000,
      enabled: !!symbol,
      ...options
    }
  );
};

/**
 * Hook for fetching multiple quotes (watchlist)
 */
export const useWatchlist = (symbols, options = {}) => {
  return useFetchData(
    () => getMultipleQuotes(symbols, options.source || 'finnhub'),
    {
      cacheKey: `watchlist-${symbols.join(',')}`,
      cacheTTL: options.cacheTTL || 60 * 1000,
      refreshInterval: options.refreshInterval || 10 * 1000,
      enabled: symbols?.length > 0,
      ...options
    }
  );
};

/**
 * Hook for fetching chart data
 */
export const useChartData = (symbol, interval, options = {}) => {
  return useFetchData(
    () => getChartData(symbol, interval, options.source || 'alphavantage'),
    {
      cacheKey: `chart-${symbol}-${interval}`,
      cacheTTL: options.cacheTTL || 5 * 60 * 1000,
      refreshInterval: options.refreshInterval || 0, // No auto-refresh for charts by default
      enabled: !!(symbol && interval),
      ...options
    }
  );
};

// =============================================================================
// EXAMPLE: COMPLETE WIDGET WITH DATA FETCHING
// =============================================================================

/**
 * Complete example: Stock widget with all features
 */
export const CompleteStockWidget = ({ symbol, refreshInterval = 30000 }) => {
  const { data, isLoading, isFetching, error, refetch, isStale } = useStockQuote(symbol, {
    refreshInterval,
    onError: (error) => {
      console.error(`Error fetching ${symbol}:`, error);
    },
    retryOnError: true,
    maxRetries: 3,
  });

  if (isLoading) {
    return <div className="widget loading">Loading {symbol}...</div>;
  }

  if (error && !data) {
    return (
      <div className="widget error">
        <p>Failed to load {symbol}</p>
        <p>{error.message}</p>
        {error.retryable && <button onClick={refetch}>Retry</button>}
      </div>
    );
  }

  return (
    <div className={`widget stock-widget ${isStale ? 'stale' : ''}`}>
      {/* Header */}
      <div className="widget-header">
        <h3>{data.symbol}</h3>
        <div className="status-indicators">
          {isFetching && <span className="spinner" />}
          {isStale && <span className="badge">Stale</span>}
          {error?.type === 'rate_limit' && (
            <span className="badge warning">Rate Limited</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="widget-content">
        <div className="price-display">
          <span className="current-price">${data.price?.toFixed(2)}</span>
          <span className={`price-change ${data.change >= 0 ? 'up' : 'down'}`}>
            {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.changePercent)?.toFixed(2)}%
          </span>
        </div>

        <div className="stock-details">
          <div className="detail-row">
            <span>Open:</span>
            <span>${data.open?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>High:</span>
            <span>${data.high?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Low:</span>
            <span>${data.low?.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Volume:</span>
            <span>{data.volume?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="widget-footer">
        <button onClick={refetch} disabled={isFetching}>
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
        <small>Updates every {refreshInterval / 1000}s</small>
      </div>
    </div>
  );
};

export default {
  WidgetDataFetcher,
  FinanceCardWithData,
  StockTableWithData,
  LineChartWithData,
  WatchlistWithData,
  WidgetFactoryWithDataFetching,
  DashboardGridWithDataFetching,
  useStockQuote,
  useWatchlist,
  useChartData,
  CompleteStockWidget,
};
