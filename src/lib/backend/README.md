# Backend Adapter System

This system provides a unified interface for working with different backend services (Supabase, Strapi, NocoDB) in the AI Guided SaaS platform.

## Features

- **Unified API**: Same interface regardless of backend choice
- **Hot-swappable**: Switch backends without changing application code
- **Type-safe**: Full TypeScript support with type inference
- **Migration tools**: Easily migrate data between backends
- **Query builder**: Consistent query syntax across backends
- **Real-time support**: Subscribe to data changes (where supported)

## Quick Start

```typescript
import { getBackendAdapter } from '@/lib/backend'

// Get the configured backend adapter
const backend = getBackendAdapter()

// Use it anywhere in your application
const user = await backend.getCurrentUser()
const projects = await backend.listProjects(user.id)
```

## Configuration

### Environment Variables

Set the backend type and credentials in your `.env` file:

```bash
# Backend type: supabase, strapi, or nocodb
NEXT_PUBLIC_BACKEND_TYPE=supabase

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Strapi
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your-api-token

# NocoDB
NEXT_PUBLIC_NOCODB_URL=http://localhost:8080
NEXT_PUBLIC_NOCODB_API_TOKEN=your-api-token
```

### Runtime Configuration

Switch backends at runtime:

```typescript
import { switchBackend } from '@/lib/backend'

await switchBackend({
  type: 'strapi',
  url: 'http://localhost:1337',
  apiKey: 'your-token'
})
```

## Backend Setup

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the database migrations in `supabase/migrations`
3. Copy your project URL and anon key
4. Set environment variables

### Strapi

1. Run Docker: `docker-compose -f docker/services/strapi.yml up`
2. Access admin panel at http://localhost:1337/admin
3. Create content types for users and projects
4. Generate an API token
5. Set environment variables

### NocoDB

1. Run Docker: `docker-compose -f docker/services/nocodb.yml up`
2. Access NocoDB at http://localhost:8080
3. Create tables for users and projects
4. Generate an API token
5. Set environment variables

## API Reference

### Authentication

```typescript
// Sign up
const user = await backend.signUp(email, password, metadata)

// Sign in
const { user, token } = await backend.signIn(email, password)

// Sign out
await backend.signOut()

// Get current user
const user = await backend.getCurrentUser()
```

### CRUD Operations

```typescript
// Create
const project = await backend.create('projects', data)

// Read
const project = await backend.read('projects', id)

// Update
const updated = await backend.update('projects', id, data)

// Delete
await backend.delete('projects', id)

// List with pagination
const result = await backend.list('projects', {
  limit: 10,
  offset: 0,
  orderBy: 'createdAt',
  order: 'desc',
  filters: { status: 'active' }
})
```

### Query Builder

```typescript
const projects = await backend
  .query('projects')
  .where('status', '=', 'active')
  .where('userId', '=', userId)
  .orderBy('createdAt', 'desc')
  .limit(10)
  .execute()

// Get single result
const project = await backend
  .query('projects')
  .where('id', '=', projectId)
  .single()

// Count results
const count = await backend
  .query('projects')
  .where('userId', '=', userId)
  .count()
```

### Real-time Subscriptions

```typescript
// Subscribe to changes
const unsubscribe = backend.subscribe(
  'projects',
  (event) => {
    console.log(event.type) // INSERT, UPDATE, DELETE
    console.log(event.record) // New/updated record
    console.log(event.oldRecord) // Previous state (for updates)
  },
  { userId } // Optional filters
)

// Unsubscribe
unsubscribe()
```

### File Storage

```typescript
// Upload file
const url = await backend.uploadFile('avatars', 'user-123.jpg', file)

// Delete file
await backend.deleteFile('avatars', 'user-123.jpg')

// Get file URL
const url = backend.getFileUrl('avatars', 'user-123.jpg')
```

## Migration

Migrate data between backends:

```typescript
import { BackendMigrator, validateMigration } from '@/lib/backend/migration'

// Validate migration
const { valid, issues } = await validateMigration(sourceConfig, targetConfig)

// Create migrator
const migrator = new BackendMigrator(sourceConfig, targetConfig, {
  batchSize: 100,
  includeUsers: true,
  includeProjects: true,
  onProgress: (progress) => {
    console.log(`Migrated ${progress.processedRecords}/${progress.totalRecords}`)
  }
})

// Run migration
const result = await migrator.migrate()
console.log(`Migration complete: ${result.migratedRecords} records migrated`)
```

## Creating Custom Adapters

Implement the `BackendAdapter` interface:

```typescript
import { BackendAdapter } from '@/lib/backend/types'

export class CustomAdapter implements BackendAdapter {
  // Implement all required methods
  async signUp(email: string, password: string): Promise<User> {
    // Your implementation
  }
  
  // ... other methods
}
```

## Best Practices

1. **Always use the adapter factory**: Don't instantiate adapters directly
2. **Handle errors gracefully**: All methods can throw `BackendError`
3. **Use type inference**: Let TypeScript infer types from schemas
4. **Cache the adapter**: Use `getBackendAdapter()` for singleton instance
5. **Test migrations**: Always test in development before production

## Troubleshooting

### Connection Issues

- Check environment variables are set correctly
- Ensure backend services are running
- Verify API tokens have correct permissions
- Check CORS settings for browser requests

### Type Errors

- Ensure all backend responses match expected types
- Use validation schemas for runtime type checking
- Check for version mismatches between adapters

### Performance

- Use query builder for efficient queries
- Implement pagination for large datasets
- Consider caching frequently accessed data
- Monitor real-time subscription usage