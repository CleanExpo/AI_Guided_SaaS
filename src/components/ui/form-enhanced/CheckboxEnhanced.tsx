'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { CheckboxProps } from './types';
import { checkboxSizes } from './styles';

export function CheckboxEnhanced({
  className,
  checkboxSize = 'md',
  variant = 'default',
  state = 'default',
  label,
  description,
  indeterminate,
  id,
  checked,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;
  const hasError = state === 'error';

  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className="flex items-start space-x-2">
      <div className="relative flex items-center justify-center">
        <input
          ref={checkboxRef}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          className={cn(
            'peer appearance-none rounded border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            checkboxSizes[checkboxSize],
            hasError && 'border-red-500 focus:ring-red-500',
            state === 'success' && 'border-green-500 focus:ring-green-500',
            state === 'warning' && 'border-yellow-500 focus:ring-yellow-500',
            className
          )}
          {...props}
        />
        
        {(checked || indeterminate) && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center pointer-events-none text-white',
            checkboxSizes[checkboxSize]
          )}>
            {indeterminate ? (
              <MinusIcon className="w-3 h-3" />
            ) : (
              <CheckIcon className="w-3 h-3" />
            )}
          </div>
        )}
        
        <div className={cn(
          'absolute inset-0 rounded peer-checked:bg-primary peer-checked:border-primary peer-indeterminate:bg-primary peer-indeterminate:border-primary',
          checkboxSizes[checkboxSize]
        )} />
      </div>
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
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