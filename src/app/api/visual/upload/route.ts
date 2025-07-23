// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }
    
    // File upload logic would go here
    // This is a placeholder for actual file upload to storage
    const upload = {
      id: `upload_${Date.now()}`,
      filename: file.name,
      size: file.size,
      type: file.type,
      url: `https://example.com/uploads/${Date.now()}_${file.name}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    return NextResponse.json({
      success: true,
      upload
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const uploadId = url.searchParams.get('uploadId');
    
    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }
    
    // Simulate getting upload status
    const upload = {
      id: uploadId,
      status: 'completed',
      url: `https://example.com/uploads/${uploadId}.png`,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      upload
    });
  } catch (error) {
    console.error('Get upload error:', error);
    return NextResponse.json(
      { error: 'Failed to get upload' },
      { status: 500 }
    );
  }
}