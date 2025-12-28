/**
 * UI States Demo
 * 
 * Interactive showcase of all UI state components (Loader, ErrorState, EmptyState)
 */

import React, { useState } from 'react';
import {
  Loader,
  InlineLoader,
  SkeletonLoader,
  CardSkeleton,
  TableSkeleton,
  ErrorState,
  NetworkError,
  ServerError,
  NotFoundError,
  RateLimitError,
  EmptyState,
  NoSearchResults,
  NoWidgets,
  NoStockData,
  NoFilteredData,
  EmptyDashboard
} from '../components/ui';

// =============================================================================
// LOADER DEMOS
// =============================================================================

const LoaderDemo = () => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Loader Components
      </h2>

      {/* Spinner Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Spinner Variants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Small</p>
            <Loader size="sm" variant="spinner" text="Loading..." />
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Medium</p>
            <Loader size="md" variant="spinner" text="Loading..." />
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Large</p>
            <Loader size="lg" variant="spinner" text="Loading..." />
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Extra Large</p>
            <Loader size="xl" variant="spinner" text="Loading..." />
          </div>
        </div>
      </div>

      {/* Different Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Loader Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Spinner</p>
            <Loader variant="spinner" text="Loading..." />
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Dots</p>
            <Loader variant="dots" text="Loading..." />
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Pulse</p>
            <Loader variant="pulse" text="Loading..." />
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Bars</p>
            <Loader variant="bars" text="Loading..." />
          </div>
        </div>
      </div>

      {/* Inline Loader */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Inline Loader (for buttons)
        </h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <InlineLoader size="sm" />
            Loading...
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
            <InlineLoader size="md" />
            Processing
          </button>
        </div>
      </div>

      {/* Skeleton Loaders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Skeleton Loaders
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Content Skeleton */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Content Skeleton</p>
            <SkeletonLoader lines={4} avatar={true} />
          </div>

          {/* Card Skeleton */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Card Skeleton</p>
            <CardSkeleton />
          </div>

          {/* Table Skeleton */}
          <div className="col-span-1 md:col-span-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Table Skeleton</p>
            <TableSkeleton rows={3} columns={4} />
          </div>
        </div>
      </div>

      {/* Full Screen Loader */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Full Screen Loader
        </h3>
        <button
          onClick={() => {
            setShowFullScreen(true);
            setTimeout(() => setShowFullScreen(false), 3000);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Show Full Screen Loader (3s)
        </button>
        {showFullScreen && (
          <Loader fullScreen={true} text="Loading your data..." size="lg" />
        )}
      </div>
    </div>
  );
};

// =============================================================================
// ERROR STATE DEMOS
// =============================================================================

const ErrorStateDemo = () => {
  const handleRetry = () => {
    alert('Retry clicked!');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Error State Components
      </h2>

      {/* Default Error */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Default Error
        </h3>
        <ErrorState onRetry={handleRetry} />
      </div>

      {/* Error Icons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Different Error Icons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ErrorState icon="alert" title="Alert Error" message="This is an alert error." onRetry={handleRetry} />
          <ErrorState icon="error" title="Error" message="This is a standard error." onRetry={handleRetry} />
          <ErrorState icon="network" title="Network Error" message="Connection failed." onRetry={handleRetry} />
          <ErrorState icon="server" title="Server Error" message="Server is unavailable." onRetry={handleRetry} />
        </div>
      </div>

      {/* Error Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Error Variants
        </h3>
        
        {/* Inline */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Inline Variant</p>
          <ErrorState 
            variant="inline" 
            title="Failed to load data" 
            message="Unable to fetch stock data. Please try again."
            onRetry={handleRetry}
          />
        </div>

        {/* Minimal */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Minimal Variant</p>
          <ErrorState 
            variant="minimal" 
            message="An error occurred"
            onRetry={handleRetry}
          />
        </div>
      </div>

      {/* Specific Error Types */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Specific Error Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NetworkError onRetry={handleRetry} />
          <ServerError onRetry={handleRetry} />
          <NotFoundError />
          <RateLimitError onRetry={handleRetry} retryAfter={60} />
        </div>
      </div>

      {/* Error with Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Error with Technical Details
        </h3>
        <ErrorState 
          title="API Error"
          message="Failed to fetch data from the API"
          error={{
            message: "Failed to fetch data from the API",
            status: 500,
            stack: "Error: Failed to fetch data\n    at fetchData (api.js:123)\n    at async loadWidget (widget.js:45)"
          }}
          showDetails={true}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
};

// =============================================================================
// EMPTY STATE DEMOS
// =============================================================================

const EmptyStateDemo = () => {
  const handleAction = () => {
    alert('Action clicked!');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Empty State Components
      </h2>

      {/* Default Empty State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Default Empty State
        </h3>
        <EmptyState action={handleAction} />
      </div>

      {/* Different Icons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Different Icons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EmptyState icon="inbox" title="Inbox" message="No messages" />
          <EmptyState icon="search" title="Search" message="No results" />
          <EmptyState icon="chart" title="Chart" message="No data" />
          <EmptyState icon="folder" title="Folder" message="Empty folder" />
          <EmptyState icon="document" title="Document" message="No documents" />
          <EmptyState icon="widget" title="Widget" message="No widgets" />
          <EmptyState icon="stock" title="Stock" message="No stocks" />
          <EmptyState icon="filter" title="Filter" message="No matches" />
        </div>
      </div>

      {/* Empty State Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Empty State Variants
        </h3>
        
        {/* Inline */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Inline Variant</p>
          <EmptyState 
            variant="inline" 
            message="No data available"
            action={handleAction}
            actionLabel="Load Data"
          />
        </div>

        {/* Minimal */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Minimal Variant</p>
          <EmptyState 
            variant="minimal" 
            message="Nothing to show"
            action={handleAction}
          />
        </div>

        {/* Illustration */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Illustration Variant</p>
          <EmptyState 
            variant="illustration" 
            title="Get Started"
            message="Start by adding your first item to see it here."
            action={handleAction}
            actionLabel="Add Item"
          />
        </div>
      </div>

      {/* Specific Empty States */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Specific Empty States
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NoSearchResults searchTerm="AAPL" onClear={handleAction} />
          <NoWidgets onAdd={handleAction} />
          <NoStockData onRefresh={handleAction} />
          <NoFilteredData onReset={handleAction} />
        </div>
      </div>

      {/* Empty Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Empty Dashboard
        </h3>
        <EmptyDashboard onAddWidget={handleAction} />
      </div>
    </div>
  );
};

// =============================================================================
// INTEGRATION EXAMPLE
// =============================================================================

const IntegrationDemo = () => {
  const [state, setState] = useState('idle'); // idle, loading, error, empty, success
  const [data, setData] = useState(null);

  const simulateAPICall = (resultType) => {
    setState('loading');
    setData(null);

    setTimeout(() => {
      if (resultType === 'success') {
        setState('success');
        setData([
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' }
        ]);
      } else if (resultType === 'error') {
        setState('error');
        setData(null);
      } else if (resultType === 'empty') {
        setState('empty');
        setData([]);
      }
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Integration Example
      </h2>

      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Simulate API States
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => simulateAPICall('success')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Load Success
          </button>
          <button
            onClick={() => simulateAPICall('error')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Load Error
          </button>
          <button
            onClick={() => simulateAPICall('empty')}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
          >
            Load Empty
          </button>
        </div>
      </div>

      {/* Result Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg min-h-[300px]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current State: <span className="text-blue-600">{state}</span>
        </h3>

        {/* Loading State */}
        {state === 'loading' && (
          <Loader text="Loading data from API..." size="lg" />
        )}

        {/* Error State */}
        {state === 'error' && (
          <ErrorState
            title="Failed to load data"
            message="An error occurred while fetching data from the server."
            onRetry={() => simulateAPICall('success')}
          />
        )}

        {/* Empty State */}
        {state === 'empty' && (
          <EmptyState
            title="No data found"
            message="The API returned no data. Try refreshing or adding some data."
            action={() => simulateAPICall('success')}
            actionLabel="Retry"
          />
        )}

        {/* Success State */}
        {state === 'success' && data && (
          <div className="space-y-3">
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✓ Data loaded successfully!
            </p>
            <div className="space-y-2">
              {data.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idle State */}
        {state === 'idle' && (
          <EmptyState
            title="Ready to load"
            message="Click one of the buttons above to simulate different API responses."
            variant="minimal"
          />
        )}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN DEMO COMPONENT
// =============================================================================

const UIStatesDemo = () => {
  const [activeTab, setActiveTab] = useState('loader');

  const tabs = [
    { id: 'loader', label: '⏳ Loaders', component: <LoaderDemo /> },
    { id: 'error', label: '❌ Errors', component: <ErrorStateDemo /> },
    { id: 'empty', label: '📭 Empty States', component: <EmptyStateDemo /> },
    { id: 'integration', label: '🔗 Integration', component: <IntegrationDemo /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            UI States Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Reusable components for loading, error, and empty states
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
        <div>
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>

        {/* Footer */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            💡 Usage Tips
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <p>
              <strong>Import:</strong> <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">import {'{ Loader, ErrorState, EmptyState }'} from './components/ui';</code>
            </p>
            <p>
              <strong>Customize:</strong> All components accept className, variant, and custom props
            </p>
            <p>
              <strong>Variants:</strong> Use different variants for different contexts (inline, minimal, illustration, fullScreen)
            </p>
            <p>
              <strong>Actions:</strong> Provide action callbacks for retry/reload functionality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIStatesDemo;
