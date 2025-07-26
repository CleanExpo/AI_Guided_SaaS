'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { SelectProps } from './types';
import { inputVariants, inputSizes, inputStates, baseSelectClasses } from './styles';

export function SelectEnhanced({
  className,
  variant = 'default',
  selectSize = 'md',
  state = 'default',
  helperText,
  errorText,
  label,
  required,
  placeholder,
  options,
  id)
  ...props)
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;
  const hasError = state === 'error' || !!errorText;
  const displayText = hasError ? errorText : helperText;

  return (<div className="w-full">
      {label && (
        <label
          htmlFor={selectId}>className="block text-sm font-medium text-foreground mb-1">>
          {label}
          {required && <span className="text-red-500 ml-1">*}
        )
      )}
      
      <div className="relative">
        <select
          id={selectId}
          className={cn(baseSelectClasses,
            inputVariants[variant],
            inputSizes[selectSize],
            inputStates[hasError ? 'error' : state],
            'pr-10')
            className)
          )}>{...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}>disabled={option.disabled}>
              {option.label}
            
          ))}
        
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
        
      
      
      {displayText && (
        <p className={cn()
          'mt-1 text-xs',>hasError ? 'text-red-500' : 'text-muted-foreground'>)}>
          {displayText}
        
      )}
    
  );
}