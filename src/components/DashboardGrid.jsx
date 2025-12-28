import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { updateLayout } from '../state/dashboardSlice';
import { selectAllWidgets } from '../state/widgetsSlice';
import { selectLayout, selectIsEditMode } from '../state/dashboardSlice';
import WidgetContainer from './WidgetContainer';
import WidgetFactory from './widgets/WidgetFactory';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * DashboardGrid - Main grid layout component using react-grid-layout
 * Handles drag and drop, resizing, and responsive layouts
 */
const DashboardGrid = () => {
  const dispatch = useDispatch();
  const widgets = useSelector(selectAllWidgets);
  const layout = useSelector(selectLayout);
  const isEditMode = useSelector(selectIsEditMode);

  // Grid configuration
  const gridConfig = useMemo(
    () => ({
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      rowHeight: 120,
      margin: [16, 16],
      containerPadding: [16, 16],
    }),
    []
  );

  // Generate layout from widgets if no layout exists
  const currentLayout = useMemo(() => {
    if (layout && layout.length > 0) {
      return layout;
    }

    // Generate default layout for new widgets
    return widgets.map((widget, index) => ({
      i: widget.id,
      x: (index * 6) % 12,
      y: Math.floor(index / 2) * 4,
      w: 6,
      h: 4,
      minW: 3,
      minH: 3,
    }));
  }, [widgets, layout]);

  // Sync layout when widgets change
  useEffect(() => {
    if (widgets.length > 0 && layout.length === 0) {
      const defaultLayout = widgets.map((widget, index) => ({
        i: widget.id,
        x: (index * 6) % 12,
        y: Math.floor(index / 2) * 4,
        w: 6,
        h: 4,
        minW: 3,
        minH: 3,
      }));
      dispatch(updateLayout(defaultLayout));
    }
  }, [widgets, layout, dispatch]);

  // Handle layout changes (drag/resize)
  const handleLayoutChange = (newLayout) => {
    // Only update if layout actually changed
    if (JSON.stringify(newLayout) !== JSON.stringify(currentLayout)) {
      dispatch(updateLayout(newLayout));
    }
  };

  if (widgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No widgets yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your first widget to start building your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: currentLayout }}
        breakpoints={gridConfig.breakpoints}
        cols={gridConfig.cols}
        rowHeight={gridConfig.rowHeight}
        margin={gridConfig.margin}
        containerPadding={gridConfig.containerPadding}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        draggableHandle=".widget-drag-handle"
        compactType="vertical"
        preventCollision={false}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="widget-item">
            <WidgetContainer widget={widget} isEditMode={isEditMode}>
              {/* Use WidgetFactory to render the appropriate widget */}
              <WidgetFactory widget={widget} />
            </WidgetContainer>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardGrid;
