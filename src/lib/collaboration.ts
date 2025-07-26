/* BREADCRUMB: library - Shared library code */
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { isServiceConfigured } from './env';
import { SocketEventHandler } from './collaboration/SocketEventHandler';
import { RoomManager } from './collaboration/RoomManager';
import { ProjectManager } from './collaboration/ProjectManager';
import { CommentManager } from './collaboration/CommentManager';

// Re-export types
export {
  CollaborationRoom,
  CollaborationUser,
  CursorPosition,
  RoomSettings,
  CollaborationEvent,
  ProjectChange,
  Comment
} from './collaboration/types';

// Collaboration service
export class CollaborationService {
  private static io: SocketIOServer | null = null;

  // Initialize Socket.IO server
  static initialize(httpServer: HTTPServer): SocketIOServer {
    if (this.io) {
      return this.io;
    }

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });

    SocketEventHandler.setupEventHandlers(this.io);
    return this.io;
  }

  // Public API methods
  static async createRoom(projectId: string, ownerId: string, settings?: Partial<any>): Promise<string> {
    return RoomManager.createRoom(projectId, ownerId, settings);
  }

  static async getRoomParticipants(roomId: string): Promise<any[]> {
    return RoomManager.getRoomParticipants(roomId);
  }

  static async getProjectChanges(projectId: string, limit: number = 50): Promise<any[]> {
    return ProjectManager.getProjectChanges(projectId, limit);
  }

  static async getProjectComments(projectId: string): Promise<any[]> {
    return CommentManager.getProjectComments(projectId);
  }

  static isConfigured(): boolean {
    return isServiceConfigured('database');
  }
}