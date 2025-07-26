/* BREADCRUMB: library - Shared library code */

// Export all types
export * from './admin/types';

// Export query classes
export { StatsQueries } from './admin/queries/stats-queries';
export { AnalyticsQueries } from './admin/queries/analytics-queries';
export { UserQueries } from './admin/queries/user-queries';
export { SystemQueries } from './admin/queries/system-queries';

// Main AdminQueries class that aggregates all query modules
export class AdminQueries {
  // Stats methods
  static getAdminStats = StatsQueries.getAdminStats;
  
  // Analytics methods
  static getAnalytics = AnalyticsQueries.getAnalytics;
  
  // User management methods
  static searchUsers = UserQueries.searchUsers;
  static getUserDetails = UserQueries.getUserDetails;
  static updateUser = UserQueries.updateUser;
  static deleteUser = UserQueries.deleteUser;
  static impersonateUser = UserQueries.impersonateUser;
  
  // System methods
  static getDebugInfo = SystemQueries.getDebugInfo;
  static clearCache = SystemQueries.clearCache;
  static runDiagnostics = SystemQueries.runDiagnostics;
  static exportLogs = SystemQueries.exportLogs;
}

// Re-export commonly used functions for backward compatibility
export const getAdminStats = AdminQueries.getAdminStats;
export const getAnalytics = AdminQueries.getAnalytics;
export const searchUsers = AdminQueries.searchUsers;
export const getUserDetails = AdminQueries.getUserDetails;
export const getDebugInfo = AdminQueries.getDebugInfo;