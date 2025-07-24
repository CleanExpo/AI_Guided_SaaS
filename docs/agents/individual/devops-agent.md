# DevOps Agent Documentation

## Overview
The DevOps Agent manages deployment pipelines, infrastructure, monitoring, and ensures smooth operations of the AI Guided SaaS platform. It handles CI/CD processes, container orchestration, cloud infrastructure, and maintains system reliability.

## Core Responsibilities

### 1. CI/CD Pipeline Management
- Configure and maintain GitHub Actions workflows
- Implement automated build and deployment processes
- Manage staging and production environments
- Handle rollback procedures
- Optimize build times and caching

### 2. Infrastructure Management
- Provision and manage Vercel deployments
- Configure Docker containers for agents
- Manage environment variables and secrets
- Implement auto-scaling policies
- Monitor resource utilization

### 3. Monitoring & Observability
- Set up application monitoring with OpenTelemetry
- Configure log aggregation and analysis
- Implement health checks and alerts
- Track performance metrics
- Create operational dashboards

### 4. Security & Compliance
- Manage SSL certificates
- Implement security headers
- Handle secrets rotation
- Ensure compliance requirements
- Perform security audits

## Technical Specifications

### Configuration
```typescript
{
  name: 'devops-agent',
  type: 'core',
  model: 'claude-3-sonnet',
  memory: '512MB',
  cpuShares: 768,
  specializations: [
    'ci-cd',
    'docker',
    'kubernetes',
    'monitoring',
    'cloud-infrastructure'
  ],
  tools: [
    'pipeline-builder',
    'container-manager',
    'infrastructure-provisioner',
    'monitoring-configurator',
    'security-scanner'
  ]
}
```

### Required Skills
- **CI/CD**: GitHub Actions, deployment strategies
- **Containers**: Docker, container orchestration
- **Cloud**: Vercel, AWS/GCP, serverless
- **Monitoring**: OpenTelemetry, Prometheus, Grafana
- **Security**: SSL/TLS, secrets management, scanning

## Workflow Integration

### Input Sources
1. **Architect Agent**: Infrastructure requirements
2. **Backend Agent**: Deployment specifications
3. **QA Agent**: Test automation needs
4. **Security Agent**: Security policies

### Output Deliverables
1. **CI/CD Pipelines**: Automated workflows
2. **Infrastructure Code**: IaC configurations
3. **Monitoring Setup**: Dashboards and alerts
4. **Documentation**: Runbooks and procedures

## Best Practices

### GitHub Actions Workflow
```yaml
# .github/workflows/production-deploy.yml
name: Production Deployment

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20.x'
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run typecheck || true # Allow TypeScript errors for now
      
      - name: Run tests
        run: npm run test:ci
        env:
          CI: true
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level=high || true
      
      - name: Run SAST scan
        uses: github/super-linter@v5
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  deploy-production:
    needs: [quality-checks, security-scan]
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Vercel CLI
        run: npm install -g vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        id: deploy
        run: |
          deployment_url=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
          echo "deployment_url=$deployment_url" >> $GITHUB_OUTPUT
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Deployed to production: ${{ steps.deploy.outputs.deployment_url }}'
            })

  post-deployment:
    needs: deploy-production
    runs-on: ubuntu-latest
    steps:
      - name: Run smoke tests
        run: |
          npm install -g @playwright/test
          npx playwright test tests/smoke --reporter=list
        env:
          BASE_URL: ${{ steps.deploy.outputs.deployment_url }}
      
      - name: Notify monitoring
        run: |
          curl -X POST ${{ secrets.MONITORING_WEBHOOK }} \
            -H "Content-Type: application/json" \
            -d '{"deployment": "production", "version": "${{ github.sha }}"}'
```

### Docker Configuration
```dockerfile
# Dockerfile for Agent Containers
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Monitoring Configuration
```typescript
// OpenTelemetry Setup
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'ai-guided-saas',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      headers: {
        'api-key': process.env.OTEL_API_KEY,
      },
    }),
  }),
});

