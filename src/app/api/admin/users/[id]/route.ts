import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'

// Mock user data
const getMockUser = (id: string) => {
  return {
    id,
    email: `user${id}@example.com`,
    name: `User ${id}`,
    status: 'active',
    role: 'free',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    projectsCount: 5,
    apiCalls: 234,
    profile: {
      bio: 'A passionate developer',
      avatar: null,
      location: 'San Francisco, CA',
      company: 'Tech Corp'
    },
    subscription: {
      plan: 'free',
      status: 'active',
      expiresAt: null
    }
  }
}

// Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request, 'manage_users')
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = getMockUser(params.id)

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Admin get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request, 'manage_users')
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // In production, update user in database
    // const updatedUser = await updateUser(params.id, body)

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: {
        ...getMockUser(params.id),
        ...body,
        updatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request, 'manage_users')
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // In production, delete user from database
    // await deleteUser(params.id)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Admin delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}