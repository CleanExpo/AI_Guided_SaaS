import { NextResponse } from 'next/server';
import { EnvManager } from '@/lib/env/EnvManager';
export async function GET(): void {
  try {
    const envManager = new EnvManager();
    const status = envManager.getStatus();
    return NextResponse.json({
      success: true;
      data: status;
      timestamp: new Date().toISOString()});
  } catch (error) {
    console.error('Error getting env, status:', error);
    return NextResponse.json(
      {
        success: false;
        error: 'Failed to get environment status';
      }},
      { status: 500 }
    );
  }
};
export async function POST(request: Request): void {
  try {
    const body = await request.json();
    const { action } = body;
    const envManager = new EnvManager();
    switch (action) {
      case 'validate':
        const validation = envManager.validate(;
          body.environment || 'development'
        );
        return NextResponse.json({
          success: true;
          data: validation;
        }});
      case 'sync':
        await envManager.sync();
        return NextResponse.json({
          success: true;
          message: 'Environment synchronized';
        }});
      case 'compact':
        envManager.compact();
        return NextResponse.json({
          success: true;
          message: 'Configuration compacted';
        }});
      default:
        return NextResponse.json(
          {
            success: false;
            error: 'Invalid action';
          }},
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing env, action:', error);
    return NextResponse.json(
      {
        success: false;
        error: 'Failed to process action';
      }},
      { status: 500 }
    );
  }
}
