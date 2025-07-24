# QA Agent Documentation

## Overview
The QA Agent ensures the quality, reliability, and correctness of the AI Guided SaaS platform through comprehensive testing, bug detection, and quality assurance processes. It works across all layers of the application to maintain high standards of code quality and user experience.

## Core Responsibilities

### 1. Test Development
- Write unit tests using Jest and React Testing Library
- Create integration tests for API endpoints
- Develop E2E tests with Playwright
- Implement visual regression testing
- Maintain test coverage above 80%

### 2. Bug Detection
- Perform static code analysis
- Identify potential security vulnerabilities
- Detect performance bottlenecks
- Find accessibility issues
- Monitor runtime errors

### 3. Quality Assurance
- Review code for best practices
- Ensure TypeScript type safety
- Validate API contracts
- Check UI/UX consistency
- Verify business logic correctness

### 4. Continuous Monitoring
- Track test execution results
- Monitor application metrics
- Analyze error logs
- Report quality metrics
- Maintain quality dashboards

## Technical Specifications

### Configuration
```typescript
{
  name: 'qa-agent',
  type: 'core',
  model: 'claude-3-sonnet',
  memory: '512MB',
  cpuShares: 768,
  specializations: [
    'testing',
    'debugging',
    'security-analysis',
    'performance-testing',
    'accessibility'
  ],
  tools: [
    'test-generator',
    'bug-detector',
    'coverage-analyzer',
    'performance-profiler',
    'security-scanner'
  ]
}
```

### Required Skills
- **Testing Frameworks**: Jest, Playwright, React Testing Library
- **Analysis Tools**: ESLint, TypeScript compiler, Lighthouse
- **Security**: OWASP knowledge, vulnerability scanning
- **Performance**: Profiling, load testing, optimization
- **Debugging**: Chrome DevTools, Node.js debugging

## Workflow Integration

### Input Sources
1. **Frontend Agent**: UI components for testing
2. **Backend Agent**: API endpoints for validation
3. **Architect Agent**: Quality requirements and standards
4. **DevOps Agent**: Deployment verification needs

### Output Deliverables
1. **Test Suites**: Comprehensive test coverage
2. **Bug Reports**: Detailed issue documentation
3. **Quality Reports**: Metrics and analysis
4. **Recommendations**: Improvement suggestions

## Best Practices

### Test Writing Standards
```typescript
// Unit Test Example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });

  it('should apply correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
    
    rerender(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');
  });
});
```

### E2E Test Example
```typescript
// Playwright E2E Test
import { test, expect } from '@playwright/test';

test.describe('Project Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create new project successfully', async ({ page }) => {
    // Navigate to projects
    await page.click('text=Projects');
    await page.click('text=New Project');

    // Fill project details
    await page.fill('[name="projectName"]', 'Test Project');
    await page.fill('[name="description"]', 'E2E test project');
    await page.selectOption('[name="template"]', 'saas-starter');

    // Submit and verify
    await page.click('text=Create Project');
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
    await expect(page.locator('h1')).toContainText('Test Project');
  });

  test('should handle validation errors', async ({ page }) => {
    await page.click('text=New Project');
    await page.click('text=Create Project');
    
    await expect(page.locator('.error-message')).toContainText('Project name is required');
  });
});
```

### API Testing Pattern
```typescript
// API Integration Test
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/v1/projects/route';
import { prismaMock } from '@/tests/mocks/prisma';

describe('/api/v1/projects', () => {
  it('should create project with valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'Authorization': 'Bearer valid-token',
        'Content-Type': 'application/json'
      },
      body: {
        name: 'New Project',
        description: 'Test description'
      }
    });

    prismaMock.project.create.mockResolvedValue({
      id: 'project-123',
      name: 'New Project',
      description: 'Test description',
      userId: 'user-123',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const jsonData = JSON.parse(res._getData());
    expect(jsonData.data.name).toBe('New Project');
  });

  it('should return 400 for invalid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'Authorization': 'Bearer valid-token'
      },
      body: {
        name: '' // Invalid: empty name
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const jsonData = JSON.parse(res._getData());
    expect(jsonData.error).toContain('Validation failed');
  });
});
```

## Quality Metrics

### Coverage Requirements
```javascript
// jest.config.js coverage thresholds
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/lib/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  }
};
```

### Performance Benchmarks
```typescript
interface PerformanceBenchmarks {
  api: {
    responseTime: {
      p50: 100, // ms
      p95: 500,
      p99: 1000
    }
  };
  frontend: {
    FCP: 1.8, // seconds
    LCP: 2.5,
    TTI: 3.8,
    CLS: 0.1
  };
  database: {
    queryTime: {
      simple: 10, // ms
      complex: 100,
      aggregation: 500
    }
  };
}
```

## Bug Report Template
```typescript
interface BugReport {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'functional' | 'performance' | 'security' | 'ui' | 'accessibility';
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: {
    browser?: string;
    os?: string;
    nodeVersion?: string;
  };
  screenshots?: string[];
  logs?: string[];
  affectedComponents: string[];
  suggestedFix?: string;
}
```

## Communication Protocol

### Incoming Messages
```typescript
interface QATaskMessage {
  taskId: string;
  type: 'test-feature' | 'verify-fix' | 'performance-test' | 'security-scan';
  priority: 'high' | 'medium' | 'low';
  target: {
    component?: string;
    api?: string;
    feature?: string;
    fix?: string;
  };
  requirements?: TestRequirements;
}
```

### Outgoing Messages
```typescript
interface QAResultMessage {
  taskId: string;
  status: 'passed' | 'failed' | 'blocked';
  results: {
    testsRun: number;
    testsPassed: number;
    testsFailed: number;
    coverage: CoverageReport;
  };
  issues: BugReport[];
  recommendations: string[];
  metrics: QualityMetrics;
}
```

## Troubleshooting Guide

### Common Issues

1. **Flaky Tests**
   - Add proper wait conditions
   - Mock external dependencies
   - Use stable selectors
   - Increase timeouts appropriately

2. **Low Coverage**
   - Identify untested code paths
   - Add edge case tests
   - Test error scenarios
   - Cover all branches

3. **Performance Issues**
   - Profile test execution
   - Parallelize test runs
   - Use test data factories
   - Optimize setup/teardown

4. **False Positives**
   - Review test assertions
   - Check timing issues
   - Verify test isolation
   - Update outdated tests

## Version History
- v1.0.0 (2024-01): Initial QA Agent implementation
- v1.1.0 (2024-02): Added visual regression testing
- v1.2.0 (2024-03): Enhanced security scanning capabilities
- v2.0.0 (2024-07): AI-powered test generation features