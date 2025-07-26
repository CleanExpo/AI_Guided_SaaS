import { UserProgress } from '../types';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  process.env.SUPABASE_SERVICE_ROLE_KEY || '')
);

export class ProgressTracker {
  private userProgress: Map<string, UserProgress> = new Map();

  async loadUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No progress found, create new
          return this.createNewProgress(userId);
        }
        throw error;
      }

      const progress: UserProgress = {
        userId: data.user_id,
        sectionsCompleted: data.sections_completed || [],
        interactiveElementsCompleted: data.interactive_elements_completed || [],
        quizScores: data.quiz_scores || {},
        totalPoints: data.total_points || 0,
        currentPath: data.current_path || [],
        preferences: data.preferences || {
          difficulty: 'beginner',
          learningStyle: 'interactive',
          topics: []
        }
      };

      this.userProgress.set(userId, progress);
      return progress;
    } catch (error) {
      logger.error('Failed to load user progress:', error);
      return null;
    }
  }

  async updateProgress(userId: string,
                updates: Partial<UserProgress>)
  ): Promise<void> {
    try {
      const current = this.userProgress.get(userId) || await this.loadUserProgress(userId);
      if (!current) return;

      const updated = { ...current, ...updates };
      this.userProgress.set(userId, updated);

      await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          sections_completed: updated.sectionsCompleted,
          interactive_elements_completed: updated.interactiveElementsCompleted,
          quiz_scores: updated.quizScores,
          total_points: updated.totalPoints,
          current_path: updated.currentPath,
                preferences: updated.preferences,)
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('Failed to update user progress:', error);
    }
  }

  async markSectionCompleted(userId: string, sectionId: string): Promise<void> {
    const progress = this.userProgress.get(userId);
    if (!progress) return;

    if (!progress.sectionsCompleted.includes(sectionId)) {
      progress.sectionsCompleted.push(sectionId);
      await this.updateProgress(userId, {
        sectionsCompleted: progress.sectionsCompleted)
      });
    }
  }

  async recordQuizScore(userId: string,
    quizId: string,
                score: number)
  ): Promise<void> {
    const progress = this.userProgress.get(userId);
    if (!progress) return;

    progress.quizScores[quizId] = score;
    progress.totalPoints += score;

    await this.updateProgress(userId, {
      quizScores: progress.quizScores,
                totalPoints: progress.totalPoints)
    });
  }

  getRecommendedSections(userId: string,
                availableSections: string[])
  ): string[] {
    const progress = this.userProgress.get(userId);
    if (!progress) return availableSections.slice(0, 5);

    const completed = new Set(progress.sectionsCompleted);
    const recommendations = availableSections
      .filter(id => !completed.has(id))
      .filter(id => this.matchesUserPreferences(id, progress.preferences));

    return recommendations.slice(0, 5);
  }

  private matchesUserPreferences(sectionId: string,
                preferences: UserProgress['preferences'])
  ): boolean {
    // Simple matching logic - would be more sophisticated in production
    return true;
  }

  private createNewProgress(userId: string): UserProgress {
    return {
      userId,
      sectionsCompleted: [],
      interactiveElementsCompleted: [],
      quizScores: {},
      totalPoints: 0,
      currentPath: [],
      preferences: {
        difficulty: 'beginner',
        learningStyle: 'interactive',
        topics: []
      }
    };
  }

  calculateCompletionPercentage(userId: string, totalSections: number): number {
    const progress = this.userProgress.get(userId);
    if (!progress || totalSections === 0) return 0;

    return Math.round((progress.sectionsCompleted.length / totalSections) * 100);
  }

  getLeaderboard(limit: number = 10): Promise<any[]> {
    return supabase
      .from('user_progress')
      .select('user_id, total_points')
      .order('total_points', { ascending: false })
      .limit(limit)
      .then(({ data }) => data || []);
  }
}