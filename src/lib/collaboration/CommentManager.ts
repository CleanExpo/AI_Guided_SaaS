import { DatabaseService } from '../database';
import { isServiceConfigured } from '../env';
import { logger } from '@/lib/logger';
import { Comment, DatabaseComment } from './types';

export class CommentManager {
  async saveComment(comment: Comment): Promise<Comment> {
    const commentWithId = {
      ...comment,
      id: this.generateId()
    };

    if (isServiceConfigured('database')) {
      try {
        await DatabaseService.query(
          `INSERT INTO collaboration_comments (id, project_id, user_id, content, position, resolved, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            commentWithId.id,
            commentWithId.projectId,
            commentWithId.userId,
            commentWithId.content,
            JSON.stringify(commentWithId.position),
            commentWithId.resolved,
            commentWithId.createdAt.toISOString(),
            commentWithId.updatedAt.toISOString()
          ]
        );
      } catch (error) {
        logger.error('Database error saving comment:', error);
      }
    }

    return commentWithId;
  }

  static async getProjectComments(projectId: string): Promise<Comment[]> {
    if (isServiceConfigured('database')) {
      try {
        const comments = await DatabaseService.query(
          'SELECT * FROM collaboration_comments WHERE project_id = ? ORDER BY created_at DESC',
          [projectId]
        );

        return comments.map((comment) => {
          const dbComment = comment as unknown as DatabaseComment;
          return {
            id: dbComment.id,
            projectId: dbComment.project_id,
            userId: dbComment.user_id,
            content: dbComment.content,
            position: JSON.parse(dbComment.position),
            replies: [], // TODO: Implement nested comments
            resolved: dbComment.resolved,
            createdAt: new Date(dbComment.created_at),
            updatedAt: new Date(dbComment.updated_at || dbComment.created_at)
          };
        });
      } catch (error) {
        logger.error('Database error getting comments:', error);
      }
    }

    return [];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}