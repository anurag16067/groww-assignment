# Widget Configuration Panel - Visual UI Flow

## 🎨 User Interface Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WidgetConfigPanel Component                       │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Header: "Add New Widget" or "Configure Widget"        [X]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Widget Title                                              │     │
│  │  ┌─────────────────────────────────────────────────────┐  │     │
│  │  │ Enter widget title...                               │  │     │
│  │  └─────────────────────────────────────────────────────┘  │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Widget Type                                              │     │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │     │
│  │  │  💳  │  │  📊  │  │  📈  │  │  📉  │  │  👁️  │       │     │
│  │  │ Card │  │Table │  │ Line │  │Candle│  │Watch │       │     │
│  │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘       │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────┐  ┌────────────────────────┐           │
│  │  API Provider          │  │  Endpoint              │           │
│  │  ┌──────────────────┐ │  │  ┌──────────────────┐ │           │
│  │  │ Finnhub      ▼   │ │  │  │ Quote         ▼  │ │           │
│  │  └──────────────────┘ │  │  └──────────────────┘ │           │
│  └────────────────────────┘  └────────────────────────┘           │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Stock Symbol                                             │     │
│  │  ┌─────────────────────────────────────────────────────┐ │     │
│  │  │ AAPL                                               │ │     │
│  │  └─────────────────────────────────────────────────────┘ │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────┐  ┌────────────────────────┐           │
│  │  Refresh Interval      │  │  Cache TTL             │           │
│  │  ┌──────────────────┐ │  │  ┌──────────────────┐ │           │
│  │  │ 30 seconds    ▼  │ │  │  │ 1 minute      ▼  │ │           │
│  │  └──────────────────┘ │  │  └──────────────────┘ │           │
│  └────────────────────────┘  └────────────────────────┘           │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Field Mapping (3 fields)          [Configure Fields]    │     │
│  │  ┌─────────────────────────────────────────────────────┐ │     │
│  │  │  symbol              →  Symbol (text)              │ │     │
│  │  │  price               →  Price (currency)           │ │     │
│  │  │  changePercent       →  Change % (percentage)      │ │     │
│  │  └─────────────────────────────────────────────────────┘ │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Data Preview                        [Fetch Preview]      │     │
│  │  ┌─────────────────────────────────────────────────────┐ │     │
│  │  │ {                                                    │ │     │
│  │  │   "symbol": "AAPL",                                 │ │     │
│  │  │   "price": 142.56,                                  │ │     │
│  │  │   "change": 2.34,                                   │ │     │
│  │  │   "changePercent": 1.67                             │ │     │
│  │  │ }                                                    │ │     │
│  │  └─────────────────────────────────────────────────────┘ │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                      [Cancel]  [Save]       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 JsonFieldExplorer Component

```
┌───────────────────────────────────────────────────────────────────────┐
│            JsonFieldExplorer: Field Mapping Configuration             │
│  Select fields from the data structure and configure display format   │
├───────────────────────────────────┬───────────────────────────────────┤
│  Available Fields                 │  Selected Fields (3)              │
│                                   │                                   │
│  ▼ symbol            string       │  ┌─────────────────────────────┐ │
│  [ ] "AAPL"                       │  │  symbol                  [X] │ │
│                                   │  │  Display Label:              │ │
│  ▶ quote             object       │  │  ┌─────────────────────────┐│ │
│                                   │  │  │ Symbol                  ││ │
│  ▼ price             number       │  │  └─────────────────────────┘│ │
│  [✓] 142.56                       │  │  Format:                     │ │
│                                   │  │  [Auto][💵][📊][🔢][📅][...]│ │
│  ▼ change            number       │  │  Preview: Symbol: AAPL       │ │
│  [✓] 2.34                         │  └─────────────────────────────┘ │
│                                   │                                   │
│  ▼ changePercent     number       │  ┌─────────────────────────────┐ │
│  [✓] 1.67                         │  │  price                   [X] │ │
│                                   │  │  Display Label:              │ │
│  ▼ volume            number       │  │  ┌─────────────────────────┐│ │
│  [ ] 45000000                     │  │  │ Stock Price             ││ │
│                                   │  │  └─────────────────────────┘│ │
│  ▼ high              number       │  │  Format:                     │ │
│  [ ] 145.20                       │  │  [Auto][💵][📊][🔢][📅][...]│ │
│                                   │  │  Preview: Price: $142.56     │ │
│  ▼ low               number       │  └─────────────────────────────┘ │
│  [ ] 141.80                       │                                   │
│                                   │  ┌─────────────────────────────┐ │
│  ▼ open              number       │  │  changePercent           [X] │ │
│  [ ] 143.00                       │  │  Display Label:              │ │
│                                   │  │  ┌─────────────────────────┐│ │
│                                   │  │  │ Change %                ││ │
│                                   │  │  └─────────────────────────┘│ │
│                                   │  │  Format:                     │ │
│                                   │  │  [Auto][💵][📊][🔢][📅][...]│ │
│                                   │  │  Preview: Change: 1.67%      │ │
│                                   │  └─────────────────────────────┘ │
├───────────────────────────────────┴───────────────────────────────────┤
│  3 fields selected                      [Cancel]  [Save Field Mapping]│
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Interaction Flow

### Step 1: Open Configuration Panel
```
User clicks "Add Widget" button
         ↓
