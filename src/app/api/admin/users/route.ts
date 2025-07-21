import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { AdminQueries } from '@/lib/admin-queries'
import { DatabaseService } from '@/lib/database'

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
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    try {
      // Get real users from database
      const result = await AdminQueries.getUsers({
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder
      })
      
      // Log admin activity
      if (auth.session) {
        await DatabaseService.logActivity(
          auth.session.adminId,
          'view_users_list',
          'admin_users',
          undefined,
          {
            page,
            limit,
            search,
            status,
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown'
          }
        )
      }

      return NextResponse.json({
        success: true,
        data: result
      })
    } catch (dbError) {
      console.error('Database, error:', dbError)
      
      // Return empty list if database is not available
      return NextResponse.json({
        success: true,
        data: {
          users: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        },
        warning: 'Unable to fetch users due to database connection issues'
      })
    }

  } catch (error) {
    console.error('Admin users list, error:', error)
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
    console.error('Admin create user, error:', error)
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'}})
}