import { Tutorial } from '../types';

export const projectCreationTutorial: Tutorial = {
  id: 'project-creation',
  title: 'Creating Your First Project',
  description: 'Learn how to create and configure a new project using AI assistance',
  difficulty: 'beginner',
  estimatedTime: '15 minutes',
  prerequisites: ['getting-started'],
  category: 'projects',
  tags: ['projects', 'ai', 'creation'],
  completionRewards: {
    points: 150,
    badges: ['project-creator'],
    unlocks: ['ai-assistant', 'deployment']
  },
  steps: [
    {
      id: 'start-project',
      title: 'Start a New Project',
      content: 'Let\'s create your first project. Click the "New Project" button.',
      type: 'action',
      action: {
        component: 'projects',
        method: 'click',
        parameters: { target: 'new-project-button' }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'element_exists',
            target: '.project-creation-modal',
            errorMessage: 'Please click the New Project button'
          }
        ]
      },
      hints: ['The New Project button is usually in the top right corner'],
      skipAllowed: false
    },
    {
      id: 'describe-project',
      title: 'Describe Your Project',
      content: 'In the text area, describe what kind of application you want to build. Be specific about features and functionality.',
      type: 'action',
      action: {
        component: 'project-form',
        method: 'fill',
        parameters: {
          field: 'requirements',
          exampleValue: 'I need a task management app with user authentication, project boards, and real-time collaboration'
        }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'value_equals',
            target: 'requirements-field-length',
            expected: 50, // Minimum characters
            errorMessage: 'Please provide a detailed description (at least 50 characters)'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'select-ai-model',
      title: 'Choose AI Model',
      content: 'Select the AI model that will help generate your project. Each model has different strengths.',
      type: 'instruction',
      skipAllowed: true
    },
    {
      id: 'generate-project',
      title: 'Generate Project',
      content: 'Click "Generate Project" and watch as the AI creates your project structure, code, and documentation.',
      type: 'action',
      action: {
        component: 'project-form',
        method: 'submit',
        parameters: { action: 'generate' }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'api_call',
            target: '/api/projects/generate',
            errorMessage: 'Project generation failed. Please try again.'
          }
        ]
      },
      skipAllowed: false
    }
  ]
};