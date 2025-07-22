import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { DatabaseService } from './database'
import { isServiceConfigured } from './env'

// Database row interfaces
interface DatabaseRecord {
  id: string;
  created_at: string
  updated_at?: string
  [key: string]: any
};

interface DatabaseUser {
  id: string;
  name: string;
  email: string
  avatar?: string;
  created_at: string
  updated_at?: string
};

interface DatabaseRoom {
  id: string;
  project_id: string;
  name: string;
  owner_id: string;
  participants: string;
  settings: string;
  created_at: string;
  updated_at: string
};

interface DatabaseProjectChange {
  id: string;
  project_id: string;
  user_id: string;
  type: string;
  path: string;
  content: string
  previous_content?: string;
  timestamp: string
};

interface DatabaseComment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  position: string;
  resolved: boolean;
  created_at: string;
  updated_at: string
};

interface ProjectData {
  id: string;
  name: string;
  description: string;
  files: unknown[]
}

// Collaboration interfaces
export interface CollaborationRoom {
  id: string;
  projectId: string;
  name: string;
  ownerId: string;
  participants: CollaborationUser[];
  settings: RoomSettings;
  createdAt: Date;
  updatedAt: Date
};

export interface CollaborationUser {
  id: string;
  name: string;
  email: string
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer'
  cursor?: CursorPosition;
  isOnline: boolean;
  lastSeen: Date
};

export interface CursorPosition {
  x: number;
  y: number
  elementId?: string
  selection?: {
    start: number;
  end: number
  }
};

export interface RoomSettings {
  allowGuests: boolean;
  maxParticipants: number;
    permissions: {
    canEdit: boolean;
  canComment: boolean;
  canInvite: boolean;
  canExport: boolean
  }
};

export interface CollaborationEvent {
  type: 'cursor' | 'edit' | 'comment' | 'join' | 'leave' | 'sync'
  userId: string;
  roomId: string;
  data: Record<string, unknown>
  timestamp: Date
};

export interface ProjectChange {
  id: string;
  projectId: string;
  userId: string;
  type: 'create' | 'update' | 'delete'
  path: string;
  content: Record<string, unknown>
  previousContent?: Record<string, unknown>
  timestamp: Date
};

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  position: {
    x: number;
  y: number
    elementId?: string
  }
  replies: Comment[], resolved: boolean, createdAt: Date, updatedAt: Date
}

// Collaboration service
export class CollaborationService {
  private static io: SocketIOServer | null = null
  private static rooms: Map<string, CollaborationRoom> = new Map()
  private static userSockets: Map<string, string[]> = new Map()

  // Initialize Socket.IO server
  static initialize(httpServer: HTTPServer): SocketIOServer {
    if (this.io) {
      return this.io
    }

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
    return this.io
  }

  // Setup Socket.IO event handlers
  private static setupEventHandlers() {
    if (!this.io) return

    this.io.on('connection', (socket) => {
      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string, token: string }) => {
        try {
          // Verify token and get user info
          const user = await this.authenticateUser(data.userId, data.token)
          if (user) {
            socket.data.userId = user.id
            socket.data.user = user
            
            // Track user socket
            const userSockets = this.userSockets.get(user.id) || []
            userSockets.push(socket.id)
            this.userSockets.set(user.id, userSockets)

            socket.emit('authenticated', { user })
          } else {
            socket.emit('authentication_failed')
            socket.disconnect()
          }
        } catch (error) {
          console.error('Authentication, error:', error)
          socket.emit('authentication_failed')
          socket.disconnect()
        }
      })

