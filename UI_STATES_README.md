# UI States Documentation

Complete guide to using the reusable UI state components for loading, error, and empty states.

## 📦 Components Overview

### **1. Loader** ⏳
Loading indicators with multiple variants and skeleton loaders.

### **2. ErrorState** ❌
Error displays with retry functionality and different variants.

### **3. EmptyState** 📭
Empty state displays with actions and different layouts.

---

## 🎨 Loader Component

### Basic Usage

```jsx
import { Loader } from './components/ui';

<Loader 
  size="md"              // sm, md, lg, xl
  variant="spinner"      // spinner, dots, pulse, bars
  text="Loading..."
  showText={true}
  fullScreen={false}
/>
```

### Variants

**1. Spinner** (default)
```jsx
<Loader variant="spinner" text="Loading data..." />
```

**2. Dots**
```jsx
<Loader variant="dots" text="Please wait..." />
```

**3. Pulse**
```jsx
<Loader variant="pulse" text="Processing..." />
```

**4. Bars**
```jsx
<Loader variant="bars" text="Loading..." />
```

### Sizes

```jsx
<Loader size="sm" />   // Small - 16px
<Loader size="md" />   // Medium - 32px (default)
<Loader size="lg" />   // Large - 48px
<Loader size="xl" />   // Extra Large - 64px
```

### Full Screen Loader

```jsx
<Loader 
  fullScreen={true} 
  size="lg" 
  text="Loading your dashboard..." 
/>
```

### Inline Loader (for buttons)

```jsx
import { InlineLoader } from './components/ui';

<button className="btn">
  <InlineLoader size="sm" />
  Loading...
</button>
```

### Skeleton Loaders

**Content Skeleton**
```jsx
import { SkeletonLoader } from './components/ui';

<SkeletonLoader 
  lines={3}        // Number of lines
  avatar={true}    // Show avatar
  height="h-4"     // Line height
/>
```

**Card Skeleton**
```jsx
import { CardSkeleton } from './components/ui';

<CardSkeleton className="w-full" />
```

**Table Skeleton**
```jsx
import { TableSkeleton } from './components/ui';

<TableSkeleton 
  rows={5} 
  columns={4} 
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the loader |
| `variant` | `'spinner' \| 'dots' \| 'pulse' \| 'bars'` | `'spinner'` | Loader animation style |
| `text` | `string` | `'Loading...'` | Loading message text |
| `showText` | `boolean` | `true` | Show/hide text |
| `fullScreen` | `boolean` | `false` | Full screen overlay |
| `className` | `string` | `''` | Additional CSS classes |

---

## ❌ ErrorState Component

### Basic Usage

```jsx
import { ErrorState } from './components/ui';

<ErrorState
  title="Something went wrong"
  message="An error occurred while loading the data."
  error={errorObject}
  onRetry={() => refetchData()}
  variant="default"
  icon="alert"
  showDetails={false}
/>
```

### Variants

**1. Default**
```jsx
<ErrorState 
  title="Error occurred"
  message="Failed to load data"
  onRetry={handleRetry}
/>
```

**2. Inline**
```jsx
<ErrorState 
  variant="inline"
  title="Failed to load"
  message="Please try again"
  onRetry={handleRetry}
/>
```

**3. Minimal**
```jsx
<ErrorState 
  variant="minimal"
  message="An error occurred"
  onRetry={handleRetry}
/>
```

**4. Full Screen**
```jsx
<ErrorState 
  variant="fullScreen"
  title="Critical Error"
  message="Unable to load the application"
  onRetry={handleRetry}
/>
```

### Icons

```jsx
<ErrorState icon="alert" />    // Triangle warning
<ErrorState icon="error" />    // Circle X
<ErrorState icon="network" />  // Network error
<ErrorState icon="server" />   // Server error
```

### Specific Error Types

**Network Error**
```jsx
import { NetworkError } from './components/ui';

<NetworkError onRetry={handleRetry} />
```

**Server Error**
```jsx
import { ServerError } from './components/ui';

<ServerError onRetry={handleRetry} />
```

**Not Found Error**
```jsx
import { NotFoundError } from './components/ui';

<NotFoundError />
```

**Rate Limit Error**
```jsx
import { RateLimitError } from './components/ui';

<RateLimitError 
  onRetry={handleRetry} 
  retryAfter={60}  // seconds
