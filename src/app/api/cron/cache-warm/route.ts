
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

const CRITICAL_PATHS = [
  '/',
  '/dashboard',
  '/api/health',
  '/prompts',
  '/folders'
];

export async function GET(request: NextRequest) {
  const results = [];
  
  for (const path of CRITICAL_PATHS) {
    try {
      const url = new URL(path, request.url);
      const response = await fetch(url.toString(), {
        headers: {
          'X-Prerender-Revalidate': process.env.PRERENDER_TOKEN || '',
        },
      });
      
      results.push({
        path,
        status: response.status,
        cached: response.headers.get('x-vercel-cache') || 'MISS'
      });
    } catch (error) {
      results.push({
        path,
        status: 500,
        error: error.message
      });
    }
  }
  
  return NextResponse.json({
    warmed: results,
    timestamp: new Date().toISOString()
  });
}
