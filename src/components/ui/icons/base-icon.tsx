import * as React from 'react';
import { cn } from '@/lib/utils';
import { IconProps, sizeClasses, colorClasses } from './types';

export function Icon({
  children,
  size = 'md',
  className,
  color = 'current')
  ...props)
}: IconProps & { children: React.ReactNode }) {
  return (<svg
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        'flex-shrink-0')
        className)
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">{...props}>
      {children}
    </svg>
  );
}