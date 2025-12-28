import BaseWidget from './BaseWidget';

/**
 * FinanceCard - Display financial metrics in a card format
 * Suitable for: Watchlist items, Market Gainers, Performance Data, Financial Data
 */
const FinanceCard = ({ data, loading, error, config }) => {
  return (
    <BaseWidget 
      data={data} 
      loading={loading} 
      error={error} 
      config={config}
      emptyMessage="No financial data available"
    >
      <div className="h-full overflow-auto">
        {Array.isArray(data) ? (
          // Multiple cards in a grid
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.map((item, index) => (
              <FinanceCardItem key={index} item={item} config={config} />
            ))}
          </div>
        ) : (
          // Single card
          <FinanceCardItem item={data} config={config} />
        )}
      </div>
    </BaseWidget>
  );
};

/**
 * Individual card item component
 */
const FinanceCardItem = ({ item, config }) => {
  const {
    symbol = item.symbol || 'N/A',
    name = item.name || item.companyName || '',
    price = item.price || item.currentPrice || 0,
    change = item.change || item.priceChange || 0,
    changePercent = item.changePercent || item.changePercentage || 0,
    volume = item.volume,
    marketCap = item.marketCap,
    high = item.high || item.dayHigh,
    low = item.low || item.dayLow,
  } = item;

  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBgColor = isPositive 
    ? 'bg-green-100 dark:bg-green-900/30' 
    : 'bg-red-100 dark:bg-red-900/30';

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {symbol}
          </h4>
          {name && (
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {name}
            </p>
          )}
        </div>
        <div className={`px-2 py-1 rounded ${changeBgColor}`}>
          <span className={`text-xs font-semibold ${changeColor}`}>
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ${typeof price === 'number' ? price.toFixed(2) : price}
        </div>
        <div className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{typeof change === 'number' ? change.toFixed(2) : change}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {high && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">High:</span>
            <span className="ml-1 text-gray-900 dark:text-white font-medium">
              ${typeof high === 'number' ? high.toFixed(2) : high}
            </span>
          </div>
        )}
        {low && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">Low:</span>
            <span className="ml-1 text-gray-900 dark:text-white font-medium">
              ${typeof low === 'number' ? low.toFixed(2) : low}
            </span>
          </div>
        )}
        {volume && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">Volume:</span>
            <span className="ml-1 text-gray-900 dark:text-white font-medium">
              {formatNumber(volume)}
            </span>
          </div>
        )}
        {marketCap && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">Cap:</span>
            <span className="ml-1 text-gray-900 dark:text-white font-medium">
              {formatNumber(marketCap)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceCard;
