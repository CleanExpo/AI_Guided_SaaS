import React from 'react';

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="glass-sidebar h-48 rounded-xl-lg mb-4"></div>
      <div className="h-4 glass-sidebar rounded-lg w-3/4 mb-2"></div>
      <div className="h-4 glass-sidebar rounded-lg w-1/2"></div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 glass-sidebar rounded-lg"
          style={ width: `${Math.random() * 40 + 60}%` }
        />
      ))}
    </div>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div
      data-testid="loading-spinner"
      className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass p-6 rounded-xl-lg shadow-md-xl flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-700">{message}</p>
      </div>
    </div>
  );
}
