export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  steps: TutorialStep[];
  completionRewards: {
    points: number;
    badges?: string[];
    unlocks?: string[];
  };
  category: string;
  tags: string[];
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'action' | 'validation' | 'quiz';
  action?: {
    component: string;
    method: string;
    parameters?: any;
    expectedResult?: any;
  };
  validation?: {
    type: 'automatic' | 'manual' | 'quiz';
    criteria: ValidationCriteria[];
  };
  hints?: string[];
  skipAllowed: boolean;
}

export interface ValidationCriteria {
  type: 'element_exists' | 'value_equals' | 'api_call' | 'custom';
  target: string;
  expected?: any;
  errorMessage: string;
}

export interface TutorialProgress {
  tutorialId: string;
  userId: string;
  currentStep: number;
  completedSteps: string[];
  startedAt: Date;
  completedAt?: Date;
  score: number;
  hintsUsed: number;
  attempts: Record<string, any>;
}

export interface TutorialHighlight {
  element: string;
  type: 'highlight' | 'tooltip' | 'arrow' | 'mask';
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}