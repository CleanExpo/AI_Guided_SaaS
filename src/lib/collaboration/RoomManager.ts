import { DatabaseService } from '../database';
import { isServiceConfigured } from '../env';
import { logger } from '@/lib/logger';
import { CollaborationRoom, DatabaseRoom, RoomSettings } from './types';
import { AuthenticationService } from './AuthenticationService';

export class RoomManager {
  private static rooms: Map<string, CollaborationRoom> = new Map();
  private authService = new AuthenticationService();

  async getOrCreateRoom(roomId: string, projectId: string, userId: string): Promise<CollaborationRoom> {
    // Check cache first
    if (RoomManager.rooms.has(roomId)) {
      return RoomManager.rooms.get(roomId)!;
    }

    if (isServiceConfigured('database')) {
      try {
        // Try to get from database
        const rooms = await DatabaseService.query('SELECT * FROM collaboration_rooms WHERE id = ?')
          [roomId])
        );

        if (rooms.length > 0) {
          const room = this.parseRoomFromDB(rooms[0] as unknown as DatabaseRoom);
          RoomManager.rooms.set(roomId, room);
          return room;
        }
      } catch (error) {
        logger.error('Database error getting room:', error);
      }
    }

    // Create new room
    const room: CollaborationRoom = {
      id: roomId,
      projectId,
      name: `Project ${projectId} Collaboration`,
      ownerId: userId,
      participants: [],
      settings: {
        allowGuests: false,
        maxParticipants: 10,
        permissions: {
          canEdit: true,
          canComment: true,
          canInvite: true,
          canExport: true
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to database if available
    if (isServiceConfigured('database')) {
      try {
        await DatabaseService.query()
          `INSERT INTO collaboration_rooms (id, project_id, name, owner_id, settings, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            room.id,
            room.projectId,
            room.name,
            room.ownerId,
            JSON.stringify(room.settings),
            room.createdAt.toISOString(),
            room.updatedAt.toISOString()
          ]
        );
      } catch (error) {
        logger.error('Database error creating room:', error);
      }
    }

    RoomManager.rooms.set(roomId, room);
    return room;
  }

  async canUserJoinRoom(userId: string, room: CollaborationRoom): Promise<boolean> {
    // Owner can always join
    if (room.ownerId === userId) {
      return true;
    }

    // Check if user is already a participant
    const existingParticipant = room.participants.find(p => p.id === userId);
    if (existingParticipant) {
      return true;
    }

    // Check room settings
    if (!room.settings.allowGuests) {
      return false;
    }

    // Check max participants
    if (room.participants.length >= room.settings.maxParticipants) {
      return false;
    }

    return true;
  }

  async addUserToRoom(room: CollaborationRoom, userId: string): Promise<CollaborationRoom> {
    // Check if user already in room
    const existingIndex = room.participants.findIndex(p => p.id === userId);
    
    if (existingIndex >= 0) {
      // Update existing participant
      room.participants[existingIndex].isOnline = true;
      room.participants[existingIndex].lastSeen = new Date();
    } else {
      // Add new participant
      const user = await this.authService.getUserInfo(userId);
      if (user) {
        room.participants.push({
          ...user,
          role: room.ownerId === userId ? 'owner' : 'editor')
          isOnline: true,)
          lastSeen: new Date()
        });
      }
    }

    room.updatedAt = new Date();
    RoomManager.rooms.set(room.id, room);

    // Update database
    if (isServiceConfigured('database')) {
      try {
        await DatabaseService.query('UPDATE collaboration_rooms SET participants = ?, updated_at = ? WHERE id = ?',)
          [JSON.stringify(room.participants), room.updatedAt.toISOString(), room.id]
        );
      } catch (error) {
        logger.error('Database error updating room participants:', error);
      }
    }

    return room;
  }

  async updateUserOfflineStatus(roomId: string, userId: string): Promise<CollaborationRoom | null> {
    const room = RoomManager.rooms.get(roomId);
    if (!room) return null;

    // Update participant status
    const participantIndex = room.participants.findIndex(p => p.id === userId);
    if (participantIndex >= 0) {
      room.participants[participantIndex].isOnline = false;
      room.participants[participantIndex].lastSeen = new Date();
    }

    RoomManager.rooms.set(roomId, room);
    return room;
  }

  sanitizeRoom(room: CollaborationRoom): Partial<CollaborationRoom> {
    return {
      id: room.id,
      projectId: room.projectId,
      name: room.name,
      participants: room.participants,
      settings: room.settings
    };
  }

  private parseRoomFromDB(dbRoom: DatabaseRoom): CollaborationRoom {
    return {
      id: dbRoom.id,
      projectId: dbRoom.project_id,
      name: dbRoom.name,
      ownerId: dbRoom.owner_id,
      participants: JSON.parse(dbRoom.participants || '[]'),
      settings: JSON.parse(dbRoom.settings || '{}'),
      createdAt: new Date(dbRoom.created_at),
      updatedAt: new Date(dbRoom.updated_at)
    };
  }

  static async createRoom(projectId: string, ownerId: string, settings?: Partial<RoomSettings>): Promise<string> {
    const roomId = this.generateId();
    const roomManager = new RoomManager();
    await roomManager.getOrCreateRoom(roomId, projectId, ownerId);
    return roomId;
  }

  static async getRoomParticipants(roomId: string): Promise<any[]> {
    const room = this.rooms.get(roomId);
    return room ? room.participants : [];
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}