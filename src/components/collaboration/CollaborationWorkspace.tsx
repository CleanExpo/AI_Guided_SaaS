'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  MessageCircle,
  Copy,
  Crown,
  Eye,
  Edit3,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react'
import {
  CollaborationRoom,
  CollaborationUser,
  CursorPosition,
  Comment,
  ProjectChange
} from '@/lib/collaboration'

interface CollaborationWorkspaceProps {
  projectId: string
  roomId?: string
  onRoomCreated?: (roomId: string) => void
}

export default function CollaborationWorkspace({
  projectId,
  roomId,
  onRoomCreated
}: CollaborationWorkspaceProps) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)</Socket>
  const [room, setRoom] = useState<CollaborationRoom | null>(null)</CollaborationRoom>
  const [participants, setParticipants] = useState<CollaborationUser[]>([])</CollaborationUser>
  const [comments, setComments] = useState<Comment[]>([])</Comment>
      </ProjectChange>
  const [changes, setChanges] = useState<ProjectChange[]>([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)</ProjectChange>
      </Map>
  const [cursors, setCursors] = useState<Map<string, { user: CollaborationUser, position: CursorPosition }>>(new Map())
  const [inviteLink, setInviteLink] = useState('')
  const [testMode, setTestMode] = useState(false)
  </Map>
  const workspaceRef = useRef<HTMLDivElement>(null)</HTMLDivElement>
  const mousePosition = useRef<{ x: number, y: number }>({ x: 0, y: 0 })

  const initializeCollaboration = useCallback(async () => {
    setLoading(true)
    try {
      // Initialize Socket.IO connection
      const newSocket = io({
        transports: ['websocket', 'polling']
      })

      // Set up event listeners
      setupSocketListeners(newSocket)

      // Authenticate with the server
      newSocket.emit('authenticate', {
        userId: session?.user?.email || 'anonymous',
        token: 'mock-token' // TODO: Use real JWT token
      })

      setSocket(newSocket)
    } catch (error) {
      console.error('Error initializing, collaboration:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.email, projectId, roomId, onRoomCreated])

  useEffect(() => {
    if (session?.user) {
      initializeCollaboration()
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [session, projectId, roomId, initializeCollaboration, socket])

  const setupSocketListeners = (socket: Socket) => {
    socket.on('connect', () => {
      console.log('Connected to collaboration server')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from collaboration server')
      setConnected(false)
    })

    socket.on('authenticated', (data: { user: CollaborationUser }) => {
      console.log('Authenticated:', data.user)
      
      // Join or create room
      if (roomId) {
        socket.emit('join_room', { roomId, projectId })
      } else {
        // Create new room
        createNewRoom(socket)
      }
    })

    socket.on('room_joined', (data: { room: CollaborationRoom, project: unknown }) => {
      console.log('Joined room:', data.room)
      setRoom(data.room)
      setParticipants(data.room.participants || [])
      setInviteLink(`${window.location.origin}/collaborate/${data.room.id}`)
      setTestMode(true) // Since we're using mock data
      
      if (!roomId && onRoomCreated) {
        onRoomCreated(data.room.id)
      }
    })

    socket.on('user_joined', (data: { user: CollaborationUser, room: CollaborationRoom }) => {
      console.log('User joined:', data.user)
      setParticipants(data.room.participants || [])
    })

    socket.on('user_left', (data: { userId: string, user: CollaborationUser }) => {
      console.log('User left:', data.user)
      setParticipants(prev => prev.filter(p => p.id !== data.userId))
      
      // Remove cursor
      setCursors(prev => {
        const newCursors = new Map(prev)
        newCursors.delete(data.userId)
        return newCursors
      })
    })

    socket.on('cursor_update', (data: { userId: string, user: CollaborationUser; position: CursorPosition }) => {
      if (data.userId !== (session?.user as { id?: string })?.id) {
        setCursors(prev => {
          const newCursors = new Map(prev)
          newCursors.set(data.userId, { user: data.user, position: data.position })
          return newCursors
        }
      )}
    </div>
  );
    })

    socket.on('project_updated', (data: { change: ProjectChange, user: CollaborationUser }) => {
      console.log('Project updated:', data.change)
      setChanges(prev => [data.change, ...prev.slice(0, 49)]) // Keep last 50 changes
    })

    socket.on('comment_added', (data: { comment: Comment, user: CollaborationUser }) => {
      console.log('Comment added:', data.comment)
      setComments(prev => [data.comment, ...prev])
    })

    socket.on('error', (data: { message: string }) => {
      console.error('Collaboration, error:', data.message)
    }
      )}
    </div>
    );
  const createNewRoom = async (socket: Socket) => {
    try {
      const response = await fetch('/api/collaboration/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          settings: {
            allowGuests: true,
            maxParticipants: 10; permissions: {
              canEdit: true,
              canComment: true,
              canInvite: true,
              canExport: true
            }
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        socket.emit('join_room', { roomId: data.roomId, projectId }
      )}
    </div>
    );
    } catch (error) {
      console.error('Error creating, room:', error)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!socket || !room) return

    const rect = workspaceRef.current?.getBoundingClientRect()
    if (!rect) return

    const position: CursorPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    mousePosition.current = position
    
    // Throttle cursor updates
    if (Date.now() % 100 === 0) {
      socket.emit('cursor_move', {
        roomId: room.id,
        position
      }
      )}
    </div>
    );
  }

  const handleAddComment = () => {
    if (!socket || !room || !newComment.trim()) return

    const comment = {
      projectId,
      content: newComment,
      position: {
        x: mousePosition.current.x,
        y: mousePosition.current.y
      }
    }

    socket.emit('add_comment', {
      roomId: room.id,
      comment
    })

    setNewComment('')
  }


  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
  }

  const getParticipantStatusColor = (participant: CollaborationUser) => {
    if (participant.isOnline) {
      return 'bg-green-500'
    }
    return 'bg-gray-400'
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3" />
      case 'editor':</Crown>
        return <Edit3 className="h-3 w-3" />
      case 'viewer':</Edit3>
        return <Eye className="h-3 w-3" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8"></div>
        <div className="text-center"></div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing collaboration...</p>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}</div>
      <div className="flex items-center justify-between p-4 border-b"></div>
        <div className="flex items-center space-x-4"></div>
          <div className="flex items-center space-x-2">
            {connected ? (</div>
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (</Wifi>
              <WifiOff className="h-4 w-4 text-red-500" />
            )}</WifiOff>
            <span className="text-sm font-medium">
              {connected ? 'Connected' : 'Disconnected'}</span>
          
          {room && (
            <Badge variant="outline">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}</Badge>
          )}
        </div>

        <div className="flex items-center space-x-2"></div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
          ></Button>
            <Users className="h-4 w-4 mr-1" />
            Participants</Users>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          ></Button>
            <MessageCircle className="h-4 w-4 mr-1" />
            Comments ({comments.length})</MessageCircle>

          {inviteLink && (
            <Button variant="outline" size="sm" onClick={copyInviteLink}></Button>
              <Copy className="h-4 w-4 mr-1" />
              Copy Link</Copy>
          )}
        </div>

      {testMode && (
        <Alert className="m-4"></Alert>
          <AlertDescription>
            Collaboration is running in demo mode. In production, this would provide real-time collaboration with live cursors, synchronized editing, and persistent comments.</AlertDescription>
      )}

      <div className="flex-1 flex">
        {/* Main workspace */}</div>
        <div 
          ref={workspaceRef}
          className="flex-1 relative bg-gray-50 overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {/* Collaboration cursors */}
          {Array.from(cursors.entries()).map(([userId, { user, position }]) => (</div>
            <div
              key={userId}
              className="absolute pointer-events-none z-50"
              style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-2px, -2px)'
              }}
            ></div>
              <div className="flex items-center space-x-1"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                  {user.name}</div>
          ))}

          {/* Comments overlay */}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="absolute z-40"
              style={{
                left: comment.position.x,
                top: comment.position.y
              }}
            ></div>
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 shadow-lg max-w-xs"></div>
                <div className="text-xs font-medium text-yellow-800 mb-1">
                  Comment</div>
                <div className="text-sm text-yellow-700">
                  {comment.content}</div>
          ))}

          {/* Project workspace content */}
          <div className="p-8"></div>
            <div className="max-w-4xl mx-auto"></div>
              <h1 className="text-2xl font-bold mb-6">Collaborative Project Workspace</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
                <Card></Card>
                  <CardHeader></CardHeader>
                    <CardTitle>Project Files</CardTitle>
                    <CardDescription>
                      Collaborate on project files in real-time</CardDescription>
                  <CardContent></CardContent>
                    <div className="space-y-2"></div>
                      <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer"></div>
                        <div className="font-medium">index.html</div>
                        <div className="text-sm text-gray-500">Main HTML file</div>
                      <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer"></div>
                        <div className="font-medium">styles.css</div>
                        <div className="text-sm text-gray-500">Stylesheet</div>
                      <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer"></div>
                        <div className="font-medium">script.js</div>
                        <div className="text-sm text-gray-500">JavaScript logic</div>
                  </CardContent>

                <Card></Card>
                  <CardHeader></CardHeader>
                    <CardTitle>Recent Changes</CardTitle>
                    <CardDescription>
                      Live project updates from collaborators</CardDescription>
                  <CardContent></CardContent>
                    <div className="space-y-2">
                      {changes.slice(0, 5).map((change) => (</div>
                        <div key={change.id} className="flex items-center space-x-2 text-sm"></div>
                          <Clock className="h-3 w-3 text-gray-400" /></Clock>
                          <span className="font-medium">{change.type}</span>
                          <span className="text-gray-500">{change.path}</span>))}
                      {changes.length === 0 && (
                        <div className="text-sm text-gray-500">No recent changes</div>
                      )}
                    </div>

              {/* Add comment section */}
              <Card className="mt-6"></Card>
                <CardHeader></CardHeader>
                  <CardTitle>Add Comment</CardTitle>
                  <CardDescription>
                    Click anywhere on the workspace and add a comment</CardDescription>
                <CardContent></CardContent>
                  <div className="flex space-x-2"></div>
                    <Input
                      placeholder="Type your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    /></Input>
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}></Button>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Comment</MessageCircle>

        {/* Participants sidebar */}
        {showParticipants && (
          <div className="w-80 border-l bg-white"></div>
            <div className="p-4 border-b"></div>
              <h3 className="font-semibold">Participants</h3>
            <div className="p-4 space-y-3">
              {participants.map((participant) => (</div>
                <div key={participant.id} className="flex items-center space-x-3"></div>
                  <div className="relative"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {participant.avatar ? (</div>
                        <img 
                          src={participant.avatar} 
                          alt={participant.name}
                          className="w-full h-full rounded-full"
                        />
                      ) : (</img>
                        <span className="text-sm font-medium">
                          {participant.name.charAt(0)}</span>
                      )}
                    </div>
                    <div 
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getParticipantStatusColor(participant)}`}
                    ></div>
                  
                  <div className="flex-1"></div>
                    <div className="flex items-center space-x-1"></div>
                      <span className="font-medium">{participant.name}</span>
                      {getRoleIcon(participant.role)}
                    </div>
                    <div className="text-sm text-gray-500">{participant.email}</div>
              ))}
              
              {participants.length === 0 && (
                <div className="text-sm text-gray-500">No participants yet</div>
              )}
            </div>
        )}

        {/* Comments sidebar */}
        {showComments && (
          <div className="w-80 border-l bg-white"></div>
            <div className="p-4 border-b"></div>
              <h3 className="font-semibold">Comments</h3>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment) => (</div>
                <div key={comment.id} className="border rounded-lg p-3"></div>
                  <div className="text-sm font-medium mb-1">Anonymous User</div>
                  <div className="text-sm text-gray-700 mb-2">{comment.content}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleTimeString()}</div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-sm text-gray-500">No comments yet</div>
              )}
            </div>
        )}
      </div>
    );
}
