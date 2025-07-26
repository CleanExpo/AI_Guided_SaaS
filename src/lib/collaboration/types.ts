// Database row interfaces
export interface DatabaseRecord {
  id: string;
  created_at: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at?: string;
}

export interface DatabaseRoom {
  id: string;
  project_id: string;
  name: string;
  owner_id: string;
  participants: string;
  settings: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProjectChange {
  id: string;
  project_id: string;
  user_id: string;
  type: string;
  path: string;
  content: string;
  previous_content?: string;
  timestamp: string;
}

export interface DatabaseComment {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  position: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  files: unknown[];
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
  updatedAt: Date;
}

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  cursor?: CursorPosition;
  isOnline: boolean;
  lastSeen: Date;
}

export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
  selection?: {
    start: number;
    end: number;
  };
}

export interface RoomSettings {
  allowGuests: boolean;
  maxParticipants: number;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canInvite: boolean;
    canExport: boolean;
  };
}

export interface CollaborationEvent {
  type: 'cursor' | 'edit' | 'comment' | 'join' | 'leave' | 'sync';
  userId: string;
  roomId: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface ProjectChange {
  id: string;
  projectId: string;
  userId: string;
  type: 'create' | 'update' | 'delete';
  path: string;
  content: Record<string, unknown>;
  previousContent?: Record<string, unknown>;
  timestamp: Date;
}

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  position: {
    x: number;
    y: number;
    elementId?: string;
  };
  replies: Comment[];
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}