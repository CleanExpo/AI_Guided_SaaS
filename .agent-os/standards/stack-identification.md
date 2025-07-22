# Stack Identification Standards v1.0

## Evidence-to-Category Mapping

### Runtime Environment Detection

| Evidence Pattern | Stack Component | Confidence Score | Notes |
|------------------|-----------------|------------------|-------|
| `package.json` with `"type": "module"` | Node.js ESM | 95% | Modern Node.js setup |
| `package.json` present | Node.js | 90% | Standard Node.js project |
| `requirements.txt` or `pyproject.toml` | Python | 95% | Python package definitions |
| `Gemfile` | Ruby | 95% | Ruby project |
| `go.mod` | Go | 98% | Go modules |
| `Cargo.toml` | Rust | 98% | Rust project |
| `pom.xml` or `build.gradle` | Java/JVM | 95% | Java build tools |
| `composer.json` | PHP | 95% | PHP dependency manager |
| `Program.cs` with top-level statements | .NET 6+ | 90% | Modern .NET |

### Web Framework Detection

| Evidence Pattern | Framework | Confidence Score | Version Hints |
|------------------|-----------|------------------|---------------|
| `"next"` in dependencies | Next.js | 95% | Check version in package.json |
| `next.config.js` or `next.config.mjs` | Next.js | 98% | Configuration confirms usage |
| `"react"` + `"react-dom"` | React | 90% | Base React setup |
| `"@vitejs/plugin-react"` | Vite + React | 95% | Vite React setup |
| `"vue"` in dependencies | Vue.js | 95% | Vue framework |
| `"nuxt"` in dependencies | Nuxt.js | 98% | Vue meta-framework |
| `"svelte"` in dependencies | Svelte | 95% | Svelte framework |
| `"@angular/core"` | Angular | 98% | Angular framework |
| `"express"` in dependencies | Express.js | 90% | Node.js web server |
| `"fastify"` in dependencies | Fastify | 95% | Modern Node.js framework |
| `"django"` in requirements | Django | 98% | Python web framework |
| `"flask"` in requirements | Flask | 95% | Lightweight Python framework |

### Database & ORM Detection

| Evidence Pattern | Database/ORM | Confidence Score | Integration Type |
|------------------|--------------|------------------|------------------|
| `"prisma"` + `schema.prisma` | Prisma ORM | 98% | Type-safe ORM |
| `"@supabase/supabase-js"` | Supabase | 95% | PostgreSQL + Auth |
| `"sequelize"` in dependencies | Sequelize | 90% | Node.js ORM |
| `"typeorm"` in dependencies | TypeORM | 90% | TypeScript ORM |
| `"mongoose"` in dependencies | MongoDB + Mongoose | 95% | MongoDB ODM |
| `"pg"` or `"node-postgres"` | PostgreSQL | 85% | Direct PostgreSQL |
| `"mysql2"` in dependencies | MySQL | 85% | Direct MySQL |
| `DATABASE_URL` in env files | Generic SQL DB | 75% | Connection string pattern |
| `MONGODB_URI` in env files | MongoDB | 85% | MongoDB connection |
| `REDIS_URL` in env files | Redis | 80% | Caching/sessions |

### Authentication Detection

| Evidence Pattern | Auth System | Confidence Score | Features |
|------------------|-------------|------------------|----------|
| `"next-auth"` in dependencies | NextAuth.js | 95% | OAuth + credentials |
| `"@auth0/nextjs-auth0"` | Auth0 | 98% | Enterprise auth |
| `"firebase/auth"` | Firebase Auth | 90% | Google ecosystem |
| `"@supabase/auth-helpers"` | Supabase Auth | 95% | Built-in auth |
| `"passport"` in dependencies | Passport.js | 85% | Node.js auth middleware |
| `"jsonwebtoken"` + custom routes | Custom JWT | 75% | Manual implementation |
| `"bcryptjs"` + user models | Custom Auth | 70% | Password hashing |

### Payment Processing Detection

| Evidence Pattern | Payment System | Confidence Score | Features |
|------------------|----------------|------------------|----------|
| `"stripe"` in dependencies | Stripe | 95% | Payment processing |
| `"@stripe/stripe-js"` | Stripe Frontend | 90% | Client-side Stripe |
| `"paypal-rest-sdk"` | PayPal | 85% | PayPal integration |
| `STRIPE_SECRET_KEY` in env | Stripe | 98% | Server-side Stripe |
| `STRIPE_PUBLISHABLE_KEY` | Stripe | 95% | Client-side Stripe |

### Deployment & Hosting Detection

