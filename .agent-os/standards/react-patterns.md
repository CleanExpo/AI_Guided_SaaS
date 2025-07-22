# React SSR/Hydration Standards

## Critical SSR/Hydration Rules

### Provider Structure Consistency
❌ **NEVER DO THIS** - Conditional provider structure:
```tsx
// This breaks hydration!
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    return <AdminProviders>{children}</AdminProviders>;
  }
  
  return <RegularProviders>{children}</RegularProviders>;
}
```

✅ **ALWAYS DO THIS** - Unified provider structure:
```tsx
// This maintains hydration consistency
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
```

### Client-Only Content Patterns
For content that must differ between server and client:

✅ **Use useEffect pattern**:
```tsx
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

return (
  <div>
    {isClient ? 'Client-only content' : 'SSR content'}
  </div>
);
```

✅ **Use dynamic imports for browser-only components**:
```tsx
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(() => import('./ClientOnlyComponent'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
```

✅ **Use Suspense boundaries for dynamic content**:
```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DynamicContent />
    </Suspense>
  );
}
```

### Hook Usage Rules
- Always use 'use client' directive for components using React hooks
- Never use hooks in Server Components
- Wrap hook-dependent components in Suspense if they cause hydration issues

### Common Hydration Error Patterns to Avoid

1. **Conditional rendering based on `window` or `document`**
2. **Different provider structures between server/client**
3. **Random values or timestamps without synchronization**
4. **Browser-specific APIs without proper guards**
5. **Conditional imports based on runtime environment**

### Hydration Testing Checklist
- [ ] Provider structure identical on server and client
- [ ] No conditional rendering based on `usePathname()` in providers
- [ ] All client-only logic properly guarded with useEffect
- [ ] Dynamic components use `ssr: false` when needed
- [ ] Suspense boundaries wrap problematic components
