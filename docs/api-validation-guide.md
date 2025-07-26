# API Validation Guide

This guide explains how to add proper input validation to all API routes in the AI Guided SaaS application.

## Overview

We use [Zod](https://zod.dev/) for schema validation and have created comprehensive validation middleware and schemas for all API endpoints.

## Key Files

1. **`/src/lib/api/validation-middleware.ts`** - Core validation middleware functions
2. **`/src/lib/api/validation-schemas.ts`** - Pre-defined validation schemas for all routes
3. **`/src/lib/api/rate-limiter.ts`** - Rate limiting middleware (already applied via middleware.ts)

## Adding Validation to API Routes

### Basic Example

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateInput } from '@/lib/api/validation-middleware';
import { authSchemas } from '@/lib/api/validation-schemas';

export async function POST(request: NextRequest) {
  return validateInput(authSchemas.login)(request, async (data) => {
    // data is now fully validated and typed
    const { email, password } = data;
    
    // Your logic here
    return NextResponse.json({ success: true });
  });
}
```

### Validating Query Parameters

```typescript
import { commonSchemas } from '@/lib/api/validation-schemas';

export async function GET(request: NextRequest) {
  return validateInput(commonSchemas.pagination, 'query')(request, async (data) => {
    const { page, limit, sortBy, sortOrder } = data;
    // Pagination parameters are validated
  });
}
```

### Custom Validation

```typescript
import { z } from 'zod';

const customSchema = z.object({
  customField: z.string().regex(/^[A-Z]{3}-\d{4}$/, 'Invalid format'),
  amount: z.number().positive().max(10000),
});

export async function POST(request: NextRequest) {
  return validateInput(customSchema)(request, async (data) => {
    // Custom validation applied
  });
}
```

## Available Pre-defined Schemas

### Authentication
- `authSchemas.register` - User registration
- `authSchemas.login` - User login
- `authSchemas.resetPassword` - Password reset
- `authSchemas.updatePassword` - Password update

### Projects
- `projectSchemas.create` - Create new project
- `projectSchemas.update` - Update project
- `projectSchemas.query` - Query projects with pagination

### AI/Agent Operations
- `aiSchemas.chat` - Agent chat messages
- `aiSchemas.generateCode` - Code generation requests
- `aiSchemas.validateChat` - Validated chat requests

### Analytics
- `analyticsSchemas.trackEvent` - Track analytics events
- `analyticsSchemas.query` - Query analytics data

### File Operations
- `fileSchemas.upload` - File upload validation
- `fileSchemas.visualAnalyze` - Visual analysis requests

### Admin
- `adminSchemas.login` - Admin authentication
- `adminSchemas.userUpdate` - Update user details
- `adminSchemas.analytics` - Admin analytics queries

### Marketplace
- `marketplaceSchemas.template` - Template creation/update
- `marketplaceSchemas.search` - Search marketplace

### Collaboration
- `collaborationSchemas.createRoom` - Create collaboration room
- `collaborationSchemas.joinRoom` - Join room
- `collaborationSchemas.message` - Send message

## Sanitization Functions

The validation middleware includes sanitization utilities:

```typescript
import { sanitize } from '@/lib/api/validation-middleware';

// Remove HTML and script tags
const clean = sanitize.string(userInput);

// Prevent SQL injection
const safeSql = sanitize.sql(queryInput);

// Safe filenames
const safeFilename = sanitize.filename(uploadedFile.name);

// Prevent XSS
const safeHtml = sanitize.xss(htmlContent);
```

## Error Handling

Validation errors are automatically formatted and returned as:

```json
{
  "error": "Validation Error",
  "message": "Validation failed",
  "errors": {
    "fieldName": ["Error message 1", "Error message 2"],
    "_errors": ["General errors"]
  }
}
```

## Best Practices

1. **Always validate input** - Never trust client data
2. **Use pre-defined schemas** - Maintain consistency across the API
3. **Sanitize user input** - Especially for filenames, SQL queries, and HTML
4. **Log validation errors** - For monitoring and debugging
5. **Return helpful error messages** - But don't expose internal details
6. **Set appropriate limits** - String lengths, file sizes, array lengths
7. **Validate types strictly** - Use Zod's type coercion carefully

## Migration Checklist

To ensure all API routes have proper validation:

1. [ ] `/api/admin/*` - Admin routes
2. [ ] `/api/agent-chat` - ✅ Updated
3. [ ] `/api/analytics` - Analytics routes
4. [ ] `/api/auth/*` - Authentication routes
5. [ ] `/api/collaboration/*` - Collaboration routes
6. [ ] `/api/config` - Configuration routes
7. [ ] `/api/email/*` - Email routes
8. [ ] `/api/marketplace/*` - Marketplace routes
9. [ ] `/api/monitoring/*` - Monitoring routes
10. [ ] `/api/projects/*` - Project routes
11. [ ] `/api/support/*` - Support routes
12. [ ] `/api/templates` - Template routes
13. [ ] `/api/visual/*` - ✅ Updated (upload route)
14. [ ] `/api/webhooks/*` - Webhook routes

## Security Considerations

1. **Rate Limiting** - Already implemented via middleware
2. **Authentication** - Verify user session before processing
3. **Authorization** - Check user permissions for resources
4. **CORS** - Configure appropriate CORS headers
5. **Content Security Policy** - Set CSP headers for API responses
6. **Input Size Limits** - Enforce maximum payload sizes
7. **Timeout Protection** - Set appropriate request timeouts

## Testing Validation

Example test for validated endpoint:

```typescript
import { POST } from '@/app/api/auth/login/route';

describe('Login API', () => {
  it('should reject invalid email', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid', password: '12345678' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation Error');
  });
});
```