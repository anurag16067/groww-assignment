/**
 * Performance Monitoring Utilities
 * Tools for measuring and optimizing React component performance
 */

import { useRef, useEffect } from 'react';

/**
 * Measure component render time
 * Usage: Add to component useEffect
 */
export const measureRenderTime = (componentName) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 16.67) { // Slower than 60fps
      console.warn(
        `⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`
      );
    } else if (import.meta.env.DEV) {
      console.log(
        `✓ ${componentName} rendered in ${duration.toFixed(2)}ms`
      );
    }
  };
};

/**
 * Track component re-renders
 * Helps identify unnecessary re-renders
 */
export class RenderCounter {
  constructor(componentName) {
    this.componentName = componentName;
    this.count = 0;
    this.reasons = {};
  }

  increment(reason = 'unknown') {
    this.count++;
    this.reasons[reason] = (this.reasons[reason] || 0) + 1;
    
    if (this.count % 10 === 0) {
      console.warn(
        `⚠️ ${this.componentName} has rendered ${this.count} times`,
        this.reasons
      );
    }
  }

  reset() {
    this.count = 0;
    this.reasons = {};
  }

  getStats() {
    return {
      component: this.componentName,
      totalRenders: this.count,
      reasons: this.reasons,
    };
  }
}

/**
 * Hook to track why a component re-rendered
 * Usage: useWhyDidYouUpdate('ComponentName', props);
 */
export const useWhyDidYouUpdate = (name, props) => {
  const previousProps = useRef();

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }

    previousProps.current = props;
  });
};

/**
 * Detect slow renders and log warnings
 */
export const withPerformanceTracking = (Component, threshold = 16) => {
  return function PerformanceTrackedComponent(props) {
    const startTime = useRef(performance.now());

    useEffect(() => {
      const renderTime = performance.now() - startTime.current;
      
      if (renderTime > threshold) {
        console.warn(
          `Slow render detected in ${Component.displayName || Component.name}:`,
          `${renderTime.toFixed(2)}ms`
        );
      }
    });

    return <Component {...props} />;
  };
};

/**
 * Performance metrics aggregator
 */
export class PerformanceMetrics {
  constructor() {
    this.metrics = {
      renders: {},
      apiCalls: {},
      stateUpdates: {},
    };
  }

  recordRender(componentName, duration) {
    if (!this.metrics.renders[componentName]) {
      this.metrics.renders[componentName] = {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        maxTime: 0,
      };
    }

    const metric = this.metrics.renders[componentName];
    metric.count++;
    metric.totalTime += duration;
    metric.avgTime = metric.totalTime / metric.count;
    metric.maxTime = Math.max(metric.maxTime, duration);
  }

  recordApiCall(endpoint, duration, success = true) {
    if (!this.metrics.apiCalls[endpoint]) {
      this.metrics.apiCalls[endpoint] = {
        count: 0,
        successCount: 0,
        failureCount: 0,
        totalTime: 0,
        avgTime: 0,
      };
    }

    const metric = this.metrics.apiCalls[endpoint];
    metric.count++;
    if (success) metric.successCount++;
    else metric.failureCount++;
    metric.totalTime += duration;
    metric.avgTime = metric.totalTime / metric.count;
  }

  recordStateUpdate(action, duration) {
    if (!this.metrics.stateUpdates[action]) {
      this.metrics.stateUpdates[action] = {
        count: 0,
        totalTime: 0,
        avgTime: 0,
      };
    }

    const metric = this.metrics.stateUpdates[action];
    metric.count++;
    metric.totalTime += duration;
    metric.avgTime = metric.totalTime / metric.count;
  }

  getReport() {
    return {
      ...this.metrics,
      summary: {
        totalRenders: Object.values(this.metrics.renders).reduce(
          (sum, m) => sum + m.count,
          0
        ),
        totalApiCalls: Object.values(this.metrics.apiCalls).reduce(
          (sum, m) => sum + m.count,
          0
        ),
        totalStateUpdates: Object.values(this.metrics.stateUpdates).reduce(
          (sum, m) => sum + m.count,
          0
        ),
      },
    };
  }

  reset() {
    this.metrics = {
      renders: {},
      apiCalls: {},
      stateUpdates: {},
    };
  }

  logReport() {
    console.table(this.getReport());
  }
}

// Global performance metrics instance
export const performanceMetrics = new PerformanceMetrics();

/**
 * React Profiler callback
 * Use with <Profiler id="componentName" onRender={onRenderCallback}>
 */
export const onRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) => {
  if (actualDuration > 16) {
    console.warn(
      `Slow ${phase} in ${id}:`,
      `${actualDuration.toFixed(2)}ms`,
      { baseDuration, startTime, commitTime, interactions }
    );
  }

  performanceMetrics.recordRender(id, actualDuration);
};

/**
 * Bundle size analyzer helper
 */
export const analyzeBundleSize = async () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource');
    const scripts = resources.filter((r) => r.name.includes('.js'));
    
    const analysis = {
      totalSize: 0,
      chunks: [],
    };

    scripts.forEach((script) => {
      const size = script.transferSize || script.encodedBodySize || 0;
      analysis.totalSize += size;
      analysis.chunks.push({
        name: script.name.split('/').pop(),
        size: size,
        sizeMB: (size / 1024 / 1024).toFixed(2),
      });
    });

    analysis.totalSizeMB = (analysis.totalSize / 1024 / 1024).toFixed(2);
    
    console.log('Bundle Size Analysis:', analysis);
    return analysis;
  }

  return null;
};

/**
 * Memory usage tracker
 */
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    return {
      usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB',
    };
  }
  return null;
};

/**
 * Log performance summary
 */
export const logPerformanceSummary = () => {
  console.group('📊 Performance Summary');
  
  // Render metrics
  performanceMetrics.logReport();
  
  // Memory usage
  const memory = trackMemoryUsage();
  if (memory) {
    console.log('Memory Usage:', memory);
  }
  
  // Bundle size
  analyzeBundleSize();
  
  console.groupEnd();
};

// Expose to window for debugging in development
if (import.meta.env.DEV) {
  window.performanceMetrics = performanceMetrics;
  window.logPerformanceSummary = logPerformanceSummary;
  window.trackMemoryUsage = trackMemoryUsage;
}

export default {
  measureRenderTime,
  RenderCounter,
  useWhyDidYouUpdate,
  withPerformanceTracking,
  PerformanceMetrics,
  performanceMetrics,
  onRenderCallback,
  analyzeBundleSize,
  trackMemoryUsage,
  logPerformanceSummary,
};
