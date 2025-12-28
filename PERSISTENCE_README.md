# Dashboard Persistence Documentation

Complete guide to dashboard persistence features including localStorage, export/import, and backups.

## 📦 Features Overview

### **1. Automatic Persistence** 💾
Dashboard state automatically saves to localStorage on every change.

### **2. Export/Import** 📤📥
Export dashboard configuration as JSON file or import from file.

### **3. Backups** 💿
Create manual backups and restore previous states.

### **4. Storage Management** 🗄️
Monitor storage usage and manage saved data.

---

## 🚀 Quick Start

### Setup

```jsx
import { Provider } from 'react-redux';
import store from './store';
import useDashboardPersistence from './hooks/useDashboardPersistence';

// Wrap app with Redux Provider
function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}

// Use in component
function Dashboard() {
  const {
    isLoading,
    isSaving,
    lastSaved,
    exportToFile,
    importFromFile
  } = useDashboardPersistence();

  if (isLoading) return <Loader />;

  return <div>{/* Your dashboard */}</div>;
}
```

---

## 🔧 API Reference

### useDashboardPersistence Hook

```jsx
const {
  // State
  isLoading,        // Boolean: Loading state
  isSaving,         // Boolean: Saving state
  lastSaved,        // Date: Last save timestamp

  // Actions
  save,             // Function: Manual save
  exportDashboard,  // Function: Get config object
  exportToFile,     // Function: Download JSON
  importDashboard,  // Function: Import config object
  importFromFile,   // Function: Import from file

  // Backup
  createBackup,     // Function: Create backup
  listBackups,      // Function: List all backups
  restoreBackup,    // Function: Restore from backup

  // Info
  getStorageInfo    // Function: Get storage usage
} = useDashboardPersistence();
```

---

## 💾 Automatic Persistence

### How It Works

Dashboard automatically saves to localStorage when:
- Widgets are added, updated, or removed
- Layout changes (resize, reorder)
- Settings are modified

```jsx
function Dashboard() {
  const { isSaving, lastSaved } = useDashboardPersistence();

  return (
    <div>
      {isSaving && <span>Saving...</span>}
      {lastSaved && <span>Last saved: {lastSaved.toLocaleString()}</span>}
    </div>
  );
}
```

### Manual Save

```jsx
const { save } = useDashboardPersistence();

<button onClick={save}>
  Save Now
</button>
```

### Storage Keys

Data is stored under these localStorage keys:
- `finboard_widgets` - Widget configurations
- `finboard_layout` - Layout positions
- `finboard_settings` - Dashboard settings
- `finboard_version` - Data version

---

## 📤 Export

### Export to File

```jsx
const { exportToFile } = useDashboardPersistence();

const handleExport = () => {
  const success = exportToFile();
  if (success) {
    alert('Dashboard exported!');
  }
};
```

Downloads a JSON file named `finboard-dashboard-{timestamp}.json`

### Export to Object

```jsx
const { exportDashboard } = useDashboardPersistence();

const config = exportDashboard();
console.log(config);
// {
//   version: "1.0.0",
//   exportedAt: "2025-12-28T...",
//   widgets: [...],
//   layout: [...],
//   settings: {...}
// }
```

### Export to Clipboard

```jsx
const handleCopyToClipboard = async () => {
  const config = exportDashboard();
  const json = JSON.stringify(config, null, 2);
  await navigator.clipboard.writeText(json);
  alert('Copied to clipboard!');
};
```

---

## 📥 Import

### Import from File

```jsx
const { importFromFile } = useDashboardPersistence();
const fileInputRef = useRef(null);

const handleImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const result = await importFromFile(file);
    if (result.success) {
      alert('Dashboard imported!');
      window.location.reload(); // Reload to apply
    } else {
      alert(`Import failed: ${result.error}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

<input
  ref={fileInputRef}
  type="file"
  accept=".json"
  onChange={handleImport}
  style={{ display: 'none' }}
/>
<button onClick={() => fileInputRef.current?.click()}>
  Import
</button>
```

### Import from Object

```jsx
const { importDashboard } = useDashboardPersistence();

const config = {
  version: "1.0.0",
  widgets: [...],
  layout: [...],
  settings: {...}
};

const result = importDashboard(config);
if (result.success) {
  window.location.reload();
}
```

### Validation

Import automatically validates:
- JSON structure
- Version compatibility
- Required fields
- Data types

---

## 💿 Backups

### Create Backup

```jsx
const { createBackup } = useDashboardPersistence();

const handleBackup = () => {
  const backupKey = createBackup();
  if (backupKey) {
    alert('Backup created successfully!');
  }
};
```

### List Backups

```jsx
const { listBackups } = useDashboardPersistence();

const backups = listBackups();
// [
//   {
//     key: "finboard_backup_1703779200000",
//     timestamp: 1703779200000,
//     date: Date,
//     widgetCount: 5
//   },
//   ...
// ]
```

### Restore Backup

```jsx
const { restoreBackup } = useDashboardPersistence();

