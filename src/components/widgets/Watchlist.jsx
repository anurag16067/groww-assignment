import { useState } from 'react';
import BaseWidget from './BaseWidget';

/**
 * Watchlist - Display and manage a list of watched stocks
 * Allows adding/removing stocks from watchlist
 */
const Watchlist = ({ data, loading, error, config }) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleToggleExpand = (symbol) => {
    setExpandedItem(expandedItem === symbol ? null : symbol);
  };

  return (
    <BaseWidget 
      data={data} 
      loading={loading} 
      error={error} 
      config={config}
      emptyMessage="Your watchlist is empty"
    >
      <div className="h-full overflow-auto">
        <div className="space-y-2">
          {data?.map((item, index) => {
            const isPositive = (item.change || 0) >= 0;
            const changeColor = isPositive 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400';
            const changeBg = isPositive
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20';
            const isExpanded = expandedItem === item.symbol;

            return (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                {/* Main row */}
                <div
                  className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                  onClick={() => handleToggleExpand(item.symbol)}
                >
                  <div className="flex items-center justify-between">
                    {/* Symbol and Name */}
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.symbol || 'N/A'}
                        </h4>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.name && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                          {item.name}
                        </p>
                      )}
                    </div>

                    {/* Price and Change */}
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          ${(item.price || 0).toFixed(2)}
                        </div>
                        <div className={`text-xs font-medium ${changeColor}`}>
                          {isPositive ? '+' : ''}{(item.change || 0).toFixed(2)}
                        </div>
                      </div>

                      {/* Change Percentage Badge */}
                      <div className={`px-2 py-1 rounded ${changeBg} min-w-[60px] text-center`}>
                        <span className={`text-xs font-semibold ${changeColor}`}>
                          {isPositive ? '+' : ''}{(item.changePercent || 0).toFixed(2)}%
                        </span>
                      </div>

                      {/* Expand Icon */}
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {item.high && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Day High
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${item.high.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {item.low && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Day Low
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${item.low.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {item.volume && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Volume
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.volume.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {item.marketCap && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Market Cap
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.marketCap >= 1e9
                              ? `$${(item.marketCap / 1e9).toFixed(2)}B`
                              : `$${(item.marketCap / 1e6).toFixed(2)}M`}
                          </span>
                        </div>
                      )}
                      {item.pe && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            P/E Ratio
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.pe.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {item.week52High && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            52W High
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${item.week52High.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-3">
                      <button className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </BaseWidget>
  );
};

export default Watchlist;
