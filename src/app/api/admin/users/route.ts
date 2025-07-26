// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { validateInput } from '@/lib/api/validation-middleware';
import { commonSchemas } from '@/lib/api/validation-schemas';
export async function GET(request: NextRequest): Promise<NextResponse> {
    return validateInput(commonSchemas.pagination, 'query')(request, async (params) => {
        try {
            const { page, limit, search, sortBy, sortOrder } = params;
            const url = new URL(request.url);
            const status = url.searchParams.get('status') || 'all';
        // Simulate users data

        const users = Array.from({ length: limit }, (_, i) => ({ id: `user_${page}_${i + 1}`,
            email: `user${page}_${i + 1}@example.com`,
            name: `User ${page} ${i + 1}`,
            status: i % 2 === 0 ? 'active' : 'inactive',
            createdAt: new Date().toISOString(), lastLogin: new Date().toISOString()
       
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
            logger.error('Get users error:', error);
            return NextResponse.json({ 
                error: 'Failed to fetch users' 
            }, { 
                status: 500
            });
        }
    });
}