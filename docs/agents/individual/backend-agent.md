# Backend Agent Documentation

## Overview
The Backend Agent is responsible for server-side development, API implementation, database management, and ensuring robust backend services for the AI Guided SaaS platform. It handles Next.js API routes, integrations with external services, and maintains data integrity across the system.

## Core Responsibilities

### 1. API Development
- Design and implement RESTful APIs using Next.js API routes
- Create GraphQL endpoints when needed
- Implement authentication and authorization
- Handle request validation and error responses
- Optimize API performance and caching

### 2. Database Management
- Design and maintain PostgreSQL schemas via Supabase
- Implement efficient queries and indexes
- Manage database migrations
- Ensure data integrity and relationships
- Handle real-time subscriptions

### 3. Integration Services
- Connect with third-party APIs (OpenAI, Anthropic, Stripe)
- Implement webhook handlers
- Manage external service authentication
- Handle rate limiting and retries
- Implement fallback mechanisms

### 4. Security Implementation
- Implement JWT-based authentication
- Manage API keys and secrets
- Implement rate limiting
- Handle CORS and security headers
- Validate and sanitize inputs

## Technical Specifications

### Configuration
```typescript
{
  name: 'backend-agent',
  type: 'core',
  model: 'claude-3-sonnet',
  memory: '768MB',
  cpuShares: 1024,
  specializations: [
    'node.js',
    'postgresql',
    'api-design',
    'security',
    'performance-optimization'
  ],
  tools: [
    'api-generator',
    'database-migrator',
    'query-optimizer',
    'security-scanner'
  ]
}
```

### Required Skills
- **Node.js**: Advanced async patterns, streams, workers
- **TypeScript**: Type-safe API contracts, decorators
- **PostgreSQL**: Complex queries, indexes, procedures
- **Supabase**: Row Level Security, Edge Functions
- **Redis**: Caching strategies, pub/sub patterns

## Workflow Integration

### Input Sources
1. **Architect Agent**: API specifications and data models
2. **Frontend Agent**: API requirements and contracts
3. **Security Agent**: Security policies and requirements
4. **DevOps Agent**: Deployment and scaling needs

### Output Deliverables
1. **API Endpoints**: Fully documented and tested
2. **Database Schemas**: Migrations and seed data
3. **Integration Code**: External service connectors
4. **Documentation**: API documentation and usage guides

## Best Practices

### API Design Standards
```typescript
// API Route Example: /api/v1/projects/[id]
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  settings: z.object({
    isPublic: z.boolean(),
    features: z.array(z.string())
  }).optional()
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(req);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentication
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validation
    const body = await req.json();
    const validated = updateProjectSchema.parse(body);

    // Business logic
    const project = await updateProject(params.id, validated, user.id);

    return NextResponse.json({ data: project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database Patterns
```sql
-- Efficient query with proper indexes
CREATE INDEX idx_projects_user_created 
ON projects(user_id, created_at DESC);

-- Row Level Security policy
CREATE POLICY "Users can only see their own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

-- Optimized view for complex queries
CREATE VIEW project_analytics AS
SELECT 
  p.id,
  p.name,
  COUNT(DISTINCT pm.user_id) as member_count,
  COUNT(DISTINCT f.id) as file_count,
  MAX(f.updated_at) as last_activity
FROM projects p
LEFT JOIN project_members pm ON pm.project_id = p.id
LEFT JOIN files f ON f.project_id = p.id
GROUP BY p.id, p.name;
```

### Security Guidelines
1. Always validate input with Zod schemas
2. Use parameterized queries to prevent SQL injection
3. Implement proper authentication on all routes
4. Rate limit all public endpoints
5. Log security events for monitoring

## Communication Protocol

### Incoming Messages
```typescript
interface BackendTaskMessage {
  taskId: string;
  type: 'create-api' | 'optimize-query' | 'fix-bug' | 'integrate-service';
  priority: 'high' | 'medium' | 'low';
  specifications: {
    api?: ApiSpecification;
    query?: QueryOptimizationRequest;
    bug?: BugReport;
    integration?: IntegrationRequest;
  };
  dependencies?: string[];
}
```

### Outgoing Messages
```typescript
interface BackendResultMessage {
  taskId: string;
  status: 'completed' | 'in-progress' | 'blocked' | 'failed';
  deliverables?: {
    endpoints: ApiEndpoint[];
    migrations: string[];
    tests: string[];
    documentation: string[];
  };
  performance?: {
    averageResponseTime: number;
    p95ResponseTime: number;
    throughput: number;
  };
  issues?: string[];
}
```

## Performance Metrics

### Key Performance Indicators
1. **API Response Time**: Average and P95 latency
2. **Database Query Performance**: Slow query analysis
3. **Error Rate**: 4XX and 5XX response rates
4. **Throughput**: Requests per second capacity
5. **Integration Reliability**: External service success rate

### Monitoring Setup
```typescript
// Performance monitoring
interface BackendMetrics {
  api: {
    responseTime: number[];
    errorRate: number;
    throughput: number;
  };
  database: {
    queryTime: number[];
    connectionPool: {
      active: number;
      idle: number;
      waiting: number;
    };
    slowQueries: QueryMetric[];
  };
  integrations: {
    [service: string]: {
      successRate: number;
      averageLatency: number;
      errors: number;
    };
  };
}
```

## Troubleshooting Guide

### Common Issues

1. **API Performance Issues**
   - Check for N+1 queries
   - Verify database indexes
   - Review caching strategy
   - Monitor connection pool usage

2. **Database Problems**
   - Analyze slow query logs
   - Check for lock contention
   - Verify connection limits
   - Review query execution plans

3. **Integration Failures**
   - Check API key validity
   - Verify rate limits
   - Review error logs
   - Test fallback mechanisms

4. **Authentication Issues**
   - Verify JWT token generation
   - Check session management
   - Review CORS configuration
   - Test refresh token flow

## Integration Examples

### Implementing a New API Endpoint
```typescript
// 1. Receive specification from Architect Agent
const apiSpec: ApiSpecification = {
  endpoint: '/api/v1/analytics/usage',
  method: 'GET',
  authentication: 'required',
  parameters: {
    startDate: 'ISO 8601 date',
    endDate: 'ISO 8601 date',
    groupBy: 'day | week | month'
  },
  response: {
    data: 'UsageMetrics[]',
    pagination: 'PaginationInfo'
  }
};

// 2. Implement endpoint with proper validation
// 3. Add comprehensive tests
// 4. Document in OpenAPI format
// 5. Deploy and monitor
```

### Database Migration Example
```sql
-- Migration: 001_add_usage_analytics.sql
BEGIN;

CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usage_metrics_user_date 
ON usage_metrics(user_id, created_at DESC);

CREATE INDEX idx_usage_metrics_project_date 
ON usage_metrics(project_id, created_at DESC);

COMMIT;
```

## Version History
- v1.0.0 (2024-01): Initial Backend Agent implementation
- v1.1.0 (2024-02): Added Supabase Edge Functions support
- v1.2.0 (2024-03): Enhanced caching with Redis
- v2.0.0 (2024-07): Full Next.js 15 App Router compatibility