/>
```

### Error with Details

```jsx
<ErrorState
  title="API Error"
  error={{
    message: "Failed to fetch data",
    status: 500,
    stack: "Error: Failed to fetch..."
  }}
  showDetails={true}
  onRetry={handleRetry}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Something went wrong'` | Error title |
| `message` | `string` | `'An error occurred...'` | Error message |
| `error` | `object` | `null` | Error object with details |
| `onRetry` | `function` | `null` | Retry callback |
| `variant` | `'default' \| 'inline' \| 'minimal' \| 'fullScreen'` | `'default'` | Display variant |
| `showDetails` | `boolean` | `false` | Show error stack trace |
| `icon` | `'alert' \| 'error' \| 'network' \| 'server'` | `'alert'` | Error icon |
| `className` | `string` | `''` | Additional CSS classes |

---

## 📭 EmptyState Component

### Basic Usage

```jsx
import { EmptyState } from './components/ui';

<EmptyState
  title="No data available"
  message="There is no data to display."
  icon="inbox"
  action={() => loadData()}
  actionLabel="Load Data"
  variant="default"
/>
```

### Variants

**1. Default**
```jsx
<EmptyState 
  title="No items"
  message="Add your first item to get started"
  action={handleAdd}
/>
```

**2. Inline**
```jsx
<EmptyState 
  variant="inline"
  message="No data available"
  action={handleLoad}
  actionLabel="Load Data"
/>
```

**3. Minimal**
```jsx
<EmptyState 
  variant="minimal"
  message="Nothing to show"
/>
```

**4. Illustration** (large, centered)
```jsx
<EmptyState 
  variant="illustration"
  title="Welcome!"
  message="Get started by adding your first item"
  action={handleAdd}
  actionLabel="Add Item"
/>
```

### Icons

```jsx
<EmptyState icon="inbox" />       // Inbox
<EmptyState icon="search" />      // Search
<EmptyState icon="chart" />       // Chart/Graph
<EmptyState icon="folder" />      // Folder
<EmptyState icon="document" />    // Document
<EmptyState icon="widget" />      // Widget grid
<EmptyState icon="stock" />       // Stock chart
<EmptyState icon="filter" />      // Filter
<EmptyState icon="box" />         // Box/Package
```

### Specific Empty States

**No Search Results**
```jsx
import { NoSearchResults } from './components/ui';

<NoSearchResults 
  searchTerm="AAPL" 
  onClear={() => clearSearch()}
/>
```

**No Widgets**
```jsx
import { NoWidgets } from './components/ui';

<NoWidgets onAdd={() => openAddDialog()} />
```

**No Stock Data**
```jsx
import { NoStockData } from './components/ui';

<NoStockData onRefresh={() => refetchData()} />
```

**No Filtered Data**
```jsx
import { NoFilteredData } from './components/ui';

<NoFilteredData onReset={() => clearFilters()} />
```

**Empty Dashboard**
```jsx
import { EmptyDashboard } from './components/ui';

<EmptyDashboard onAddWidget={() => showWidgetPanel()} />
```

### Custom Children

```jsx
<EmptyState
  title="Custom Actions"
  message="You can provide custom action buttons"
>
  <div className="flex gap-3">
    <button onClick={action1}>Action 1</button>
    <button onClick={action2}>Action 2</button>
  </div>
</EmptyState>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'No data available'` | Empty state title |
| `message` | `string` | `'There is no data...'` | Empty state message |
| `icon` | `string` | `'inbox'` | Icon to display |
| `action` | `function` | `null` | Action callback |
| `actionLabel` | `string` | `'Get Started'` | Action button text |
| `variant` | `'default' \| 'inline' \| 'minimal' \| 'illustration'` | `'default'` | Display variant |
| `children` | `ReactNode` | `null` | Custom action content |
| `className` | `string` | `''` | Additional CSS classes |

---

## 🔗 Integration Examples

### With API Calls

```jsx
import { Loader, ErrorState, EmptyState } from './components/ui';

function DataComponent() {
  const { data, loading, error } = useFetchData(url);

  if (loading) {
    return <Loader text="Loading data..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load data"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No data found"
        message="No data is available at this time."
        action={() => refetch()}
        actionLabel="Refresh"
      />
    );
  }

  return <div>{/* Render data */}</div>;
}
```

### With Search/Filter

