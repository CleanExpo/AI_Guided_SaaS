import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { CollaborationService } from '@/lib/collaboration'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, settings } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Create collaboration room
    const roomId = await CollaborationService.createRoom(
      projectId,
      session.user.email,
      settings
    )

    return NextResponse.json({
      success: true,
      roomId,
      message: 'Collaboration room created successfully',
      testMode: !CollaborationService.isConfigured()
    })

  } catch (error) {
    console.error('Collaboration room creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create collaboration room' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    // Get room participants
    const participants = await CollaborationService.getRoomParticipants(roomId)

    return NextResponse.json({
      success: true,
      participants,
      testMode: !CollaborationService.isConfigured()
    })

  } catch (error) {
    console.error('Get room participants error:', error)
    return NextResponse.json(
      { error: 'Failed to get room participants' },
      { status: 500 }
    )
  }
}
