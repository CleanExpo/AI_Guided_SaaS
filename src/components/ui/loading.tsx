'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'wave' | 'brand';
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const colorClasses = {
  primary: 'text-brand-primary-600',
  secondary: 'text-brand-secondary-600',
  accent: 'text-brand-primary-500',
  muted: 'text-muted-foreground',
};

// Spinner Loading Component
export function Spinner({
  size = 'md',
  className,
  color = 'primary',
}: LoadingProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Dots Loading Component
export function LoadingDots({
  size = 'md',
  className,
  color = 'primary',
}: LoadingProps) {
  const dotSize = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div
      className={cn('flex space-x-1', className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            dotSize[size],
            colorClasses[color],
            'bg-current'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Pulse Loading Component
export function LoadingPulse({
  size = 'md',
  className,
  color = 'primary',
}: LoadingProps) {
  return (
    <div
      className={cn(
        'rounded-full animate-pulse-slow bg-current opacity-75',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Skeleton Loading Component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses =
    'animate-pulse bg-brand-secondary-200 dark:bg-brand-secondary-700';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    rounded: 'rounded-lg',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variantClasses.text,
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{ width: i === lines - 1 ? '75%' : width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Wave Loading Component
export function LoadingWave({
  size = 'md',
  className,
  color = 'primary',
}: LoadingProps) {
  const barHeight = {
    xs: 'h-2',
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
    xl: 'h-8',
  };

  return (
    <div
      className={cn('flex items-end space-x-1', className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={cn(
            'w-1 bg-current animate-bounce-subtle',
            barHeight[size],
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Brand Loading Component with Logo
export function BrandLoader({ size = 'md', className }: LoadingProps) {
  return (
    <div
      className={cn('flex flex-col items-center space-y-4', className)}
      role="status"
      aria-label="Loading"
    >
      <div className={cn('relative', sizeClasses[size])}>
        {/* Brand Logo with Animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-primary-600 to-brand-primary-800 animate-pulse-slow" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-primary-700 flex items-center justify-center">
          <span className="text-white font-bold text-xs">AGS</span>
        </div>
        {/* Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-primary-400 animate-spin" />
      </div>
      <div className="text-sm text-brand-secondary-600 animate-pulse">
        Loading AI Guided SaaS...
      </div>
      <span className="sr-only">Loading AI Guided SaaS Platform...</span>
    </div>
  );
}

// Card Skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border rounded-lg space-y-4', className)}>
      <Skeleton variant="rectangular" height="20px" width="60%" />
      <Skeleton variant="text" lines={3} />
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" height="32px" width="80px" />
        <Skeleton variant="rectangular" height="32px" width="80px" />
      </div>
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height="20px"
            className="flex-1"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="rectangular"
              height="16px"
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Page Loading Component
export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn('min-h-screen flex items-center justify-center', className)}
    >
      <BrandLoader size="xl" />
    </div>
  );
}

// Button Loading State
interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function ButtonLoading({
  loading = false,
  children,
  className,
  disabled,
  size = 'sm',
  ...props
}: ButtonLoadingProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center',
        loading && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size={size} color="primary" />
        </div>
      )}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
    </button>
  );
}

// Progress Bar Loading
interface ProgressLoadingProps {
  progress?: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressLoading({
  progress = 0,
  className,
  showPercentage = false,
  color = 'primary',
  size = 'md',
}: ProgressLoadingProps) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const progressColorClasses = {
    primary: 'bg-brand-primary-600',
    secondary: 'bg-brand-secondary-600',
    accent: 'bg-brand-primary-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-brand-secondary-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-brand-secondary-200 rounded-full overflow-hidden',
          heightClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            progressColorClasses[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// Shimmer Effect
export function ShimmerEffect({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-brand-secondary-100 dark:bg-brand-secondary-800',
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-shimmer-gradient" />
    </div>
  );
}

// Loading Container
interface LoadingContainerProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function LoadingContainer({
  loading,
  children,
  fallback,
  className,
}: LoadingContainerProps) {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        {fallback || <BrandLoader />}
      </div>
    );
  }

  return <>{children}</>;
}

// Main Loading Component (combines all variants)
export function Loading({ variant = 'spinner', ...props }: LoadingProps) {
  switch (variant) {
    case 'dots':
      return <LoadingDots {...props} />;
    case 'pulse':
      return <LoadingPulse {...props} />;
    case 'wave':
      return <LoadingWave {...props} />;
    case 'brand':
      return <BrandLoader {...props} />;
    case 'spinner':
    default:
      return <Spinner {...props} />;
  }
}
