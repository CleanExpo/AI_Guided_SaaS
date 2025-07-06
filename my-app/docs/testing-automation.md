# Testing Automation

## Test Strategy
- **Unit**: 90% coverage (Jest, React Testing Library)
- **Integration**: 80% coverage (API endpoints, database)
- **E2E**: 70% coverage (Playwright, user workflows)
- **Performance**: Lighthouse, load testing
- **Security**: OWASP ZAP, npm audit

## CI Pipeline
```yaml
# .github/workflows/test.yml
jobs:
  test:
    steps:
      - run: npm run test:unit -- --coverage
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run test:lighthouse
```

## Quality Gates
- Unit test coverage: >90%
- API success rate: >99%
- Lighthouse score: >90
- Zero high-severity vulnerabilities

## Test Contracts
```typescript
// API contract example
'/api/chat': {
  request: { message: string, persona: Persona }
  response: { message: string, suggestions: string[] }
}
```

## Commands
```bash
/test:generate --component=AuthSystem
/test:analyze --identify-gaps
npm run test:all
