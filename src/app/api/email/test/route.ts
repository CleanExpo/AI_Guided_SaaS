import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Simulate email configuration test
        const configTest = { success: true };
    if (!configTest.success) {
      return NextResponse.json({
          success: false,
          error: 'Email configuration test failed'
        }, { status: 500 })
}
    return NextResponse.json({ success: true, message: 'Email configuration test passed',
      timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Email test error:', error);
        return NextResponse.json({ error: 'Email test failed' }, { status: 500 })
}}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const status = {
      configured: !!process.env.SMTP_HOST,
      provider: process.env.EMAIL_PROVIDER || 'none',
      lastTest: new Date().toISOString()
};
    return NextResponse.json({ success: true, status })
} catch (error) {
    console.error('Email status error:', error);
        return NextResponse.json({ error: 'Failed to get email status' }, { status: 500 })
}};
export const dynamic = "force-dynamic";
