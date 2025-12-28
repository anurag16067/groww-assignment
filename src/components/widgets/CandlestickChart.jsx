import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import BaseWidget from './BaseWidget';

/**
 * CandlestickChart - Display stock price candlestick patterns
 * Shows open, high, low, close prices in candlestick format
 */
const CandlestickChart = ({ data, loading, error, config }) => {
  const {
    showGrid = true,
    bullishColor = '#10b981',
    bearishColor = '#ef4444',
  } = config || {};

  // Process data for candlestick visualization
  const processedData = data?.map((item) => {
    const open = item.open || 0;
    const close = item.close || 0;
    const high = item.high || 0;
    const low = item.low || 0;

    const isBullish = close >= open;
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);

    return {
      ...item,
      date: item.date,
      high: high,
      low: low,
      bodyHigh: bodyHigh,
      bodyLow: bodyLow,
      bodyHeight: Math.abs(close - open),
      wickHigh: high - bodyHigh,
      wickLow: bodyLow - low,
      isBullish,
      color: isBullish ? bullishColor : bearishColor,
    };
  });

  // Custom candlestick rendering
  const Candlestick = ({ x, y, width, height, payload }) => {
    if (!payload) return null;

    const centerX = x + width / 2;
    const wickWidth = 2;
    const bodyWidth = Math.max(width * 0.6, 4);

    // Scale factors (this is simplified - in production you'd calculate from YAxis domain)
    const pixelsPerUnit = height / (payload.high - payload.low || 1);
    
    const wickHighHeight = payload.wickHigh * pixelsPerUnit;
    const bodyHeight = Math.max(payload.bodyHeight * pixelsPerUnit, 2);
    const wickLowHeight = payload.wickLow * pixelsPerUnit;

    const bodyY = y + wickHighHeight;

    return (
      <g>
        {/* Upper wick */}
        <line
          x1={centerX}
          y1={y}
          x2={centerX}
          y2={bodyY}
          stroke={payload.color}
          strokeWidth={wickWidth}
        />
        {/* Body */}
        <rect
          x={centerX - bodyWidth / 2}
          y={bodyY}
          width={bodyWidth}
          height={bodyHeight}
          fill={payload.color}
          stroke={payload.color}
          strokeWidth={1}
        />
        {/* Lower wick */}
        <line
          x1={centerX}
          y1={bodyY + bodyHeight}
          x2={centerX}
          y2={bodyY + bodyHeight + wickLowHeight}
          stroke={payload.color}
          strokeWidth={wickWidth}
        />
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isBullish = data.isBullish;
      
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {data.date}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between space-x-4">
              <span className="text-gray-600 dark:text-gray-400">Open:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${data.open?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-gray-600 dark:text-gray-400">High:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${data.high?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-gray-600 dark:text-gray-400">Low:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                ${data.low?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-gray-600 dark:text-gray-400">Close:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${data.close?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between space-x-4 pt-1 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Change:</span>
              <span className={`font-semibold ${isBullish ? 'text-green-600' : 'text-red-600'}`}>
                {isBullish ? '+' : ''}${(data.close - data.open).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <BaseWidget 
      data={data} 
      loading={loading} 
      error={error} 
      config={config}
      emptyMessage="No candlestick data available"
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={processedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.1}
              />
            )}
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              domain={['dataMin', 'dataMax']}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Candlestick bars */}
            <Bar 
              dataKey="bodyHeight" 
              shape={<Candlestick />}
            >
              {processedData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 mt-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-3" style={{ backgroundColor: bullishColor }}></div>
            <span className="text-gray-600 dark:text-gray-400">Bullish</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-3" style={{ backgroundColor: bearishColor }}></div>
            <span className="text-gray-600 dark:text-gray-400">Bearish</span>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default CandlestickChart;
