# Widget Configuration Panel

A comprehensive, user-friendly interface for configuring widgets with API selection, field mapping, and data formatting.

## 🎯 Features

### WidgetConfigPanel
- ✅ **API Provider Selection** - Choose between Finnhub and Alpha Vantage
- ✅ **Endpoint Selection** - Dynamic endpoint options based on provider
- ✅ **Stock Symbol Input** - Single or multiple symbols (watchlist)
- ✅ **Refresh Interval** - Configurable auto-refresh (10s to 10m)
- ✅ **Cache TTL** - Configure cache time-to-live
- ✅ **Widget Title** - Editable widget display name
- ✅ **Time Intervals** - For chart widgets (1m, 5m, 15m, 30m, 1h, 1D, 1W, 1M)
- ✅ **Data Preview** - Real-time API data preview
- ✅ **Validation** - Form validation with error messages
- ✅ **Dark Mode** - Full dark mode support

### JsonFieldExplorer
- ✅ **JSON Tree Navigation** - Visual exploration of API response structure
- ✅ **Field Selection** - Checkbox-based field selection
- ✅ **Custom Labels** - Rename fields for display
- ✅ **Format Options** - 8 format types with icons:
  - 🔄 Auto (intelligent detection)
  - 💵 Currency ($)
  - 📊 Percentage (%)
  - 🔢 Number (with locale formatting)
  - 📅 Date
  - 🕐 Date & Time
  - 📝 Text
  - ✅ Boolean (Yes/No)
- ✅ **Smart Suggestions** - Automatic format detection based on field name/value
- ✅ **Live Preview** - See formatted values in real-time
- ✅ **Nested Objects** - Support for complex JSON structures

---

## 📦 Components

### WidgetConfigPanel

**Location:** `/src/components/WidgetConfigPanel.jsx`

**Props:**
```javascript
{
  widgetId: string | null,     // Widget ID for editing (null for new)
  onClose: function,           // Close handler
  isNewWidget: boolean         // true for new widgets, false for editing
}
```

**Usage:**
```javascript
import WidgetConfigPanel from './components/WidgetConfigPanel';

const [showConfig, setShowConfig] = useState(false);

<WidgetConfigPanel
  widgetId={null}              // null for new widget
  isNewWidget={true}
  onClose={() => setShowConfig(false)}
/>
```

---

### JsonFieldExplorer

**Location:** `/src/components/JsonFieldExplorer.jsx`

**Props:**
```javascript
{
  data: object,                // JSON data to explore
  selectedFields: array,       // Previously selected fields
  onSave: function,           // Save handler (receives field array)
  onClose: function           // Close handler
}
```

**Field Object Structure:**
```javascript
{
  path: "price",              // JSON path (e.g., "data.price", "quote.c")
  key: "price",               // Field key name
  label: "Stock Price",       // Display label
  format: "currency",         // Format type
  type: "number"              // Value type
}
```

---

## 🎨 Widget Types

| Type | Icon | Description | Fields |
|------|------|-------------|--------|
| finance-card | 💳 | Key financial metrics | Symbol, Price, Change, Volume |
| stock-table | 📊 | Tabular stock data | Multiple stocks with all metrics |
| line-chart | 📈 | Price trend chart | Time series data |
| candlestick-chart | 📉 | OHLC visualization | Open, High, Low, Close |
| watchlist | 👁️ | Monitor stocks | Multiple symbols with quotes |

---

## 🔧 API Configuration

### Supported Providers

#### Finnhub
- **Quote** - Real-time stock quotes
- **Candles** - OHLC data (requires interval)
- **Profile** - Company profile
- **Company News** - Company-specific news
- **Market News** - General market news

#### Alpha Vantage
- **Global Quote** - Current stock price
- **Intraday** - Intraday time series (requires interval)
- **Daily** - Daily time series
- **Weekly** - Weekly time series
- **Monthly** - Monthly time series
- **Overview** - Company overview

### Endpoint Requirements

| Endpoint | Symbol Required | Interval Required | Supports Multiple |
|----------|----------------|-------------------|-------------------|
| quote | ✅ | ❌ | ✅ |
| candles | ✅ | ✅ | ❌ |
| intraday | ✅ | ✅ | ❌ |
| daily | ✅ | ❌ | ❌ |
| profile | ✅ | ❌ | ❌ |
| news | ✅ | ❌ | ❌ |
| market-news | ❌ | ❌ | ❌ |

---

## 📋 Configuration Options

### Refresh Intervals
```javascript
Manual Only    // 0ms - No auto-refresh
10 seconds     // 10000ms
30 seconds     // 30000ms
1 minute       // 60000ms
2 minutes      // 120000ms
5 minutes      // 300000ms
10 minutes     // 600000ms
```

### Time Intervals (Charts)
```javascript
1 minute       // '1'
5 minutes      // '5'
15 minutes     // '15'
30 minutes     // '30'
1 hour         // '60'
1 day          // '1D'
1 week         // '1W'
1 month        // '1M'
```

