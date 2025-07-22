# Analyze React Hydration Issues

## Purpose
Systematically diagnose and resolve React hydration mismatches in Next.js applications.

## When to Use
- Vercel builds failing with "useState is not a function" errors
- Hydration mismatch warnings in browser console
- Components rendering differently on server vs client
- SSR/CSR inconsistencies

## Analysis Checklist

### 1. Provider Structure Analysis
```bash
# Check for conditional provider rendering
grep -r "usePathname\|useRouter" src/components/providers.tsx
grep -r "if.*Route\|pathname?.startsWith" src/components/providers.tsx
```

**Red Flags:**
- Conditional provider wrapping based on pathname
- Different provider structures for different routes
- Runtime-dependent provider logic

### 2. Component Structure Audit
```bash
# Find components using hooks without 'use client'
grep -r "useState\|useEffect" src/components/ | grep -v "use client"
```

**Requirements:**
- All hook-using components must have 'use client' directive
- Server components cannot use React hooks
- Dynamic imports needed for browser-only components

### 3. Authentication Logic Review
```bash
# Check middleware routing logic
grep -r "redirect\|NextResponse" src/middleware.ts
```

**Common Issues:**
- Inconsistent authentication redirects
- Mixed authentication systems in providers
- Runtime path-based authentication decisions

## Diagnostic Commands

### Build and Test Locally
```bash
npm run build
npm run start
# Check browser console for hydration warnings
```

### Vercel Deployment Check
```bash
# Check build logs for hydration errors
vercel logs [deployment-url]
```

### Hydration Testing Pattern
```tsx
// Add to components for debugging
useEffect(() => {
  console.log('Component hydrated:', componentName);
}, []);
```

## Common Solutions

### 1. Unify Provider Structure
```tsx
// Before: Conditional providers (BREAKS HYDRATION)
const isAdminRoute = pathname?.startsWith('/admin');
if (isAdminRoute) return <AdminProviders>{children}</AdminProviders>;
return <RegularProviders>{children}</RegularProviders>;

// After: Unified providers (FIXES HYDRATION)
return (
  <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  </SessionProvider>
);
```

### 2. Move Authentication Logic to Middleware
```tsx
// Before: Authentication in providers
if (isAdminRoute) {
  // Skip SessionProvider for admin routes
}

// After: Authentication in middleware
if (pathname.startsWith('/admin')) {
  // Handle admin auth separately
  const adminToken = request.cookies.get('admin-token');
  // ...redirect logic
}
```

### 3. Client-Only Components
```tsx
// For browser-dependent components
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(() => import('./Component'), {
  ssr: false,
  loading: () => <LoadingSkeleton />
});
```

## Verification Steps

1. **Local Build Test**
   ```bash
   npm run build
   # Should complete without hydration errors
   ```

2. **Browser Console Check**
   - No hydration mismatch warnings
   - Components render consistently

3. **Authentication Flow Test**
   - Admin routes redirect to `/admin/login`
   - Regular routes redirect to `/auth/signin`
   - Both auth systems work independently

4. **Production Deployment**
   - Vercel build succeeds
   - All pages generate correctly
   - No runtime hydration errors

## Documentation Updates
- [ ] Record solution in specs/
- [ ] Update standards/ with new patterns
- [ ] Create reusable patterns for future use
