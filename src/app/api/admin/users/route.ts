// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Simulate users data
    const users = Array.from({ length: limit }, (_, i) => ({
      id: `user_${page}_${i + 1}`,
      email: `user${page}_${i + 1}@example.com`,
      name: `User ${page} ${i + 1}`,
      status: i % 2 === 0 ? 'active' : 'inactive',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }));

    const response = {
      users,
      pagination: {
        page,
        limit,
        total: 1247,
        pages: Math.ceil(1247 / limit)
      },
      filters: {
        search,
        status,
        sortBy,
        sortOrder
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}