---

## 🎯 Usage Examples

### Example 1: Add New Widget Button

```javascript
import { useState } from 'react';
import WidgetConfigPanel from './components/WidgetConfigPanel';

const Dashboard = () => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div>
      <button onClick={() => setShowConfig(true)}>
        Add Widget
      </button>

      {showConfig && (
        <WidgetConfigPanel
          widgetId={null}
          isNewWidget={true}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};
```

### Example 2: Edit Existing Widget

```javascript
import { useState } from 'react';
import WidgetConfigPanel from './components/WidgetConfigPanel';

const Widget = ({ widgetId }) => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="widget">
      <button onClick={() => setShowConfig(true)}>
        ⚙️ Configure
      </button>

      {showConfig && (
        <WidgetConfigPanel
          widgetId={widgetId}
          isNewWidget={false}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};
```

### Example 3: Widget Gallery with Quick Add

```javascript
const WidgetGallery = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (type) => {
    setSelectedType(type);
    setShowConfig(true);
  };

  return (
    <div>
      <button onClick={() => handleSelect('finance-card')}>
        💳 Add Finance Card
      </button>
      <button onClick={() => handleSelect('line-chart')}>
        📈 Add Line Chart
      </button>

      {showConfig && (
        <WidgetConfigPanel
          widgetId={null}
          isNewWidget={true}
          onClose={() => setShowConfig(false)}
          initialType={selectedType}
        />
      )}
    </div>
  );
};
```

---

## 🎨 Field Formatting Examples

### Currency Formatting
```javascript
// Field Config
{
  path: "price",
  label: "Stock Price",
  format: "currency"
}

// Input: 142.56
// Output: "$142.56"
```

### Percentage Formatting
```javascript
// Field Config
{
  path: "changePercent",
  label: "Change",
  format: "percentage"
}

// Input: 2.34
// Output: "2.34%"
```

### Number Formatting
```javascript
// Field Config
{
  path: "volume",
  label: "Volume",
  format: "number"
}

// Input: 45000000
// Output: "45,000,000"
```

### Date Formatting
```javascript
// Field Config
{
  path: "lastUpdated",
  label: "Last Updated",
  format: "datetime"
}

// Input: "2024-03-15T10:30:00Z"
// Output: "3/15/2024, 10:30:00 AM"
```

---

## 🔍 JSON Field Explorer Guide

### Step-by-Step Usage

1. **Fetch Preview Data**
   - Click "Fetch Preview" button
   - Wait for API response
   - Data appears in preview panel

2. **Open Field Explorer**
   - Click "Configure Fields" button
   - JsonFieldExplorer modal opens

3. **Navigate JSON Tree**
   - Click ▶ to expand objects
   - Click ▼ to collapse
   - See nested structure

4. **Select Fields**
   - Check boxes next to desired fields
   - Selected fields appear in right panel

5. **Configure Fields**
   - Edit "Display Label"
   - Choose format type
   - See live preview

6. **Save Configuration**
   - Click "Save Field Mapping"
   - Fields applied to widget config

### Example JSON Navigation

```json
{
  "symbol": "AAPL",           // ✓ Select as text
  "quote": {
    "c": 142.56,              // ✓ Select as currency
    "d": 2.34,                // ✓ Select as currency
    "dp": 1.67,               // ✓ Select as percentage
    "h": 145.20,              // ✓ Select as currency
    "l": 141.80,              // ✓ Select as currency
    "o": 143.00,              // ✓ Select as currency
    "pc": 140.22,             // ✓ Select as currency
    "t": 1647360000           // ✓ Select as datetime
  }
}
```

Resulting fields:
```javascript
[
  { path: "symbol", label: "Symbol", format: "text" },
  { path: "quote.c", label: "Current Price", format: "currency" },
  { path: "quote.d", label: "Change", format: "currency" },
  { path: "quote.dp", label: "Change %", format: "percentage" },
  { path: "quote.h", label: "High", format: "currency" },
  { path: "quote.l", label: "Low", format: "currency" },
  { path: "quote.o", label: "Open", format: "currency" },
  { path: "quote.t", label: "Last Updated", format: "datetime" }
]
```

---

## ✨ Smart Format Detection

The JsonFieldExplorer includes intelligent format detection:

### Automatic Detection Rules

| Condition | Detected Format |
|-----------|----------------|
| Field name contains "price" or "cost" | Currency |
| Field name contains "percent" or "change" | Percentage |
| Value is number | Number |
| Value is boolean | Boolean |
| Value is ISO date string | Date/Datetime |
| Default | Text |

### Example Detection

```javascript
// Field: "currentPrice" with value 142.56
// Auto-detected: currency

// Field: "changePercent" with value 2.34
// Auto-detected: percentage

// Field: "volume" with value 45000000
// Auto-detected: number

// Field: "isActive" with value true
// Auto-detected: boolean
```

---

## 🎯 Validation Rules

### Required Fields