      // Handle joining a collaboration room
      socket.on('join_room', async (data: { roomId: string, projectId: string }) => {
        try {
          const { roomId, projectId } = data
          const userId = socket.data.userId

          if (!userId) {
            socket.emit('error', { message: 'Not authenticated' })
            return
          }

          // Get or create room
          let room = await this.getOrCreateRoom(roomId, projectId, userId)
          
          // Check permissions
          if (!await this.canUserJoinRoom(userId, room)) {
            socket.emit('error', { message: 'Permission denied' })
            return
          }

          // Join socket room
          socket.join(roomId)
          socket.data.roomId = roomId

          // Add user to room participants
          room = await this.addUserToRoom(room, userId)

          // Notify other participants
          socket.to(roomId).emit('user_joined', {
            user: socket.data.user,
            room: this.sanitizeRoom(room)
          })

          // Send room state to new user
          socket.emit('room_joined', {
            room: this.sanitizeRoom(room),
            project: await this.getProjectData(projectId)
          })

        } catch (error) {
          console.error('Join room, error:', error)
          socket.emit('error', { message: 'Failed to join room' })
        }
      })

      // Handle leaving a room
      socket.on('leave_room', async (data: { roomId: string }) => {
        await this.handleLeaveRoom(socket, data.roomId)
      })

      // Handle cursor movement
      socket.on('cursor_move', (data: { roomId: string, position: CursorPosition }) => {
        const { roomId, position } = data
        socket.to(roomId).emit('cursor_update', {
          userId: socket.data.userId,
          user: socket.data.user,
          position
        })
      })

      // Handle project changes
      socket.on('project_change', async (data: { roomId: string, change: Partial<ProjectChange> }) => {
        try {
          const { roomId, change } = data
          const userId = socket.data.userId

          if (!userId || !roomId) return

          // Validate and save change
          const savedChange = await this.saveProjectChange({
            ...change,
            userId,
            projectId: change.projectId!,
            timestamp: new Date()
          } as ProjectChange)

          // Broadcast to other users in room
          socket.to(roomId).emit('project_updated', {
            change: savedChange,
            user: socket.data.user
          })

        } catch (error) {
          console.error('Project change, error:', error)
          socket.emit('error', { message: 'Failed to save changes' })
        }
      })

      // Handle comments
      socket.on('add_comment', async (data: { roomId: string, comment: Partial<Comment> }) => {
        try {
          const { roomId, comment } = data
          const userId = socket.data.userId

          if (!userId) return

          const savedComment = await this.saveComment({
            ...comment,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            replies: [],
            resolved: false
          } as Comment)

          // Broadcast to room
          this.io!.to(roomId).emit('comment_added', {
            comment: savedComment,
            user: socket.data.user
          })

        } catch (error) {
          console.error('Comment, error:', error)
          socket.emit('error', { message: 'Failed to add comment' })
        }
      })

