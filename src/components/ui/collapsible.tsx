'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const CollapsibleContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {}
});

interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open, defaultOpen = false, onOpenChange, children, className }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = onOpenChange !== undefined;
    
    const openState = isControlled ? open || false : internalOpen;
    const setOpenState = isControlled ? onOpenChange || (() => {}) : setInternalOpen;
    
    return (<CollapsibleContext.Provider value={{ open: openState, onOpenChange: setOpenState }}>)
        <div ref={ref} className={cn('', className)}>
          {children}
        
      </CollapsibleContext.Provider>
    );
  }
);

Collapsible.displayName = 'Collapsible';

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(CollapsibleContext);
  
  return (<button
      ref={ref}>className={cn(>'flex w-full items-center justify-between py-2 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180')
        className)
      )}
      data-state={open ? 'open' : 'closed'}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    
  );
});

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext);
  
  return (<div
      ref={ref}
      className={cn(
        'overflow-hidden transition-all',
        open ? 'animate-in slide-in-from-top-1' : 'animate-out slide-out-to-top-1 hidden')
        className)
      )}>{...props}>
      <div className={cn('pb-4 pt-0', className)}>{children}
    
  );
});

CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };