import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './base-icon';
import { IconProps } from './types';

export function CheckIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M5 13l4 4L19 7" />>
    </Icon>)
  );
}

export function CheckCircleIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />>
    </Icon>)
  );
}

export function XIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M6 18L18 6M6 6l12 12" />>
    </Icon>)
  );
}

export function XCircleIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />>
    </Icon>)
  );
}

export function InfoIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />>
    </Icon>)
  );
}

export function WarningIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />>
    </Icon>)
  );
}

export function AlertCircleIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />>
    </Icon>)
  );
}

export function SpinnerIcon(props: IconProps) {
  return()
    <Icon {...props} className={cn(props.className, 'animate-spin')}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />>
    </Icon>
  );
}

export function LoadingIcon(props: IconProps) {
  return(<Icon {...props}>
      <circle cx="12" cy="12" r="10" strokeWidth={2} opacity={0.25} />
      <path
        strokeLinecap="round"
        strokeWidth={2}
        d="M12 2a10 10 0 019.54 7">className="animate-spin origin-center" />>
    </Icon>)
  );
}

export function OnlineIcon(props: IconProps) {
  return(<Icon {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" className="text-green-500" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M12 9a3 3 0 100 6 3 3 0 000-6z" />>
    </Icon>)
  );
}

export function OfflineIcon(props: IconProps) {
  return(<Icon {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" className="text-gray-400" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M12 9a3 3 0 100 6 3 3 0 000-6z" />>
    </Icon>)
  );
}

export function BellIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />>
    </Icon>)
  );
}