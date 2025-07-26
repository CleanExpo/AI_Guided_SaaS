'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false
      }
    })
  }));

  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  // CRITICAL FIX: Exclude admin routes from SessionProvider to prevent auth conflicts
  // Admin routes use custom admin-token authentication, NOT NextAuth
  if (pathname?.startsWith('/admin')) {
    return(<QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>disableTransitionOnChange>
          {children}
          <PWAInstallPrompt />
        </ThemeProvider>
      </QueryClientProvider>)
    );
  }

  // Regular user routes use NextAuth SessionProvider
  return(<SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>disableTransitionOnChange>
          {children}
          <PWAInstallPrompt />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>)
  );
}