import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWidget, addWidget } from '../state/widgetsSlice';
import JsonFieldExplorer from './JsonFieldExplorer';
import { getStockQuote, getChartData } from '../services';

/**
 * WidgetConfigPanel - Comprehensive widget configuration component
 * 
 * Features:
 * - API provider selection (Alpha Vantage, Finnhub)
 * - Endpoint selection
 * - Symbol/ticker input
 * - Refresh interval configuration
 * - Editable widget title
 * - JSON field mapping with format options
 * - Real-time data preview
 */
const WidgetConfigPanel = ({ widgetId, onClose, isNewWidget = false }) => {
  const dispatch = useDispatch();
  const existingWidget = useSelector(state =>
    state.widgets.widgets.find(w => w.id === widgetId)
  );

  // Form state
  const [config, setConfig] = useState({
    title: existingWidget?.title || 'New Widget',
    type: existingWidget?.type || 'finance-card',
    apiSource: existingWidget?.apiSource || 'finnhub',
    apiEndpoint: existingWidget?.apiEndpoint || 'quote',
    symbol: existingWidget?.symbol || 'AAPL',
    symbols: existingWidget?.symbols || [],
    timeInterval: existingWidget?.timeInterval || '1D',
    refreshInterval: existingWidget?.refreshInterval || 30000,
    cacheTTL: existingWidget?.cacheTTL || 60000,
    fields: existingWidget?.fields || [],
    customSettings: existingWidget?.customSettings || {}
  });

  const [previewData, setPreviewData] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [showFieldExplorer, setShowFieldExplorer] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // API providers and endpoints configuration
  const API_PROVIDERS = [
    { value: 'finnhub', label: 'Finnhub' },
    { value: 'alphavantage', label: 'Alpha Vantage' }
  ];

  const ENDPOINTS_BY_PROVIDER = {
    finnhub: [
      { value: 'quote', label: 'Stock Quote', requiresSymbol: true },
      { value: 'candles', label: 'Candles/OHLC', requiresSymbol: true, requiresInterval: true },
      { value: 'profile', label: 'Company Profile', requiresSymbol: true },
      { value: 'news', label: 'Company News', requiresSymbol: true },
      { value: 'market-news', label: 'Market News', requiresSymbol: false }
    ],
    alphavantage: [
      { value: 'quote', label: 'Global Quote', requiresSymbol: true },
      { value: 'intraday', label: 'Intraday', requiresSymbol: true, requiresInterval: true },
      { value: 'daily', label: 'Daily Time Series', requiresSymbol: true },
      { value: 'weekly', label: 'Weekly Time Series', requiresSymbol: true },
      { value: 'monthly', label: 'Monthly Time Series', requiresSymbol: true },
      { value: 'overview', label: 'Company Overview', requiresSymbol: true }
    ]
  };

  const WIDGET_TYPES = [
    { value: 'finance-card', label: 'Finance Card', icon: '💳' },
    { value: 'stock-table', label: 'Stock Table', icon: '📊' },
    { value: 'line-chart', label: 'Line Chart', icon: '📈' },
    { value: 'candlestick-chart', label: 'Candlestick Chart', icon: '📉' },
    { value: 'watchlist', label: 'Watchlist', icon: '👁️' }
  ];

  const REFRESH_INTERVALS = [
    { value: 0, label: 'Manual Only' },
    { value: 10000, label: '10 seconds' },
    { value: 30000, label: '30 seconds' },
    { value: 60000, label: '1 minute' },
    { value: 120000, label: '2 minutes' },
    { value: 300000, label: '5 minutes' },
    { value: 600000, label: '10 minutes' }
  ];

  const TIME_INTERVALS = [
    { value: '1', label: '1 minute' },
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '1D', label: '1 day' },
    { value: '1W', label: '1 week' },
    { value: '1M', label: '1 month' }
  ];

  // Get available endpoints for selected provider
  const availableEndpoints = ENDPOINTS_BY_PROVIDER[config.apiSource] || [];
  const selectedEndpoint = availableEndpoints.find(e => e.value === config.apiEndpoint);

  // Fetch preview data
  const fetchPreview = async () => {
    if (!config.symbol && selectedEndpoint?.requiresSymbol) {
      setPreviewError('Symbol required for preview');
      return;
    }

    setIsLoadingPreview(true);
    setPreviewError(null);

    try {
      let data;
      
      if (config.apiEndpoint === 'quote') {
        const result = await getStockQuote(config.symbol, config.apiSource);
        data = result.success ? result.data : null;
      } else if (['intraday', 'daily', 'weekly', 'monthly', 'candles'].includes(config.apiEndpoint)) {
        const result = await getChartData(config.symbol, config.timeInterval, config.apiSource);
        data = result.success ? result.data : null;
      } else {
        data = { message: 'Preview not available for this endpoint' };
      }

      setPreviewData(data);
    } catch (error) {
      setPreviewError(error.message || 'Failed to fetch preview');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Validation
  const validate = () => {
    const errors = {};

    if (!config.title.trim()) {
      errors.title = 'Widget title is required';
    }

    if (selectedEndpoint?.requiresSymbol && !config.symbol.trim()) {
      errors.symbol = 'Symbol is required for this endpoint';
    }

    if (config.type === 'watchlist' && config.symbols.length === 0) {
      errors.symbols = 'At least one symbol required for watchlist';
    }

    // Check if preview data has been fetched
    if (!previewData) {
      errors.preview = 'Please fetch preview data before saving';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSave = () => {
    if (!validate()) {
      return;
    }

    // Format data based on widget type
    let formattedData = previewData;
    
    // If widget type expects an array but we have a single object, wrap it
    if (['stock-table', 'watchlist'].includes(config.type) && previewData && !Array.isArray(previewData)) {
      formattedData = [previewData];
    }

    const widgetData = {
      ...config,
      data: formattedData, // Save the formatted data
      isLoading: false,
      error: null,
      lastUpdated: Date.now()
    };

    if (isNewWidget) {
      dispatch(addWidget(widgetData));
    } else {
      dispatch(updateWidget({ id: widgetId, updates: widgetData }));
    }

    onClose();
  };

  // Handle field selection from JsonFieldExplorer
  const handleFieldsSelected = (selectedFields) => {
    setConfig(prev => ({
      ...prev,
      fields: selectedFields
    }));
    setShowFieldExplorer(false);
  };

  // Add symbol to watchlist
  const handleAddSymbol = (symbol) => {
    if (symbol && !config.symbols.includes(symbol)) {
      setConfig(prev => ({
        ...prev,
        symbols: [...prev.symbols, symbol.toUpperCase()]
      }));
    }
  };

  // Remove symbol from watchlist
  const handleRemoveSymbol = (symbol) => {
    setConfig(prev => ({
      ...prev,
      symbols: prev.symbols.filter(s => s !== symbol)
    }));
  };

  // Update field value
  const updateField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNewWidget ? 'Add New Widget' : 'Configure Widget'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Widget Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Widget Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  validationErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter widget title"
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
              )}
            </div>

            {/* Widget Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Widget Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WIDGET_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => updateField('type', type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      config.type === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* API Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Provider
                </label>
                <select
                  value={config.apiSource}
                  onChange={(e) => updateField('apiSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {API_PROVIDERS.map(provider => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Endpoint */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endpoint
                </label>
                <select
                  value={config.apiEndpoint}
                  onChange={(e) => updateField('apiEndpoint', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {availableEndpoints.map(endpoint => (
                    <option key={endpoint.value} value={endpoint.value}>
                      {endpoint.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Symbol Input */}
            {selectedEndpoint?.requiresSymbol && config.type !== 'watchlist' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  value={config.symbol}
                  onChange={(e) => updateField('symbol', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    validationErrors.symbol ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="e.g., AAPL"
                />
                {validationErrors.symbol && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.symbol}</p>
                )}
              </div>
            )}

            {/* Watchlist Symbols */}
            {config.type === 'watchlist' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Watchlist Symbols
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter symbol (e.g., AAPL)"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSymbol(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      handleAddSymbol(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.symbols.map(symbol => (
                    <span
                      key={symbol}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {symbol}
                      <button
                        onClick={() => handleRemoveSymbol(symbol)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {validationErrors.symbols && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.symbols}</p>
                )}
              </div>
            )}

            {/* Time Interval (for charts) */}
            {selectedEndpoint?.requiresInterval && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Interval
                </label>
                <select
                  value={config.timeInterval}
                  onChange={(e) => updateField('timeInterval', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {TIME_INTERVALS.map(interval => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Refresh Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refresh Interval
                </label>
                <select
                  value={config.refreshInterval}
                  onChange={(e) => updateField('refreshInterval', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {REFRESH_INTERVALS.map(interval => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cache TTL
                </label>
                <select
                  value={config.cacheTTL}
                  onChange={(e) => updateField('cacheTTL', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {REFRESH_INTERVALS.map(interval => (
                    <option key={interval.value} value={interval.value || 60000}>
                      {interval.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field Mapping */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Field Mapping ({config.fields.length} fields)
                </label>
                <button
                  onClick={() => setShowFieldExplorer(true)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Configure Fields
                </button>
              </div>
              {config.fields.length > 0 && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {config.fields.map((field, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {field.label || field.path}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {field.format || 'auto'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data Preview */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data Preview
                </label>
                <button
                  onClick={fetchPreview}
                  disabled={isLoadingPreview}
                  className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {isLoadingPreview ? 'Loading...' : 'Fetch Preview'}
                </button>
              </div>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 max-h-60 overflow-y-auto">
                {isLoadingPreview ? (
                  <div className="text-center text-gray-500">Loading preview...</div>
                ) : previewError ? (
                  <div className="text-red-500 text-sm">{previewError}</div>
                ) : previewData ? (
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(previewData, null, 2)}
                  </pre>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    Click &quot;Fetch Preview&quot; to see data
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {/* Validation Error Message */}
          {validationErrors.preview && (
            <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ {validationErrors.preview}
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!previewData}
              className={`px-4 py-2 rounded-lg transition-colors ${
                previewData
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isNewWidget ? 'Add Widget' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Field Explorer Modal */}
      {showFieldExplorer && (
        <JsonFieldExplorer
          data={previewData}
          selectedFields={config.fields}
          onSave={handleFieldsSelected}
          onClose={() => setShowFieldExplorer(false)}
        />
      )}
    </div>
  );
};

export default WidgetConfigPanel;
