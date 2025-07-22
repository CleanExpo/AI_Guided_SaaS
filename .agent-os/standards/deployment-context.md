# Production Environment Standards

## Platform Configuration
- **Primary Platform**: Vercel
- **Repository**: GitHub integration
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x
- **Framework**: Next.js 14+

## Deployment-Specific Considerations
- **SSR/Client Boundaries**: All components using React hooks must have 'use client' directive
- **Hydration Requirements**: Server and client render must match exactly
- **Environment Variables**: Production vs development differences
- **Build Optimization**: Minification impacts error debugging

## Error Context Mapping
- **Hydration Errors**: Check for client-only code running on server
- **Import/Export Mismatches**: Verify named vs default exports across codebase
- **Missing Dependencies**: Cross-reference package.json with actual imports
- **Build Failures**: Static analysis vs runtime issues

## Next.js App Router Specifics
- **Server Components**: Default behavior, no hooks allowed
- **Client Components**: Require 'use client' directive for React hooks
- **Layout Components**: Must be server components unless using hooks
- **Page Components**: Can be server or client based on functionality

## Vercel Deployment Pipeline
1. **GitHub Push/PR**: Triggers automatic deployment
2. **Build Phase**: Next.js build process with static analysis
3. **Deployment**: Server and client bundles deployed separately
4. **Edge Functions**: API routes deployed to Vercel Edge Runtime
5. **Static Assets**: Optimized and served from CDN

## Common Production Issues
1. **Hydration Mismatches**:
   - Server render differs from client render
   - Solution: Ensure consistent state, proper 'use client' usage
   - Prevention: Hydration validation in development

2. **Import/Export Errors**:
   - Named vs default export confusion
   - Missing component exports
   - Solution: Systematic import/export validation

3. **Environment Variable Issues**:
   - Missing NEXT_PUBLIC_ prefix for client-side variables
   - Different values between development and production
   - Solution: Environment parity validation

4. **Performance Issues**:
   - Large bundle sizes in production
   - Slow hydration due to heavy client-side components
   - Solution: Bundle analysis and optimization

## Success Criteria
- Zero hydration errors in production
- Build success rate > 95%
- Page load times < 2 seconds
- Error rate < 1% of total requests
