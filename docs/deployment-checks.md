# Deployment Checks

## Pre-Deployment
```bash
npm run build && npm run typecheck && npm run lint && npm run test
npm audit --audit-level=high
```

## Environment Validation
- **Staging**: Database, API endpoints, SSL certificates
- **Production**: Full monitoring + incident response

## Performance Thresholds
- Page load: <2s
- API response: <500ms
- Memory: <512MB
- Error rate: <0.1%
- Uptime: >99.9%

## Health Checks
```typescript
// API validation
const endpoints = ['/api/health', '/api/chat', '/api/projects']
// External services: OpenAI, Supabase, Vercel
```

## Rollback Triggers
- Error rate >1%
- Response time >5s
- 3 consecutive health check failures

## Commands
```bash
/docs:validate --deployment-ready
vercel rollback  # Emergency rollback