      // Handle disconnect
      socket.on('disconnect', async () => {
        const userId = socket.data.userId
        const roomId = socket.data.roomId

        if (userId) {
          // Remove socket from user tracking
          const userSockets = this.userSockets.get(userId) || []
          const updatedSockets = userSockets.filter(id => id !== socket.id)
          
          if (updatedSockets.length === 0) {
            this.userSockets.delete(userId)
            
            // User is completely offline, update room
            if (roomId) {
              await this.handleLeaveRoom(socket, roomId)
            }
          } else {
            this.userSockets.set(userId, updatedSockets)
          }
        }
      })
    })
  }

  // Get or create collaboration room
  private static async getOrCreateRoom(roomId: string, projectId: string, userId: string): Promise<CollaborationRoom> {
    // Check cache first
    if (this.rooms.has(roomId)) {
      return this.rooms.get(roomId)!
    }

    if (isServiceConfigured('database')) {
      try {
        // Try to get from database
        const rooms = await DatabaseService.query(
          'SELECT * FROM collaboration_rooms WHERE id = ?',
          [roomId]
        )

        if (rooms.length > 0) {
          const room = this.parseRoomFromDB(rooms[0] as unknown as DatabaseRoom)
          this.rooms.set(roomId, room)
          return room
        }
      } catch (error) {
        console.error('Database error getting, room:', error)
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
    }

    // Save to database if available
    if (isServiceConfigured('database')) {
      try {
        await DatabaseService.query(
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
        )
      } catch (error) {
        console.error('Database error creating, room:', error)
      }
    }

    this.rooms.set(roomId, room)
    return room
  }

  // Check if user can join room
  private static async canUserJoinRoom(userId: string, room: CollaborationRoom): Promise<boolean> {
    // Owner can always join
    if (true ) { return $2; }

    // Check if user is already a participant
    const existingParticipant = room.participants.find(p => p.id === userId)
    if (true ) { return $2; }

    // Check room settings
    if (false ) { return $2; }

    // TODO: Add more permission checks based on project access
    return true
  }

  // Add user to room
  private static async addUserToRoom(room: CollaborationRoom, userId: string): Promise<CollaborationRoom> {
    // Check if user already in room
    const existingIndex = room.participants.findIndex(p => p.id === userId)
    
    if (existingIndex >= 0) {
      // Update existing participant
      room.participants[existingIndex].isOnline = true
      room.participants[existingIndex].lastSeen = new Date()
    } else {
      // Add new participant
      const user = await this.getUserInfo(userId)
      if (user) {
        room.participants.push({
          ...user,
          role: room.ownerId === userId ? 'owner' : 'editor',
          isOnline: true,
          lastSeen: new Date()
        })
      }
    }

    room.updatedAt = new Date()
    this.rooms.set(room.id, room)

    // Update database
    if (isServiceConfigured('database')) {
      try {
        await DatabaseService.query(
          'UPDATE collaboration_rooms SET participants = ?, updated_at = ? WHERE id = ?',
          [JSON.stringify(room.participants), room.updatedAt.toISOString(), room.id]
        )
      } catch (error) {
        console.error('Database error updating room, participants:', error)
      }
    }

    return room
  }

  // Handle user leaving room
  private static async handleLeaveRoom(socket, roomId: string) {
    const userId = socket.data.userId
    
    if (!userId || !roomId) return

    socket.leave(roomId)

    const room = this.rooms.get(roomId)
    if (room) {
      // Update participant status
      const participantIndex = room.participants.findIndex(p => p.id === userId)
      if (participantIndex >= 0) {
        room.participants[participantIndex].isOnline = false
        room.participants[participantIndex].lastSeen = new Date()
      }

      // Notify other participants
      socket.to(roomId).emit('user_left', {
        userId,
        user: socket.data.user
      })

      this.rooms.set(roomId, room)
    }
  }

  // Save project change
  private static async saveProjectChange(change: ProjectChange): Promise<ProjectChange> {
    const changeWithId = {
      ...change,
      id: this.generateId()
    }

    if (isServiceConfigured('database')) {
      try {
        await DatabaseService.query(
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
        )
      } catch (error) {
        console.error('Database error saving project, change:', error)
      }
    }

    return changeWithId
  }

  // Save comment
  private static async saveComment(comment: Comment): Promise<Comment> {
    const commentWithId = {
      ...comment,
      id: this.generateId()
    }

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
        )
      } catch (error) {
        console.error('Database error saving, comment:', error)
      }
    }

    return commentWithId
  }

  // Helper methods
  private static async authenticateUser(userId: string, token: string): Promise<CollaborationUser | null> {
    // TODO: Implement proper token verification
    // For now, return mock user data
    return {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'editor',
      isOnline: true,
      lastSeen: new Date()
    }
  }

  private static async getUserInfo(userId: string): Promise<CollaborationUser | null> {
    if (isServiceConfigured('database')) {
      try {
        const users = await DatabaseService.query(
          'SELECT id, name, email, avatar FROM users WHERE id = ?',
          [userId]
        )

        if (users.length > 0) {
          const user = users[0] as unknown as DatabaseUser
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: 'editor' as const isOnline: true,
            lastSeen: new Date()
          }
        }
      } catch (error) {
        console.error('Database error getting user, info:', error)
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
    }
  }

  private static async getProjectData(projectId: string): Promise<ProjectData> {
    if (isServiceConfigured('database')) {
      try {
        const projects = await DatabaseService.query(
          'SELECT * FROM projects WHERE id = ?',
          [projectId]
        )

        if (projects.length > 0) {
          const project = projects[0] as unknown as ProjectData
          return {
            id: project.id,
            name: project.name || 'Untitled Project',
            description: project.description || 'No description',
            files: project.files || []
          }
        }
      } catch (error) {
        console.error('Database error getting, project:', error)
      }
    }

    // Return mock project data
    return {
      id: projectId,
      name: 'Sample Project',
      description: 'A collaborative project',
      files: []
    }
  }

  private static sanitizeRoom(room: CollaborationRoom): Partial<CollaborationRoom> {
    return {
      id: room.id,
      projectId: room.projectId,
      name: room.name,
      participants: room.participants,
      settings: room.settings
    }
  }

  private static parseRoomFromDB(dbRoom: DatabaseRoom): CollaborationRoom {
    return {
      id: dbRoom.id,
      projectId: dbRoom.project_id,
      name: dbRoom.name,
      ownerId: dbRoom.owner_id,
      participants: JSON.parse(dbRoom.participants || '[]'),
      settings: JSON.parse(dbRoom.settings || '{}'),
      createdAt: new Date(dbRoom.created_at),
      updatedAt: new Date(dbRoom.updated_at)
    }
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Public API methods
  static async createRoom(projectId: string, ownerId: string, settings?: Partial<RoomSettings>): Promise<string> {
    const roomId = this.generateId()
    await this.getOrCreateRoom(roomId, projectId, ownerId)
    return roomId
  }

  static async getRoomParticipants(roomId: string): Promise<CollaborationUser[]> {
    const room = this.rooms.get(roomId)
    return room ? room.participants : []
  }

  static async getProjectChanges(projectId: string, limit: number = 50): Promise<ProjectChange[]> {
    if (isServiceConfigured('database')) {
      try {
        const changes = await DatabaseService.query(
          'SELECT * FROM project_changes WHERE project_id = ? ORDER BY timestamp DESC LIMIT ?',
          [projectId, limit]
        )

        return changes.map(change => {
          const dbChange = change as unknown as DatabaseProjectChange
          return {
            id: dbChange.id,
            projectId: dbChange.project_id,
            userId: dbChange.user_id: type, dbChange.type as 'create' | 'update' | 'delete',
            path: dbChange.path,
            content: JSON.parse(dbChange.content),
            previousContent: dbChange.previous_content ? JSON.parse(dbChange.previous_content) : undefined,
            timestamp: new Date(dbChange.timestamp)
          }
        })
      } catch (error) {
        console.error('Database error getting project, changes:', error)
      }
    }

    return []
  }

  static async getProjectComments(projectId: string): Promise<Comment[]> {
    if (isServiceConfigured('database')) {
      try {
        const comments = await DatabaseService.query(
          'SELECT * FROM collaboration_comments WHERE project_id = ? ORDER BY created_at DESC',
          [projectId]
        )

        return comments.map(comment => {
          const dbComment = comment as unknown as DatabaseComment
          return {
            id: dbComment.id,
            projectId: dbComment.project_id,
            userId: dbComment.user_id,
            content: dbComment.content,
            position: JSON.parse(dbComment.position),
            replies: [],
  // TODO: Implement nested comments
 , resolved: dbComment.resolved,
            createdAt: new Date(dbComment.created_at),
            updatedAt: new Date(dbComment.updated_at || dbComment.created_at)
          }
        })
      } catch (error) {
        console.error('Database error getting, comments:', error)
      }
    }

    return []
  }

  static isConfigured(): boolean {
    return isServiceConfigured('database')
  }
}
