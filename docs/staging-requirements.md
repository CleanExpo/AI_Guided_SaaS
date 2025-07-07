# Staging Requirements

## Environment Setup
- **Platform**: Vercel (staging branch)
- **Database**: PostgreSQL (Railway staging)
- **Cache**: Redis Cloud (staging tier)
- **Monitoring**: Health checks every 5 minutes

## Validation Pipeline
```bash
# staging-validation.sh
npm run build && npm run typecheck && npm run lint && npm run test
node scripts/validate-database-connection.js
npm audit --audit-level=high
npm run test:lighthouse-staging
```

## Performance Targets
- Page load: <2s (home), <3s (chat), <5s (generation)
- API response: <500ms (auth), <5s (chat), <30s (project)
- Resource usage: <80% memory, <70% CPU
- Lighthouse score: >90

## Health Checks
```typescript
// Key endpoints monitored
['/api/health', '/api/chat', '/api/generate']
// Timeout: 5-30s, Retries: 1-3, Alert on failure
```

## Promotion Criteria
- Build success: Required
- Test pass rate: >98%
- Performance score: >90
- Security scan: Clean
- Manual approval: Required

## Commands
```bash
/staging:analyze --performance --security
npx vercel --token $VERCEL_TOKEN