```jsx
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term) => {
    setLoading(true);
    setSearchTerm(term);
    const data = await searchAPI(term);
    setResults(data);
    setLoading(false);
  };

  if (loading) {
    return <Loader variant="dots" text="Searching..." />;
  }

  if (searchTerm && results.length === 0) {
    return (
      <NoSearchResults
        searchTerm={searchTerm}
        onClear={() => setSearchTerm('')}
      />
    );
  }

  return <div>{/* Render results */}</div>;
}
```

### With Table

```jsx
function DataTable({ data, loading, error, onRetry }) {
  if (loading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  if (error) {
    return <ErrorState variant="inline" onRetry={onRetry} />;
  }

  if (data.length === 0) {
    return <EmptyState variant="inline" message="No records found" />;
  }

  return (
    <table>
      {/* Table content */}
    </table>
  );
}
```

### With Cards

```jsx
function CardGrid({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        variant="illustration"
        title="No items"
        message="Add your first item"
        action={handleAdd}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map(item => <Card key={item.id} {...item} />)}
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Always Handle All States

```jsx
// ✅ Good
function Component() {
  if (loading) return <Loader />;
  if (error) return <ErrorState onRetry={retry} />;
  if (!data) return <EmptyState />;
  return <Data />;
}

// ❌ Bad
function Component() {
  if (loading) return <Loader />;
  return <Data />; // What if error or no data?
}
```

### 2. Provide Retry Actions

```jsx
// ✅ Good - User can retry
<ErrorState 
  message="Failed to load"
  onRetry={() => refetch()}
/>

// ❌ Bad - User stuck with error
<ErrorState message="Failed to load" />
```

### 3. Use Appropriate Variants

```jsx
// ✅ For inline messages
<ErrorState variant="inline" />

// ✅ For full page
<ErrorState variant="default" />

// ✅ For critical errors
<ErrorState variant="fullScreen" />
```

### 4. Use Skeleton Loaders for Content

```jsx
// ✅ Better UX - Shows structure while loading
{loading ? (
  <TableSkeleton rows={5} columns={4} />
) : (
  <Table data={data} />
)}

// ❌ Generic spinner
{loading ? <Loader /> : <Table data={data} />}
```

### 5. Provide Context in Messages

```jsx
// ✅ Specific and helpful
<ErrorState 
  title="Failed to load stock data"
  message="Unable to fetch data for AAPL. Please check your connection."
/>

// ❌ Generic and unclear
<ErrorState message="Error" />
```

---

## 🎨 Customization

### Custom Styling

```jsx
<Loader 
  className="my-custom-class" 
  style={{ padding: '20px' }}
/>

<ErrorState 
  className="border-2 border-red-500" 
/>

<EmptyState 
  className="bg-gray-100 rounded-lg p-8" 
/>
```

### Custom Icons

You can pass custom icon components through the `children` prop or by modifying the component source.

### Theming

All components support dark mode automatically via Tailwind's `dark:` classes.

```jsx
// Automatically switches based on system preference
<div className="dark">
  <Loader />
  <ErrorState />
  <EmptyState />
</div>
```

---

## 📱 Responsive Design

All components are fully responsive and adapt to different screen sizes:

- **Mobile**: Smaller text, compact layouts
- **Tablet**: Medium sizing
- **Desktop**: Full sizing with optimal spacing

---

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly
- Sufficient color contrast

---

## 📊 Examples

See complete examples in:
- `src/examples/UIStatesDemo.jsx` - Interactive demo with all states

To run the demo:
```bash
npm run dev
# Navigate to /ui-states-demo
```

---

## 🚀 Quick Reference

```jsx
// Import
import { 
  Loader, 
  ErrorState, 
  EmptyState,
  // Specific variants
  InlineLoader,
  SkeletonLoader,
  CardSkeleton,
  TableSkeleton,
  NetworkError,
  ServerError,
  NoSearchResults,
  EmptyDashboard
} from './components/ui';

// Usage
<Loader size="md" variant="spinner" />
<ErrorState onRetry={handleRetry} />
<EmptyState action={handleAction} />
```

---

## 🐛 Troubleshooting

**Loader not showing:**
- Check that parent has height defined
- Verify className isn't hiding it

**Full screen loader not covering:**
- Ensure z-index is appropriate
- Check for competing fixed/absolute elements

**Dark mode not working:**
- Enable dark mode in tailwind.config.js
- Apply `dark` class to parent element

---

## 📄 License

MIT License - See LICENSE file for details
