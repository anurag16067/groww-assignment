import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BaseWidget from './BaseWidget';

/**
 * LineChart - Display stock price trends over time using Recharts
 */
const LineChart = ({ data, loading, error, config }) => {
  const {
    timeInterval = 'daily',
    showGrid = true,
    showLegend = true,
    lineColor = '#3b82f6',
    strokeWidth = 2,
  } = config || {};

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {entry.name}:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
              </span>
            </div>
          ))}
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
      emptyMessage="No chart data available"
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
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
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
            )}
            <Line 
              type="monotone" 
              dataKey="close" 
              name="Close Price"
              stroke={lineColor} 
              strokeWidth={strokeWidth}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {data?.[0]?.open && (
              <Line 
                type="monotone" 
                dataKey="open" 
                name="Open Price"
                stroke="#10b981" 
                strokeWidth={strokeWidth}
                dot={false}
                strokeDasharray="5 5"
              />
            )}
            {data?.[0]?.high && (
              <Line 
                type="monotone" 
                dataKey="high" 
                name="High"
                stroke="#ef4444" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="3 3"
              />
            )}
            {data?.[0]?.low && (
              <Line 
                type="monotone" 
                dataKey="low" 
                name="Low"
                stroke="#f59e0b" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="3 3"
              />
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </BaseWidget>
  );
};

export default LineChart;
