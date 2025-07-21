import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logSecurity, logWarn } from './lib/production-logger';

// Rate limiting store (in production, use Redis or external service)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers configuration
const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent content type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.openai.com, https://api.anthropic.com, https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com"].join('; '),
  
  // Permissions policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'].join(', ')};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes, maxRequests: 100, // requests per window, apiWindowMs: 1 * 60 * 1000, // 1 minute for API routes, apiMaxRequests: 20, // API requests per minute
};

function getRateLimitKey(request: NextRequest): string {
  // Use IP address or user ID for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return `rate_limit:${ip}`;
}

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs});
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

function validateRequest(request: NextRequest): string | null {
  // Check for suspicious patterns
  const url = request.url.toLowerCase();
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // Block common attack patterns
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript injection
    /vbscript:/i,  // VBScript injection
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      return 'Suspicious request pattern detected';
    }
  }
  
  // Check for bot patterns (basic)
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i];
  
  // Allow legitimate bots but log them
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    logSecurity('Bot detected', { userAgent });
  }
  
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // CRITICAL: Skip middleware for admin routes to prevent NextAuth interference
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Validate request for suspicious patterns
  const validationError = validateRequest(request);
  if (validationError) {
    logSecurity(`Blocked suspicious, request: ${validationError}`, {
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.ip});
    
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Apply rate limiting
  const rateLimitKey = getRateLimitKey(request);
  const isApiRoute = pathname.startsWith('/api');
  
  const { maxRequests, windowMs } = isApiRoute
    ? { maxRequests: RATE_LIMIT_CONFIG.apiMaxRequests, windowMs: RATE_LIMIT_CONFIG.apiWindowMs }
    : { maxRequests: RATE_LIMIT_CONFIG.maxRequests, windowMs: RATE_LIMIT_CONFIG.windowMs };
  
  if (!checkRateLimit(rateLimitKey, maxRequests, windowMs)) {
    logWarn(`Rate limit exceeded for ${rateLimitKey}`, {
      pathname,
      ip: request.headers.get('x-forwarded-for') || request.ip});
    
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil(windowMs / 1000).toString()}});
  }
  
  // Create response with security headers
  const response = NextResponse.next();
  
  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add HSTS header for HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Add rate limit headers
  const record = rateLimitStore.get(rateLimitKey);
  if (record) {
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting, with:
     * - admin (admin routes - handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!admin|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']};
