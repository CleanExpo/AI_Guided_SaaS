import { HealthIssue } from './types';

export const mockIssues: HealthIssue[] = [
  {
    id: 'SEC-001',
    type: 'critical',
    category: 'security',
    title: 'Outdated dependency with known vulnerability',
    description: 'Package @types/node has a security vulnerability',
    file: 'package.json',
    autoFixable: true,
    estimatedTime: 60
  },
  {
    id: 'DEP-001',
    type: 'high',
    category: 'dependency',
    title: 'Deprecated package usage',
    description: 'Using deprecated version of react-router',
    file: 'package.json',
    autoFixable: true,
    estimatedTime: 120
  },
  {
    id: 'MOD-001',
    type: 'medium',
    category: 'module',
    title: 'Missing error boundary',
    description: 'Component lacks error boundary implementation',
    file: 'src/components/ui/card.tsx',
    line: 15,
    autoFixable: true,
    estimatedTime: 180
  },
  {
    id: 'PERF-001',
    type: 'medium',
    category: 'performance',
    title: 'Unoptimized image loading',
    description: 'Images not using Next.js Image component',
    file: 'src/app/page.tsx',
    line: 42,
    autoFixable: true,
    estimatedTime: 90
  },
  {
    id: 'UX-001',
    type: 'low',
    category: 'ux',
    title: 'Missing accessibility labels',
    description: 'Form inputs missing aria-labels',
    file: 'src/components/auth/SignInForm.tsx',
    line: 28,
    autoFixable: true,
    estimatedTime: 45
  }
];