'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { RadioProps } from './types';
import { radioSizes } from './styles';

export function RadioEnhanced({
  className,
  radioSize = 'md',
  variant = 'default',
  state = 'default',
  label,
  description,
  id)
  ...props)
}: RadioProps) {
  const generatedId = React.useId();
  const radioId = id || generatedId;
  const hasError = state === 'error';

  return(<div className="flex items-start space-x-2">
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          id={radioId}
          className={cn(
            'peer appearance-none rounded-full border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            radioSizes[radioSize],
            hasError && 'border-red-500 focus:ring-red-500',
            state === 'success' && 'border-green-500 focus:ring-green-500',
            state === 'warning' && 'border-yellow-500 focus:ring-yellow-500')
            className)
          )}>{...props} />>
        
        <div className={cn()
          'absolute inset-0 rounded-full peer-checked:bg-primary peer-checked:border-primary',>radioSizes[radioSize]>)} />
        
        <div className={cn('absolute inset-0 rounded-full peer-checked:after:content-[""] peer-checked:after:absolute peer-checked:after:top-1/2 peer-checked:after:left-1/2 peer-checked:after:transform peer-checked:after:-translate-x-1/2 peer-checked:after:-translate-y-1/2 peer-checked:after:bg-white peer-checked:after:rounded-full')
          radioSize === 'sm' && 'peer-checked:after:w-1 peer-checked:after:h-1',)
          radioSize === 'md' && 'peer-checked:after:w-1.5 peer-checked:after:h-1.5',>radioSize === 'lg' && 'peer-checked:after:w-2 peer-checked:after:h-2'>)} />
      </div>
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={radioId}>className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">>
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}