| Widget Type | Required Fields |
|------------|----------------|
| finance-card | title, symbol |
| stock-table | title, symbols (min 1) |
| line-chart | title, symbol, timeInterval |
| candlestick-chart | title, symbol, timeInterval |
| watchlist | title, symbols (min 1) |

### Validation Messages

```javascript
// Empty title
"Widget title is required"

// Missing symbol (when required)
"Symbol is required for this endpoint"

// Empty watchlist
"At least one symbol required for watchlist"
```

---

## 🎨 Styling & Theming

### Dark Mode Support

Both components fully support dark mode with Tailwind CSS:

```javascript
// Light mode
bg-white text-gray-900

// Dark mode
dark:bg-gray-800 dark:text-white
```

### Customization

Modify Tailwind classes in components:

```javascript
// Change primary color (blue)
bg-blue-500 → bg-purple-500
hover:bg-blue-600 → hover:bg-purple-600

// Change border radius
rounded-lg → rounded-xl

// Change shadows
shadow-md → shadow-2xl
```

---

## 📊 State Management

### Redux Integration

WidgetConfigPanel automatically dispatches to Redux:

```javascript
// For new widgets
dispatch(addWidget({
  title: "My Widget",
  type: "finance-card",
  apiSource: "finnhub",
  symbol: "AAPL",
  // ... other config
}));

// For existing widgets
dispatch(updateWidget({
  id: widgetId,
  updates: {
    title: "Updated Title",
    refreshInterval: 60000,
    // ... other updates
  }
}));
```

### Widget Config Structure

```javascript
{
  id: "abc123",                    // Auto-generated
  title: "AAPL Stock Price",       // User input
  type: "finance-card",            // Widget type
  apiSource: "finnhub",            // API provider
  apiEndpoint: "quote",            // API endpoint
  symbol: "AAPL",                  // Stock symbol
  symbols: [],                     // For watchlist
  timeInterval: "1D",              // For charts
  refreshInterval: 30000,          // 30 seconds
  cacheTTL: 60000,                 // 1 minute
  fields: [                        // Field mapping
    {
      path: "price",
      label: "Price",
      format: "currency",
      type: "number"
    }
  ],
  customSettings: {},              // Additional settings
  createdAt: 1647360000000,        // Timestamp
  lastUpdated: 1647360000000       // Timestamp
}
```

---

## 🚀 Advanced Features

### 1. Live Data Preview

Fetch and display real API data before saving:

```javascript
const fetchPreview = async () => {
  const result = await getStockQuote(symbol, apiSource);
  setPreviewData(result.data);
};
```

### 2. Watchlist Multi-Symbol Input

Add/remove multiple symbols:

```javascript
// Add symbol
handleAddSymbol("AAPL")  // Adds to array
handleAddSymbol("GOOGL") // Adds to array

// Remove symbol
handleRemoveSymbol("AAPL") // Removes from array

// Result
symbols: ["GOOGL", "MSFT", "TSLA"]
```

### 3. Field Path Navigation

Navigate nested JSON structures:

```javascript
// Top level
"symbol" → symbol

// Nested
"quote.c" → quote.c

// Array element
"data[0].price" → data[0].price
```

---

## 🐛 Troubleshooting

### Issue: Preview Not Loading

**Solution:** Check API keys in `.env`:
```bash
VITE_FINNHUB_API_KEY=your_key_here
VITE_ALPHA_VANTAGE_API_KEY=your_key_here
```

### Issue: Fields Not Appearing

**Solution:** Fetch preview data first before opening field explorer

### Issue: Validation Errors

**Solution:** Ensure all required fields are filled:
- Widget title (always required)
- Symbol (for quote/chart endpoints)
- At least one symbol (for watchlist)

### Issue: Format Not Applied

**Solution:** Select "Auto" to use smart detection, or manually choose format

---

## 📝 Best Practices

1. **Always fetch preview** before configuring fields
2. **Use descriptive labels** for better UX
3. **Choose appropriate formats** for data types
4. **Set reasonable refresh intervals** to avoid rate limits
5. **Test with real data** before finalizing config
6. **Use watchlist** for monitoring multiple stocks
7. **Leverage auto format** for quick setup

---

## 🎓 Complete Example

```javascript
import { useState } from 'react';
import WidgetConfigPanel from './components/WidgetConfigPanel';

const MyDashboard = () => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="dashboard">
      {/* Add Widget Button */}
      <button 
        onClick={() => setShowConfig(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
        +
      </button>

      {/* Configuration Panel */}
      {showConfig && (
        <WidgetConfigPanel
          widgetId={null}
          isNewWidget={true}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};

export default MyDashboard;
```

---

## 📚 Additional Resources

- [Widget Integration Examples](./src/examples/WidgetConfigIntegration.jsx)
- [API Services Documentation](./src/services/README.md)
- [Redux State Management](./src/state/README.md)
- [Component Props Reference](./src/components/README.md)

---

## 📄 License

MIT License - See LICENSE file for details
