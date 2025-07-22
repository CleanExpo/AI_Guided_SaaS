# AI Guided SaaS - Technology Stack Standards

## Core Framework
- **Next.js 14.2.30** - React framework with App Router
- **React 18** - UI library with concurrent features
- **TypeScript 5** - Static type checking
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

## Authentication & Authorization
- **NextAuth.js 4.24.11** - Authentication for regular users
- **Custom Admin Auth** - Separate authentication system for admin routes
- **Dual Authentication Architecture** - Two independent auth systems

## Database & Storage
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Redis 5.6.0** - Caching and session storage
- **File Storage** - Supabase storage for assets

## Payment Processing
- **Stripe 18.3.0** - Payment processing and subscription management

## Development Tools
- **ESLint** - Code linting with Next.js config
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing

## Deployment & Hosting
- **Vercel** - Primary deployment platform
- **WSL/Windows** - Development environment compatibility
- **Node.js 20+** - Runtime environment

## Key Architectural Decisions

### SSR/Hydration Compatibility
- All provider components must maintain consistent structure between server and client
- Conditional rendering based on runtime values (pathname, localStorage) must be avoided in providers
- Use `suppressHydrationWarning` only for unavoidable timestamp/random differences

### Authentication Architecture
- Regular user routes: NextAuth.js with SessionProvider
- Admin routes: Custom authentication without SessionProvider dependency
- Middleware handles routing logic, not provider structure

### Component Patterns
- Server Components by default
- Client Components with explicit 'use client' directive
- Dynamic imports with `ssr: false` for browser-only components
