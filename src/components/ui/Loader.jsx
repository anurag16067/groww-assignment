/**
 * Loader Component
 * 
 * Reusable loading spinner with different sizes and variants
 */

import React from 'react';

const Loader = ({ 
  size = 'md', 
  variant = 'spinner',
  text = 'Loading...',
  showText = true,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  // Spinner loader
  const SpinnerLoader = () => (
    <div className={`${sizeClasses[size]} border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin`} />
  );

  // Dots loader
  const DotsLoader = () => (
    <div className="flex space-x-2">
      <div className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : size === 'xl' ? 'w-5 h-5' : 'w-3 h-3'} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : size === 'xl' ? 'w-5 h-5' : 'w-3 h-3'} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : size === 'xl' ? 'w-5 h-5' : 'w-3 h-3'} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  // Pulse loader
  const PulseLoader = () => (
    <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`} />
  );

  // Bars loader
  const BarsLoader = () => (
    <div className="flex space-x-1 items-end">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`${size === 'sm' ? 'w-1' : size === 'lg' ? 'w-2' : size === 'xl' ? 'w-3' : 'w-1.5'} bg-blue-500 rounded-sm animate-pulse`}
          style={{ 
            height: `${size === 'sm' ? 12 : size === 'lg' ? 24 : size === 'xl' ? 32 : 16}px`,
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const loaderVariants = {
    spinner: <SpinnerLoader />,
    dots: <DotsLoader />,
    pulse: <PulseLoader />,
    bars: <BarsLoader />
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {loaderVariants[variant] || loaderVariants.spinner}
      {showText && (
        <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Inline loader for buttons
export const InlineLoader = ({ size = 'sm', className = '' }) => (
  <div className={`inline-block ${className}`}>
    <div className={`${size === 'sm' ? 'w-4 h-4 border-2' : 'w-5 h-5 border-2'} border-white/30 border-t-white rounded-full animate-spin`} />
  </div>
);

// Skeleton loader for content
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  avatar = false,
  height = 'h-4'
}) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {avatar && (
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    )}
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`${height} bg-gray-300 dark:bg-gray-700 rounded`}
        style={{ width: i === lines - 1 ? '80%' : '100%' }}
      />
    ))}
  </div>
);

// Card skeleton loader
export const CardSkeleton = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-pulse ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32" />
      </div>
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
    <div className="space-y-3">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {/* Header */}
    <div className="flex gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="flex gap-4 py-3">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <div key={colIdx} className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default Loader;
