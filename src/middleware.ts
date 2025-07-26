import { NextRequest, NextResponse } from 'next/server';
import { checkApiRateLimit } from '@/lib/api/rate-limiter';

// Define public routes that don't require rate limiting
const PUBLIC_FILE_REGEX = /\.(.*)$/;
const PUBLIC_ROUTES = [
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Connection', 'keep-alive');
  
  // Geo-based routing
  const country = request.geo?.country || 'US';
  response.headers.set('X-User-Country', country);
  
  // Cache control for static assets
  if (pathname.startsWith('/images/') || 
      pathname.startsWith('/fonts/') ||
      pathname.startsWith('/_next/static/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    try {
      // Skip rate limiting for public files and Next.js internals
      if (
        PUBLIC_FILE_REGEX.test(pathname) ||
        PUBLIC_ROUTES.some(route => pathname.startsWith(route))
      ) {
        return response;
      }

      // Determine rate limit tier based on the route
      let tier: 'api' | 'upload' | 'anonymous' = 'api';
      
      if (pathname.includes('/upload') || pathname.includes('/visual')) {
        tier = 'upload';
      } else if (pathname.includes('/public') || pathname.includes('/health')) {
        tier = 'anonymous';
      }

      const rateLimitResult = await checkApiRateLimit(request, tier);
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', rateLimitResult.totalHits.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());

      if (!rateLimitResult.allowed) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
              ...Object.fromEntries(response.headers.entries()),
            },
          }
        );
      }
    } catch (error) {
      console.error('Rate limiting middleware error:', error);
      // Allow request to proceed on error
    }
  }
  
  return response;
}