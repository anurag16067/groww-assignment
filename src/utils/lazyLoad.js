import { lazy, Suspense, memo } from 'react';
import { Loader } from '../components/ui';

/**
 * Lazy-loaded route components for code splitting
 * Routes are only loaded when navigated to
 */

// Lazy load all demo/example pages
export const DashboardPersistenceDemo = lazy(() => 
  import('../examples/DashboardPersistenceDemo')
);

export const UIStatesDemo = lazy(() => 
  import('../examples/UIStatesDemo')
);

// Lazy load large modal/panel components
export const DashboardImportExport = lazy(() => 
  import('../components/DashboardImportExport')
);

export const WidgetConfigPanel = lazy(() => 
  import('../components/WidgetConfigPanel')
);

export const JsonFieldExplorer = lazy(() => 
  import('../components/JsonFieldExplorer')
);

/**
 * HOC to wrap lazy-loaded components with Suspense
 * Provides a consistent loading experience
 */
export const withLazyLoad = (Component, fallbackText = 'Loading...') => {
  const LazyLoadWrapper = memo((props) => (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <Loader size="lg" text={fallbackText} />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  ));
  
  LazyLoadWrapper.displayName = `withLazyLoad(${Component.displayName || Component.name || 'Component'})`;
  
  return LazyLoadWrapper;
};

/**
 * HOC for lazy loading modals/dialogs
 * Provides a lighter fallback for modal content
 */
export const withModalLazyLoad = (Component) => {
  const ModalLazyLoadWrapper = memo((props) => (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader size="md" text="Loading..." />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  ));
  
  ModalLazyLoadWrapper.displayName = `withModalLazyLoad(${Component.displayName || Component.name || 'Component'})`;
  
  return ModalLazyLoadWrapper;
};

/**
 * Preload a lazy component
 * Useful for preloading components that will likely be needed
 */
export const preloadComponent = (lazyComponent) => {
  // Trigger the lazy load without rendering
  lazyComponent._payload._result || lazyComponent._payload._fn();
};

/**
 * Route configuration with lazy loading
 */
export const routes = {
  dashboard: {
    path: '/',
    component: null, // Main dashboard is not lazy loaded
    exact: true,
  },
  persistenceDemo: {
    path: '/demo/persistence',
    component: withLazyLoad(DashboardPersistenceDemo, 'Loading demo...'),
    exact: true,
  },
  uiStatesDemo: {
    path: '/demo/ui-states',
    component: withLazyLoad(UIStatesDemo, 'Loading demo...'),
    exact: true,
  },
};

export default {
  DashboardPersistenceDemo,
  UIStatesDemo,
  DashboardImportExport,
  WidgetConfigPanel,
  JsonFieldExplorer,
  withLazyLoad,
  withModalLazyLoad,
  preloadComponent,
  routes,
};