| Evidence Pattern | Platform | Confidence Score | Type |
|------------------|----------|------------------|------|
| `vercel.json` | Vercel | 98% | Serverless |
| `netlify.toml` | Netlify | 98% | Jamstack |
| `Dockerfile` | Docker | 95% | Containerized |
| `docker-compose.yml` | Docker Compose | 98% | Multi-container |
| `.github/workflows/` | GitHub Actions | 95% | CI/CD |
| `railway.json` | Railway | 90% | Full-stack platform |
| `render.yaml` | Render | 90% | Cloud platform |

## Confidence Scoring System

### Scoring Methodology
- **98-100%**: Explicit configuration files (e.g., `next.config.js`, `Dockerfile`)
- **95-97%**: Direct dependency declarations with version constraints
- **90-94%**: Strong dependency patterns (e.g., React + React-DOM)
- **85-89%**: Environment variable patterns or indirect evidence
- **80-84%**: File structure patterns or naming conventions
- **75-79%**: Inferred from related technologies
- **Below 75%**: Uncertain, requires manual verification

### Confidence Aggregation Rules
When multiple pieces of evidence point to the same technology:
```typescript
// Confidence aggregation formula
function aggregateConfidence(scores: number[]): number {
  const maxScore = Math.max(...scores);
  const avgOthers = scores.filter(s => s !== maxScore).reduce((a, b) => a + b, 0) / (scores.length - 1);
  return Math.min(99, maxScore + (avgOthers * 0.1));
}
```

## Canonical Component Buckets

### Primary Categories

```typescript
interface TechStack {
  // Core Runtime
  runtime: {
    language: 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'java' | 'php' | 'ruby';
    version: string;
    environment: 'node' | 'browser' | 'deno' | 'bun';
  };
  
  // Web Framework
  webFramework: {
    name: 'next' | 'react' | 'vue' | 'svelte' | 'angular' | 'express' | 'fastify' | 'django' | 'flask';
    version: string;
    type: 'meta-framework' | 'framework' | 'library';
  };
  
  // Database Layer
  database: {
    primary: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'redis';
    orm?: 'prisma' | 'typeorm' | 'sequelize' | 'mongoose' | 'sqlalchemy';
    provider?: 'supabase' | 'planetscale' | 'mongodb-atlas' | 'railway' | 'neon';
  };
  
  // Authentication
  auth: {
    system: 'nextauth' | 'auth0' | 'firebase' | 'supabase' | 'custom' | 'passport';
    providers?: ('google' | 'github' | 'email' | 'credentials')[];
  };
  
  // Styling & UI
  styling: {
    system: 'tailwind' | 'styled-components' | 'emotion' | 'css-modules' | 'sass';
    components?: 'shadcn-ui' | 'chakra-ui' | 'material-ui' | 'ant-design' | 'custom';
  };
  
  // State Management
  stateManagement?: {
    global: 'redux' | 'zustand' | 'jotai' | 'valtio' | 'context-api';
    server: 'react-query' | 'swr' | 'apollo' | 'urql';
  };
  
  // Testing
  testing: {
    unit: 'jest' | 'vitest' | 'mocha' | 'pytest';
    integration: 'jest' | 'testing-library' | 'cypress' | 'playwright';
    e2e?: 'cypress' | 'playwright' | 'puppeteer';
  };
  
  // Build & Bundling
  build: {
    bundler: 'webpack' | 'vite' | 'esbuild' | 'rollup' | 'parcel';
    transpiler?: 'babel' | 'swc' | 'tsc' | 'esbuild';
  };
  
  // Deployment
  deployment: {
    platform: 'vercel' | 'netlify' | 'railway' | 'render' | 'aws' | 'docker';
    type: 'serverless' | 'container' | 'static' | 'traditional';
  };
  
  // Monitoring & Analytics
  monitoring?: {
    errors: 'sentry' | 'rollbar' | 'bugsnag';
    analytics: 'google-analytics' | 'mixpanel' | 'amplitude' | 'posthog';
    performance: 'vercel-analytics' | 'web-vitals' | 'lighthouse-ci';
  };
}
```

## Recommendation Rules

### Stack Compatibility Matrix

