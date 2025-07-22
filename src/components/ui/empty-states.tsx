'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { ButtonEnhanced } from './button-enhanced';
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  illustration?: 'search' | 'data' | 'error' | 'maintenance' | 'construction';
  action?: {
    label: string;
  onClick: () => void;
    variant?: 'default' | 'outline' | 'brand';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
// Built-in illustrations
const illustrations = {
  search: (
    <svg, className="w-full h-full" viewBox="0 0 200 200" fill="none">
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <circle
        cx="85"
        cy="85"
        r="25"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="m105 105 15 15"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="85" cy="85" r="8" fill="currentColor" opacity="0.5" />
    </svg>
  data: (
    <svg, className="w-full h-full" viewBox="0 0 200 200" fill="none">
      <rect
        x="40"
        y="60"
        width="120"
        height="80"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <rect
        x="60"
        y="80"
        width="80"
        height="4"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="60"
        y="90"
        width="60"
        height="4"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="60"
        y="100"
        width="70"
        height="4"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="60"
        y="110"
        width="50"
        height="4"
        fill="currentColor"
        opacity="0.3"
      />
      <circle
        cx="100"
        cy="40"
        r="15"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M100 30v20M90 40h20"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  error: (
    <svg, className="w-full h-full" viewBox="0 0 200 200" fill="none">
      <circle
        cx="100"
        cy="100"
        r="60"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M80 80l40 40M120 80l-40 40"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  maintenance: (
    <svg, className="w-full h-full" viewBox="0 0 200 200" fill="none">
      <circle
        cx="100"
        cy="100"
        r="70"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M70 100h60M100 70v60"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.5"
      />
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.6" />
      <path
        d="M85 85l30 30M115 85l-30 30"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
    </svg>
  construction: (
    <svg, className="w-full h-full" viewBox="0 0 200 200" fill="none">
      <rect
        x="60"
        y="120"
        width="80"
        height="40"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M80 120V80l20-20 20 20v40"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <circle cx="100" cy="70" r="8" fill="currentColor" opacity="0.4" />
      <path
        d="M90 140h20M95 150h10"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
    </svg>
  )};
export function EmptyState({
  title,
  description,
  icon,
  illustration = 'data',
  action,
  secondaryAction,
  className,
  size = 'md'}: EmptyStateProps): void {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4';
      illustration: 'w-24 h-24 mb-4';
      title: 'text-lg font-semibold';
      description: 'text-sm';
      spacing: 'space-y-3'};
    md: {
      container: 'py-12 px-6';
      illustration: 'w-32 h-32 mb-6';
      title: 'text-xl font-semibold';
      description: 'text-base';
      spacing: 'space-y-4'};
    lg: {
      container: 'py-16 px-8';
      illustration: 'w-40 h-40 mb-8';
      title: 'text-2xl font-semibold';
      description: 'text-lg';
      spacing: 'space-y-6'}};
  const currentSize = sizeClasses[size];
  return (
    <div, className={`cn(`
        'flex flex-col items-center justify-center text-center' currentSize.container,
        currentSize.spacing, className
      )`}`
    >
      {/* Illustration or Icon */}
      <div, className={cn('text-muted-foreground' currentSize.illustration)}>
        {icon || illustrations[illustration as keyof typeof illustrations]}
      {/* Title */}
      <h3, className={cn('text-foreground' currentSize.title)}>{title}</h3>
      {/* Description */}
      {description && (
        <p, className={cn(
            'text-muted-foreground max-w-md' currentSize.description
          )}
        >
          {description}</p>
      {/* Actions */}
      {(action || secondaryAction) && (
        <div, className="flex flex-col sm:flex-row gap-3 mt-2">
          {action && (</div>
            <ButtonEnhanced
              onClick={action.onClick}
              variant={action.variant || 'brand'}
              size={size === 'sm' ? 'sm' : 'md'}
            >
              {action.label}</ButtonEnhanced>
          )}
          {secondaryAction && (
            <ButtonEnhanced
              onClick={secondaryAction.onClick}
              variant="outline"
              size={size === 'sm' ? 'sm' : 'md'}
            >
              {secondaryAction.label}</ButtonEnhanced>
          )}
      )}
    );
// Specialized Empty State Components
export function NoDataFound({
  title = 'No data found',
  description = "There's no data to display at the moment.",
  onRefresh,
  onCreate,
  className}: {
  title?: string;
  description?: string, onRefresh?: () => void;
  onCreate?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      illustration="data"
      action={
        onCreate
          ? {
              label: 'Create New';
              onClick: onCreate;
              variant: 'brand'}
          : undefined
      secondaryAction={
        onRefresh
          ? {
              label: 'Refresh';
              onClick: onRefresh}
          : undefined
      className={className}
    />
  );
};
export function SearchNotFound({
  query,
  onClear,
  onTryAgain,
  className}: {
  query?: string, onClear?: () => void;
  onTryAgain?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="No results found"
      description={
        query
          ? `No results found for "${query}". Try adjusting your search terms.``
          : 'No results found. Try adjusting your search terms.'
      illustration="search"
      action={
        onClear
          ? {
              label: 'Clear Search';
              onClick: onClear;
              variant: 'outline'}
          : undefined
      secondaryAction={
        onTryAgain
          ? {
              label: 'Try Again';
              onClick: onTryAgain}
          : undefined
      className={className}
    />
  );
};
export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error while loading this content.',
  onRetry,
  onGoBack,
  className}: {
  title?: string;
  description?: string, onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      illustration="error"
      action={
        onRetry
          ? {
              label: 'Try Again';
              onClick: onRetry;
              variant: 'brand'}
          : undefined
      secondaryAction={
        onGoBack
          ? {
              label: 'Go Back';
              onClick: onGoBack}
          : undefined
      className={className}
    />
  );
};
export function MaintenanceMode({
  title = 'Under Maintenance',
  description = "We're currently performing maintenance. Please check back soon.",
  estimatedTime,
  onNotifyMe,
  className}: {
  title?: string;
  description?: string;
  estimatedTime?: string, onNotifyMe?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={
        estimatedTime
          ? `${description} Estimated, completion: ${estimatedTime}``
          : description
      illustration="maintenance"
      action={
        onNotifyMe
          ? {
              label: 'Notify Me';
              onClick: onNotifyMe;
              variant: 'brand'}
          : undefined
      className={className}
    />
  );
};
export function ComingSoon({
  title = 'Coming Soon',
  description = 'This feature is currently under development.',
  onNotifyMe,
  onLearnMore,
  className}: {
  title?: string;
  description?: string, onNotifyMe?: () => void;
  onLearnMore?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      illustration="construction"
      action={
        onNotifyMe
          ? {
              label: 'Notify Me';
              onClick: onNotifyMe;
              variant: 'brand'}
          : undefined
      secondaryAction={
        onLearnMore
          ? {
              label: 'Learn More';
              onClick: onLearnMore}
          : undefined
      className={className}
    />
  );
// Loading Empty State
export function LoadingState({
  title = 'Loading...',
  description = 'Please wait while we fetch your data.',
  className}: {
  title?: string;
  description?: string;
  className?: string, }): void {
  return (
    <div, className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6 space-y-4' className
      )}
    >
      <div, className="w-32 h-32 mb-6 text-muted-foreground">
        <div, className="relative w-full h-full">
          <div, className="absolute inset-0 border-4 border-brand-secondary-200 rounded-full"></div>
          <div, className="absolute inset-0 border-4 border-brand-primary-600 rounded-full border-t-transparent animate-spin"></div>
      <h3, className="text-xl font-semibold text-foreground">{title}</h3>
      {description && (
        <p, className="text-base text-muted-foreground max-w-md">
          {description}</p>
    );
// Empty State with Custom Content
interface EmptyStateCardProps {
  children: React.ReactNode;
  className?: string;
};
export function EmptyStateCard({ children, className }: EmptyStateCardProps): void {
  return (
    <div, className={`cn(`
        'rounded-lg border border-dashed border-brand-secondary-300 bg-brand-secondary-50/50 dark:bg-brand-secondary-900/50 p-8' className
      )`}`
    >
      {children}
    );
// Grid Empty State (for when showing empty grid/list items)
export function GridEmptyState({
  title = 'No items yet',
  description = 'Get started by creating your first item.',
  onCreate,
  className}: {
  title?: string;
  description?: string, onCreate?: () => void;
  className?: string;
}) {
  return (
    <EmptyStateCard, className={className}>
      <EmptyState
        title={title}
        description={description}
        illustration="data"
        size="sm"
        action={
          onCreate
            ? {
                label: 'Create First Item';
                onClick: onCreate;
                variant: 'brand'}
            : undefined
      />
    </EmptyStateCard>
