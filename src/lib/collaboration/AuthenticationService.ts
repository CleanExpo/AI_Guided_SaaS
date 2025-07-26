import { DatabaseService } from '../database';
import { isServiceConfigured } from '../env';
import { logger } from '@/lib/logger';
import { CollaborationUser, DatabaseUser } from './types';

export class AuthenticationService {
  async authenticateUser(userId: string, token: string): Promise<CollaborationUser | null> {
    // TODO: Implement proper token verification
    // For now, return mock user data
    return {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'editor',
      isOnline: true,
      lastSeen: new Date()
    };
  }

  async getUserInfo(userId: string): Promise<CollaborationUser | null> {
    if (isServiceConfigured('database')) {
      try {
        const users = await DatabaseService.query('SELECT id, name, email, avatar FROM users WHERE id = ?')
          [userId])
        );

        if (users.length > 0) {
          const user = users[0] as unknown as DatabaseUser;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: 'editor' as const,
            isOnline: true,
            lastSeen: new Date()
          };
        }
      } catch (error) {
        logger.error('Database error getting user info:', error);
      }
    }

    // Return mock data
    return {
      id: userId,
      name: 'User ' + userId.slice(-4),
      email: `user${userId.slice(-4)}@example.com`,
      role: 'editor',
      isOnline: true,
      lastSeen: new Date()
    };
  }
}