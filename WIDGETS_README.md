# Finance Widgets Documentation

Complete guide to using the finance widget components in your application.

## 📦 Available Widgets

### 1. **Finance Card** 💳
Displays key financial metrics in an attractive card format.

**Features:**
- Price display with currency formatting
- Percentage change with color coding (green/red)
- Volume with K/M/B notation
- High/Low prices
- Market capitalization
- Gradient backgrounds
- Hover effects
- Responsive grid layout

**Usage:**
```jsx
import FinanceCard from './components/widgets/FinanceCard';

<FinanceCard
  data={{
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.23,
    change: 2.45,
    changePercent: 1.39,
    volume: 52341200,
    high: 179.50,
    low: 176.80,
    marketCap: 2800000000000
  }}
  loading={false}
  error={null}
  config={{}}
/>
```

**Props:**
- `data` (object|array): Stock data - single object for one card, array for multiple cards
- `loading` (boolean): Show loading state
- `error` (string|null): Error message
- `config` (object): Additional configuration options

---

### 2. **Stock Table** 📊
Interactive table with search, sorting, and pagination.

**Features:**
- Real-time search by symbol or company name
- Sortable columns (Symbol, Name, Price, Change, Change %, Volume)
- Pagination with configurable items per page
- Color-coded positive/negative changes
- Formatted numbers (volume in K/M/B)
- Sticky header
- Responsive design

**Usage:**
```jsx
import StockTable from './components/widgets/StockTable';

<StockTable
  data={[
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.23,
      change: 2.45,
      changePercent: 1.39,
      volume: 52341200
    },
    // ... more stocks
  ]}
  loading={false}
  error={null}
  config={{
    itemsPerPage: 10
  }}
/>
```

**Props:**
- `data` (array): Array of stock objects
- `loading` (boolean): Show loading state
- `error` (string|null): Error message
- `config.itemsPerPage` (number): Items per page (default: 10)

---

### 3. **Line Chart** 📈
Multi-line chart for price trends using Recharts.

**Features:**
- Multiple data series (close, open, high, low)
- Interactive tooltip with formatted values
- Configurable grid and legend
- Smooth line interpolation
- Hover effects with active dots
- Responsive container
- Date formatting on X-axis
- Currency formatting on Y-axis

**Usage:**
```jsx
import LineChart from './components/widgets/LineChart';

<LineChart
  data={[
    {
      date: 'Jan 1',
      open: 175.50,
      high: 178.20,
      low: 174.80,
      close: 177.45,
      volume: 45000000
    },
    // ... more data points
  ]}
  loading={false}
  error={null}
  config={{
    showGrid: true,
    showLegend: true,
    lineColor: '#3b82f6',
    strokeWidth: 2
  }}
/>
```

**Props:**
- `data` (array): Array of time series data with date, open, high, low, close
- `loading` (boolean): Show loading state
- `error` (string|null): Error message
- `config` (object):
  - `showGrid` (boolean): Show/hide grid lines (default: true)
  - `showLegend` (boolean): Show/hide legend (default: true)
  - `lineColor` (string): Color for close price line
  - `strokeWidth` (number): Line thickness

---

### 4. **Candlestick Chart** 📉
OHLC candlestick chart with custom rendering.

**Features:**
- Full OHLC (Open, High, Low, Close) visualization
- Color-coded bullish (green) and bearish (red) candles
- Automatic wick and body rendering
- Interactive tooltip showing all price points
- Configurable colors
- Responsive Recharts ComposedChart
- Manual legend with color indicators

**Usage:**
```jsx
import CandlestickChart from './components/widgets/CandlestickChart';

<CandlestickChart
  data={[
    {
      date: 'Jan 1',
      open: 175.50,
      high: 178.20,
      low: 174.80,
      close: 177.45
    },
    // ... more candles
  ]}
  loading={false}
  error={null}
  config={{
    showGrid: true,
    bullishColor: '#10b981',
    bearishColor: '#ef4444'
  }}
/>
```

**Props:**
- `data` (array): Array of OHLC data with date, open, high, low, close
- `loading` (boolean): Show loading state
- `error` (string|null): Error message
- `config` (object):
  - `showGrid` (boolean): Show/hide grid lines (default: true)
  - `bullishColor` (string): Color for bullish candles (default: #10b981)
  - `bearishColor` (string): Color for bearish candles (default: #ef4444)

---

## 🔄 Live Data Integration

All widgets work seamlessly with the `useFetchData` hook for real-time data:

```jsx
import useFetchData from './hooks/useFetchData';
import FinanceCard from './components/widgets/FinanceCard';

function LiveStockCard({ symbol }) {
  const { data, loading, error } = useFetchData(
    `https://api.example.com/quote/${symbol}`,
    {
      pollingInterval: 5000,  // Update every 5 seconds
      cacheTime: 60000,       // Cache for 1 minute
      retry: 3                // Retry 3 times on failure
    }
  );

  return (
    <FinanceCard
      data={data}
      loading={loading}
      error={error}
      config={{}}
    />
  );
}
```

### useFetchData Options

```jsx
useFetchData(url, {
  pollingInterval: 5000,      // Polling interval in ms (null to disable)
  cacheTime: 60000,           // Cache TTL in ms
  retry: 3,                   // Number of retries on failure
  retryDelay: 1000,           // Initial retry delay (exponential backoff)
  onSuccess: (data) => {},    // Success callback
  onError: (error) => {}      // Error callback
})
```

---

## 🎨 Styling & Theming

All widgets support dark mode out of the box using Tailwind CSS:

```jsx
// Dark mode is automatic based on system preference
// or can be toggled with Tailwind's dark mode class

