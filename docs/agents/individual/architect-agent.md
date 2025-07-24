# Architect Agent Documentation

## Overview
The Architect Agent serves as the technical leader and system designer for the AI Guided SaaS platform. It makes high-level architectural decisions, ensures technical coherence across all components, and guides other agents in implementing robust, scalable solutions.

## Core Responsibilities

### 1. System Architecture
- Design overall system architecture and component interactions
- Define technology stack and framework choices
- Create architectural patterns and best practices
- Ensure scalability, maintainability, and performance
- Review and approve major technical decisions

### 2. Technical Leadership
- Coordinate between specialized agents
- Resolve technical conflicts and trade-offs
- Establish coding standards and conventions
- Guide refactoring and modernization efforts
- Mentor other agents on architectural principles

### 3. Design Patterns
- Implement design patterns (Factory, Observer, Strategy, etc.)
- Create reusable architectural components
- Define data flow and state management patterns
- Establish API design standards
- Ensure SOLID principles adherence

### 4. Technology Evaluation
- Research and evaluate new technologies
- Assess technical debt and propose solutions
- Plan migration strategies
- Benchmark performance implications
- Ensure technology choices align with business goals

## Technical Specifications

### Configuration
```typescript
{
  name: 'architect-agent',
  type: 'core',
  model: 'claude-3-opus',
  memory: '768MB',
  cpuShares: 1024,
  specializations: [
    'system-design',
    'microservices',
    'scalability',
    'security-architecture',
    'cloud-native',
    'design-patterns'
  ],
  tools: [
    'codebase-analyzer',
    'dependency-graph',
    'architecture-validator',
    'performance-estimator',
    'tech-debt-analyzer'
  ]
}
```

### Required Skills
- **System Design**: Distributed systems, microservices, monolith-to-services
- **Architecture Patterns**: MVC, MVVM, Event-driven, CQRS, Event Sourcing
- **Cloud Architecture**: Serverless, containers, auto-scaling, multi-region
- **Security**: Zero-trust, encryption, authentication/authorization patterns
- **Performance**: Caching strategies, database optimization, CDN usage

## Workflow Integration

### Input Sources
1. **Product Requirements**: Business needs and constraints
2. **Technical Constraints**: Performance, security, compliance requirements
3. **Agent Feedback**: Implementation challenges from other agents
4. **Monitoring Data**: System metrics and bottlenecks

### Output Deliverables
1. **Architecture Diagrams**: System, component, sequence diagrams
2. **Technical Specifications**: Detailed implementation guides
3. **ADRs**: Architecture Decision Records
4. **Standards Documents**: Coding conventions, API standards
5. **Migration Plans**: Step-by-step modernization strategies

## Architectural Standards

### System Architecture Overview
```typescript
// High-level architecture definition
interface SystemArchitecture {
  layers: {
    presentation: {
      web: 'Next.js 15 App Router',
      mobile: 'React Native (future)',
      desktop: 'Electron (future)'
    };
    application: {
      api: 'Next.js API Routes',
      graphql: 'Apollo Server (optional)',
      websocket: 'Socket.io'
    };
    business: {
      services: 'Domain-driven services',
      workflows: 'Agent orchestration',
      rules: 'Business rule engine'
    };
    data: {
      primary: 'PostgreSQL (Supabase)',
      cache: 'Redis',
      search: 'PostgreSQL FTS',
      files: 'Supabase Storage'
    };
    infrastructure: {
      hosting: 'Vercel',
      cdn: 'Vercel Edge Network',
      monitoring: 'OpenTelemetry',
      ci_cd: 'GitHub Actions'
    };
  };
  patterns: [
    'Repository Pattern',
    'Dependency Injection',
    'Event-driven Architecture',
    'CQRS for complex domains',
    'Saga pattern for workflows'
  ];
}
```

### Architecture Decision Record (ADR) Template
```markdown
# ADR-001: Choice of Next.js App Router

## Status
Accepted

## Context
We need to choose between Next.js Pages Router and App Router for our application architecture.

## Decision
We will use Next.js 15 App Router for the following reasons:
1. Better performance with React Server Components
2. Simplified data fetching with async components
3. Improved routing with layouts and parallel routes
4. Better TypeScript support
5. Future-proof architecture

## Consequences
### Positive
- Improved performance and SEO
- Better developer experience
- More flexible routing
- Native streaming support

### Negative
- Learning curve for developers
- Some third-party libraries need updates
- Migration complexity for existing code

### Mitigation
- Provide comprehensive documentation
- Create migration guides
- Use compatibility layers where needed
```

