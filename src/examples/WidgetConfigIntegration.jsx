/**
 * Widget Configuration Panel - Integration Guide & Examples
 * 
 * This file demonstrates how to integrate the WidgetConfigPanel and JsonFieldExplorer
 * components into the FinBoard application.
 */

import { useState } from 'react';
import { useSelector } from 'react-redux';
import WidgetConfigPanel from '../components/WidgetConfigPanel';

// =============================================================================
// EXAMPLE 1: Add New Widget Button in Dashboard
// =============================================================================

export const DashboardWithAddWidget = () => {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState(null);

  return (
    <div className="dashboard">
      {/* Add Widget Button */}
      <button
        onClick={() => {
          setEditingWidgetId(null);
          setShowConfigPanel(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center text-2xl"
      >
        +
      </button>

      {/* Widget Configuration Panel */}
      {showConfigPanel && (
        <WidgetConfigPanel
          widgetId={editingWidgetId}
          isNewWidget={!editingWidgetId}
          onClose={() => setShowConfigPanel(false)}
        />
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Widgets will be rendered here */}
      </div>
    </div>
  );
};

// =============================================================================
// EXAMPLE 2: Edit Widget Configuration
// =============================================================================

export const WidgetWithEditButton = ({ widgetId }) => {
  const [showConfig, setShowConfig] = useState(false);
  const widget = useSelector(state =>
    state.widgets.widgets.find(w => w.id === widgetId)
  );

  return (
    <div className="widget-container">
      {/* Widget Header with Edit Button */}
      <div className="widget-header flex justify-between items-center">
        <h3>{widget.title}</h3>
        <button
          onClick={() => setShowConfig(true)}
          className="p-2 hover:bg-gray-200 rounded"
          title="Configure Widget"
        >
          ⚙️
        </button>
      </div>

      {/* Widget Content */}
      <div className="widget-content">
        {/* Widget data display */}
      </div>

      {/* Configuration Panel */}
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

// =============================================================================
// EXAMPLE 3: Toolbar with Add Widget Options
// =============================================================================

export const DashboardToolbar = () => {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [preselectedType, setPreselectedType] = useState(null);

  const widgetTemplates = [
    { type: 'finance-card', label: 'Finance Card', icon: '💳' },
    { type: 'stock-table', label: 'Stock Table', icon: '📊' },
    { type: 'line-chart', label: 'Line Chart', icon: '📈' },
    { type: 'candlestick-chart', label: 'Candlestick', icon: '📉' },
    { type: 'watchlist', label: 'Watchlist', icon: '👁️' }
  ];

  return (
    <div className="toolbar bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="flex gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          Add Widget:
        </span>
        {widgetTemplates.map(template => (
          <button
            key={template.type}
            onClick={() => {
              setPreselectedType(template.type);
              setShowConfigPanel(true);
            }}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2 text-sm"
          >
            <span>{template.icon}</span>
            <span>{template.label}</span>
          </button>
        ))}
      </div>

      {showConfigPanel && (
        <WidgetConfigPanel
          widgetId={null}
          isNewWidget={true}
          onClose={() => {
            setShowConfigPanel(false);
            setPreselectedType(null);
          }}
          initialType={preselectedType}
        />
      )}
    </div>
  );
};

// =============================================================================
// EXAMPLE 4: Context Menu for Widget Actions
// =============================================================================

export const WidgetContextMenu = ({ widgetId, onClose }) => {
  const [showConfig, setShowConfig] = useState(false);

  const handleEdit = () => {
    setShowConfig(true);
    onClose();
  };

  return (
    <>
      <div className="context-menu bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 min-w-[150px]">
        <button
          onClick={handleEdit}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <span>⚙️</span>
          <span>Configure</span>
        </button>
        <button
          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
        <button
          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 text-red-500"
        >
          <span>🗑️</span>
          <span>Delete</span>
        </button>
      </div>

      {showConfig && (
        <WidgetConfigPanel
          widgetId={widgetId}
          isNewWidget={false}
          onClose={() => setShowConfig(false)}
        />
      )}
    </>
  );
};

// =============================================================================
// EXAMPLE 5: Keyboard Shortcut Integration
// =============================================================================

export const DashboardWithKeyboardShortcuts = () => {
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+N or Cmd+N to add new widget
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowConfigPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="dashboard">
      {/* Dashboard content */}
      
      {showConfigPanel && (
        <WidgetConfigPanel
          widgetId={null}
          isNewWidget={true}
          onClose={() => setShowConfigPanel(false)}
        />
      )}
    </div>
  );
};

// =============================================================================
// EXAMPLE 6: Widget Gallery with Quick Add
// =============================================================================

export const WidgetGallery = ({ onAdd }) => {
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  const widgetTypes = [
    {
      type: 'finance-card',
      name: 'Finance Card',
      icon: '💳',
      description: 'Display key financial metrics',
      preview: '/previews/finance-card.png'
    },
    {
      type: 'stock-table',
      name: 'Stock Table',
      icon: '📊',
      description: 'Tabular view of multiple stocks',
      preview: '/previews/stock-table.png'
    },
    {
      type: 'line-chart',
      name: 'Line Chart',
      icon: '📈',
      description: 'Price movement over time',
      preview: '/previews/line-chart.png'
    },
    {
      type: 'candlestick-chart',
      name: 'Candlestick Chart',
      icon: '📉',
      description: 'OHLC price visualization',
      preview: '/previews/candlestick.png'
    },
    {
      type: 'watchlist',
      name: 'Watchlist',
      icon: '👁️',
      description: 'Monitor multiple stocks',
      preview: '/previews/watchlist.png'
    }
  ];

  const handleSelect = (widget) => {
    setSelectedWidget(widget);
    setShowConfig(true);
  };

  return (
    <>
      <div className="widget-gallery grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {widgetTypes.map(widget => (
          <div
            key={widget.type}
            className="widget-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleSelect(widget)}
          >
            <div className="p-6">
              <div className="text-4xl mb-3">{widget.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {widget.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {widget.description}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4">
              <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Add to Dashboard
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfig && selectedWidget && (
        <WidgetConfigPanel
          widgetId={null}
          isNewWidget={true}
          onClose={() => {
            setShowConfig(false);
            setSelectedWidget(null);
          }}
          initialType={selectedWidget.type}
        />
      )}
    </>
  );
};

// =============================================================================
// EXAMPLE 7: Complete Dashboard Integration
// =============================================================================

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateLayout } from '../state/dashboardSlice';
import DashboardGrid from '../components/DashboardGrid';

export const CompleteDashboard = () => {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const widgets = useSelector(state => state.widgets.widgets);
  const dispatch = useDispatch();

  const handleAddWidget = () => {
    setEditingWidgetId(null);
    setShowConfigPanel(true);
  };

  const handleEditWidget = (widgetId) => {
    setEditingWidgetId(widgetId);
    setShowConfigPanel(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            FinBoard Dashboard
          </h1>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isEditMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isEditMode ? '✓ Done' : '✏️ Edit'}
            </button>
            
            <button
              onClick={handleAddWidget}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + Add Widget
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {widgets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Widgets Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your dashboard by adding widgets
            </p>
            <button
              onClick={handleAddWidget}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
            >
              Add Your First Widget
            </button>
          </div>
        ) : (
          <DashboardGrid
            isEditMode={isEditMode}
            onEditWidget={handleEditWidget}
          />
        )}
      </div>

      {/* Widget Configuration Panel */}
      {showConfigPanel && (
        <WidgetConfigPanel
          widgetId={editingWidgetId}
          isNewWidget={!editingWidgetId}
          onClose={() => {
            setShowConfigPanel(false);
            setEditingWidgetId(null);
          }}
        />
      )}

      {/* Floating Action Button (mobile) */}
      <button
        onClick={handleAddWidget}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center text-2xl lg:hidden"
      >
        +
      </button>
    </div>
  );
};

// =============================================================================
// USAGE TIPS
// =============================================================================

/*
1. **Basic Integration**
   - Import WidgetConfigPanel component
   - Add a button/trigger to show the panel
   - Pass widgetId (for edit) or null (for new)
   - Set isNewWidget flag appropriately

2. **State Management**
   - Panel automatically dispatches to Redux
   - addWidget for new widgets
   - updateWidget for existing widgets
   - No manual state sync needed

3. **Field Mapping**
   - Fetch preview data first
   - Click "Configure Fields" button
   - JsonFieldExplorer shows automatically
   - Select fields from JSON tree
   - Configure labels and formats
   - Preview formatted values

4. **API Configuration**
   - Select provider (Finnhub/Alpha Vantage)
   - Choose endpoint from dropdown
   - Enter required parameters (symbol, interval)
   - Set refresh interval
   - Configure cache TTL

5. **Validation**
   - Required fields are validated
   - Error messages shown inline
   - Save button enabled when valid
   - Real-time validation on field change

6. **Styling**
   - Fully responsive design
   - Dark mode support
   - Tailwind CSS classes
   - Customizable via CSS

7. **Keyboard Shortcuts**
   - Escape to close panel
   - Enter to save (when valid)
   - Tab navigation supported

8. **Accessibility**
   - Semantic HTML
   - ARIA labels (can be added)
   - Keyboard navigation
   - Screen reader friendly
*/

export default {
  DashboardWithAddWidget,
  WidgetWithEditButton,
  DashboardToolbar,
  WidgetContextMenu,
  DashboardWithKeyboardShortcuts,
  WidgetGallery,
  CompleteDashboard
};
