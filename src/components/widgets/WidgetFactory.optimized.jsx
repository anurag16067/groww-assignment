import { lazy, Suspense, memo } from 'react';
import { Loader } from '../ui';

/**
 * Lazy-loaded widget components for better performance
 * Widgets are only loaded when they're actually used
 */

// Lazy load all widget components
const FinanceCard = lazy(() => import('./FinanceCard'));
const StockTable = lazy(() => import('./StockTable'));
const LineChart = lazy(() => import('./LineChart'));
const CandlestickChart = lazy(() => import('./CandlestickChart'));
const Watchlist = lazy(() => import('./Watchlist'));

// Widget type mapping with lazy-loaded components
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
      refreshInterval: 300000,
      timeInterval: 'daily',
    },
  },
  'candlestick-chart': {
    name: 'Candlestick Chart',
    description: 'Display OHLC data with candlesticks',
    icon: '🕯️',
    category: 'Charts',
    defaultConfig: {
      refreshInterval: 300000,
      timeInterval: 'daily',
    },
  },
  'watchlist': {
    name: 'Watchlist',
    description: 'Monitor multiple stocks in one view',
    icon: '👁️',
    category: 'Display',
    defaultConfig: {
      refreshInterval: 30000,
      maxItems: 10,
    },
  },
};

/**
 * WidgetFactory - Factory component that renders the appropriate widget based on type
 * Memoized to prevent unnecessary re-renders
 * Uses Suspense for lazy loading with fallback
 */
const WidgetFactory = memo(({ widget }) => {
  const WidgetComponent = WIDGET_COMPONENTS[widget.type];

  if (!WidgetComponent) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Unknown widget type: {widget.type}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Please check your widget configuration
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <Loader size="md" text={`Loading ${widget.title}...`} />
        </div>
      }
    >
      <WidgetComponent widget={widget} />
    </Suspense>
  );
});

WidgetFactory.displayName = 'WidgetFactory';

export default WidgetFactory;

/**
 * Get widget type configuration
 */
export const getWidgetTypeConfig = (type) => {
  return WIDGET_TYPES[type] || null;
};

/**
 * Get all available widget types
 */
export const getAvailableWidgetTypes = () => {
  return Object.entries(WIDGET_TYPES).map(([key, config]) => ({
    type: key,
    ...config,
  }));
};

/**
 * Get widget types by category
 */
export const getWidgetTypesByCategory = () => {
  const categories = {};
  Object.entries(WIDGET_TYPES).forEach(([type, config]) => {
    const category = config.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ type, ...config });
  });
  return categories;
};

/**
 * Validate widget type
 */
export const isValidWidgetType = (type) => {
  return type in WIDGET_COMPONENTS;
};