### Domain-Driven Design Structure
```typescript
// Domain model example
namespace ProjectDomain {
  // Entities
  export class Project {
    constructor(
      public readonly id: ProjectId,
      public name: string,
      public description: string,
      public owner: UserId,
      public settings: ProjectSettings,
      public status: ProjectStatus
    ) {}

    // Business logic methods
    publish(): Result<void> {
      if (this.status !== ProjectStatus.Draft) {
        return Result.fail('Project must be in draft status to publish');
      }
      this.status = ProjectStatus.Published;
      return Result.ok();
    }
  }

  // Value Objects
  export class ProjectId {
    constructor(public readonly value: string) {
      if (!this.isValid(value)) {
        throw new Error('Invalid project ID format');
      }
    }

    private isValid(value: string): boolean {
      return /^proj_[a-z0-9]{20}$/.test(value);
    }
  }

  // Domain Services
  export class ProjectService {
    constructor(
      private projectRepo: IProjectRepository,
      private eventBus: IEventBus
    ) {}

    async createProject(dto: CreateProjectDTO): Promise<Result<Project>> {
      // Domain logic here
      const project = new Project(/* ... */);
      
      await this.projectRepo.save(project);
      await this.eventBus.publish(new ProjectCreatedEvent(project));
      
      return Result.ok(project);
    }
  }

  // Repository Interface
  export interface IProjectRepository {
    save(project: Project): Promise<void>;
    findById(id: ProjectId): Promise<Project | null>;
    findByOwner(owner: UserId): Promise<Project[]>;
  }
}
```

### API Design Standards
```typescript
// RESTful API conventions
interface ApiStandards {
  versioning: 'URL path (/api/v1, /api/v2)';
  authentication: 'Bearer token (JWT)';
  response_format: {
    success: {
      data: any;
      meta?: {
        pagination?: PaginationInfo;
        version: string;
      };
    };
    error: {
      error: string;
      code: string;
      details?: any;
      trace_id: string;
    };
  };
  status_codes: {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    503: 'Service Unavailable'
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
}
```

## Communication Protocol

### Incoming Messages
```typescript
interface ArchitectTaskMessage {
  taskId: string;
  type: 'design' | 'review' | 'refactor' | 'evaluate' | 'troubleshoot';
  priority: 'critical' | 'high' | 'medium' | 'low';
  context: {
    requirement?: BusinessRequirement;
    issue?: TechnicalIssue;
    proposal?: TechnicalProposal;
    metrics?: SystemMetrics;
  };
  constraints?: {
    timeline?: string;
    budget?: number;
    performance?: PerformanceRequirements;
    security?: SecurityRequirements;
  };
}
```

### Outgoing Messages
```typescript
interface ArchitectResultMessage {
  taskId: string;
  decision: {
    type: 'approved' | 'rejected' | 'needs-revision';
    rationale: string;
    alternatives?: Alternative[];
  };
  deliverables: {
    diagrams?: string[];
    specifications?: string[];
    adrs?: string[];
    guidelines?: string[];
  };
  assignments: {
    [agentName: string]: Task[];
  };
  risks?: Risk[];
  recommendations?: string[];
}
```

## Design Patterns Catalog

### Implemented Patterns
```typescript
// 1. Repository Pattern
interface Repository<T> {
  find(id: string): Promise<T | null>;
  findAll(criteria: Criteria): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

// 2. Factory Pattern
abstract class AgentFactory {
  abstract createAgent(config: AgentConfig): Agent;
  
  static getFactory(type: AgentType): AgentFactory {
    switch (type) {
      case 'frontend': return new FrontendAgentFactory();
      case 'backend': return new BackendAgentFactory();
      // ...
    }
  }
}

// 3. Observer Pattern (Event-driven)
class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  
  subscribe(event: string, handler: EventHandler): void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }
  
  publish(event: Event): void {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach(handler => handler(event));
  }
}

// 4. Strategy Pattern
interface CacheStrategy {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

class CacheManager {
  constructor(private strategy: CacheStrategy) {}
  
  async get(key: string): Promise<any> {
    return this.strategy.get(key);
  }
}
```

## Performance Optimization Guidelines

### Caching Strategy
```typescript
interface CachingLayers {
  browser: {
    strategy: 'Cache-Control headers';
    duration: '1 hour for static assets, 0 for dynamic';
  };
  cdn: {
    provider: 'Vercel Edge Network';
    regions: 'Global';
    invalidation: 'Tag-based';
  };
  application: {
    tool: 'Redis';
    patterns: ['Cache-aside', 'Write-through'];
    ttl: {
      user_session: 3600, // 1 hour
      api_responses: 300, // 5 minutes
      static_data: 86400  // 24 hours
    };
  };
  database: {
    query_cache: 'PostgreSQL built-in';
    materialized_views: 'For complex aggregations';
  };
}
```

## Troubleshooting Architecture Issues

### Common Problems

1. **Performance Bottlenecks**
   - Analyze with distributed tracing
   - Review database query plans
   - Check caching effectiveness
   - Optimize critical paths

2. **Scalability Issues**
   - Identify stateful components
   - Implement horizontal scaling
   - Use queue-based processing
   - Optimize database connections

3. **Integration Failures**
   - Implement circuit breakers
   - Add retry mechanisms
   - Use message queues for resilience
   - Monitor third-party SLAs

4. **Technical Debt**
   - Maintain debt registry
   - Plan incremental refactoring
   - Automate debt detection
   - Balance new features vs. cleanup

## Version History
- v1.0.0 (2024-01): Initial Architect Agent implementation
- v1.1.0 (2024-02): Added Domain-Driven Design support
- v1.2.0 (2024-03): Enhanced cloud-native patterns
- v2.0.0 (2024-07): AI-assisted architecture optimization