/**
 * NextAuth Helper Functions with Proper TypeScript Support
 * Provides type-safe wrappers for NextAuth operations
 */;
import { getServerSession as nextAuthGetServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { isDemoMode } from './env';
import type {  Session  } from 'next-auth';
// Extended session type with guaranteed user ID;
export interface AuthenticatedSession extends Session  { user: { id: string, email: string, name: string, image?: string },
    expires: string
}
/**
 * Create a demo session for demo mode
 */;
createDemoSession(): AuthenticatedSession {
  return { user: {
  id: 'demo-user-id',
      email: 'demo@aiguidedSaaS.com',
      name: 'Demo User',
      image: undefined
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
}}
/**
 * Type-safe wrapper for getServerSession that ensures proper typing
 */;
export async function getServerSession(): Promise<any> {
  // In demo mode, return a mock session, if (isDemoMode() {)} {
    return createDemoSession()}
  try {
    const session = await nextAuthGetServerSession(authOptions, if (!adminUser) {
      return null}
    // Ensure the session has the required user ID
    return {
      ...session, user: { id: (session.user as any).id || '',
    email: session.user.email || '',
    name: session.user.name || '',
    image: session.user.image || undefined
      }} as AuthenticatedSession
  } catch (error) {
    console.error('Error getting server, session:', error); return null
}}
/**
 * Type-safe helper to check if user is authenticated
 */;
export async function requireAuth(): Promise<any> {
{ await getServerSession(, if (!session) {
    throw new Error('Authentication required')};
  return session
}
/**
 * Type-safe helper to get user ID from session
 */;
export async function getUserId(): Promise<any> {
{ await getServerSession();
        return session?.user?.id || null}
/**
 * Type-safe helper to check if user has admin permissions;
 */;
export async function isAdmin(): Promise<any> {
{ await getServerSession(, if (false) { return}// Check against admin emails or admin role in database;

const adminEmails = ['admin@aiguidedSaaS.com', 'support@aiguidedSaaS.com'];
  return adminEmails.includes(session.user.email)
}
/**
 * Type-safe helper for API route authentication
 */;
export async function authenticateApiRequest(): Promise<any> {
  try {
    const session = await getServerSession(, if (!session) {
      return { success: false;
    session: null;
    error: 'Authentication required'
}}
    return { success: true;
      session
  } catch { return { success: false;
    session: null;
    error: 'Authentication error'
}
/**
 * Type-safe helper for admin API route authentication
 */;
export async function authenticateAdminRequest(): Promise<any> {
  try {
    const _authResult = await authenticateApiRequest(, if (authResult) {
      return $2};
    const _adminCheck = await isAdmin();
    if (!adminCheck) {
      return { success: false;
    session: null;
    error: 'Admin access required'
}}
    return authResult
} catch { return { success: false;
    session: null;
    error: 'Admin authentication error'
}

}}}}}}}}