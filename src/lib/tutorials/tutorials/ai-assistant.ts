import { Tutorial } from '../types';

export const aiAssistantTutorial: Tutorial = {
  id: 'ai-assistant',
  title: 'Working with AI Assistant',
  description: 'Master the AI assistant to boost your productivity',
  difficulty: 'intermediate',
  estimatedTime: '20 minutes',
  prerequisites: ['project-creation'],
  category: 'ai',
  tags: ['ai', 'assistant', 'productivity'],
  completionRewards: {
    points: 200,
    badges: ['ai-master'],
    unlocks: ['advanced-features']
  },
  steps: [
    {
      id: 'open-assistant',
      title: 'Open AI Assistant',
      content: 'Open the AI Assistant panel by clicking the AI icon or pressing Cmd/Ctrl + K.',
      type: 'action',
      action: {
        component: 'ai-assistant',
        method: 'open',
        parameters: { trigger: 'keyboard-shortcut' }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'element_exists',
            target: '.ai-assistant-panel',
            errorMessage: 'Please open the AI Assistant panel'
          }
        ]
      },
      hints: ['Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)'],
      skipAllowed: false
    },
    {
      id: 'ask-question',
      title: 'Ask Your First Question',
      content: 'Type a question about your code or project. For example: "How do I add authentication to my app?"',
      type: 'action',
      action: {
        component: 'ai-assistant',
        method: 'input',
        parameters: { 
          field: 'question',
          exampleValue: 'How do I add authentication to my app?'
        }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'value_equals',
            target: 'input-length',
            expected: 10,
            errorMessage: 'Please type a question (at least 10 characters)'
          }
        ]
      },
      skipAllowed: false
    },
    {
      id: 'review-response',
      title: 'Review AI Response',
      content: 'The AI will provide a detailed response. You can ask follow-up questions or apply suggested code changes.',
      type: 'instruction',
      skipAllowed: true
    },
    {
      id: 'apply-suggestion',
      title: 'Apply Code Suggestion',
      content: 'If the AI suggests code changes, you can apply them directly by clicking "Apply Changes".',
      type: 'action',
      action: {
        component: 'ai-assistant',
        method: 'apply-suggestion',
        parameters: { confirm: true }
      },
      validation: {
        type: 'manual',
        criteria: []
      },
      hints: ['Look for the "Apply Changes" button in the AI response'],
      skipAllowed: true
    },
    {
      id: 'context-commands',
      title: 'Learn Context Commands',
      content: 'Use @ to reference files, # to reference functions, and ! for special commands.',
      type: 'instruction',
      skipAllowed: false
    },
    {
      id: 'practice-context',
      title: 'Practice Context Commands',
      content: 'Try typing "@" to see available files, or "#" to see functions in your project.',
      type: 'action',
      action: {
        component: 'ai-assistant',
        method: 'input',
        parameters: { 
          field: 'command',
          value: '@'
        }
      },
      validation: {
        type: 'automatic',
        criteria: [
          {
            type: 'element_exists',
            target: '.context-menu',
            errorMessage: 'Type @ to see the context menu'
          }
        ]
      },
      skipAllowed: false
    }
  ]
};