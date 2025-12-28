/**
 * Finance Widgets Demo - Complete showcase of all widget components
 * 
 * This file demonstrates all finance widgets with sample data and configurations
 */

import { useState } from 'react';
import FinanceCard from '../components/widgets/FinanceCard';
import StockTable from '../components/widgets/StockTable';
import LineChart from '../components/widgets/LineChart';
import CandlestickChart from '../components/widgets/CandlestickChart';
import Watchlist from '../components/widgets/Watchlist';

// =============================================================================
// SAMPLE DATA
// =============================================================================

// Sample stock quotes for Finance Card
const sampleQuotes = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.23,
    change: 2.45,
    changePercent: 1.39,
    volume: 52341200,
    high: 179.50,
    low: 176.80,
    marketCap: 2800000000000
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.65,
    change: -1.23,
    changePercent: -0.85,
    volume: 28945600,
    high: 144.20,
    low: 142.10,
    marketCap: 1790000000000
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    change: 5.67,
    changePercent: 1.52,
    volume: 23567800,
    high: 380.45,
    low: 375.20,
    marketCap: 2820000000000
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 242.84,
    change: -3.45,
    changePercent: -1.40,
    volume: 95234100,
    high: 248.50,
    low: 241.20,
    marketCap: 770000000000
  }
];

// Sample table data (extended list)
const sampleTableData = [
  ...sampleQuotes,
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 151.94,
    change: 0.87,
    changePercent: 0.58,
    volume: 41234500,
    high: 153.20,
    low: 150.80
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 352.12,
    change: 4.23,
    changePercent: 1.22,
    volume: 15678900,
    high: 355.40,
    low: 349.80
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 495.22,
    change: 12.34,
    changePercent: 2.55,
    volume: 48567200,
    high: 498.50,
    low: 487.30
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 158.67,
    change: -0.45,
    changePercent: -0.28,
    volume: 8945600,
    high: 160.20,
    low: 157.90
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    price: 258.34,
    change: 1.89,
    changePercent: 0.74,
    volume: 6234800,
    high: 259.80,
    low: 256.50
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    price: 162.45,
    change: 0.34,
    changePercent: 0.21,
    volume: 7123400,
    high: 163.20,
    low: 161.80
  },
  {
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    price: 92.15,
    change: -1.67,
    changePercent: -1.78,
    volume: 10456700,
    high: 94.50,
    low: 91.80
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 441.23,
    change: 8.92,
    changePercent: 2.06,
    volume: 5234900,
    high: 445.60,
    low: 436.70
  }
];

// Sample line chart data (30 days)
const generateLineChartData = (basePrice = 150, days = 30) => {
  const data = [];
  let price = basePrice;
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate price movement
    const change = (Math.random() - 0.5) * 10;
    price = Math.max(price + change, basePrice * 0.8);
    price = Math.min(price, basePrice * 1.3);
    
    const open = price + (Math.random() - 0.5) * 5;
    const close = price;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 10000000
    });
  }
  
  return data;
};

const sampleLineChartData = generateLineChartData(178.23, 30);

// Sample candlestick data (14 days)
const sampleCandlestickData = generateLineChartData(178.23, 14);

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

const FinanceCardDemo = () => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or single

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Finance Card Widget
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('single')}
            className={`px-3 py-1 rounded ${
              viewMode === 'single'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Single
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <FinanceCard
          data={viewMode === 'single' ? sampleQuotes[0] : sampleQuotes}
          loading={loading}
          error={null}
          config={{}}
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          <li>Displays price, % change, and volume</li>
          <li>Color-coded positive (green) and negative (red) changes</li>
          <li>Shows high/low and market cap</li>
          <li>Responsive grid layout for multiple cards</li>
          <li>Gradient backgrounds and hover effects</li>
        </ul>
      </div>
    </div>
  );
};

const StockTableDemo = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Stock Table Widget
        </h2>
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" style={{ height: '500px' }}>
        <StockTable
          data={sampleTableData}
          loading={loading}
          error={null}
          config={{ itemsPerPage: 5 }}
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          <li>Search by symbol or company name</li>
          <li>Sortable columns (click headers)</li>
          <li>Pagination with configurable items per page</li>
          <li>Color-coded changes</li>
          <li>Responsive table design</li>
          <li>Formatted volume numbers</li>
        </ul>
      </div>
    </div>
  );
};

const LineChartDemo = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    showGrid: true,
    showLegend: true,
    lineColor: '#3b82f6',
    strokeWidth: 2
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Line Chart Widget
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setConfig({ ...config, showGrid: !config.showGrid })}
            className={`px-3 py-1 rounded text-sm ${
              config.showGrid
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setConfig({ ...config, showLegend: !config.showLegend })}
            className={`px-3 py-1 rounded text-sm ${
              config.showLegend
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Legend
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" style={{ height: '400px' }}>
        <LineChart
          data={sampleLineChartData}
          loading={loading}
          error={null}
          config={config}
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          <li>Multiple line series (close, open, high, low)</li>
          <li>Interactive tooltip with formatted values</li>
          <li>Responsive Recharts implementation</li>
          <li>Configurable grid and legend</li>
          <li>Smooth line interpolation</li>
          <li>Hover effects and active dots</li>
        </ul>
      </div>
    </div>
  );
};

const CandlestickChartDemo = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    showGrid: true,
    bullishColor: '#10b981',
    bearishColor: '#ef4444'
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Candlestick Chart Widget
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setConfig({ ...config, showGrid: !config.showGrid })}
            className={`px-3 py-1 rounded text-sm ${
              config.showGrid
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" style={{ height: '400px' }}>
        <CandlestickChart
          data={sampleCandlestickData}
          loading={loading}
          error={null}
          config={config}
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm">
        <h3 className="font-semibold mb-2">Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          <li>Full OHLC (Open, High, Low, Close) visualization</li>
          <li>Color-coded bullish (green) and bearish (red) candles</li>
          <li>Interactive tooltip with all price points</li>
          <li>Responsive Recharts ComposedChart</li>
          <li>Configurable colors</li>
          <li>Automatic wick and body rendering</li>
        </ul>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN DEMO COMPONENT
// =============================================================================

const FinanceWidgetsDemo = () => {
  const [activeTab, setActiveTab] = useState('card');

  const tabs = [
    { id: 'card', label: '💳 Finance Card', component: <FinanceCardDemo /> },
    { id: 'table', label: '📊 Stock Table', component: <StockTableDemo /> },
    { id: 'line', label: '📈 Line Chart', component: <LineChartDemo /> },
    { id: 'candlestick', label: '📉 Candlestick', component: <CandlestickChartDemo /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Finance Widgets Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive showcase of all finance widget components with live data
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            💡 Integration Guide
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <p>
              <strong>Import:</strong> Import widgets from <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">components/widgets/</code>
            </p>
            <p>
              <strong>Props:</strong> All widgets accept <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">data</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">loading</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">error</code>, and <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">config</code>
            </p>
            <p>
              <strong>Data Fetching:</strong> Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">useFetchData</code> hook for automatic caching and polling
            </p>
            <p>
              <strong>Configuration:</strong> Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">WidgetConfigPanel</code> to let users configure widgets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceWidgetsDemo;

// Export individual demos for testing
export {
  FinanceCardDemo,
  StockTableDemo,
  LineChartDemo,
  CandlestickChartDemo
};
