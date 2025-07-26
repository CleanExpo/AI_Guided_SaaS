export interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  metadata: {
    category: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    lastUpdated: Date;
    version: string;
  };
  relatedSections: string[];
  interactiveElements: InteractiveElement[];
  codeExamples: CodeExample[];
  systemState?: SystemStateContext;
}

export interface InteractiveElement {
  id: string;
  type: 'tutorial' | 'demo' | 'playground' | 'quiz';
  title: string;
  description: string;
  config: Record<string, any>;
  completionTracking?: {
    required: boolean;
    points: number;
  };
}

export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  runnable: boolean;
  expectedOutput?: string;
  systemRequirements?: string[];
}

export interface SystemStateContext {
  componentsActive: string[];
  featuresEnabled: string[];
  configurationValues: Record<string, any>;
  performanceMetrics: Record<string, any>;
  lastUpdated: Date;
}

export interface UserProgress {
  userId: string;
  sectionsCompleted: string[];
  interactiveElementsCompleted: string[];
  quizScores: Record<string, number>;
  totalPoints: number;
  currentPath: string[];
  preferences: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    learningStyle: 'visual' | 'textual' | 'interactive';
    topics: string[];
  };
}

export interface DocumentationSearchResult {
  sectionId: string;
  title: string;
  snippet: string;
  relevanceScore: number;
  context: string[];
}

export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  category?: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response?: any;
  exampleBody?: any;
}