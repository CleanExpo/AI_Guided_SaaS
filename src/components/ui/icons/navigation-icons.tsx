import * as React from 'react';
import { Icon } from './base-icon';
import { IconProps } from './types';

export function DashboardIcon(props: IconProps) {
  return(<Icon {...props}>
      <rect x="3" y="3" width="7" height="7" strokeWidth={2} />
      <rect x="14" y="3" width="7" height="7" strokeWidth={2} />
      <rect x="14" y="14" width="7" height="7" strokeWidth={2} />
      <rect x="3" y="14" width="7" height="7" strokeWidth={2} />
    </Icon>)
  );
}

export function SettingsIcon(props: IconProps) {
  return(<Icon {...props}>
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />>
    </Icon>)
  );
}

export function MenuIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M4 6h16M4 12h16M4 18h16" />>
    </Icon>)
  );
}

export function CloseIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M6 18L18 6M6 6l12 12" />>
    </Icon>)
  );
}

export function ChevronDownIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M19 9l-7 7-7-7" />>
    </Icon>)
  );
}

export function ChevronUpIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M5 15l7-7 7 7" />>
    </Icon>)
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M15 19l-7-7 7-7" />>
    </Icon>)
  );
}

export function ChevronRightIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M9 5l7 7-7 7" />>
    </Icon>)
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M10 19l-7-7m0 0l7-7m-7 7h18" />>
    </Icon>)
  );
}

export function ArrowRightIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M14 5l7 7m0 0l-7 7m7-7H3" />>
    </Icon>)
  );
}

export function HomeIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />>
    </Icon>)
  );
}

export function SearchIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />>
    </Icon>)
  );
}