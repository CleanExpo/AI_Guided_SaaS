import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const authStatus = {;
            adminEnabled: process.env.ENABLE_ADMIN_PANEL === 'true';
            hasAdminPassword: !!process.env.ADMIN_PASSWORD;
            timestamp: new Date().toISOString()
};
        return NextResponse.json(authStatus);
} catch (error) {
        console.error('Admin auth status error:', error);
        return NextResponse.json({ error: 'Failed to get auth status' }, { status: 500 })
}}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {;
        const body  = await request.json(); const { password } = body;
        if (!password) {
            return NextResponse.json({ error: 'Password required' }, { status: 400 })
};
        // Simple password check;

const isValid = password === process.env.ADMIN_PASSWORD;
        if (isValid) {
            return NextResponse.json({ success: true, message: 'Authentication successful' })
} else {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
    } catch (error) {;
        console.error('Direct auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
}};
export const dynamic = "force-dynamic";
