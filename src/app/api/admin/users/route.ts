import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'

// Mock user data - replace with actual database queries
const getMockUsers = () => {
  const users = []
  for (let i = 1; i <= 50; i++) {
    users.push({
      id: `user_${i}`,
      email: `user${i}@example.com`,
      name: `User ${i}`,
      status: i % 10 === 0 ? 'inactive' : 'active',
      role: i % 5 === 0 ? 'premium' : 'free',
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      projectsCount: Math.floor(Math.random() * 20),
      apiCalls: Math.floor(Math.random() * 1000)
    })
  }
  return users
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await requireAdminAuth(request, 'manage_users')
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Get mock users
    let users = getMockUsers()

    // Apply filters
    if (search) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      users = users.filter(user => user.status === status)
    }

    // Apply sorting
    users.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a]
      const bVal = b[sortBy as keyof typeof b]
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages: Math.ceil(users.length / limit)
        }
      }
    })

  } catch (error) {
    console.error('Admin users list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request, 'manage_users')
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // In production, create user in database
    // const newUser = await createUser(body)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        id: `user_${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Admin create user error:', error)
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}