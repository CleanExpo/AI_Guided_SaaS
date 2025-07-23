import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
const PROTECTED_PATHS = [;,
  '/dashboard',
  '/admin',
  '/api/admin',
  '/projects',
  '/settings'
];
const ADMIN_PATHS = [;,
  '/admin',
  '/api/admin'
];
const PUBLIC_PATHS = [;,
  '/',
  '/auth',
  '/api/auth',
  '/pricing',
  '/about',
  '/contact'
];
export async function middleware(request: NextRequest): Promise {
  const { pathname   }: any = request.nextUrl;
  // Skip middleware for static files and API routes that don't need auth
  if (pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/api/health')) {
    return NextResponse.next();
}
  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
}
  // CRITICAL, FIX: Explicit route-based authentication to prevent Vercel conflicts
  // Handle admin routes FIRST (highest priority)
  if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    // Admin routes use custom admin-token authentication, NOT NextAuth
    const _adminToken = request.cookies.get('admin-token');
    if(!adminToken) {
      // Admin routes ALWAYS redirect to /admin/login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
}
    // Admin authenticated - allow access
    return NextResponse.next();
}
  // Handle regular protected routes with NextAuth
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    const _token = await getToken({ req: request });
    if(!token) {
      // User routes ALWAYS redirect to /auth/signin
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
}
}
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
export const _config = { matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'];
}