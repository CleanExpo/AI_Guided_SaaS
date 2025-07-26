'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { StateIcon } from './StateIcon';
import { InputProps } from './types';
import { inputVariants, inputSizes, inputStates, baseInputClasses } from './styles';

export function InputEnhanced({
  className,
  variant = 'default',
  inputSize = 'md',
  state = 'default',
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  helperText,
  errorText,
  label,
  required,
  loading,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const hasError = state === 'error' || !!errorText;
  const displayText = hasError ? errorText : helperText;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {leftAddon && (
          <div className="flex items-center px-3  -r-0 -glass-input bg-brand-secondary-50 dark:bg-brand-secondary-900 rounded-lg-l-md">
            {leftAddon}
          </div>
        )}
        
        <div className="relative flex-1">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              baseInputClasses,
              inputVariants[variant],
              inputSizes[inputSize],
              inputStates[hasError ? 'error' : state],
              leftIcon && 'pl-10',
              (rightIcon || state !== 'default' || loading) && 'pr-10',
              leftAddon && 'rounded-l-none border-l-0',
              rightAddon && 'rounded-r-none border-r-0',
              className
            )}
            {...props}
          />
          
          {(rightIcon || state !== 'default' || loading) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <StateIcon state={state} loading={loading} rightIcon={rightIcon} />
            </div>
          )}
        </div>
        
        {rightAddon && (
          <div className="flex items-center px-3  -l-0 -glass-input bg-brand-secondary-50 dark:bg-brand-secondary-900 rounded-lg-r-md">
            {rightAddon}
          </div>
        )}
      </div>
      
      {displayText && (
        <p className={cn(
          'mt-1 text-xs',
          hasError ? 'text-red-500' : 'text-muted-foreground'
        )}>
          {displayText}
        </p>
      )}
    </div>
  );
}