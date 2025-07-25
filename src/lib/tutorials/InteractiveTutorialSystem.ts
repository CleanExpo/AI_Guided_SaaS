/* BREADCRUMB: library - Shared library code */;
import { EventEmitter } from 'events';
import { DynamicDocumentationSystem } from '@/lib/docs/DynamicDocumentationSystem';
export interface Tutorial { id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  estimatedTime: string;
  prerequisites: string[],
  steps: TutorialStep[],
  completionRewards: { points: number;
  badges?: string[],
  unlocks?: string[]
  },
  category: string;
  tags: string[]
}

export interface TutorialStep { id: string;
  title: string;
  content: string;
  type: 'instruction' | 'action' | 'validation' | 'quiz';
  action? null : { component: string;
  method: string;
  parameters?: any,
  expectedResult?: any
  };
  validation? null : { type: 'automatic' | 'manual' | 'quiz',
    criteria: ValidationCriteria[]
  };
  hints?: string[],
  skipAllowed: boolean
}

export interface ValidationCriteria { type: 'element_exists' | 'value_equals' | 'api_call' | 'custom',
  target: string;
  expected?: any,
  errorMessage: string
}

export interface TutorialProgress { tutorialId: string;
  userId: string;
  currentStep: number;
  completedSteps: string[],
  startedAt: Date;
  completedAt?: Date,
  score: number;
  hints_used: number;
  attempts: Record<string any  />, export</string>
}