<div className="dark">
  <FinanceCard data={data} />
</div>
```

**Color Scheme:**
- Positive changes: Green (#10b981)
- Negative changes: Red (#ef4444)
- Primary blue: #3b82f6
- Gradients: From blue to purple, teal to emerald

---

## 📱 Responsive Design

All widgets are fully responsive:

- **Finance Card**: Auto-adjusts grid from 1 column (mobile) to 4 columns (desktop)
- **Stock Table**: Horizontal scroll on small screens, full table on desktop
- **Charts**: Responsive containers automatically adjust to parent width

---

## 🔧 Advanced Configuration

### Custom Formatting

```jsx
// Finance Card with custom formatting
<FinanceCard
  data={data}
  config={{
    formatPrice: (price) => `$${price.toFixed(2)}`,
    formatVolume: (volume) => `${(volume / 1000000).toFixed(1)}M`
  }}
/>
```

### Custom Tooltips

```jsx
// Line Chart with custom tooltip
<LineChart
  data={data}
  config={{
    customTooltip: ({ active, payload }) => {
      if (active && payload) {
        return (
          <div className="custom-tooltip">
            {/* Your custom tooltip content */}
          </div>
        );
      }
      return null;
    }
  }}
/>
```

---

## 📊 Data Format Reference

### Quote Data (Finance Card, Stock Table)
```typescript
interface QuoteData {
  symbol: string;           // Stock symbol (e.g., "AAPL")
  name: string;             // Company name (e.g., "Apple Inc.")
  price: number;            // Current price
  change: number;           // Price change ($)
  changePercent: number;    // Price change (%)
  volume: number;           // Trading volume
  high?: number;            // Day high
  low?: number;             // Day low
  marketCap?: number;       // Market capitalization
}
```

### Time Series Data (Line Chart)
```typescript
interface TimeSeriesData {
  date: string;             // Date label
  open: number;             // Opening price
  high: number;             // Highest price
  low: number;              // Lowest price
  close: number;            // Closing price
  volume?: number;          // Trading volume
}
```

### OHLC Data (Candlestick Chart)
```typescript
interface OHLCData {
  date: string;             // Date label
  open: number;             // Opening price
  high: number;             // Highest price
  low: number;              // Lowest price
  close: number;            // Closing price
}
```

---

## 🎯 Examples

See complete examples in:
- `src/examples/FinanceWidgetsDemo.jsx` - Interactive demo with all widgets
- `src/examples/LiveWidgetExample.jsx` - Live data integration examples

To run the demo:
```bash
npm run dev
# Navigate to the demo route in your app
```

---

## 🛠️ Dependencies

Required packages:
```json
{
  "react": "^18.3.1",
  "recharts": "^2.12.0",
  "tailwindcss": "^3.4.1"
}
```

---

## 🚀 Quick Start

1. **Import the widget:**
```jsx
import FinanceCard from './components/widgets/FinanceCard';
```

2. **Prepare your data:**
```jsx
const stockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 178.23,
  change: 2.45,
  changePercent: 1.39,
  volume: 52341200
};
```

3. **Render the widget:**
```jsx
<FinanceCard data={stockData} loading={false} error={null} />
```

---

## 💡 Best Practices

1. **Always handle loading and error states:**
```jsx
<FinanceCard
  data={data}
  loading={isLoading}
  error={errorMessage}
/>
```

2. **Use polling for live data:**
```jsx
const { data, loading, error } = useFetchData(url, {
  pollingInterval: 5000  // Update every 5 seconds
});
```

3. **Implement proper error boundaries:**
```jsx
<ErrorBoundary>
  <FinanceCard data={data} />
</ErrorBoundary>
```

4. **Optimize re-renders with memoization:**
```jsx
const MemoizedCard = React.memo(FinanceCard);
```

5. **Use appropriate cache times:**
```jsx
// Quote data: 30-60 seconds
// Chart data: 1-5 minutes
// News data: 5-10 minutes
```

---

## 🐛 Troubleshooting

**Widget not displaying:**
- Check that data is in the correct format
- Verify loading and error props are boolean/string
- Check browser console for errors

**Charts not responsive:**
- Ensure parent container has defined height
- Use ResponsiveContainer from Recharts
- Check CSS for conflicting styles

**Dark mode not working:**
- Verify Tailwind dark mode is enabled in config
- Check `darkMode: 'class'` in tailwind.config.js
- Apply `dark` class to parent element

---

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details
