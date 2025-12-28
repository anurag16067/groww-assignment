import { useState, useMemo, useCallback } from 'react';

/**
 * JsonFieldExplorer - Interactive JSON field selector with formatting options
 * 
 * Features:
 * - Visual JSON tree navigation
 * - Field selection with checkboxes
 * - Custom field labels
 * - Format options (currency, percentage, number, date, text)
 * - Nested object/array support
 * - Real-time preview
 */
const JsonFieldExplorer = ({ data, selectedFields = [], onSave, onClose }) => {
  const [fields, setFields] = useState(selectedFields);
  const [expandedPaths, setExpandedPaths] = useState(new Set());

  // Data format options
  const FORMAT_OPTIONS = [
    { value: 'auto', label: 'Auto', icon: '🔄' },
    { value: 'currency', label: 'Currency ($)', icon: '💵' },
    { value: 'percentage', label: 'Percentage (%)', icon: '📊' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'datetime', label: 'Date & Time', icon: '🕐' },
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'boolean', label: 'Yes/No', icon: '✅' }
  ];

  /**
   * Extract all paths from JSON data
   */
  const extractPaths = useCallback((obj, parentPath = '', result = []) => {
    if (obj === null || obj === undefined) {
      return result;
    }

    if (typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach(key => {
        const path = parentPath ? `${parentPath}.${key}` : key;
        const value = obj[key];
        const type = Array.isArray(value) ? 'array' : typeof value;

        result.push({
          path,
          key,
          value,
          type,
          parent: parentPath,
          hasChildren: typeof value === 'object' && value !== null
        });

        if (typeof value === 'object' && value !== null) {
          extractPaths(value, path, result);
        }
      });
    } else if (Array.isArray(obj) && obj.length > 0) {
      // For arrays, analyze first element
      extractPaths(obj[0], `${parentPath}[0]`, result);
    }

    return result;
  }, []);

  const allPaths = useMemo(() => {
    if (!data) return [];
    return extractPaths(data);
  }, [data, extractPaths]);

  /**
   * Toggle path expansion
   */
  const toggleExpand = (path) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  /**
   * Check if field is selected
   */
  const isFieldSelected = (path) => {
    return fields.some(f => f.path === path);
  };

  /**
   * Toggle field selection
   */
  const toggleFieldSelection = (pathInfo) => {
    const existing = fields.find(f => f.path === pathInfo.path);

    if (existing) {
      setFields(fields.filter(f => f.path !== pathInfo.path));
    } else {
      setFields([
        ...fields,
        {
          path: pathInfo.path,
          key: pathInfo.key,
          label: pathInfo.key,
          format: 'auto',
          type: pathInfo.type
        }
      ]);
    }
  };

  /**
   * Update field property
   */
  const updateField = (path, property, value) => {
    setFields(fields.map(f =>
      f.path === path ? { ...f, [property]: value } : f
    ));
  };

  /**
   * Format value for preview
   */
  const formatValue = (value, format) => {
    if (value === null || value === undefined) return 'N/A';

    switch (format) {
      case 'currency':
        return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
      case 'percentage':
        return typeof value === 'number' ? `${value.toFixed(2)}%` : value;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  };

  /**
   * Get suggested format based on value
   */
  const getSuggestedFormat = (value, key) => {
    if (typeof value === 'number') {
      const keyLower = key.toLowerCase();
      if (keyLower.includes('price') || keyLower.includes('cost')) {
        return 'currency';
      }
      if (keyLower.includes('percent') || keyLower.includes('change') && Math.abs(value) < 100) {
        return 'percentage';
      }
      return 'number';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return 'date';
    }
    return 'text';
  };

  /**
   * Render JSON tree node
   */
  const renderTreeNode = (pathInfo, level = 0) => {
    const isExpanded = expandedPaths.has(pathInfo.path);
    const isSelected = isFieldSelected(pathInfo.path);
    const hasChildren = pathInfo.hasChildren;
    const children = allPaths.filter(p => p.parent === pathInfo.path);

    return (
      <div key={pathInfo.path} className="select-none">
        <div
          className={`flex items-center py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isSelected ? 'bg-blue-50 dark:bg-blue-900' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => toggleExpand(pathInfo.path)}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}

          {/* Checkbox */}
          {!hasChildren && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleFieldSelection(pathInfo)}
              className="mr-2 cursor-pointer"
            />
          )}

          {/* Field Info */}
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                {pathInfo.key}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {pathInfo.type}
              </span>
            </div>

            {!hasChildren && (
              <span className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate max-w-xs">
                {String(pathInfo.value).substring(0, 50)}
                {String(pathInfo.value).length > 50 ? '...' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Expanded Children */}
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render selected field configuration
   */
  const renderFieldConfig = (field) => {
    const pathInfo = allPaths.find(p => p.path === field.path);
    const suggestedFormat = pathInfo ? getSuggestedFormat(pathInfo.value, pathInfo.key) : 'auto';

    return (
      <div
        key={field.path}
        className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg space-y-3"
      >
        {/* Field Path */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
            {field.path}
          </span>
          <button
            onClick={() => setFields(fields.filter(f => f.path !== field.path))}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>

        {/* Custom Label */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.path, 'label', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={field.key}
          />
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Format
            {field.format === 'auto' && suggestedFormat !== 'auto' && (
              <span className="ml-2 text-blue-500">
                (Suggests: {FORMAT_OPTIONS.find(f => f.value === suggestedFormat)?.label})
              </span>
            )}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FORMAT_OPTIONS.map(format => (
              <button
                key={format.value}
                onClick={() => updateField(field.path, 'format', format.value)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  field.format === format.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <span className="mr-1">{format.icon}</span>
                {format.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {pathInfo && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preview
            </label>
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
              <span className="font-medium">{field.label}:</span>{' '}
              <span className="text-gray-700 dark:text-gray-300">
                {formatValue(pathInfo.value, field.format === 'auto' ? suggestedFormat : field.format)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get root level paths
  const rootPaths = allPaths.filter(p => !p.parent || p.parent === '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Field Mapping Configuration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select fields from the data structure and configure their display format
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: JSON Tree Explorer */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Available Fields
            </h4>
            {!data ? (
              <div className="text-center text-gray-500 py-8">
                No data available. Fetch preview first.
              </div>
            ) : rootPaths.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No fields found in data structure.
              </div>
            ) : (
              <div className="space-y-1">
                {rootPaths.map(pathInfo => renderTreeNode(pathInfo, 0))}
              </div>
            )}
          </div>

          {/* Right: Selected Fields Configuration */}
          <div className="w-1/2 overflow-y-auto p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Selected Fields ({fields.length})
            </h4>
            {fields.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No fields selected. Check fields from the left panel.
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map(field => renderFieldConfig(field))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {fields.length} field{fields.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(fields)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Field Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFieldExplorer;
