-- Migration: 004_collaboration
-- Description: Real-time collaboration features and room management
-- Author: AI Guided SaaS Team
-- Date: 2025-07-26

-- Collaboration rooms
CREATE TABLE IF NOT EXISTS public.collaboration_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    max_participants INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room participants
CREATE TABLE IF NOT EXISTS public.room_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    cursor_position JSONB, -- For cursor tracking
    selected_element JSONB, -- For selection tracking
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    UNIQUE(room_id, user_id)
);

-- Collaboration messages
CREATE TABLE IF NOT EXISTS public.collaboration_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'code', 'file', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared cursors and selections
CREATE TABLE IF NOT EXISTS public.collaboration_cursors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cursor_x INTEGER,
    cursor_y INTEGER,
    selection_start JSONB,
    selection_end JSONB,
    color TEXT, -- User's cursor color
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Code changes tracking
CREATE TABLE IF NOT EXISTS public.collaboration_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    change_type TEXT CHECK (change_type IN ('insert', 'delete', 'update')),
    line_start INTEGER,
    line_end INTEGER,
    content TEXT,
    previous_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collaboration invites
CREATE TABLE IF NOT EXISTS public.collaboration_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    invitee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
    token TEXT UNIQUE NOT NULL,
    accepted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screen sharing sessions
CREATE TABLE IF NOT EXISTS public.screen_sharing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    presenter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    peer_connection_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- Collaboration annotations
CREATE TABLE IF NOT EXISTS public.collaboration_annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.collaboration_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    target_element TEXT NOT NULL, -- CSS selector or element ID
    annotation_type TEXT CHECK (annotation_type IN ('comment', 'suggestion', 'issue', 'approval')),
    content TEXT NOT NULL,
    position JSONB NOT NULL, -- x, y coordinates
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_collaboration_rooms_project ON public.collaboration_rooms(project_id);
CREATE INDEX idx_room_participants_room ON public.room_participants(room_id);
CREATE INDEX idx_room_participants_user ON public.room_participants(user_id);
CREATE INDEX idx_collaboration_messages_room ON public.collaboration_messages(room_id);
CREATE INDEX idx_collaboration_messages_created ON public.collaboration_messages(created_at);
CREATE INDEX idx_collaboration_changes_room ON public.collaboration_changes(room_id);
CREATE INDEX idx_collaboration_changes_file ON public.collaboration_changes(file_path);
CREATE INDEX idx_collaboration_invites_token ON public.collaboration_invites(token);
CREATE INDEX idx_collaboration_invites_email ON public.collaboration_invites(invitee_email);

-- Functions
-- Function to check if user can join room
CREATE OR REPLACE FUNCTION can_join_room(p_user_id UUID, p_room_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_room_exists BOOLEAN;
    v_is_participant BOOLEAN;
    v_has_invite BOOLEAN;
    v_current_participants INTEGER;
    v_max_participants INTEGER;
BEGIN
    -- Check if room exists and is active
    SELECT EXISTS(
        SELECT 1 FROM public.collaboration_rooms 
        WHERE id = p_room_id AND is_active = TRUE
    ) INTO v_room_exists;
    
    IF NOT v_room_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Check if already a participant
    SELECT EXISTS(
        SELECT 1 FROM public.room_participants 
        WHERE room_id = p_room_id AND user_id = p_user_id
    ) INTO v_is_participant;
    
    IF v_is_participant THEN
        RETURN TRUE;
    END IF;
    
    -- Check if has valid invite
    SELECT EXISTS(
        SELECT 1 FROM public.collaboration_invites 
        WHERE room_id = p_room_id 
        AND invitee_id = p_user_id 
        AND expires_at > NOW()
        AND accepted_at IS NULL
    ) INTO v_has_invite;
    
    IF NOT v_has_invite THEN
        RETURN FALSE;
    END IF;
    
    -- Check room capacity
    SELECT COUNT(*), r.max_participants
    INTO v_current_participants, v_max_participants
    FROM public.room_participants p
    JOIN public.collaboration_rooms r ON r.id = p.room_id
    WHERE p.room_id = p_room_id AND p.left_at IS NULL
    GROUP BY r.max_participants;
    
    RETURN v_current_participants < v_max_participants;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old cursor data
CREATE OR REPLACE FUNCTION cleanup_old_cursors()
RETURNS void AS $$
BEGIN
    DELETE FROM public.collaboration_cursors 
    WHERE updated_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.collaboration_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_cursors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_sharing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_annotations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Rooms are accessible to participants
CREATE POLICY "Room participants can view room" ON public.collaboration_rooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.room_participants 
            WHERE room_id = collaboration_rooms.id 
            AND user_id = auth.uid()
        )
    );

-- Room creators can update their rooms
CREATE POLICY "Room creators can update" ON public.collaboration_rooms
    FOR UPDATE USING (created_by = auth.uid());

-- Participants can view other participants
CREATE POLICY "Participants can view room members" ON public.room_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.room_participants p 
            WHERE p.room_id = room_participants.room_id 
            AND p.user_id = auth.uid()
        )
    );

-- Messages are viewable by room participants
CREATE POLICY "Participants can view messages" ON public.collaboration_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.room_participants 
            WHERE room_id = collaboration_messages.room_id 
            AND user_id = auth.uid()
        )
    );

-- Participants can create messages
CREATE POLICY "Participants can send messages" ON public.collaboration_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.room_participants 
            WHERE room_id = collaboration_messages.room_id 
            AND user_id = auth.uid()
        )
    );

-- Triggers
CREATE TRIGGER update_collaboration_rooms_updated_at BEFORE UPDATE ON public.collaboration_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rollback:
-- DROP TABLE public.collaboration_annotations CASCADE;
-- DROP TABLE public.screen_sharing_sessions CASCADE;
-- DROP TABLE public.collaboration_invites CASCADE;
-- DROP TABLE public.collaboration_changes CASCADE;
-- DROP TABLE public.collaboration_cursors CASCADE;
-- DROP TABLE public.collaboration_messages CASCADE;
-- DROP TABLE public.room_participants CASCADE;
-- DROP TABLE public.collaboration_rooms CASCADE;
-- DROP FUNCTION can_join_room(UUID, UUID);
-- DROP FUNCTION cleanup_old_cursors();