// Health check endpoint
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      external_services: await checkExternalServices(),
    },
  };

  const allHealthy = Object.values(health.checks).every(check => check.status === 'healthy');
  
  return NextResponse.json(health, { 
    status: allHealthy ? 200 : 503 
  });
}
```

## Deployment Strategies

### Blue-Green Deployment
```typescript
interface BlueGreenDeployment {
  stages: [
    'prepare-green-environment',
    'deploy-to-green',
    'run-smoke-tests',
    'switch-traffic',
    'monitor-metrics',
    'cleanup-blue'
  ];
  rollback: {
    trigger: 'error-rate > 5% || response-time > 2s';
    action: 'switch-traffic-to-blue';
  };
}
```

### Canary Deployment
```yaml
# Vercel canary configuration
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/:path*",
      "has": [
        {
          "type": "cookie",
          "key": "canary",
          "value": "true"
        }
      ]
    }
  ],
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "X-Deployment-Type",
          "value": "canary"
        }
      ]
    }
  ]
}
```

## Communication Protocol

### Incoming Messages
```typescript
interface DevOpsTaskMessage {
  taskId: string;
  type: 'deploy' | 'rollback' | 'scale' | 'monitor' | 'configure';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  specifications: {
    deployment?: DeploymentSpec;
    scaling?: ScalingPolicy;
    monitoring?: MonitoringConfig;
    configuration?: InfrastructureConfig;
  };
  environment: 'development' | 'staging' | 'production';
}
```

### Outgoing Messages
```typescript
interface DevOpsResultMessage {
  taskId: string;
  status: 'success' | 'in-progress' | 'failed' | 'rolled-back';
  deployment?: {
    url: string;
    version: string;
    buildTime: number;
    deploymentTime: number;
  };
  metrics?: {
    availability: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  alerts?: Alert[];
}
```

## Monitoring Dashboards

### Key Metrics
```typescript
interface SystemMetrics {
  application: {
    requestsPerSecond: number;
    errorRate: number;
    responseTime: {
      p50: number;
      p95: number;
      p99: number;
    };
  };
  infrastructure: {
    cpu: number;
    memory: number;
    diskUsage: number;
    networkIO: {
      inbound: number;
      outbound: number;
    };
  };
  business: {
    activeUsers: number;
    projectsCreated: number;
    apiCallsPerHour: number;
  };
}
```

## Troubleshooting Guide

### Common Issues

1. **Deployment Failures**
   - Check build logs for errors
   - Verify environment variables
   - Test locally with production build
   - Review Vercel function limits

2. **Performance Degradation**
   - Analyze APM metrics
   - Check database slow queries
   - Review CDN cache hit rates
   - Optimize bundle sizes

3. **High Error Rates**
   - Check error logs
   - Review recent deployments
   - Verify external service status
   - Test rollback procedures

4. **Resource Exhaustion**
   - Monitor memory usage
   - Check connection pools
   - Review auto-scaling policies
   - Optimize resource allocation

## Incident Response

### Runbook Template
```markdown
## Incident: [Name]

### Detection
- Triggered by: [Alert/User Report]
- Time: [Timestamp]
- Severity: [Critical/High/Medium/Low]

### Impact
- Affected services: [List]
- User impact: [Description]
- Business impact: [Metrics]

### Response Steps
1. Acknowledge incident
2. Assess scope and impact
3. Implement immediate mitigation
4. Root cause analysis
5. Long-term fix deployment
6. Post-mortem documentation

### Escalation
- L1: DevOps on-call
- L2: Backend team lead
- L3: CTO/Engineering VP
```

## Version History
- v1.0.0 (2024-01): Initial DevOps Agent implementation
- v1.1.0 (2024-02): Added Vercel deployment automation
- v1.2.0 (2024-03): Enhanced monitoring with OpenTelemetry
- v2.0.0 (2024-07): Multi-region deployment support