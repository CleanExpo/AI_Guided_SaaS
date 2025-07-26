import { Tutorial } from '../types';

export const gettingStartedTutorial: Tutorial = {
  id: 'getting-started',
  title: 'Getting Started with AI Guided SaaS',
  description: 'Learn the basics of the platform in this interactive walkthrough',
  difficulty: 'beginner',
  estimatedTime: '10 minutes',
  prerequisites: [],
  category: 'basics',
  tags: ['onboarding', 'introduction', 'basics'],
  completionRewards: {
    points: 100,
    badges: ['first-steps'],
    unlocks: ['project-creation']
  },
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to AI Guided SaaS',
      content: 'Welcome! This tutorial will guide you through the basic features of our platform. Let\'s start by exploring the dashboard.',
      type: 'instruction',
      skipAllowed: false
    },
    {
      id: 'navigate-dashboard',
      title: 'Navigate to Dashboard',
      content: 'Click on the Dashboard link in the navigation menu.',
      type: 'action',
      action: {
        component: 'navigation',
        method: 'click',
        parameters: { target: 'dashboard-link' }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'element_exists',
            target: '.dashboard-container',
            errorMessage: 'Please click on the Dashboard link to continue'
          }
        ]
      },
      hints: ['Look for the Dashboard link in the top navigation bar'],
      skipAllowed: false
    },
    {
      id: 'explore-metrics',
      title: 'Explore Your Metrics',
      content: 'Great! This is your dashboard. Here you can see an overview of your projects, recent activity, and system metrics.',
      type: 'instruction',
      skipAllowed: true
    },
    {
      id: 'quiz-basics',
      title: 'Quick Check',
      content: 'What is the main purpose of the dashboard?',
      type: 'quiz',
      validation: {
        type: 'quiz',
        criteria: [
          {
            type: 'value_equals',
            target: 'answer',
            expected: 'overview',
            errorMessage: 'The dashboard provides an overview of your projects and activity'
          }
        ]
      },
      skipAllowed: false
    }
  ]
};