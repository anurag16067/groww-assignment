import { useCallback, useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { updateLayout } from '../state/dashboardSlice';
import { selectAllWidgets } from '../state/selectors';
import { selectLayout, selectIsEditMode } from '../state/selectors';
import WidgetContainer from './WidgetContainer.optimized';
import WidgetFactory from './widgets/WidgetFactory.optimized';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * DashboardGrid - Optimized main grid layout component
 * - Uses memoization to prevent unnecessary re-renders
 * - Implements virtualization-ready structure
 * - Optimized layout calculations
 */
const DashboardGrid = memo(() => {
  const dispatch = useDispatch();
  const widgets = useSelector(selectAllWidgets);
  const layout = useSelector(selectLayout);
  const isEditMode = useSelector(selectIsEditMode);

  // Grid configuration - memoized to prevent recreation
  const gridConfig = useMemo(
    () => ({
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      rowHeight: 100,
      margin: [16, 16],
      containerPadding: [16, 16],
    }),
    []
  );

  // Generate layout from widgets if no layout exists - memoized
  const currentLayout = useMemo(() => {
    if (layout && layout.length > 0) {
      return layout;
    }

    // Generate default layout for new widgets
    return widgets.map((widget, index) => ({
      i: widget.id,
      x: (index * 4) % 12,
      y: Math.floor(index / 3) * 3,
      w: 4,
      h: 3,
      minW: 2,
      minH: 2,
    }));
  }, [widgets, layout]);

  // Memoize layout change handler
  const handleLayoutChange = useCallback((newLayout) => {
    // Only update if in edit mode and layout actually changed
    if (isEditMode && newLayout && newLayout.length > 0) {
      dispatch(updateLayout(newLayout));
    }
  }, [dispatch, isEditMode]);

  // Memoize the render of individual grid items
  const renderGridItems = useMemo(() => {
    return widgets.map((widget) => (
      <div key={widget.id} className="relative">
        <WidgetContainer widget={widget} isEditMode={isEditMode}>
          <WidgetFactory widget={widget} />
        </WidgetContainer>
      </div>
    ));
  }, [widgets, isEditMode]);

  // Empty state
  if (widgets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Widgets Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add your first widget to get started
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Click the &ldquo;Add Widget&rdquo; button in the header
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <ResponsiveGridLayout
        {...gridConfig}
        layouts={{ lg: currentLayout }}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms={true}
      >
        {renderGridItems}
      </ResponsiveGridLayout>
    </div>
  );
});

DashboardGrid.displayName = 'DashboardGrid';

export default DashboardGrid;
