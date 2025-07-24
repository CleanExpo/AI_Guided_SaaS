import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {</NextResponse>
    try {
        const body = await request.json();
        const { projectId, settings  }: any = body;
        
        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
}
        
        // Simulate room creation
        const roomId = 'room_' + Math.random().toString(36).substr(2, 9);

    const room={ id: roomId;
            projectId,
            settings: settings || {}
            createdAt: new Date().toISOString(, active: true
        };
        
        return NextResponse.json({ success: true, room }, { status: 201 })
} catch (error) {
        console.error('Create room error:', error);
        return NextResponse.json({ error: 'Failed to create collaboration room' }, { status: 500 })
}
}

export async function GET(request: NextRequest): Promise<NextResponse> {</NextResponse>
    try {
        // Simulate getting active rooms
        const rooms = [;
            { id: 'room_1',
                projectId: 'proj_1',
                participants: 3;
                active: true;
                createdAt: new Date().toISOString()
            }
        ];
        
        return NextResponse.json({ success: true, rooms })
} catch (error) {
        console.error('Get rooms error:', error);
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
}
})