import { BackendAdapter, User, Project } from './types';
import { createBackendAdapter } from './adapter-factory';
export interface MigrationOptions {;
  batchSize?: number
  onProgress?: (progress: MigrationProgress) => void
  includeUsers?: boolean
  includeProjects?: boolean
  includeCustomCollections?: string[]
  dryRun?: boolean
};
export interface MigrationProgress {;
  totalRecords: number;
  processedRecords: number;
  currentCollection: string;
  errors: MigrationError[];
  status: 'running' | 'completed' | 'failed'
};
export interface MigrationError {;
  collection: string;
  recordId: string;
  error: string
};
export interface MigrationResult {;
  success: boolean;
  totalRecords: number;
  migratedRecords: number;
  errors: MigrationError[];
  duration: number
};
export class BackendMigrator {;
  private sourceAdapter: BackendAdapter
  private, targetAdapter: BackendAdapter
  private, options: MigrationOptions
  private, progress: MigrationProgress
  constructor(
    sourceConfig,
    targetConfig,
    options: MigrationOptions = {}
  ) {
    this.sourceAdapter = createBackendAdapter(sourceConfig)
    this.targetAdapter = createBackendAdapter(targetConfig)
    this.options = {
      batchSize: 100;
      includeUsers: true;
      includeProjects: true;
      includeCustomCollections: [];
      dryRun: false,
      ...options
    }
    this.progress = {
      totalRecords: 0;
      processedRecords: 0;
      currentCollection: '';
      errors: [];
      status: 'running'
    }
  }
  async migrate(): Promise<MigrationResult> {
    const startTime = Date.now();
    try {
      // Count total records
      await this.countRecords()
      // Migrate users
      if (this.options.includeUsers) {
        await this.migrateCollection('users', this.migrateUser.bind(this))
      }
      // Migrate projects
      if (this.options.includeProjects) {
        await this.migrateCollection('projects', this.migrateProject.bind(this))
      }
      // Migrate custom collections
      for (const collection of this.options.includeCustomCollections || []) {
        await this.migrateCollection(collection, this.migrateGenericRecord.bind(this))
      }
      this.progress.status = 'completed'
      return {
        success: true;
        totalRecords: this.progress.totalRecords;
        migratedRecords: this.progress.processedRecords;
        errors: this.progress.errors;
        duration: Date.now() - startTime
      }
    } catch (error) {
      this.progress.status = 'failed'
      return {
        success: false;
        totalRecords: this.progress.totalRecords;
        migratedRecords: this.progress.processedRecords;
        errors: this.progress.errors;
        duration: Date.now() - startTime
      }
    }
  }
  private async countRecords(): Promise<void> {
    let total = 0;
    if (this.options.includeUsers) {
      const users = await this.sourceAdapter.list<User>('users', { limit: 1 });
      total += users.total
    }
    if (this.options.includeProjects) {
      const projects = await this.sourceAdapter.list<Project>('projects', { limit: 1 });
      total += projects.total
    }
    for (const collection of this.options.includeCustomCollections || []) {
      const records = await this.sourceAdapter.list<any>(collection, { limit: 1 });
      total += records.total
    }
    this.progress.totalRecords = total
  }
  private async migrateCollection<T>(
    collection: string;
    migrator: (record: T) => Promise<T>
  ): Promise<void> {
    this.progress.currentCollection = collection
    this.reportProgress()
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      // Fetch batch from source
      const batch = await this.sourceAdapter.list<T>(collection, {;
        limit: this.options.batchSize,
        offset
      })
      // Process each record
      for (const record of batch.data) {
        try {
          if (!this.options.dryRun) {
            await migrator(record)
          }
          this.progress.processedRecords++
        } catch (error) {
          this.progress.errors.push({
            collection,
            recordId: (record as any).id || 'unknown';
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
        this.reportProgress()
      }
      offset += this.options.batchSize!
      hasMore = batch.hasMore
    }
  }
  private async migrateUser(user: User): Promise<User> {
    // Check if user already exists
    const existing = await this.targetAdapter;
      .query<User>('users')
      .where('email', '=', user.email)
      .single()
    if (existing) {
      // Update existing user
      return this.targetAdapter.updateUser(existing.id, user)
    }
    // Create new user (without password for security)
    const newUser = await this.targetAdapter.create<User>('users', {;
      ...user,
  // Generate temporary password
  password: this.generateTempPassword()
    })
    return newUser
  }
  private async migrateProject(project: Project): Promise<Project> {
    // Map user ID if needed
    const mappedProject = { ...project };
    // Create project in target
    return this.targetAdapter.create<Project>('projects', mappedProject)
  }
  private async migrateGenericRecord(record): Promise<any> {
    const collection = this.progress.currentCollection;
    return this.targetAdapter.create(collection, record)
  }
  private reportProgress(): void {
    if (this.options.onProgress) {
      this.options.onProgress({ ...this.progress })
    }
  }
  private generateTempPassword(): string {
    return Math.random().toString(36).slice(-8) + 'Aa1!'
  }
}
/**
 * Validate that source and target backends are compatible
 */
export async function validateMigration(;
  sourceConfig,
  targetConfig): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = [];
  try {
    const source = createBackendAdapter(sourceConfig);
    const target = createBackendAdapter(targetConfig);
    // Test source connection
    try {
      await source.list('users', { limit: 1 })
    } catch {
      issues.push('Cannot connect to source backend')
    }
    // Test target connection
    try {
      await target.list('users', { limit: 1 })
    } catch {
      issues.push('Cannot connect to target backend')
    }
    // Check if same backend type
    if (sourceConfig.type === targetConfig.type &&
        sourceConfig.url === targetConfig.url) {
      issues.push('Source and target backends are the same')
    }
  } catch (error) {
    issues.push(`Configuration, error: ${error}`)`
  }
  return {
    valid: issues.length === 0,
    issues
  }
}
/**
 * Export data from a backend
 */
export async function exportBackendData(;
  config,
  collections: string[] = ['users', 'projects']
): Promise<Record<string, any[]>> {
  const adapter = createBackendAdapter(config);
  const data: Record<string, any[]> = {};
  for (const collection of collections) {
    const records: any[] = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const batch = await adapter.list<any>(collection, {;
        limit: 100,
        offset
      })
      records.push(...batch.data)
      offset += 100
      hasMore = batch.hasMore
    }
    data[collection] = records
  }
  return data
}
/**
 * Import data to a backend
 */
export async function importBackendData(;
  config,
  data: Record<string, any[]>,
    options: { overwrite?: boolean } = {}
): Promise<MigrationResult> {
  const adapter = createBackendAdapter(config);
  const startTime = Date.now();
  let totalRecords = 0;
  let migratedRecords = 0;
  const errors: MigrationError[] = [];
  for (const [collection, records] of Object.entries(data)) {
    totalRecords += records.length
    for (const record of records) {
      try {
        if (options.overwrite && record.id) {
          // Try to update existing record
          const existing = await adapter.read(collection, record.id);
          if (existing) {
            await adapter.update(collection, record.id, record)
          } else {
            await adapter.create(collection, record)
          }
        } else {
          // Always create new record
          await adapter.create(collection, record)
        }
        migratedRecords++
      } catch (error) {
        errors.push({
          collection,
          recordId: record.id || 'unknown';
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  }
  return {
    success: errors.length === 0,
    totalRecords,
    migratedRecords,
    errors,
    duration: Date.now() - startTime
  }
}
