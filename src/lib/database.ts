/* BREADCRUMB: data.layer - Database connections and queries */

// Re-export types for backward compatibility
export * from './database/types';
// Re-export client
export { supabase } from './database/client';
// Import services
import { UserService } from './database/services/user-service';
import { ProjectService } from './database/services/project-service';
import { ActivityService } from './database/services/activity-service';
import { BillingService } from './database/services/billing-service';
import { FeatureFlagService } from './database/services/feature-flag-service';
import { GenericService } from './database/services/generic-service';

// Database helper functions
export class DatabaseService {
  // User operations
  static async createUser(userData: Partial<User>) {
    return UserService.createUser(userData);
  }

  static async getUserById(id: string) {
    return UserService.getUserById(id);
  }

  static async getUserByEmail(email: string) {
    return UserService.getUserByEmail(email);
  }

  static async updateUser(id: string, updates: Partial<User>) {
    return UserService.updateUser(id, updates);
  }

  static async getUserByStripeCustomerId(customerId: string) {
    return UserService.getUserByStripeCustomerId(customerId);
  }

  // Project operations
  static async createProject(projectData: Partial<Project>) {
    return ProjectService.createProject(projectData);
  }

  static async getUserProjects(userId: string) {
    return ProjectService.getUserProjects(userId);
  }

  static async updateProject(id: string, updates: Partial<Project>) {
    return ProjectService.updateProject(id, updates);
  }

  // Activity logging
  static async logActivity(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    metadata?: ActivityMetadata
  ) {
    return ActivityService.logActivity(userId, action, resourceType, resourceId, metadata);
  }

  static async recordUsage(
    userId: string,
    resourceType: string,
    quantity: number,
    metadata?: UsageMetadata
  ) {
    return ActivityService.recordUsage(userId, resourceType, quantity, metadata);
  }

  static async getUserUsage(userId: string, month?: Date) {
    return ActivityService.getUserUsage(userId, month);
  }

  // Billing operations
  static async recordPayment(paymentData: PaymentData) {
    return BillingService.recordPayment(paymentData);
  }

  static async getUserSubscription(userId: string) {
    return BillingService.getUserSubscription(userId);
  }

  static async updateSubscription(subscriptionData: SubscriptionData) {
    return BillingService.updateSubscription(subscriptionData);
  }

  // Feature flags
  static async getFeatureFlag(name: string, userId?: string) {
    return FeatureFlagService.getFeatureFlag(name, userId);
  }

  // Generic operations
  static async query(sql: string, params?: unknown[]) {
    return GenericService.query(sql, params);
  }

  static async createRecord(table: string, data: DatabaseRecord) {
    return GenericService.createRecord(table, data);
  }
}