```typescript
const compatibilityRules = {
  // Next.js recommendations
  'next': {
    recommended: {
      styling: ['tailwind', 'styled-components'],
      database: ['supabase', 'prisma + postgresql'],
      auth: ['nextauth', 'supabase-auth'],
      deployment: ['vercel', 'netlify']
    },
    avoid: {
      stateManagement: ['redux'], // Next.js has built-in state solutions
      bundler: ['webpack'] // Next.js handles bundling
    }
  },
  
  // React SPA recommendations
  'react-spa': {
    recommended: {
      bundler: ['vite', 'webpack'],
      stateManagement: ['zustand', 'redux-toolkit'],
      routing: ['react-router'],
      deployment: ['vercel', 'netlify', 'github-pages']
    },
    required: {
      bundler: true // SPAs need explicit bundling
    }
  },
  
  // Full-stack recommendations
  'fullstack': {
    recommended: {
      database: ['postgresql + prisma', 'supabase'],
      auth: ['nextauth', 'auth0'],
      monitoring: ['sentry', 'vercel-analytics'],
      testing: ['jest + testing-library + playwright']
    }
  }
};
```

### Performance-Based Recommendations

```typescript
const performanceRules = {
  // High-traffic applications
  'high-performance': {
    required: {
      caching: ['redis', 'vercel-edge-cache'],
      database: ['postgresql', 'mysql'], // Avoid MongoDB for high-read
      bundler: ['swc', 'esbuild'] // Faster build times
    },
    avoid: {
      stateManagement: ['redux'], // Heavy runtime overhead
      bundler: ['babel'] // Slower than alternatives
    }
  },
  
  // Developer experience optimized
  'dx-optimized': {
    recommended: {
      typescript: true,
      linting: ['eslint + prettier'],
      testing: ['vitest', 'jest'],
      bundler: ['vite'] // Fast HMR
    }
  }
};
```

## Red-Flag Catalogue

### Critical Issues (Build-Breaking)

| Pattern | Issue | Severity | Solution |
|---------|-------|----------|----------|
| Next.js + `"type": "commonjs"` | ESM/CJS mismatch | Critical | Set `"type": "module"` or use Next.js 13+ |
| React 17 + Next.js 13+ | Version incompatibility | Critical | Upgrade React to 18+ |
| Node < 18 + Next.js 14 | Runtime incompatibility | Critical | Upgrade Node.js to 18+ |
| `any` types > 20% of codebase | Type safety compromise | High | Implement strict TypeScript |

### Security Risks

| Pattern | Risk | Severity | Mitigation |
|---------|------|----------|------------|
| Hardcoded API keys in code | Secret exposure | Critical | Move to environment variables |
| `eval()` or `Function()` usage | Code injection risk | Critical | Remove dynamic code execution |
| HTTP URLs in production | Data interception | High | Enforce HTTPS |
| Missing CSRF protection | Cross-site attacks | High | Implement CSRF tokens |
| Weak JWT secrets | Token compromise | High | Use strong, random secrets |

### Performance Warnings

| Pattern | Impact | Severity | Optimization |
|---------|--------|----------|--------------|
| No lazy loading of routes | Large bundle size | Medium | Implement code splitting |
| Unoptimized images | Slow page loads | Medium | Use Next.js Image component |
| No caching headers | Poor performance | Medium | Implement cache-control |
| Missing compression | Bandwidth waste | Medium | Enable gzip/brotli |
| Large dependency bundle | Slow startup | Medium | Audit and remove unused deps |

### Maintainability Issues

| Pattern | Issue | Severity | Improvement |
|---------|-------|----------|-------------|
| No testing strategy | Technical debt | Medium | Implement test pyramid |
| Missing TypeScript | Type errors | Medium | Migrate to TypeScript |
| No linting configuration | Code inconsistency | Low | Add ESLint + Prettier |
| Monolithic components | Hard to maintain | Medium | Split into smaller components |
| Missing documentation | Knowledge gaps | Low | Add README and code comments |

## Detection Heuristics Priority

### File System Scan Order
1. **Root configuration files** (highest confidence)
   - `package.json`, `next.config.js`, `docker-compose.yml`
2. **Environment files** (medium-high confidence)
   - `.env*`, `vercel.json`, `netlify.toml`
3. **Source directory structure** (medium confidence)
   - `src/`, `pages/`, `app/`, `components/`
4. **Build artifacts** (low confidence, may be stale)
   - `dist/`, `build/`, `.next/`

### Dependency Analysis Rules
```typescript
const analysisRules = {
  // Primary framework detection
  frameworkDetection: {
    order: ['meta-framework', 'framework', 'library'],
    conflicts: [
      ['next', 'gatsby'], // Can't use both meta-frameworks
      ['react', 'vue', 'svelte'] // Can't mix UI frameworks
    ]
  },
  
  // Version constraint validation
  versionConstraints: {
    'next': { react: '>=18.0.0', node: '>=18.0.0' },
    'react-18': { node: '>=16.0.0' },
    'typescript': { node: '>=14.0.0' }
  }
};
```

This stack identification system enables precise, automated detection of technology stacks with quantified confidence levels, supporting both existing project analysis and new project recommendations.
