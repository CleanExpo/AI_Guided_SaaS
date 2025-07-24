# Frontend Agent Documentation

## Overview
The Frontend Agent is a specialized AI agent responsible for all UI/UX implementation tasks within the AI Guided SaaS platform. It focuses on React development, component creation, styling, and ensuring a seamless user experience across both Simple Mode (Lovable.dev-style) and Advanced Mode (VS Code-style) interfaces.

## Core Responsibilities

### 1. Component Development
- Create and maintain React components following the established design system
- Implement responsive layouts using Tailwind CSS
- Ensure component reusability and modularity
- Maintain TypeScript type safety

### 2. UI/UX Implementation
- Transform design mockups into functional interfaces
- Implement interactive features and animations using Framer Motion
- Ensure accessibility compliance (WCAG 2.1 AA)
- Optimize for performance and user experience

### 3. State Management
- Implement client-side state using Zustand
- Manage form state and validation
- Handle real-time updates via Socket.io
- Coordinate with React Query for server state

### 4. Integration Tasks
- Connect UI components with backend APIs
- Implement authentication flows with NextAuth
- Integrate third-party libraries (Monaco Editor, React DnD, etc.)
- Handle file uploads and downloads

## Technical Specifications

### Configuration
```typescript
{
  name: 'frontend-agent',
  type: 'core',
  model: 'claude-3-sonnet',
  memory: '512MB',
  cpuShares: 768,
  specializations: [
    'react',
    'typescript',
    'tailwind-css',
    'next.js',
    'ui-ux'
  ],
  tools: [
    'component-generator',
    'style-analyzer',
    'accessibility-checker',
    'performance-profiler'
  ]
}
```

### Required Skills
- **React 19**: Hooks, Context, Suspense, Server Components
- **TypeScript**: Advanced types, generics, type guards
- **Tailwind CSS**: Custom utilities, responsive design, dark mode
- **Next.js 15**: App router, middleware, API routes
- **Testing**: React Testing Library, Jest, Playwright

## Workflow Integration

### Input Sources
1. **Architect Agent**: Component specifications and architectural decisions
2. **UX Designer Agent**: Design mockups and interaction patterns
3. **Backend Agent**: API contracts and data structures
4. **QA Agent**: Bug reports and test failures

### Output Deliverables
1. **React Components**: Fully typed, tested, and documented
2. **Style Sheets**: Tailwind utilities and custom CSS
3. **Integration Code**: API connections and state management
4. **Documentation**: Component usage guides and prop documentation

## Best Practices

### Code Standards
```typescript
// Component Structure Example
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  loading = false,
  children,
  onClick
}) => {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        variants[variant],
        sizes[size],
        loading && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

### Performance Guidelines
1. Use React.memo for expensive components
2. Implement virtual scrolling for long lists
3. Lazy load heavy components
4. Optimize bundle size with dynamic imports
5. Use Next.js Image component for images

### Accessibility Requirements
1. Proper ARIA labels and roles
2. Keyboard navigation support
3. Focus management
4. Color contrast compliance
5. Screen reader compatibility

## Communication Protocol

### Incoming Messages
```typescript
interface FrontendTaskMessage {
  taskId: string;
  type: 'create-component' | 'fix-bug' | 'implement-feature' | 'optimize';
  priority: 'high' | 'medium' | 'low';
  specifications: {
    component?: ComponentSpec;
    bug?: BugReport;
    feature?: FeatureRequest;
    optimization?: OptimizationTarget;
  };
  deadline?: Date;
}
```

### Outgoing Messages
```typescript
interface FrontendResultMessage {
  taskId: string;
  status: 'completed' | 'in-progress' | 'blocked' | 'failed';
  deliverables?: {
    files: string[];
    components: string[];
    tests: string[];
    documentation: string[];
  };
  metrics?: {
    performanceScore: number;
    accessibilityScore: number;
    bundleSizeChange: number;
  };
  blockers?: string[];
}
```

## Performance Metrics

### Key Performance Indicators
1. **Component Creation Speed**: Average time to create a new component
2. **Bug Fix Rate**: Number of UI bugs fixed per sprint
3. **Code Quality Score**: ESLint/TypeScript error rate
4. **Performance Score**: Lighthouse scores for implemented features
5. **Reusability Rate**: Percentage of components reused across features

### Monitoring
```typescript
// Performance tracking
const FrontendMetrics = {
  componentCreationTime: [], // in minutes
  bugFixTime: [], // in minutes
  codeQualityScore: 0, // 0-100
  performanceScore: {
    FCP: 0, // First Contentful Paint
    LCP: 0, // Largest Contentful Paint
    TTI: 0, // Time to Interactive
    CLS: 0  // Cumulative Layout Shift
  },
  componentReusability: 0 // percentage
};
```

## Troubleshooting Guide

### Common Issues

1. **Component Rendering Issues**
   - Check React DevTools for errors
   - Verify props are correctly passed
   - Ensure state updates are immutable
   - Check for infinite re-render loops

2. **Style Conflicts**
   - Use Tailwind merge for dynamic classes
   - Check CSS specificity issues
   - Verify dark mode compatibility
   - Test responsive breakpoints

3. **Performance Degradation**
   - Profile with React DevTools Profiler
   - Check for unnecessary re-renders
   - Optimize large lists with virtualization
   - Reduce bundle size with code splitting

4. **TypeScript Errors**
   - Verify type definitions are up to date
   - Check for any type assertions
   - Ensure proper generic constraints
   - Update @types packages

## Integration Examples

### Creating a New Feature Component
```typescript
// 1. Receive task from Architect Agent
const task: FrontendTaskMessage = {
  taskId: 'FE-001',
  type: 'create-component',
  priority: 'high',
  specifications: {
    component: {
      name: 'DataVisualization',
      type: 'feature',
      requirements: [
        'Display real-time data charts',
        'Support multiple chart types',
        'Responsive design',
        'Export functionality'
      ]
    }
  }
};

// 2. Implement component
// 3. Add tests
// 4. Document usage
// 5. Report completion
```

## Version History
- v1.0.0 (2024-01): Initial Frontend Agent implementation
- v1.1.0 (2024-02): Added Tailwind CSS v4 support
- v1.2.0 (2024-03): Enhanced TypeScript error handling
- v2.0.0 (2024-07): Full React 19 and Next.js 15 compatibility