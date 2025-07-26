'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { FormGroupProps } from './types';

export function FormGroup({
  children,
  className,
  label,
  required,
  helperText,
  errorText,
  state = 'default'
}: FormGroupProps) {
  const hasError = state === 'error' || !!errorText;
  const displayText = hasError ? errorText : helperText;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      
      <div>{children}</div>
      
      {displayText && (
        <p className={cn(
          'text-xs',
          hasError ? 'text-red-500' : 'text-muted-foreground'
        )}>
          {displayText}
        </p>
      )}
    </div>
  );
}