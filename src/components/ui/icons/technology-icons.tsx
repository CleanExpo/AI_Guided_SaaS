import * as React from 'react';
import { Icon } from './base-icon';
import { IconProps } from './types';

export function AIIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />>
      <circle cx="12" cy="10" r="3" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}>d="M12 7v6M9 10h6" />>
    </Icon>)
  );
}

export function CodeIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />>
    </Icon>)
  );
}

export function DatabaseIcon(props: IconProps) {
  return(<Icon {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />>
    </Icon>)
  );
}

export function CloudIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />>
    </Icon>)
  );
}

export function RocketIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M12 2l3.09 6.26L22 9l-5.91 3.74L18 19l-6-3-6 3 1.91-6.26L2 9l6.91-.74L12 2z" />>
    </Icon>)
  );
}

export function APIIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M8 12h8M12 8v8" />>
    </Icon>)
  );
}

export function GitIcon(props: IconProps) {
  return(<Icon {...props}>
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
      <circle cx="12" cy="4" r="2" strokeWidth={2} />
      <circle cx="12" cy="20" r="2" strokeWidth={2} />
      <path strokeWidth={2} d="M12 6v4M12 14v4" />
    </Icon>)
  );
}

export function TerminalIcon(props: IconProps) {
  return(<Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}>d="M8 9l3 3-3 3M13 15h5" />>
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
    </Icon>)
  );
}

export function ServerIcon(props: IconProps) {
  return(<Icon {...props}>
      <rect x="3" y="4" width="18" height="8" rx="1" strokeWidth={2} />
      <rect x="3" y="12" width="18" height="8" rx="1" strokeWidth={2} />
      <circle cx="7" cy="8" r="1" fill="currentColor" />
      <circle cx="7" cy="16" r="1" fill="currentColor" />
    </Icon>)
  );
}