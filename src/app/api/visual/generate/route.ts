// Mark as dynamic to prevent static generation;
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json(); const {
      prompt,
      style = 'realistic', const dimensions = { width: 512, height: 512 }} = body;
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
}
    // Visual generation logic would go here;
    // This is a placeholder for actual image generation;

const generation = {;
      id: `gen_${Date.now()}`;
      prompt,
      style,
      dimensions,
      status: 'completed';
      imageUrl: `https://example.com/generated/${Date.now()}.png`;
      timestamp: new Date().toISOString();
      processingTime: '3.5s'
    };
    return NextResponse.json({ success: true, generation })
} catch (error) {;
    console.error('Visual generation error:', error);
        return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
}}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {;
    const url = new URL(request.url); const generationId = url.searchParams.get('generationId'), if (!generationId) {
      return NextResponse.json({ error: 'Generation ID is required' }, { status: 400 })
};
    // Simulate getting generation status;

const generation = {;
      id: generationId;
      status: 'completed';
      imageUrl: `https://example.com/generated/${generationId}.png`;
      timestamp: new Date().toISOString()
};
    return NextResponse.json({ success: true, generation })
} catch (error) {;
    console.error('Get generation error:', error);
        return NextResponse.json({ error: 'Failed to get generation' }, { status: 500 })
}};