import { supabase } from '../client';
import { logger } from '@/lib/logger';
import { Project } from '../types';

export class ProjectService {
  private static checkDatabase(): boolean {
    if (!supabase) {
      return false;
    }
    return true;
  }

  static async createProject(projectData: Partial<Project>): Promise<Project | null> {
    if (!this.checkDatabase()) {
      return {
        id: `project-${Date.now()}`,
        user_id: projectData.user_id || 'demo-user',
        name: projectData.name || 'Demo Project',
        description: projectData.description,
        framework: projectData.framework || 'nextjs',
        status: 'completed',
        config: projectData.config || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase!
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        logger.error('Error creating project:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    if (!this.checkDatabase()) {
      return [
        {
          id: 'demo-project-1',
          user_id: userId,
          name: 'E-commerce Store',
          description: 'A modern e-commerce platform',
          framework: 'nextjs',
          status: 'completed',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-project-2',
          user_id: userId,
          name: 'Portfolio Website',
          description: 'Personal portfolio with blog',
          framework: 'react',
          status: 'completed',
          config: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    try {
      const { data, error } = await supabase!
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching user projects:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Database error:', error);
      return [];
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    if (!this.checkDatabase()) {
      logger.info('Mock update project:', { id, updates });
      return null;
    }

    try {
      const { data, error } = await supabase!
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating project:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Database error:', error);
      return null;
    }
  }
}