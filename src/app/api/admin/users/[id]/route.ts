import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { AdminQueries } from '@/lib/admin-queries';
import { DatabaseService } from '@/lib/database';

// Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request, 'manage_users');
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      // Get real user data from database
      const user = await AdminQueries.getUserById(params.id);

      // Log admin activity
      if (auth.session) {
        await DatabaseService.logActivity(
          auth.session.adminId,
          'view_user_details',
          'admin_users',
          params.id,
          {
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown';
          }}
        );
      }

      return NextResponse.json({
        success: true,
        data: user;
      }});
    } catch (dbError) {
      console.error('Database, error:', dbError);

      // Return error if user not found
      if (dbError instanceof Error && dbError.message === 'User not found') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(
        { error: 'Unable to fetch user due to database connection issues' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Admin get user, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request, 'manage_users');
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // In production, update user in database
    // const updatedUser = await updateUser(params.id, body)

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString()};
    }});
  } catch (error) {
    console.error('Admin update user, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request, 'manage_users');
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // In production, delete user from database
    // await deleteUser(params.id)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully';
    }});
  } catch (error) {
    console.error('Admin delete user, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
  });
}
