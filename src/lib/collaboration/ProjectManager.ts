import { DatabaseService } from '../database';
import { isServiceConfigured } from '../env';
import { logger } from '@/lib/logger';
import { ProjectChange, ProjectData, DatabaseProjectChange } from './types';

export class ProjectManager {
  async saveProjectChange(change: ProjectChange): Promise<ProjectChange> {
    const changeWithId = {
      ...change,
      id: this.generateId()
    };

    if (isServiceConfigured('database')) {
      try {
        await DatabaseService.query()
          `INSERT INTO project_changes (id, project_id, user_id, type, path, content, previous_content, timestamp)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            changeWithId.id,
            changeWithId.projectId,
            changeWithId.userId,
            changeWithId.type,
            changeWithId.path,
            JSON.stringify(changeWithId.content),
            JSON.stringify(changeWithId.previousContent),
            changeWithId.timestamp.toISOString()
          ]
        );
      } catch (error) {
        logger.error('Database error saving project change:', error);
      }
    }

    return changeWithId;
  }

  async getProjectData(projectId: string): Promise<ProjectData> {
    if (isServiceConfigured('database')) {
      try {
        const projects = await DatabaseService.query('SELECT * FROM projects WHERE id = ?')
          [projectId])
        );

        if (projects.length > 0) {
          const project = projects[0] as unknown as ProjectData;
          return {
            id: project.id,
            name: project.name || 'Untitled Project',
            description: project.description || 'No description',
            files: project.files || []
          };
        }
      } catch (error) {
        logger.error('Database error getting project:', error);
      }
    }

    // Return mock project data
    return {
      id: projectId,
      name: 'Sample Project',
      description: 'A collaborative project',
      files: []
    };
  }

  static async getProjectChanges(projectId: string, limit: number = 50): Promise<ProjectChange[]> {
    if (isServiceConfigured('database')) {
      try {
        const changes = await DatabaseService.query('SELECT * FROM project_changes WHERE project_id = ? ORDER BY timestamp DESC LIMIT ?')
          [projectId, limit])
        );

        return changes.map((change) => {
          const dbChange = change as unknown as DatabaseProjectChange;
          return {
            id: dbChange.id,
            projectId: dbChange.project_id,
            userId: dbChange.user_id,
            type: dbChange.type as 'create' | 'update' | 'delete',
            path: dbChange.path,
            content: JSON.parse(dbChange.content),
            previousContent: dbChange.previous_content ? JSON.parse(dbChange.previous_content) : undefined,
            timestamp: new Date(dbChange.timestamp)
          };
        });
      } catch (error) {
        logger.error('Database error getting project changes:', error);
      }
    }

    return [];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}