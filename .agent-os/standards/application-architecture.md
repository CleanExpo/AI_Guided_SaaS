# Application Architecture Standards v1.1

## Clean Architecture + Domain-Driven Design

### Mandatory Folder Structure

```
src/
├── domain/                    # Core business logic (no external dependencies)
│   ├── entities/             # Business objects and rules
│   ├── value-objects/        # Immutable domain concepts  
│   ├── repositories/         # Data access interfaces
│   └── services/             # Domain business logic
├── application/              # Use cases and application services
│   ├── use-cases/           # Application-specific business rules
│   ├── services/            # Application services
│   ├── dto/                 # Data transfer objects
│   └── ports/               # Interfaces for external systems
├── infrastructure/           # External concerns and frameworks
│   ├── database/            # Database implementations
│   ├── external-services/   # Third-party integrations
│   ├── messaging/           # Message queues, events
│   └── config/              # Configuration and environment
└── presentation/            # UI and API layers
    ├── components/          # React components
    ├── pages/               # Next.js pages/routes
    ├── api/                 # API route handlers
    └── middleware/          # Request/response processing
```

### Layer Dependencies (Mandatory)

```
Domain ← Application ← Infrastructure ← Presentation
```

**RULES:**
- Domain layer: ZERO external dependencies
- Application layer: May depend ONLY on Domain
- Infrastructure layer: May depend on Domain + Application
- Presentation layer: May depend on all other layers

### Architectural Decision Records (ADRs)

#### ADR Naming Convention
```
docs/architecture/adr/
├── ADR-001-chosen-architecture-pattern.md
├── ADR-002-database-selection-rationale.md
├── ADR-003-authentication-strategy.md
└── ADR-template.md
```

#### Mandatory ADR Template
```markdown
# ADR-XXX: Decision Title

**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Date:** YYYY-MM-DD
**Deciders:** [List of decision makers]

## Context and Problem Statement
[Describe the architectural problem and context]

## Decision Drivers
- [Driver 1]
- [Driver 2]
- [Driver 3]

## Considered Options
- [Option 1]
- [Option 2] 
- [Option 3]

## Decision Outcome
[Chosen option with detailed justification]

### Positive Consequences
- [Consequence 1]
- [Consequence 2]

### Negative Consequences
- [Consequence 1]
- [Consequence 2]

## Implementation Notes
[Technical implementation details]

## Links
- [Related ADRs]
- [External references]
```

### Quality Gates (Non-Negotiable)

#### Code Coverage Requirements
- **Unit Tests:** ≥ 80% coverage
- **Integration Tests:** ≥ 50% coverage
- **E2E Tests:** Critical user paths covered
- **Component Tests:** All UI components tested

#### Security Analysis
- **SAST (Static Application Security Testing):** Zero high/critical issues
- **Dependency Scanning:** No known vulnerabilities in dependencies
- **Secrets Scanning:** No hardcoded secrets or keys

#### Code Quality
- **ESLint:** Zero errors, warnings ≤ 5
- **TypeScript:** Strict mode, zero `any` types
- **Prettier:** Consistent formatting enforced
- **Complexity:** Cyclomatic complexity ≤ 10 per function

### Testing Strategy (Test Pyramid)

```
    /\
   /  \    E2E Tests (5-10%)
  /____\   Integration Tests (15-25%)
 /      \  Unit Tests (60-80%)
/________\ 
```

#### Unit Testing Standards
```typescript
// Domain entities testing
describe('UserEntity', () => {
  it('should validate email format', () => {
    // Arrange
    const invalidEmail = 'invalid-email';
    
    // Act & Assert
    expect(() => new UserEntity({ email: invalidEmail }))
      .toThrow('Invalid email format');
  });
});

// Use case testing with mocks
describe('CreateUserUseCase', () => {
  it('should create user when valid data provided', async () => {
    // Arrange
    const mockRepository = jest.fn();
    const useCase = new CreateUserUseCase(mockRepository);
    
    // Act
    const result = await useCase.execute({ email: 'test@example.com' });
    
    // Assert
    expect(result.success).toBe(true);
    expect(mockRepository).toHaveBeenCalledWith(expect.any(UserEntity));
  });
});
```

#### Integration Testing Standards
```typescript
// API endpoint testing
describe('/api/users', () => {
  it('should create user with valid payload', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test User' })
      .expect(201);
      
    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com',
      name: 'Test User'
    });
  });
});
```

### Observability Baseline

#### OpenTelemetry Configuration
```typescript
// Required tracing setup
import { NodeTracerProvider } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'ai-guided-saas',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
  }),
});
```

#### Mandatory Metrics
- **Business Metrics:** User registrations, subscription conversions, churn rate
- **Technical Metrics:** Response times, error rates, throughput
- **Infrastructure Metrics:** CPU, memory, disk usage, database connections
- **Security Metrics:** Failed login attempts, API rate limit violations

#### Logging Standards (Winston)
```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'ai-guided-saas',
    version: process.env.npm_package_version 
  },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

#### Error Handling Pattern
```typescript
// Domain-level error handling
export class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DomainError';
  }
}

// Application-level error handling
export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.cause = cause;
  }
}

// Infrastructure-level error handling  
export class InfrastructureError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'InfrastructureError';
    this.cause = originalError;
  }
}
```

### Performance Standards

#### Response Time Targets
- **API Endpoints:** ≤ 200ms (P95), ≤ 500ms (P99)
- **Page Load:** ≤ 2s First Contentful Paint, ≤ 4s Largest Contentful Paint
- **Database Queries:** ≤ 100ms for simple queries, ≤ 1s for complex queries

#### Caching Strategy
- **CDN:** Static assets, 1 year TTL
- **API Cache:** GET endpoints, 5-60 minutes TTL
- **Database Cache:** Read-heavy data, Redis with 15-minute TTL
- **Browser Cache:** Application shell, service worker managed

### Security Standards

#### Authentication & Authorization
```typescript
// JWT token structure (mandatory fields)
interface JWTPayload {
  sub: string;          // User ID
  email: string;        // User email
  role: 'user' | 'admin' | 'super_admin';
  iat: number;          // Issued at
  exp: number;          // Expiration
  permissions: string[]; // Granular permissions
}

// RBAC implementation
const permissions = {
  'user': ['read:profile', 'update:profile'],
  'admin': ['read:users', 'update:users', 'read:analytics'],
  'super_admin': ['*'] // All permissions
};
```

#### API Security Headers (Mandatory)
```typescript
// Next.js security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### Module Organization Patterns

#### Feature-Based Modules (Alternative to Clean Architecture)
```
src/
├── shared/                   # Shared utilities and components
│   ├── ui/                  # Reusable UI components
│   ├── utils/               # Utility functions
│   └── types/               # Shared TypeScript types
├── features/
│   ├── authentication/      # Auth feature module
│   │   ├── components/      # Auth-specific components
│   │   ├── hooks/          # Auth-specific hooks
│   │   ├── services/       # Auth business logic
│   │   ├── types/          # Auth type definitions
│   │   └── __tests__/      # Auth tests
│   ├── user-management/     # User management module
│   └── billing/            # Billing feature module
├── app/                     # Next.js App Router
│   ├── (auth)/             # Route groups
│   ├── (dashboard)/        # Protected routes
│   └── api/                # API routes
└── lib/                    # Core libraries and configurations
    ├── database/           # Database configuration
    ├── auth/              # Authentication setup
    └── monitoring/        # Observability setup
```

This architecture standard ensures consistent, maintainable, and scalable application development across all AI-assisted and human-developed code.
