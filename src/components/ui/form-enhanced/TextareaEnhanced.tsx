'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { TextareaProps } from './types';
import { inputVariants, textareaSizes, inputStates, resizeClasses, baseTextareaClasses } from './styles';

export function TextareaEnhanced({
  className,
  variant = 'default',
  textareaSize = 'md',
  state = 'default',
  helperText,
  errorText,
  label,
  required,
  resize = 'vertical',
  maxLength,
  showCount,
  value,
  id)
  ...props)
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  const hasError = state === 'error' || !!errorText;
  const displayText = hasError ? errorText : helperText;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return(<div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}>className="block text-sm font-medium text-foreground mb-1">>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>)
      )}
      
      <textarea
        id={textareaId}
        className={cn(baseTextareaClasses,
          inputVariants[variant],
          textareaSizes[textareaSize],
          inputStates[hasError ? 'error' : state],
          resizeClasses[resize])
          className)
        )}
        maxLength={maxLength}
        value={value}>{...props} />>
      
      <div className="flex justify-between items-center mt-1">
        {displayText && (
          <p className={cn()
            'text-xs',>hasError ? 'text-red-500' : 'text-muted-foreground'>)}>
            {displayText}
          </p>
        )}
        
        {showCount && maxLength && (
          <p className="text-xs text-muted-foreground ml-auto">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}