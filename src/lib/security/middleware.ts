import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../logger';
import { Redis } from '../redis/client';
import crypto from 'crypto';

/**
 * Security Configuration
 */
export interface SecurityConfig {
  csrfProtection: boolean;
  rateLimiting: boolean;
  ipWhitelist?: string[];
  ipBlacklist?: string[];
  maxRequestSize: number;
  allowedOrigins: string[];
  securityHeaders: boolean;
  requestValidation: boolean;
}

/**
 * Default security configuration
 */
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  csrfProtection: true,
  rateLimiting: true,
  maxRequestSize: 10 * 1024 * 1024, // 10MB
  allowedOrigins: ['http://localhost:3000', 'https://localhost:3000'],
  securityHeaders: true,
  requestValidation: true,
};

/**
 * Security Middleware Class
 */
export class SecurityMiddleware {
  private config: SecurityConfig;
  private suspiciousIPs = new Map<
    string,
    { count: number; lastSeen: number }
  >();

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }

  /**
   * Main security middleware handler
   */
  async handle(request: NextRequest): Promise<NextResponse | null> {
    const start = Date.now();

    try {
      // Extract client info
      const clientInfo = this.extractClientInfo(request);

      // 1. IP filtering
      const ipCheck = await this.checkIPRestrictions(clientInfo.ip);
      if (!ipCheck.allowed) {
        return this.createSecurityResponse('IP_BLOCKED', ipCheck.reason, 403);
      }

      // 2. Rate limiting
      if (this.config.rateLimiting) {
        const rateLimitCheck = await this.checkRateLimit(request, clientInfo);
        if (!rateLimitCheck.allowed) {
          return this.createSecurityResponse(
            'RATE_LIMITED',
            'Too many requests',
            429,
            {
              'Retry-After': rateLimitCheck.retryAfter?.toString() || '60',
            }
          );
        }
      }

      // 3. Request size validation
      const sizeCheck = this.validateRequestSize(request);
      if (!sizeCheck.valid) {
        return this.createSecurityResponse(
          'REQUEST_TOO_LARGE',
          sizeCheck.reason,
          413
        );
      }

      // 4. CORS validation
      const corsCheck = this.validateCORS(request);
      if (!corsCheck.valid) {
        return this.createSecurityResponse(
          'CORS_VIOLATION',
          corsCheck.reason,
          403
        );
      }

      // 5. CSRF protection for state-changing requests
      if (this.config.csrfProtection && this.isStateChangingRequest(request)) {
        const csrfCheck = await this.validateCSRF(request);
        if (!csrfCheck.valid) {
          return this.createSecurityResponse(
            'CSRF_INVALID',
            csrfCheck.reason,
            403
          );
        }
      }

      // 6. Request validation
      if (this.config.requestValidation) {
        const validationCheck = await this.validateRequest(request);
        if (!validationCheck.valid) {
          return this.createSecurityResponse(
            'REQUEST_INVALID',
            validationCheck.reason,
            400
          );
        }
      }

      // 7. Suspicious activity detection
      await this.detectSuspiciousActivity(request, clientInfo);

      // Log successful security check
      const duration = Date.now() - start;
      logger.debug('Security middleware passed', {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        path: request.nextUrl.pathname,
        duration,
      });

      return null; // Continue to next middleware
    } catch (error) {
      logger.error('Security middleware error:', error);
      return this.createSecurityResponse(
        'SECURITY_ERROR',
        'Internal security error',
        500
      );
    }
  }

  /**
   * Extract client information from request
   */
  private extractClientInfo(request: NextRequest) {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    const ip =
      forwarded?.split(',')[0]?.trim() || realIp || cfConnectingIp || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    return { ip, userAgent, origin, referer };
  }

  /**
   * Check IP restrictions (whitelist/blacklist)
   */
  private async checkIPRestrictions(
    ip: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Check blacklist first
    if (this.config.ipBlacklist?.includes(ip)) {
      logger.warn('Blocked IP attempted access', { ip });
      return { allowed: false, reason: 'IP is blacklisted' };
    }

    // Check Redis blacklist for dynamically blocked IPs
    const isBlacklisted = await Redis.exists(`blacklisted_ip:${ip}`);
    if (isBlacklisted) {
      logger.warn('Dynamically blocked IP attempted access', { ip });
      return { allowed: false, reason: 'IP is temporarily blocked' };
    }

    // Check whitelist if configured
    if (this.config.ipWhitelist && this.config.ipWhitelist.length > 0) {
      if (!this.config.ipWhitelist.includes(ip)) {
        return { allowed: false, reason: 'IP not in whitelist' };
      }
    }

    return { allowed: true };
  }

  /**
   * Rate limiting check
   */
  private async checkRateLimit(
    request: NextRequest,
    clientInfo: any
  ): Promise<{
    allowed: boolean;
    retryAfter?: number;
  }> {
    const key = `rate_limit:${clientInfo.ip}:${request.nextUrl.pathname}`;
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;

    try {
      const current = await Redis.incr(key);

      if (current === 1) {
        await Redis.expire(key, Math.ceil(windowMs / 1000));
      }

      if (current > maxRequests) {
        logger.warn('Rate limit exceeded', {
          ip: clientInfo.ip,
          path: request.nextUrl.pathname,
          count: current,
        });

        return { allowed: false, retryAfter: 60 };
      }

      return { allowed: true };
    } catch (error) {
      logger.error('Rate limit check failed:', error);
      return { allowed: true }; // Fail open
    }
  }

  /**
   * Validate request size
   */
  private validateRequestSize(request: NextRequest): {
    valid: boolean;
    reason?: string;
  } {
    const contentLength = request.headers.get('content-length');

    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (size > this.config.maxRequestSize) {
        return {
          valid: false,
          reason: `Request size ${size} exceeds limit ${this.config.maxRequestSize}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate CORS
   */
  private validateCORS(request: NextRequest): {
    valid: boolean;
    reason?: string;
  } {
    const origin = request.headers.get('origin');

    // Skip CORS check for same-origin requests
    if (!origin || origin === request.nextUrl.origin) {
      return { valid: true };
    }

    // Check if origin is allowed
    if (!this.config.allowedOrigins.includes(origin)) {
      return {
        valid: false,
        reason: `Origin ${origin} not allowed`,
      };
    }

    return { valid: true };
  }

  /**
   * Check if request is state-changing (POST, PUT, PATCH, DELETE)
   */
  private isStateChangingRequest(request: NextRequest): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
  }

  /**
   * Validate CSRF token
   */
  private async validateCSRF(
    request: NextRequest
  ): Promise<{ valid: boolean; reason?: string }> {
    const csrfToken =
      request.headers.get('x-csrf-token') || request.headers.get('csrf-token');

    if (!csrfToken) {
      return { valid: false, reason: 'CSRF token missing' };
    }

    try {
      // Validate CSRF token format and signature
      const [timestamp, signature] = csrfToken.split('.');

      if (!timestamp || !signature) {
        return { valid: false, reason: 'Invalid CSRF token format' };
      }

      // Check if token is not too old (1 hour max)
      const tokenTime = parseInt(timestamp, 10);
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hour

      if (now - tokenTime > maxAge) {
        return { valid: false, reason: 'CSRF token expired' };
      }

      // Validate signature (simplified - in production use proper HMAC)
      const expectedSignature = crypto
        .createHash('sha256')
        .update(`${timestamp}:${process.env.CSRF_SECRET || 'default-secret'}`)
        .digest('hex')
        .substring(0, 16);

      if (signature !== expectedSignature) {
        return { valid: false, reason: 'Invalid CSRF token signature' };
      }

      return { valid: true };
    } catch (error) {
      logger.error('CSRF validation error:', error);
      return { valid: false, reason: 'CSRF validation failed' };
    }
  }

  /**
   * Validate request content and headers
   */
  private async validateRequest(
    request: NextRequest
  ): Promise<{ valid: boolean; reason?: string }> {
    // Check for suspicious headers
    const suspiciousHeaders = [
      'x-forwarded-host',
      'x-forwarded-server',
      'x-cluster-client-ip',
    ];

    for (const header of suspiciousHeaders) {
      const value = request.headers.get(header);
      if (value && this.containsSuspiciousContent(value)) {
        return {
          valid: false,
          reason: `Suspicious content in header ${header}`,
        };
      }
    }

    // Check User-Agent for bots and suspicious patterns
    const userAgent = request.headers.get('user-agent') || '';
    if (this.isSuspiciousUserAgent(userAgent)) {
      return {
        valid: false,
        reason: 'Suspicious User-Agent detected',
      };
    }

    // Check for SQL injection patterns in URL
    const url = request.nextUrl.toString();
    if (this.containsSQLInjection(url)) {
      return {
        valid: false,
        reason: 'Potential SQL injection detected in URL',
      };
    }

    return { valid: true };
  }

  /**
   * Detect suspicious activity patterns
   */
  private async detectSuspiciousActivity(
    request: NextRequest,
    clientInfo: any
  ): Promise<void> {
    const ip = clientInfo.ip;
    const now = Date.now();
    const suspicious = this.suspiciousIPs.get(ip) || {
      count: 0,
      lastSeen: now,
    };

    // Check for rapid successive requests
    if (now - suspicious.lastSeen < 1000) {
      // Less than 1 second apart
      suspicious.count++;
    } else {
      suspicious.count = Math.max(0, suspicious.count - 1); // Decay
    }

    suspicious.lastSeen = now;
    this.suspiciousIPs.set(ip, suspicious);

    // Block IP if too many suspicious requests
    if (suspicious.count > 10) {
      await Redis.set(`blacklisted_ip:${ip}`, 'suspicious_activity', 3600); // 1 hour block
      logger.warn('IP temporarily blocked for suspicious activity', {
        ip,
        suspiciousCount: suspicious.count,
      });
    }

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance
      this.cleanupSuspiciousIPs();
    }
  }

  /**
   * Check for suspicious content patterns
   */
  private containsSuspiciousContent(content: string): boolean {
    const suspiciousPatterns = [
      /[<>\"']/g, // XSS attempts
      /\b(union|select|insert|update|delete|drop|create|alter)\b/gi, // SQL keywords
      /\.\.\//g, // Directory traversal
      /\${.*}/g, // Template injection
      /%[0-9a-f]{2}/gi, // URL encoding (potential bypass)
    ];

    return suspiciousPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Check for suspicious User-Agent patterns
   */
  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /curl/i,
      /wget/i,
      /python/i,
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /^$/, // Empty user agent
    ];

    // Allow legitimate bots (Google, Bing, etc.)
    const legitimateBots = [
      /googlebot/i,
      /bingbot/i,
      /slackbot/i,
      /twitterbot/i,
      /facebookexternalhit/i,
    ];

    if (legitimateBots.some(pattern => pattern.test(userAgent))) {
      return false;
    }

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Check for SQL injection patterns
   */
  private containsSQLInjection(content: string): boolean {
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
      /((\%27)|(\'))union/i,
      /exec(\s|\+)+(s|x)p\w+/i,
      /union[^a-z]*select/i,
      /select.*from/i,
      /insert.*into/i,
      /delete.*from/i,
      /drop.*table/i,
    ];

    return sqlPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Create security response
   */
  private createSecurityResponse(
    type: string,
    message: string,
    status: number,
    headers: Record<string, string> = {}
  ): NextResponse {
    logger.warn('Security violation detected', { type, message, status });

    const response = NextResponse.json(
      {
        error: 'Security violation',
        message,
        timestamp: new Date().toISOString(),
      },
      { status }
    );

    // Add security headers
    if (this.config.securityHeaders) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set(
        'Referrer-Policy',
        'strict-origin-when-cross-origin'
      );
    }

    // Add custom headers
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  /**
   * Clean up old suspicious IP entries
   */
  private cleanupSuspiciousIPs(): void {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [ip, data] of this.suspiciousIPs.entries()) {
      if (now - data.lastSeen > maxAge) {
        this.suspiciousIPs.delete(ip);
      }
    }
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const timestamp = Date.now().toString();
    const signature = crypto
      .createHash('sha256')
      .update(`${timestamp}:${process.env.CSRF_SECRET || 'default-secret'}`)
      .digest('hex')
      .substring(0, 16);

    return `${timestamp}.${signature}`;
  }
}

/**
 * Create security middleware instance
 */
export const createSecurityMiddleware = (config?: Partial<SecurityConfig>) => {
  return new SecurityMiddleware(config);
};

/**
 * Default security middleware instance
 */
export const securityMiddleware = createSecurityMiddleware();
