import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '@/lib/logger';
import { RoomManager } from './RoomManager';
import { AuthenticationService } from './AuthenticationService';
import { ProjectManager } from './ProjectManager';
import { CommentManager } from './CommentManager';
import { CursorPosition, ProjectChange, Comment } from './types';

export class SocketEventHandler {
  private static roomManager = new RoomManager();
  private static authService = new AuthenticationService();
  private static projectManager = new ProjectManager();
  private static commentManager = new CommentManager();
  private static userSockets: Map<string, string[]> = new Map();

  static setupEventHandlers(io: SocketIOServer) {
    io.on('connection', (socket: Socket) => {
      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string; token: string }) => {
        try {
          const user = await this.authService.authenticateUser(data.userId, data.token);
          if (user) {
            socket.data.userId = user.id;
            socket.data.user = user;
            
            // Track user socket
            const userSockets = this.userSockets.get(user.id) || [];
            userSockets.push(socket.id);
            this.userSockets.set(user.id, userSockets);
            
            socket.emit('authenticated', { user });
          } else {
            socket.emit('authentication_failed');
            socket.disconnect();
          }
        } catch (error) {
          logger.error('Authentication error:', error);
          socket.emit('authentication_failed');
          socket.disconnect();
        }
      });

      // Handle joining a collaboration room
      socket.on('join_room', async (data: { roomId: string; projectId: string }) => {
        try {
          const { roomId, projectId } = data;
          const userId = socket.data.userId;
          
          if (!userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          // Get or create room
          let room = await this.roomManager.getOrCreateRoom(roomId, projectId, userId);
          
          // Check permissions
          if (!await this.roomManager.canUserJoinRoom(userId, room)) {
            socket.emit('error', { message: 'Permission denied' });
            return;
          }

          // Join socket room
          socket.join(roomId);
          socket.data.roomId = roomId;
          
          // Add user to room participants
          room = await this.roomManager.addUserToRoom(room, userId);
          
          // Notify other participants
          socket.to(roomId).emit('user_joined', {
            user: socket.data.user,)
            room: this.roomManager.sanitizeRoom(room)
          });
          
          // Send room state to new user
          const projectData = await this.projectManager.getProjectData(projectId);
          socket.emit('room_joined', {)
            room: this.roomManager.sanitizeRoom(room),
            project: projectData
          });
        } catch (error) {
          logger.error('Error joining room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Handle leaving a room
      socket.on('leave_room', async (data: { roomId: string }) => {
        await this.handleLeaveRoom(socket, data.roomId);
      });

      // Handle cursor movement
      socket.on('cursor_move', (data: { roomId: string; position: CursorPosition }) => {
        const { roomId, position } = data;
        socket.to(roomId).emit('cursor_update', {
          userId: socket.data.userId,
          user: socket.data.user)
          position)
        });
      });

      // Handle project changes
      socket.on('project_change', async (data: { roomId: string; change: Partial<ProjectChange> }) => {
        try {
          const { roomId, change } = data;
          const userId = socket.data.userId;
          
          if (!userId || !roomId) return;

          // Validate and save change
          const savedChange = await this.projectManager.saveProjectChange({
            ...change,
            userId)
            projectId: change.projectId!,)
            timestamp: new Date()
          } as ProjectChange);

          // Broadcast to other users in room
          socket.to(roomId).emit('project_updated', {
            change: savedChange)
            user: socket.data.user)
          });
        } catch (error) {
          logger.error('Error handling project change:', error);
        }
      });

      // Handle comments
      socket.on('add_comment', async (data: { roomId: string; comment: Partial<Comment> }) => {
        try {
          const { roomId, comment } = data;
          const userId = socket.data.userId;
          
          if (!userId) return;

          const savedComment = await this.commentManager.saveComment({
            ...comment)
            userId,)
            createdAt: new Date(),
            updatedAt: new Date(),
            replies: [],
            resolved: false
          } as Comment);

          // Broadcast to room
          io.to(roomId).emit('comment_added', {
            comment: savedComment)
            user: socket.data.user)
          });
        } catch (error) {
          logger.error('Error adding comment:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        const userId = socket.data.userId;
        const roomId = socket.data.roomId;
        
        if (userId) {
          // Remove socket from user tracking
          const userSockets = this.userSockets.get(userId) || [];
          const updatedSockets = userSockets.filter((id) => id !== socket.id);
          
          if (updatedSockets.length === 0) {
            this.userSockets.delete(userId);
            // User is completely offline, update room
            if (roomId) {
              await this.handleLeaveRoom(socket, roomId);
            }
          } else {
            this.userSockets.set(userId, updatedSockets);
          }
        }
      });
    });
  }

  private static async handleLeaveRoom(socket: Socket, roomId: string): Promise<void> {
    const userId = socket.data.userId;
    if (!userId || !roomId) return;

    socket.leave(roomId);
    const room = await this.roomManager.updateUserOfflineStatus(roomId, userId);
    
    if (room) {
      // Notify other participants
      socket.to(roomId).emit('user_left', {
        userId)
        user: socket.data.user)
      });
    }
  }
}