import { EventEmitter } from 'events';
import { DynamicDocumentationSystem } from '@/lib/docs/DynamicDocumentationSystem';
import { logger } from '@/lib/logger';
import { Tutorial, TutorialProgress, TutorialStep } from './types';
import { tutorials } from './tutorials';
import { TutorialValidator } from './core/validation';
import { HighlightManager } from './core/highlight-manager';

export class InteractiveTutorialSystem extends EventEmitter {
  private tutorials: Map<string, Tutorial> = new Map();
  private activeProgress: Map<string, TutorialProgress> = new Map();
  private documentationSystem: DynamicDocumentationSystem;
  private validator: TutorialValidator;
  private highlightManager: HighlightManager;

  constructor(documentationSystem: DynamicDocumentationSystem) {
    super();
    this.documentationSystem = documentationSystem;
    this.validator = new TutorialValidator();
    this.highlightManager = new HighlightManager();
    this.initializeTutorials();
  }

  private initializeTutorials(): void {
    tutorials.forEach((tutorial) => {
      this.tutorials.set(tutorial.id, tutorial);
    });
  }

  getTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values());
  }

  getTutorial(id: string): Tutorial | undefined {
    return this.tutorials.get(id);
  }

  getTutorialsByCategory(category: string): Tutorial[] {
    return this.getTutorials().filter(t => t.category === category);
  }

  getTutorialsByDifficulty(difficulty: string): Tutorial[] {
    return this.getTutorials().filter(t => t.difficulty === difficulty);
  }

  getUserProgress(userId: string): TutorialProgress[] {
    return Array.from(this.activeProgress.values())
      .filter(p => p.userId === userId);
  }

  async startTutorial(tutorialId: string, userId: string): Promise<TutorialProgress> {
    const tutorial = this.tutorials.get(tutorialId);
    if (!tutorial) {
      throw new Error(`Tutorial ${tutorialId} not found`);
    }

    // Check prerequisites
    const userProgress = this.getUserProgress(userId);
    const completedTutorials = userProgress
      .filter(p => p.completedAt)
      .map(p => p.tutorialId);

    const missingPrereqs = tutorial.prerequisites.filter(
      prereq => !completedTutorials.includes(prereq)
    );

    if (missingPrereqs.length > 0) {
      throw new Error(`Missing prerequisites: ${missingPrereqs.join(', ')}`);
    }

    // Create progress
    const progress: TutorialProgress = {
      tutorialId,
      userId,
      currentStep: 0,
      completedSteps: [],
      startedAt: new Date(),
      score: 0,
      hintsUsed: 0,
      attempts: {}
    };

    const progressKey = `${userId}-${tutorialId}`;
    this.activeProgress.set(progressKey, progress);

    // Start first step
    await this.showStep(tutorial, progress, 0);
    this.emit('tutorial-started', { tutorialId, userId, tutorial });
    
    return progress;
  }

  async nextStep(tutorialId: string, userId: string): Promise<boolean> {
    const progressKey = `${userId}-${tutorialId}`;
    const progress = this.activeProgress.get(progressKey);
    const tutorial = this.tutorials.get(tutorialId);

    if (!progress || !tutorial) {
      throw new Error('Tutorial or progress not found');
    }

    // Validate current step
    const currentStep = tutorial.steps[progress.currentStep];
    const isValid = await this.validator.validateStep(currentStep, userId);

    if (!isValid) {
      progress.attempts[currentStep.id] = (progress.attempts[currentStep.id] || 0) + 1;
      await this.saveProgress(progress);
      return false;
    }

    // Mark step as completed
    progress.completedSteps.push(currentStep.id);
    progress.score += this.calculateStepScore(currentStep, progress.attempts[currentStep.id] || 1);

    // Move to next step
    progress.currentStep++;

    if (progress.currentStep >= tutorial.steps.length) {
      // Tutorial completed
      await this.completeTutorial(tutorial, progress);
      return true;
    }

    // Show next step
    await this.showStep(tutorial, progress, progress.currentStep);
    await this.saveProgress(progress);
    
    return true;
  }

  async skipStep(tutorialId: string, userId: string): Promise<boolean> {
    const progressKey = `${userId}-${tutorialId}`;
    const progress = this.activeProgress.get(progressKey);
    const tutorial = this.tutorials.get(tutorialId);

    if (!progress || !tutorial) {
      throw new Error('Tutorial or progress not found');
    }

    const currentStep = tutorial.steps[progress.currentStep];
    if (!currentStep.skipAllowed) {
      return false;
    }

    // Skip current step
    progress.currentStep++;

    if (progress.currentStep >= tutorial.steps.length) {
      await this.completeTutorial(tutorial, progress);
      return true;
    }

    await this.showStep(tutorial, progress, progress.currentStep);
    await this.saveProgress(progress);
    
    return true;
  }

  async useHint(tutorialId: string, userId: string): Promise<string | null> {
    const progressKey = `${userId}-${tutorialId}`;
    const progress = this.activeProgress.get(progressKey);
    const tutorial = this.tutorials.get(tutorialId);

    if (!progress || !tutorial) {
      return null;
    }

    const currentStep = tutorial.steps[progress.currentStep];
    if (!currentStep.hints || currentStep.hints.length === 0) {
      return null;
    }

    progress.hintsUsed++;
    const hintIndex = Math.min(progress.hintsUsed - 1, currentStep.hints.length - 1);
    const hint = currentStep.hints[hintIndex];

    await this.saveProgress(progress);
    this.emit('hint-used', { tutorialId, userId, step: currentStep.id, hint });
    
    return hint;
  }

  private async showStep(tutorial: Tutorial, progress: TutorialProgress, stepIndex: number): Promise<void> {
    const step = tutorial.steps[stepIndex];

    // Clear previous highlights
    this.highlightManager.clearHighlights();

    // Add highlights for this step
    if (step.type === 'action' && step.action) {
      this.highlightManager.addHighlight({
        element: step.action.parameters?.target || step.action.component,
        type: 'highlight',
        content: step.content,
        position: 'top'
      });
    }

    // Emit step event
    this.emit('step-shown', {
      tutorialId: tutorial.id,
      step,
      stepIndex,
      totalSteps: tutorial.steps.length,
      progress
    });
  }

  private calculateStepScore(step: TutorialStep, attempts: number): number {
    const baseScore = 10;
    const hintPenalty = 2;
    const attemptPenalty = 1;

    let score = baseScore;
    score -= Math.min(attempts - 1, 5) * attemptPenalty;
    
    return Math.max(score, 1);
  }

  private async completeTutorial(tutorial: Tutorial, progress: TutorialProgress): Promise<void> {
    progress.completedAt = new Date();
    
    // Award completion rewards
    this.emit('tutorial-completed', {
      tutorialId: tutorial.id,
      userId: progress.userId,
      score: progress.score,
      rewards: tutorial.completionRewards
    });

    // Save final progress
    await this.saveProgress(progress);

    // Clear highlights
    this.highlightManager.clearHighlights();

    // Remove from active progress
    const progressKey = `${progress.userId}-${tutorial.id}`;
    this.activeProgress.delete(progressKey);
  }

  private async saveProgress(progress: TutorialProgress): Promise<void> {
    // In a real implementation, save to database
    logger.info('Saving tutorial progress:', {
      tutorialId: progress.tutorialId,
      userId: progress.userId,
      currentStep: progress.currentStep,
      score: progress.score
    });
  }

  async resetTutorial(tutorialId: string, userId: string): Promise<void> {
    const progressKey = `${userId}-${tutorialId}`;
    this.activeProgress.delete(progressKey);
    this.highlightManager.clearHighlights();
    
    this.emit('tutorial-reset', { tutorialId, userId });
  }

  getActiveProgress(userId: string, tutorialId: string): TutorialProgress | undefined {
    const progressKey = `${userId}-${tutorialId}`;
    return this.activeProgress.get(progressKey);
  }
}