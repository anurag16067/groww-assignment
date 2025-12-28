/**
 * Live Widget Integration Example
 * 
 * Demonstrates how to integrate finance widgets with the useFetchData hook
 * for real-time data fetching with caching and polling
 */

import { useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import FinanceCard from '../components/widgets/FinanceCard';
import StockTable from '../components/widgets/StockTable';
import LineChart from '../components/widgets/LineChart';
import CandlestickChart from '../components/widgets/CandlestickChart';

// =============================================================================
// LIVE FINANCE CARD EXAMPLE
// =============================================================================

export const LiveFinanceCard = ({ symbol = 'AAPL' }) => {
  const [pollingEnabled, setPollingEnabled] = useState(true);

  const { data, loading, error } = useFetchData(
    `https://api.example.com/quote/${symbol}`,
    {
      pollingInterval: pollingEnabled ? 5000 : null, // Poll every 5 seconds
      cacheTime: 60000, // Cache for 1 minute
      retry: 3 // Retry 3 times on failure
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Live Quote: {symbol}
        </h2>
        <button
          onClick={() => setPollingEnabled(!pollingEnabled)}
          className={`px-3 py-1 rounded text-sm ${
            pollingEnabled
              ? 'bg-green-500 text-white'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          {pollingEnabled ? '🟢 Live' : '⏸️ Paused'}
        </button>
      </div>

      <FinanceCard
        data={data}
        loading={loading}
        error={error}
        config={{}}
      />
    </div>
  );
};

// =============================================================================
// LIVE STOCK TABLE EXAMPLE
// =============================================================================

export const LiveStockTable = ({ symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'] }) => {
  const [refreshInterval, setRefreshInterval] = useState(10000);

  // Fetch multiple symbols
  const symbolsParam = symbols.join(',');
  const { data, loading, error } = useFetchData(
    `https://api.example.com/quotes?symbols=${symbolsParam}`,
    {
      pollingInterval: refreshInterval,
      cacheTime: 30000
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Live Stock Table
        </h2>
        <div className="flex gap-2">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-1 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
          >
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
          </select>
        </div>
      </div>

      <StockTable
        data={data}
        loading={loading}
        error={error}
        config={{ itemsPerPage: 10 }}
      />
    </div>
  );
};

// =============================================================================
// LIVE LINE CHART EXAMPLE
// =============================================================================

export const LiveLineChart = ({ symbol = 'AAPL', timeframe = '1D' }) => {
  const [interval, setInterval] = useState('1min');

  const { data, loading, error } = useFetchData(
    `https://api.example.com/timeseries/${symbol}?interval=${interval}&timeframe=${timeframe}`,
    {
      pollingInterval: 60000, // Update every minute
      cacheTime: 30000
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {symbol} - {timeframe}
        </h2>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="px-3 py-1 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
        >
          <option value="1min">1 Minute</option>
          <option value="5min">5 Minutes</option>
          <option value="15min">15 Minutes</option>
          <option value="1hour">1 Hour</option>
        </select>
      </div>

      <div style={{ height: '400px' }}>
        <LineChart
          data={data}
          loading={loading}
          error={error}
          config={{
            showGrid: true,
            showLegend: true,
            lineColor: '#3b82f6'
          }}
        />
      </div>
    </div>
  );
};

// =============================================================================
// LIVE CANDLESTICK CHART EXAMPLE
// =============================================================================

export const LiveCandlestickChart = ({ symbol = 'AAPL' }) => {
  const [timeframe, setTimeframe] = useState('1D');

  const { data, loading, error } = useFetchData(
    `https://api.example.com/ohlc/${symbol}?timeframe=${timeframe}`,
    {
      pollingInterval: timeframe === '1D' ? 60000 : 300000, // 1 min for 1D, 5 min for others
      cacheTime: 60000
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {symbol} Candlestick
        </h2>
        <div className="flex gap-2">
          {['1D', '5D', '1M', '3M', '1Y'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm ${
                timeframe === tf
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '400px' }}>
        <CandlestickChart
          data={data}
          loading={loading}
          error={error}
          config={{
            showGrid: true,
            bullishColor: '#10b981',
            bearishColor: '#ef4444'
          }}
        />
      </div>
    </div>
  );
};

// =============================================================================
// COMPLETE DASHBOARD EXAMPLE
// =============================================================================

export const LiveDashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const watchlistSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Live Finance Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time data with automatic polling and caching
            </p>
          </div>
          
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-lg font-semibold"
          >
            {watchlistSymbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>

        {/* Main Quote Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <LiveFinanceCard symbol={selectedSymbol} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <LiveLineChart symbol={selectedSymbol} timeframe="1D" />
          </div>

          {/* Candlestick Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <LiveCandlestickChart symbol={selectedSymbol} />
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <LiveStockTable symbols={watchlistSymbols} />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            📡 Live Data Features
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>
              <strong>Automatic Polling:</strong> Data refreshes automatically at configured intervals
            </li>
            <li>
              <strong>Smart Caching:</strong> Reduces API calls by caching responses with TTL
            </li>
            <li>
              <strong>Error Handling:</strong> Automatic retry with exponential backoff
            </li>
            <li>
              <strong>Rate Limiting:</strong> Respects API rate limits with built-in handling
            </li>
            <li>
              <strong>Request Deduplication:</strong> Prevents duplicate simultaneous requests
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

/**
 * Basic Usage:
 * 
 * import { LiveFinanceCard, LiveStockTable } from './examples/LiveWidgetExample';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <LiveFinanceCard symbol="AAPL" />
 *       <LiveStockTable symbols={['AAPL', 'GOOGL', 'MSFT']} />
 *     </div>
 *   );
 * }
 */

/**
 * Advanced Usage with Custom Config:
 * 
 * const { data, loading, error } = useFetchData(
 *   'https://api.example.com/quote/AAPL',
 *   {
 *     pollingInterval: 5000,      // Poll every 5 seconds
 *     cacheTime: 60000,           // Cache for 1 minute
 *     retry: 3,                   // Retry 3 times on failure
 *     retryDelay: 1000,           // Start with 1 second delay
 *     onSuccess: (data) => {
 *       console.log('Data fetched:', data);
 *     },
 *     onError: (error) => {
 *       console.error('Fetch failed:', error);
 *     }
 *   }
 * );
 * 
 * return <FinanceCard data={data} loading={loading} error={error} />;
 */

export default LiveDashboard;
