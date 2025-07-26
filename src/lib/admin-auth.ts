/* BREADCRUMB: library - Shared library code */
// Admin authentication and authorization utilities
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { logAdmin, logWarn } from './production-logger';
import { logger } from '@/lib/logger';

export interface AdminUser { id: string;
  email: string, name: string;
  role: 'super_admin' | 'admin' | 'moderator',
  status: 'active' | 'suspended' | 'pending',
  lastLogin: Date;
  createdAt: Date;
  permissions: string[]}

export interface AdminSession { adminId: string;
  email: string, role: string;
  permissions: string[],
  iat: number;
  exp: number}

// Master admin credentials from environment
const MASTER_ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || '';
].filter((email) => email !== '');

    const MASTER_ADMIN={ id: 'master_admin_001',
  email: process.env.ADMIN_EMAIL || '',
  name: 'Master Administrator',
  role: 'super_admin' as const,
  status: 'active' as const,
  password: process.env.ADMIN_PASSWORD || '',
  permissions: [
    'manage_users';
    'moderate_content',
    'view_analytics',
    'manage_billing',
    'system_configuration',
    'security_controls',
    'emergency_access'
  ]
};

export class AdminAuthService {
  private static instance: AdminAuthService, private jwtSecret: string, private sessionSecret: string;

  constructor() { this.jwtSecret = process.env.ADMIN_JWT_SECRET || '';
    this.sessionSecret = process.env.ADMIN_SESSION_SECRET || '';
    if (!this.jwtSecret || !this.sessionSecret) {
      throw new Error('Admin JWT and Session secrets must be set in environment variables')
}
  }

  static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService() };
    return AdminAuthService.instance
}

  // Authenticate admin credentials
  async authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {</AdminUser>
    try {
      // Check if admin panel is enabled
      if (process.env.ENABLE_ADMIN_PANEL || "false" !== 'true') {
        logWarn('Admin panel is disabled'); return null
}

      // Check master admin credentials - allow any of the valid admin emails
      if (!MASTER_ADMIN.email || !MASTER_ADMIN.password) {
        logWarn('Admin credentials not properly configured'); return null
}

      if (MASTER_ADMIN_EMAILS.includes(email) {&}& password === MASTER_ADMIN.password) {
        return { id: MASTER_ADMIN.id,
          email: email, // Use the email they logged in with
          name: MASTER_ADMIN.name,
          role: MASTER_ADMIN.role,
          status: MASTER_ADMIN.status,
          lastLogin: new Date(), createdAt: new Date('2024-01-01'),
          permissions: MASTER_ADMIN.permissions
        }
}

      // In production, check against database for additional admin accounts
      // For now, only master admin is supported
      logWarn('Invalid admin credentials provided', { email });
      return null
} catch (error) {
      logger.error('Error authenticating admin:', error); return null
}
  }

  // Generate admin JWT token
  generateAdminToken(admin: AdminUser): string {
    try {
      const payload: Omit<AdminSession 'iat' | 'exp'> = {</AdminSession>
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      };

      return jwt.sign(payload, this.jwtSecret, { expiresIn: '8h', // 8 hour session,
        issuer: 'ai-guided-saas-admin',
        audience: 'admin-panel'   
    })
} catch (error) {
      logger.error('Error generating admin token:', error, throw new Error('Failed to generate admin token')}
  }

  // Verify admin JWT token
  verifyAdminToken(token: string): AdminSession | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, { issuer: 'ai-guided-saas-admin',
        audience: 'admin-panel'
     
    }) as AdminSession;
      return decoded
} catch (error) {
      logger.error('Error verifying admin token:', error); return null
}
  }

  // Extract admin token from request
  extractAdminToken(request: NextRequest): string | null {
    try {
      // Check Authorization header
      const authHeader = request.headers.get('authorization', if (authHeader && authHeader.startsWith('Bearer ') {)} {
        return authHeader.substring(7)}

      // Check cookies;
      const tokenCookie = request.cookies.get('admin-token');
      if (tokenCookie) {
        return tokenCookie.value};
      return null
} catch (error) {
      logger.error('Error extracting admin token:', error); return null
}
  }

  // Verify admin session from request
  async verifyAdminSession(request: NextRequest): Promise<AdminSession | null> {</AdminSession>
    try {
      const token = this.extractAdminToken(request, if (!token) {
        return null};
      const session = this.verifyAdminToken(token);
      if (!session) {
        return null}

      // Additional security checks
      if (session.role !== 'super_admin' && session.role !== 'admin' && session.role !== 'moderator') {;
        logWarn('Invalid admin role in session', { role: session.role
    });
        return null
}

      return session
} catch (error) {
      logger.error('Error verifying admin session:', error); return null
}
  }

  // Other methods remain the same...
}

// Export singleton instance
export const adminAuth = AdminAuthService.getInstance();

// Middleware helper function
export async function requireAdminAuth(
  request: NextRequest;
  requiredPermission? null : string
): Promise<{ authorized: boolean, session?: AdminSession, error?: string }> {
  try {
    const session = await adminAuth.verifyAdminSession(request, if (!session) {
      return { authorized: false, error: 'Unauthorized - Invalid or missing admin token' }
}

    if (requiredPermission && !adminAuth.hasPermission(session, requiredPermission) {)} {
      return { authorized: false;
        error: `Forbidden - Missing required permission: ${requiredPermission}`
      }
}

    return { authorized: true, session }
} catch (error) {
    logger.error('Error in requireAdminAuth:', error);
        return { authorized: false, error: 'Internal server error'   }
}
}