WidgetConfigPanel opens as modal
         ↓
Form initialized with defaults
```

### Step 2: Basic Configuration
```
Enter widget title: "Apple Stock Monitor"
         ↓
Select type: Finance Card (💳)
         ↓
Choose API: Finnhub
         ↓
Choose endpoint: Quote
         ↓
Enter symbol: "AAPL"
```

### Step 3: Refresh Settings
```
Set refresh interval: 30 seconds
         ↓
Set cache TTL: 1 minute
```

### Step 4: Preview Data
```
Click "Fetch Preview"
         ↓
API call to Finnhub
         ↓
JSON data displayed in preview panel
```

### Step 5: Configure Fields
```
Click "Configure Fields"
         ↓
JsonFieldExplorer opens
         ↓
JSON tree shows data structure
```

### Step 6: Select & Format Fields
```
Left Panel (JSON Tree):
  ▼ Expand "quote" object
  [✓] Check "c" (current price)
  [✓] Check "d" (change)
  [✓] Check "dp" (change percent)

Right Panel (Configuration):
  Field: quote.c
    Label: "Current Price"
    Format: Currency (💵)
    Preview: "$142.56"
  
  Field: quote.d
    Label: "Change"
    Format: Currency (💵)
    Preview: "$2.34"
  
  Field: quote.dp
    Label: "Change %"
    Format: Percentage (📊)
    Preview: "1.67%"
```

### Step 7: Save Configuration
```
Click "Save Field Mapping" in JsonFieldExplorer
         ↓
Fields added to config panel
         ↓
Click "Add Widget" in WidgetConfigPanel
         ↓
Redux action dispatched
         ↓
Widget created and added to dashboard
```

---

## 🎨 Visual States

### Default State
- All fields empty or default values
- No validation errors
- Preview panel empty
- Field mapping shows "0 fields"

### Filled State
- Form populated with user input
- Validation passes
- Preview shows API data
- Field mapping shows selected fields

### Error State
- Invalid fields highlighted in red
- Error messages shown below fields
- Save button remains active (attempts save, shows errors)

### Loading State
- "Fetch Preview" button shows "Loading..."
- Preview panel shows "Loading preview..."
- Button disabled during fetch

### Success State (After Save)
- Modal closes
- Widget appears on dashboard
- Data starts loading in widget
- Refresh interval begins

---

## 📱 Responsive Behavior

### Desktop (lg)
```
┌─────────────────────────────────────┐
│  Full width panel (max-w-4xl)       │
│  Two-column layout for some fields  │
│  JsonFieldExplorer: 50/50 split     │
└─────────────────────────────────────┘
```

### Tablet (md)
```
┌──────────────────────────────┐
│  Slightly narrower           │
│  Some fields stack           │
│  JsonFieldExplorer: 50/50    │
└──────────────────────────────┘
```

### Mobile (sm)
```
┌─────────────────────┐
│  Full width         │
│  All fields stack   │
│  Single column      │
│  JsonFieldExplorer: │
│    Tree above       │
│    Config below     │
└─────────────────────┘
```

---

## 🎭 Dark Mode

### Light Mode
```
Background: white / gray-50
Text: gray-900
Borders: gray-300
Inputs: white with gray border
Buttons: blue-500
```

### Dark Mode
```
Background: gray-800 / gray-900
Text: white / gray-200
Borders: gray-600 / gray-700
Inputs: gray-700 with gray-600 border
Buttons: blue-500 (same)
```

---

## 🔄 Data Flow

```
User Input
    ↓
Component State (config)
    ↓
Validation Check
    ↓
[If valid] → Redux Action (addWidget/updateWidget)
    ↓
Redux Store Updated
    ↓
Widget Added to Dashboard
    ↓
useFetchData Hook Activated
    ↓
API Data Fetched
    ↓
Widget Displays Data
```

---

## 🎯 Key UI Elements

### Input Types
1. **Text Input** - Title, Symbol
2. **Dropdown** - API Provider, Endpoint, Intervals
3. **Button Grid** - Widget Type Selection
4. **Tag Input** - Watchlist Symbols (add/remove)
5. **Checkbox Tree** - Field Selection
6. **Format Buttons** - Format Selection
7. **Preview Panel** - JSON Display

### Visual Feedback
- ✅ Green checkmark for valid
- ❌ Red X for invalid
- 🔄 Spinner for loading
- 💾 Save icon
- ⚙️ Settings icon
- 📊 Data icons

### Accessibility
- Tab navigation supported
- Escape to close
- Enter to submit (when focused on inputs)
- ARIA labels (can be enhanced)
- Semantic HTML
- Keyboard shortcuts ready

---

## 🎉 User Experience Highlights

### Instant Feedback
- Real-time validation
- Inline error messages
- Preview data on demand
- Live format preview

### Smart Defaults
- Reasonable initial values
- Auto-format detection
- Suggested formats
- Common intervals pre-selected

### Visual Clarity
- Clear section headers
- Icon-based type selection
- Color-coded validation
- Organized layout

### Workflow Efficiency
- Modal overlay (doesn't navigate away)
- Quick close/cancel
- Preview before committing
- Field reuse from preview

---

This visual guide demonstrates the complete UI flow and user interaction patterns for the Widget Configuration Panel system!
