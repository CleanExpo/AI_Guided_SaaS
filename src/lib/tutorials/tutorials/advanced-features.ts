import { Tutorial } from '../types';

export const advancedFeaturesTutorial: Tutorial = {
  id: 'advanced-features',
  title: 'Advanced Platform Features',
  description: 'Explore advanced features like real-time collaboration, custom plugins, and automation',
  difficulty: 'advanced',
  estimatedTime: '30 minutes',
  prerequisites: ['ai-assistant', 'deployment'],
  category: 'advanced',
  tags: ['advanced', 'collaboration', 'plugins', 'automation'],
  completionRewards: {
    points: 300,
    badges: ['power-user', 'platform-expert'],
    unlocks: ['enterprise-features']
  },
  steps: [
    {
      id: 'collaboration-intro',
      title: 'Real-time Collaboration',
      content: 'Learn how to collaborate with team members in real-time on your projects.',
      type: 'instruction',
      skipAllowed: false
    },
    {
      id: 'invite-teammate',
      title: 'Invite a Teammate',
      content: 'Add a team member to your project by entering their email address.',
      type: 'action',
      action: {
        component: 'collaboration',
        method: 'invite',
        parameters: { 
          field: 'email',
          exampleValue: 'teammate@example.com'
        }
      },
      validation: {
        type: 'manual',
        criteria: []
      },
      hints: ['You can invite multiple team members at once'],
      skipAllowed: true
    },
    {
      id: 'plugin-system',
      title: 'Plugin System',
      content: 'Extend your project with plugins from our marketplace.',
      type: 'action',
      action: {
        component: 'navigation',
        method: 'navigate',
        parameters: { path: '/marketplace' }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'element_exists',
            target: '.marketplace-container',
            errorMessage: 'Navigate to the Marketplace'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'install-plugin',
      title: 'Install a Plugin',
      content: 'Choose and install a plugin that enhances your project.',
      type: 'action',
      action: {
        component: 'marketplace',
        method: 'install-plugin',
        parameters: { 
          category: 'productivity'
        }
      },
      validation: {
        type: 'manual',
        criteria: []
      },
      hints: ['Popular plugins include linters, formatters, and UI component libraries'],
      skipAllowed: true
    },
    {
      id: 'automation-workflows',
      title: 'Automation Workflows',
      content: 'Create automated workflows to streamline your development process.',
      type: 'instruction',
      skipAllowed: false
    },
    {
      id: 'create-workflow',
      title: 'Create Your First Workflow',
      content: 'Set up a workflow that automatically runs tests when you push code.',
      type: 'action',
      action: {
        component: 'automation',
        method: 'create-workflow',
        parameters: { 
          template: 'test-on-push'
        }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'api_call',
            target: '/api/workflows/create',
            errorMessage: 'Failed to create workflow'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'custom-commands',
      title: 'Custom Commands',
      content: 'Learn to create custom commands for repetitive tasks.',
      type: 'instruction',
      skipAllowed: true
    },
    {
      id: 'performance-monitoring',
      title: 'Performance Monitoring',
      content: 'Enable performance monitoring to track your application\'s health.',
      type: 'action',
      action: {
        component: 'settings',
        method: 'toggle',
        parameters: { 
          setting: 'performance-monitoring',
          value: true
        }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'value_equals',
            target: 'performance-monitoring-enabled',
            expected: true,
            errorMessage: 'Please enable performance monitoring'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'completion',
      title: 'Congratulations!',
      content: 'You\'ve mastered the advanced features! You\'re now a power user of AI Guided SaaS.',
      type: 'instruction',
      skipAllowed: false
    }
  ]
};