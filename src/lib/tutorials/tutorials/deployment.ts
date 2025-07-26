import { Tutorial } from '../types';

export const deploymentTutorial: Tutorial = {
  id: 'deployment',
  title: 'Deploying Your Application',
  description: 'Learn how to deploy your application to production',
  difficulty: 'intermediate',
  estimatedTime: '25 minutes',
  prerequisites: ['project-creation'],
  category: 'deployment',
  tags: ['deployment', 'production', 'hosting'],
  completionRewards: {
    points: 250,
    badges: ['deployer', 'production-ready'],
    unlocks: ['monitoring', 'scaling']
  },
  steps: [
    {
      id: 'open-deployment',
      title: 'Open Deployment Panel',
      content: 'Navigate to the Deployment section in your project.',
      type: 'action',
      action: {
        component: 'navigation',
        method: 'navigate',
        parameters: { path: '/deploy' }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'element_exists',
            target: '.deployment-panel',
            errorMessage: 'Please navigate to the Deployment section'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'choose-provider',
      title: 'Choose Hosting Provider',
      content: 'Select a hosting provider. We support Vercel, Netlify, AWS, and more.',
      type: 'action',
      action: {
        component: 'deployment',
        method: 'select-provider',
        parameters: { 
          options: ['vercel', 'netlify', 'aws', 'heroku']
        }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'value_equals',
            target: 'selected-provider',
            expected: 'any',
            errorMessage: 'Please select a hosting provider'
          }
        ]
      },
      hints: ['Vercel is recommended for Next.js applications'],
      skipAllowed: false
    },
    {
      id: 'configure-settings',
      title: 'Configure Deployment Settings',
      content: 'Set up environment variables, build commands, and deployment settings.',
      type: 'instruction',
      skipAllowed: false
    },
    {
      id: 'add-env-vars',
      title: 'Add Environment Variables',
      content: 'Add any required environment variables for your production environment.',
      type: 'action',
      action: {
        component: 'deployment',
        method: 'add-env-var',
        parameters: { 
          example: {
            key: 'DATABASE_URL',
            value: 'your-database-url'
          }
        }
      },
      validation: {
        type: 'manual',
        criteria: []
      },
      hints: ['Common variables include API keys, database URLs, and feature flags'],
      skipAllowed: true
    },
    {
      id: 'preview-deployment',
      title: 'Preview Deployment',
      content: 'Review your deployment configuration before going live.',
      type: 'action',
      action: {
        component: 'deployment',
        method: 'preview',
        parameters: {}
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'element_exists',
            target: '.deployment-preview',
            errorMessage: 'Click Preview to see your deployment configuration'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'deploy-app',
      title: 'Deploy Your Application',
      content: 'Click Deploy to push your application to production!',
      type: 'action',
      action: {
        component: 'deployment',
        method: 'deploy',
        parameters: { 
          environment: 'production'
        }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'api_call',
            target: '/api/deploy',
            errorMessage: 'Deployment failed. Please check your configuration.'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'verify-deployment',
      title: 'Verify Deployment',
      content: 'Your app is deploying! Once complete, you\'ll receive a production URL.',
      type: 'validation',
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'custom',
            target: 'deployment-status',
            expected: 'success',
            errorMessage: 'Waiting for deployment to complete...'
          }
        ]
      },
      skipAllowed: false
    }
  ]
};