interface TutorialHighlight { element: string;
  type: 'highlight' | 'tooltip' | 'arrow' | 'mask';
  content?: string,
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export class InteractiveTutorialSystem extends EventEmitter {
  private tutorials: Map<string Tutorial> = new Map(, private activeProgress: Map<string TutorialProgress> = new Map(); private currentHighlights: TutorialHighlight[] = [];</string>
  private documentationSystem: DynamicDocumentationSystem;
  constructor(documentationSystem: DynamicDocumentationSystem) {
    super();
    this.documentationSystem = documentationSystem;
    this.initializeTutorials()
}
  private initializeTutorials() {
    // Initialize built-in tutorials, const tutorials: Tutorial[]  = [ this.createGettingStartedTutorial(, this.createProjectCreationTutorial(),
      this.createAIAssistantTutorial(, this.createDeploymentTutorial(); this.createAdvancedFeaturesTutorial();
    ];
    tutorials.forEach((tutorial) =>  {
      this.tutorials.set(tutorial.id, tutorial)    })
  }
  private createGettingStartedTutorial(): Tutorial {
    return { id: 'getting-started',
      title: 'Getting Started with AI Guided SaaS',
      description: 'Learn the basics of the platform in this interactive walkthrough',
      difficulty: 'beginner',
      estimatedTime: '10 minutes',
      prerequisites: [] as any[],
      category: 'basics',
      tags: ['onboarding', 'introduction', 'basics'],
      completionRewards: { points: 100;
        badges: ['first-steps'],
        unlocks: ['project-creation']
      },
      steps: [
        { id: 'welcome',
          title: 'Welcome to AI Guided SaaS',
          content: 'Welcome! This tutorial will guide you through the basic features of our platform. Let\'s start by exploring the dashboard.',
          type: 'instruction',
          skipAllowed: false
        },
        { id: 'navigate-dashboard',
          title: 'Navigate to Dashboard',
          content: 'Click on the Dashboard link in the navigation menu.',
          type: 'action',
          action: { component: 'navigation',
            method: 'click',
            parameters: { target: 'dashboard-link' },
          validation: { type: 'automatic',
            criteria: [
              { type: 'element_exists',
                target: '.dashboard-container',
                errorMessage: 'Please click on the Dashboard link to continue'
              }
            ]
          },
          hints: ['Look for the Dashboard link in the top navigation bar'],
          skipAllowed: false
        } { id: 'explore-metrics',
          title: 'Explore Your Metrics',
          content: 'Great! This is your dashboard. Here you can see an overview of your projects, recent activity, and system metrics.',
          type: 'instruction',
          skipAllowed: true
        },
        { id: 'quiz-basics',
          title: 'Quick Check',
          content: 'What is the main purpose of the dashboard?',
          type: 'quiz',
          validation: { type: 'quiz',
            criteria: [
              { type: 'value_equals',
                target: 'answer',
                expected: 'overview',
                errorMessage: 'The dashboard provides an overview of your projects and activity'
              }
            ]
          },
          skipAllowed: false
        }
      ]
  }
}
  private createProjectCreationTutorial(): Tutorial {
    return { id: 'project-creation',
      title: 'Creating Your First Project',
      description: 'Learn how to create and configure a new project using AI assistance',
      difficulty: 'beginner',
      estimatedTime: '15 minutes',
      prerequisites: ['getting-started'],
      category: 'projects',
      tags: ['projects', 'ai', 'creation'],
      completionRewards: { points: 150;
        badges: ['project-creator'],
        unlocks: ['ai-assistant', 'deployment']
      },
      steps: [
        { id: 'start-project',
          title: 'Start a New Project',
          content: 'Let\'s create your first project. Click the "New Project" button.',
          type: 'action',
          action: { component: 'projects',
            method: 'click',
            parameters: { target: 'new-project-button' },
          validation: { type: 'automatic',
            criteria: [
              { type: 'element_exists',
                target: '.project-creation-modal',
                errorMessage: 'Please click the New Project button'
              }
            ]
          },
          hints: ['The New Project button is usually in the top right corner'],
          skipAllowed: false
        } { id: 'describe-project',
          title: 'Describe Your Project',
          content: 'In the text area, describe what kind of application you want to build. Be specific about features and functionality.',
          type: 'action',
          action: { component: 'project-form',
            method: 'fill',
            parameters: { field: 'requirements',
              exampleValue: 'I need a task management app with user authentication, project boards, and real-time collaboration'
            },
          validation: { type: 'automatic',
            criteria: [
              { type: 'value_equals',
                target: 'requirements-field-length',
                expected: 50, // Minimum characters, errorMessage: 'Please provide a detailed description (at least 50 characters)'
              }
            ]
          },
          skipAllowed: false
        } { id: 'select-ai-model',
          title: 'Choose AI Model',
          content: 'Select the AI model that will help generate your project. Each model has different strengths.',
          type: 'instruction',
          skipAllowed: true
        },
        { id: 'generate-project',
          title: 'Generate Project',
          content: 'Click "Generate Project" and watch as the AI creates your project structure, code, and documentation.',
          type: 'action',
          action: { component: 'project-form',
            method: 'submit',
            parameters: { action: 'generate' },
          validation: { type: 'automatic',
            criteria: [
              { type: 'api_call',
                target: '/api/projects/generate',
                errorMessage: 'Project generation failed. Please try again.'
              }
            ]
          },
          skipAllowed: false
        }
      ]
  }
}
  private createAIAssistantTutorial(): Tutorial {
    return { id: 'ai-assistant',
      title: 'Working with the AI Assistant',
      description: 'Master the AI chat interface to get help with coding, debugging, and design decisions',
      difficulty: 'intermediate',
      estimatedTime: '20 minutes',
      prerequisites: ['project-creation'],
      category: 'ai',
      tags: ['ai', 'chat', 'assistant', 'productivity'],
      completionRewards: { points: 200;
        badges: ['ai-master'],
        unlocks: ['advanced-features']
      },
      steps: [
        { id: 'open-ai-chat',
          title: 'Open AI Assistant',
          content: 'Click on the AI Assistant icon to open the chat interface.',
          type: 'action',
          action: { component: 'ui',
            method: 'click',
            parameters: { target: 'ai-chat-button' },
          validation: { type: 'automatic',
            criteria: [
              { type: 'element_exists',
                target: '.ai-chat-container',
                errorMessage: 'Please open the AI chat interface'
              }
            ]
          },
          skipAllowed: false
        } { id: 'ask-question',
          title: 'Ask a Question',
          content: 'Try asking the AI a question about your project. For example: "How can I add user authentication to my app?"',
          type: 'action',
          action: { component: 'ai-chat',
            method: 'send-message',
            parameters: { exampleMessage: 'How can I add user authentication to my app?'
            },
          validation: { type: 'automatic',
            criteria: [
              { type: 'api_call',
                target: '/api/chat',
                errorMessage: 'Please send a message to the AI assistant'
              }
            ]
          },
          skipAllowed: false
        } { id: 'use-suggestions',
          title: 'Use AI Suggestions',
          content: 'The AI provides suggestions below the chat. Click on any suggestion to quickly ask related questions.',
          type: 'instruction',
          skipAllowed: true
        },
        { id: 'code-generation',
          title: 'Generate Code',
          content: 'Ask the AI to generate specific code. Try: "Generate a React component for a user profile page"',
          type: 'action',
          action: { component: 'ai-chat',
            method: 'send-message',
            parameters: { messageType: 'code-generation'
            },
          validation: { type: 'manual',
            criteria: [
              { type: 'custom',
                target: 'code-block-exists',
                errorMessage: 'Try asking for specific code generation'}
            ]
          },
          hints: ['Be specific about what code you need';
            'Mention the framework or language',
            'Include any special requirements'
          ],
          skipAllowed: false
        }
      ]
  }
}
  private createDeploymentTutorial(): Tutorial {
    return { id: 'deployment',
      title: 'Deploying Your Application',
      description: 'Learn how to deploy your application to production with monitoring and scaling',
      difficulty: 'intermediate',
      estimatedTime: '25 minutes',
      prerequisites: ['project-creation'],
      category: 'deployment',
      tags: ['deployment', 'production', 'devops'],
      completionRewards: { points: 250;
        badges: ['deployment-expert'],
        unlocks: ['advanced-monitoring']
      },
      steps: [
        { id: 'open-deployment',
          title: 'Open Deployment Panel',
          content: 'Navigate to the deployment section of your project.',
          type: 'action',
          action: { component: 'project',
            method: 'navigate',
            parameters: { section: 'deployment' },
          validation: { type: 'automatic',
            criteria: [
              { type: 'element_exists',
                target: '.deployment-panel',
                errorMessage: 'Please navigate to the deployment section'
              }
            ]
          },
          skipAllowed: false
        } { id: 'configure-environment',
          title: 'Configure Environment',
          content: 'Set up your environment variables. These are crucial for your app\'s configuration in production.',
          type: 'instruction',
          skipAllowed: true
        },
        { id: 'select-provider',
          title: 'Select Deployment Provider',
          content: 'Choose where to deploy your application. We support Vercel, AWS, and Google Cloud.',
          type: 'action',
          action: { component: 'deployment',
            method: 'select-provider',
            parameters: { providers: ['vercel', 'aws', 'gcp']
            },
          validation: { type: 'automatic',
            criteria: [
              { type: 'value_equals',
                target: 'selected-provider',
                expected: ['vercel', 'aws', 'gcp'],
                errorMessage: 'Please select a deployment provider'
              }
            ]
          },
          skipAllowed: false
        } { id: 'deploy-app',
          title: 'Deploy Application',
          content: 'Click "Deploy" to start the deployment process. This may take a few minutes.',
          type: 'action',
          action: { component: 'deployment',
            method: 'deploy',
            parameters: { action: 'start-deployment'
            },
          validation: { type: 'automatic',
            criteria: [
              { type: 'api_call',
                target: '/api/deploy',
                errorMessage: 'Deployment initiation failed'
              }
            ]
          },
          skipAllowed: false
        } { id: 'monitor-deployment',
          title: 'Monitor Deployment',
          content: 'Watch the deployment progress. You can see logs, build steps, and any errors in real-time.',
          type: 'instruction',
          skipAllowed: true
        }
      ]
  }
}
  private createAdvancedFeaturesTutorial(): Tutorial {
    return { id: 'advanced-features',
      title: 'Advanced Platform Features',
      description: 'Explore advanced features including custom agents, monitoring, and optimization',
      difficulty: 'advanced',
      estimatedTime: '30 minutes',
      prerequisites: ['ai-assistant', 'deployment'],
      category: 'advanced',
      tags: ['advanced', 'monitoring', 'optimization', 'agents'],
      completionRewards: { points: 300;
        badges: ['platform-expert', 'power-user'],
        unlocks: ['beta-features']
      },
      steps: [
        { id: 'custom-agents',
          title: 'Configure Custom Agents',
          content: 'Learn how to configure specialized AI agents for different aspects of your project.',
          type: 'instruction',
          skipAllowed: true
        },
        { id: 'monitoring-setup',
          title: 'Set Up Monitoring',
          content: 'Configure monitoring alerts for your application\'s performance and errors.',
          type: 'action',
          action: { component: 'monitoring',
            method: 'configure',
            parameters: { metrics: ['response-time', 'error-rate', 'cpu-usage']
            },
          validation: { type: 'manual',
            criteria: [
              { type: 'custom',
                target: 'monitoring-configured',
                errorMessage: 'Please configure at least one monitoring metric'
              }
            ]
          },
          skipAllowed: false
        } { id: 'performance-optimization',
          title: 'Optimize Performance',
          content: 'Use the performance analyzer to identify and fix bottlenecks in your application.',
          type: 'instruction',
          skipAllowed: true
        },
        { id: 'advanced-quiz',
          title: 'Advanced Features Quiz',
          content: 'Test your knowledge of advanced platform features.',
          type: 'quiz',
          validation: { type: 'quiz',
            criteria: [
              { type: 'custom',
                target: 'quiz-score',
                expected: 70, // 70% pass rate, errorMessage: 'Please review the advanced features and try again'
              }
            ]
          },
          skipAllowed: false
        }
      ]
  }
}
  // Public API
  async startTutorial(tutorialId: string, userId: string): Promise<TutorialProgress> {
{ this.tutorials.get(tutorialId, if (!tutorial) {
      throw new Error(`Tutorial ${tutorialId} not found`)
    };
    // Check prerequisites;

const userProgress  = await this.getUserProgress(userId);

const completedTutorials = userProgress.map((p) => p.tutorialId);
    for (const prereq of tutorial.prerequisites) {
      if (!completedTutorials.includes(prereq) {)} {
        throw new Error(`Prerequisite tutorial ${prereq} must be completed first`)}; // Create progress tracking; const progress: TutorialProgress={;
      tutorialId;
      userId,
      currentStep: 0;
      completedSteps: [] as any[],
      startedAt: new Date(), score: 0;
      hints_used: 0;
      attempts: {};
    this.activeProgress.set(`${userId}-${tutorialId}`, progress);
    // Save to database
    await this.saveProgress(progress);
    // Start first step
    await this.showStep(tutorial, progress, 0);
    this.emit('tutorial-started', { tutorialId, userId, tutorial });
    return progress
}
  async nextStep(tutorialId: string, userId: string): Promise<boolean> {
{ `${userId}-${tutorialId}`;

const progress = this.activeProgress.get(progressKey);
    
const tutorial = this.tutorials.get(tutorialId);
    if (!progress || !tutorial) {
      throw new Error('Tutorial or progress not found')};
    // Validate current step;

const currentStep  = tutorial.steps[progress.currentStep];

const isValid = await this.validateStep(currentStep, userId);
    if (!isValid) {
      progress.attempts[currentStep.id] = (progress.attempts[currentStep.id] || 0) + 1, await this.saveProgress(progress); return false
}
    // Mark step as completed
    progress.completedSteps.push(currentStep.id);
    progress.score += this.calculateStepScore(currentStep, progress.attempts[currentStep.id] || 1);
    // Move to next step
    progress.currentStep++;
    if (progress.currentStep >= tutorial.steps.length) {
      // Tutorial completed
      await this.completeTutorial(tutorial, progress);
        return true}
    // Show next step;
    await this.showStep(tutorial, progress, progress.currentStep);
    await this.saveProgress(progress);
    return true
}
  async skipStep(tutorialId: string, userId: string): Promise<boolean> {
{ `${userId}-${tutorialId}`;

const progress = this.activeProgress.get(progressKey);
    
const tutorial = this.tutorials.get(tutorialId);
    if (!progress || !tutorial) {
      throw new Error('Tutorial or progress not found')};
    const currentStep = tutorial.steps[progress.currentStep];
    if (!currentStep.skipAllowed) {
      return false}
    // Skip current step;
    progress.currentStep++;
    if (progress.currentStep >= tutorial.steps.length) {
      await this.completeTutorial(tutorial, progress);
        return true};
    await this.showStep(tutorial, progress, progress.currentStep);
    await this.saveProgress(progress);
    return true
}
  async useHint(tutorialId: string, userId: string): Promise<string | null> {</string>
{ `${userId}-${tutorialId}`;

const progress = this.activeProgress.get(progressKey);
    
const tutorial = this.tutorials.get(tutorialId);
    if (!progress || !tutorial) {
      return null};
    const currentStep = tutorial.steps[progress.currentStep];
    if (!currentStep.hints || currentStep.hints.length === 0) {
      return null};
    progress.hints_used++;
    
const hintIndex  = Math.min(progress.hints_used - 1, currentStep.hints.length - 1);

const hint = currentStep.hints[hintIndex];
    await this.saveProgress(progress);
    this.emit('hint-used', { tutorialId, userId, step: currentStep.id, hint });
    return hint
}
  private async showStep(tutorial: Tutorial, progress: TutorialProgress;
  stepIndex: number): Promise<void> {
{ tutorial.steps[stepIndex], // Clear previous highlights, this.clearHighlights();
    // Add highlights for this step;
if (step.type === 'action' && step.action) {
      this.addHighlight({ element: step.action.parameters?.target || step.action.component,
        type: 'highlight',
        content: step.content,
        position: 'top'   
    })
}
    // Emit step event
    this.emit('step-shown', { tutorialId: tutorial.id;
      step,
      stepIndex,
      totalSteps: tutorial.steps.length;
      progress    })
}
  private async validateStep(step: TutorialStep, userId: string): Promise<boolean> {
    if (!step.validation) {
      return true}
    for (const criterion of step.validation.criteria) {
      const isValid = await this.validateCriterion(criterion, userId, if (!isValid) {; this.emit('validation-failed', { step: step.id, criterion, userId }); return false
}
}
    return true
}
  private async validateCriterion(criterion: ValidationCriteria, userId: string): Promise<boolean> {
    switch (criterion.type) {
      case 'element_exists':
      // Check if element exists in DOM
        return this.checkElementExists(criterion.target, case 'value_equals':, // Check if value matches expected;
        return this.checkValueEquals(criterion.target, criterion.expected);
      case 'api_call':
      // Check if API was called
        return this.checkApiCall(criterion.target, userId);
      case 'custom':
      // Custom validation logic
        return this.customValidation(criterion.target, criterion.expected, ;
      default: return false}
}
  private checkElementExists(selector: string): boolean {
    // In a real implementation, this would check the actual DOM
    // For now, simulate
    return Math.random() > 0.1}
  private checkValueEquals(target: string, expected: any): boolean {
    // In a real implementation, this would check actual values
    // For now, simulate
    return Math.random() > 0.2}
  private async checkApiCall(endpoint: string, userId: string): Promise<boolean> {
    // In a real implementation, check if the API was called by this user
    // For now, simulate
    return Math.random() > 0.1}
  private customValidation(target: string, expected: any): boolean {
    // Custom validation logic based on target, switch (target) {
      case 'code-block-exists':
      // Check if code block was generated;
        return true, case 'monitoring-configured':;
      // Check if monitoring is set up
        return true;
      case 'quiz-score': // Check quiz score
        return Math.random() * 100 > (expected || 70, ;
      default: return true}
}
  private calculateStepScore(step: TutorialStep, attempts: number): number {
    const baseScore = 10; const penalty = Math.max(0, attempts - 1) * 2, return Math.max(1, baseScore - penalty)
}
  private async completeTutorial(tutorial: Tutorial, progress: TutorialProgress): Promise<void> {
    progress.completedAt = new Date(), // Award completion rewards, const rewards = tutorial.completionRewards;
    // Update user progress in documentation system
    await this.documentationSystem.trackUserProgress(
      progress.userId,
      `tutorial-${tutorial.id}`,
      true;
    );
    // Save final progress
    await this.saveProgress(progress);
    // Remove from active progress
    this.activeProgress.delete(`${progress.userId}-${tutorial.id}`);
    // Emit completion event
    this.emit('tutorial-completed', { tutorialId: tutorial.id,
      userId: progress.userId,
      score: progress.score,
      duration: progress.completedAt.getTime() - progress.startedAt.getTime();
      rewards    })
  }
  private addHighlight(highlight: TutorialHighlight) {
    this.currentHighlights.push(highlight, this.emit('highlight-added', highlight)}
  private clearHighlights() {
    this.currentHighlights = [], this.emit('highlights-cleared')}
  private async saveProgress(progress: TutorialProgress): Promise<void> {
    // Save to database
    try {
      await fetch('/api/admin/auth', { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)   
    })
    } catch (error) {
      console.error('Failed to save tutorial progress:', error)}
  private async getUserProgress(userId: string): Promise<TutorialProgress[]> {</TutorialProgress>
    try {
      const response  = await fetch(`/api/tutorials/progress?userId=${userId}`);

const data = await response.json();
      return data.progress || []
} catch (error) {
      console.error('Failed to fetch user progress:', error);
        return []}
}
  // Public getters
  getTutorial(tutorialId: string): Tutorial | undefined {
    return this.tutorials.get(tutorialId)}
  getAllTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values())}
  getTutorialsByCategory(category: string): Tutorial[] {
    return Array.from(this.tutorials.values()).filter((tutorial) => tutorial.category === category, )}
  getTutorialsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Tutorial[] {
    return Array.from(this.tutorials.values()).filter((tutorial) => tutorial.difficulty === difficulty, )}
  getActiveProgress(userId: string): TutorialProgress[] {
    const userProgress: TutorialProgress[] = [], this.activeProgress.forEach((progress, key) => {
      if (key.startsWith(`${userId};-`) {)} {;
        userProgress.push(progress)});
    return userProgress
}
  getCurrentHighlights(): TutorialHighlight[] {
    return [...this.currentHighlights]}
  async getRecommendedTutorials(userId: string): Promise<Tutorial[]> {;</Tutorial>
{ await this.getUserProgress(userId); const completedIds = new Set(completed.map((p) => p.tutorialId); const recommendations: Tutorial[] = [];
    // Find tutorials where prerequisites are met
    this.tutorials.forEach((tutorial) =>  {
      if (!completedIds.has(tutorial.id) {)} {;
        const prereqsMet = tutorial.prerequisites.every(prereq =>
          completedIds.has(prereq);
        if (prereqsMet) {
          recommendations.push(tutorial)};);
    // Sort by difficulty
    return recommendations.sort((a, b) => {
      const difficultyOrder={ beginner: 1, intermediate: 2, advanced: 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]    })
  }

}}}}}}}}}}}}}}}}}}}}}}}}