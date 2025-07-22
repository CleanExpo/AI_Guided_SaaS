import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdminRequest } from '@/lib/auth-helpers';
import { adminService } from '@/lib/admin';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateAdminRequest();

    if (!authResult.success || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin permissions
    const hasPermission = await adminService.checkAdminPermission(
      authResult.session.user.email,
      'view_admin_panel'
    );
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'stats':
        const stats = await adminService.getSystemStats();
        return NextResponse.json(stats);

      case 'users':
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status') || undefined;
        const subscription = searchParams.get('subscription') || undefined;
        const search = searchParams.get('search') || undefined;

        const users = await adminService.getUsers(page, limit, {
          status,
          subscription,
          search,
        });
        return NextResponse.json(users);

      case 'content':
        const contentPage = parseInt(searchParams.get('page') || '1');
        const contentLimit = parseInt(searchParams.get('limit') || '20');
        const contentType = searchParams.get('type') || undefined;
        const contentStatus = searchParams.get('status') || undefined;

        const content = await adminService.getContentForModeration(
          contentPage,
          contentLimit,
          {
            type: contentType,
            status: contentStatus;
          }}
        );
        return NextResponse.json(content);

      case 'configuration':
        const config = await adminService.getSystemConfiguration();
        return NextResponse.json(config);

      case 'activity':
        const activityPage = parseInt(searchParams.get('page') || '1');
        const activityLimit = parseInt(searchParams.get('limit') || '50');
        const adminId = searchParams.get('adminId') || undefined;
        const actionFilter = searchParams.get('actionFilter') || undefined;

        const activity = await adminService.getAdminActivity(
          activityPage,
          activityLimit,
          {
            adminId,
            action: actionFilter;
          }}
        );
        return NextResponse.json(activity);

      case 'health':
        const healthCheck = await adminService.performSystemHealthCheck();
        return NextResponse.json(healthCheck);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdminRequest();

    if (!authResult.success || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'update_user_status':
        const hasUserPermission = await adminService.checkAdminPermission(
          authResult.session.user.email,
          'manage_users'
        );
        if (!hasUserPermission) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await adminService.updateUserStatus(
          data.userId,
          data.status,
          authResult.session.user.email
        );
        return NextResponse.json({ success: true });

      case 'moderate_content':
        const hasContentPermission = await adminService.checkAdminPermission(
          authResult.session.user.email,
          'moderate_content'
        );
        if (!hasContentPermission) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await adminService.moderateContent(
          data.contentId,
          data.action,
          authResult.session.user.email,
          data.reason
        );
        return NextResponse.json({ success: true });

      case 'update_configuration':
        const hasConfigPermission = await adminService.checkAdminPermission(
          authResult.session.user.email,
          'system_configuration'
        );
        if (!hasConfigPermission) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await adminService.updateConfiguration(
          data.configId,
          data.value,
          authResult.session.user.email
        );
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API, error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
