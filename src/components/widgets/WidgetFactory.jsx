import FinanceCard from './FinanceCard';
import StockTable from './StockTable';
import LineChart from './LineChart';
import CandlestickChart from './CandlestickChart';
import Watchlist from './Watchlist';

/**
 * WidgetFactory - Factory component that renders the appropriate widget based on type
 * This provides a scalable way to add new widget types
 */

// Widget type mapping
const WIDGET_COMPONENTS = {
  'finance-card': FinanceCard,
  'stock-table': StockTable,
  'line-chart': LineChart,
  'candlestick-chart': CandlestickChart,
  'watchlist': Watchlist,
  // Legacy support for old type names
  'card': FinanceCard,
  'table': StockTable,
  'chart': LineChart,
};

// Widget type metadata for display and configuration
export const WIDGET_TYPES = {
  'finance-card': {
    name: 'Finance Card',
    description: 'Display financial data in card format',
    icon: '💳',
    category: 'Display',
    defaultConfig: {
      refreshInterval: 60000,
    },
  },
  'stock-table': {
    name: 'Stock Table',
    description: 'Paginated table with search and filters',
    icon: '📊',
    category: 'Data',
    defaultConfig: {
      itemsPerPage: 10,
      refreshInterval: 60000,
    },
  },
  'line-chart': {
    name: 'Line Chart',
    description: 'Display price trends over time',
    icon: '📈',
    category: 'Charts',
    defaultConfig: {
      showGrid: true,
      showLegend: true,
      lineColor: '#3b82f6',
      strokeWidth: 2,
      refreshInterval: 300000, // 5 minutes
    },
  },
  'candlestick-chart': {
    name: 'Candlestick Chart',
    description: 'OHLC candlestick visualization',
    icon: '🕯️',
    category: 'Charts',
    defaultConfig: {
      showGrid: true,
      bullishColor: '#10b981',
      bearishColor: '#ef4444',
      refreshInterval: 300000, // 5 minutes
    },
  },
  'watchlist': {
    name: 'Watchlist',
    description: 'Track your favorite stocks',
    icon: '⭐',
    category: 'Lists',
    defaultConfig: {
      refreshInterval: 60000,
    },
  },
};

/**
 * Get widget component by type
 */
export const getWidgetComponent = (type) => {
  return WIDGET_COMPONENTS[type] || null;
};

/**
 * Check if widget type is valid
 */
export const isValidWidgetType = (type) => {
  return type in WIDGET_COMPONENTS;
};

/**
 * Get default configuration for a widget type
 */
export const getDefaultConfig = (type) => {
  return WIDGET_TYPES[type]?.defaultConfig || {};
};

/**
 * WidgetFactory Component
 * Dynamically renders the correct widget based on type
 */
const WidgetFactory = ({ widget }) => {
  const { type, data, isLoading, error, customSettings = {} } = widget;

  // Get the component for this widget type
  const WidgetComponent = getWidgetComponent(type);

  // If widget type is not recognized, show error
  if (!WidgetComponent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-yellow-500 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
            Unknown widget type: {type}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Please select a valid widget type
          </p>
        </div>
      </div>
    );
  }

  // Merge default config with custom settings
  const config = {
    ...getDefaultConfig(type),
    ...customSettings,
  };

  // Render the widget component with props
  return (
    <WidgetComponent
      data={data}
      loading={isLoading}
      error={error}
      config={config}
    />
  );
};

export default WidgetFactory;