const handleRestore = (backupKey) => {
  if (confirm('Restore this backup?')) {
    const result = restoreBackup(backupKey);
    if (result.success) {
      alert('Backup restored!');
      window.location.reload();
    }
  }
};
```

### Automatic Cleanup

- Keeps last 5 backups automatically
- Older backups are removed
- Prevents storage overflow

---

## 🗄️ Storage Management

### Get Storage Info

```jsx
const { getStorageInfo } = useDashboardPersistence();

const info = getStorageInfo();
// {
//   total: 12345,  // Total bytes
//   items: {
//     WIDGETS: { size: 5000, exists: true },
//     LAYOUT: { size: 2000, exists: true },
//     SETTINGS: { size: 500, exists: true }
//   },
//   quota: 5242880  // Estimated quota
// }
```

### Clear All Data

```jsx
const { clearDashboard } = useDashboardPersistence();

const handleClear = () => {
  if (confirm('Clear all data? This cannot be undone.')) {
    const success = clearDashboard();
    if (success) {
      window.location.reload();
    }
  }
};
```

---

## 🎨 UI Components

### Import/Export Panel

```jsx
import DashboardImportExport from './components/DashboardImportExport';

const [showPanel, setShowPanel] = useState(false);

<button onClick={() => setShowPanel(true)}>
  Import/Export
</button>

{showPanel && (
  <DashboardImportExport onClose={() => setShowPanel(false)} />
)}
```

Features:
- ✅ Export to file or clipboard
- ✅ Import from file
- ✅ Backup management
- ✅ Storage usage display
- ✅ Clear data option

---

## 🔄 Data Format

### Dashboard Config Structure

```json
{
  "version": "1.0.0",
  "exportedAt": "2025-12-28T10:30:00.000Z",
  "widgets": [
    {
      "id": "widget_123",
      "type": "financeCard",
      "title": "AAPL",
      "config": {...},
      "createdAt": 1703779200000,
      "updatedAt": 1703779200000
    }
  ],
  "layout": [
    {
      "i": "widget_123",
      "x": 0,
      "y": 0,
      "w": 4,
      "h": 4
    }
  ],
  "settings": {
    "theme": "dark",
    "autoRefresh": true
  }
}
```

---

## 🛡️ Error Handling

### Import Errors

```jsx
try {
  const result = await importFromFile(file);
  if (!result.success) {
    switch (result.error) {
      case 'Invalid JSON file':
        alert('File is not valid JSON');
        break;
      case 'Invalid dashboard configuration':
        alert('Config structure is invalid');
        break;
      default:
        alert(`Import failed: ${result.error}`);
    }
  }
} catch (error) {
  console.error('Import error:', error);
}
```

### Storage Quota Exceeded

```jsx
const { save } = useDashboardPersistence();

const success = save();
if (!success) {
  alert('Storage quota exceeded. Please clear some data.');
}
```

---

## 🔧 Advanced Usage

### Custom Storage Keys

Modify in `dashboardStorage.js`:

```javascript
const STORAGE_KEYS = {
  WIDGETS: 'my_app_widgets',
  LAYOUT: 'my_app_layout',
  SETTINGS: 'my_app_settings',
  VERSION: 'my_app_version'
};
```

### Version Migration

```javascript
static migrateWidgets(oldData) {
  if (oldData.version === '0.9.0') {
    // Migrate from v0.9.0 to v1.0.0
    return oldData.widgets.map(w => ({
      ...w,
      newField: 'default'
    }));
  }
  return oldData.widgets;
}
```

### Debounced Auto-Save

Auto-save has built-in 500ms debounce to prevent excessive writes:

```javascript
useEffect(() => {
  const saveDashboard = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    DashboardStorage.saveWidgets(widgets);
  };
  saveDashboard();
}, [widgets]);
```

---

## 📊 Best Practices

### 1. Always Create Backups

```jsx
// Before major changes
const backupKey = createBackup();
// Make changes
// If something goes wrong:
restoreBackup(backupKey);
```

### 2. Validate Imports

```jsx
const result = await importFromFile(file);
if (!result.success) {
  console.error('Import failed:', result.error);
  return;
}
```

### 3. Monitor Storage

```jsx
const info = getStorageInfo();
if (info.total > 4 * 1024 * 1024) { // 4MB
  alert('Storage usage high. Consider exporting and clearing old data.');
}
```

### 4. Handle Errors Gracefully

```jsx
try {
  const success = save();
  if (!success) {
    // Fallback: export to file
    exportToFile();
  }
} catch (error) {
  console.error('Save failed:', error);
}
```

---

## 🧪 Testing

### Test Auto-Save

1. Add a widget
2. Check console for "Dashboard auto-saved"
3. Reload page
4. Widget should persist

### Test Export/Import

1. Create widgets
2. Export to file
3. Clear dashboard
4. Import file
5. Verify widgets restored

### Test Backups

1. Create widgets
2. Create backup
3. Make changes
4. Restore backup
5. Verify original state

---

## 🐛 Troubleshooting

**Data not persisting:**
- Check localStorage is enabled
- Check browser privacy settings
- Check storage quota

**Import fails:**
- Validate JSON syntax
- Check version compatibility
- Check file encoding (UTF-8)

**Quota exceeded:**
- Export and clear old data
- Remove unused backups
- Check for large widget configs

---

## 📄 License

MIT License - See LICENSE file for details
