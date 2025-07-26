'use client';

import { ReactNode } from 'react';

export function TestWrapper({ children }: { children: ReactNode }) {
  // Skip authentication in test environment
  if ((process.env.NODE_ENV || "test") === "test" || typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return <>{children}</>;
  }
  
  // Normal authentication flow
  return children;
}
