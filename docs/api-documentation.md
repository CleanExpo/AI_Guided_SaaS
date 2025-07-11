# API Documentation - AI Guided SaaS Platform

## Overview

The AI Guided SaaS Platform provides a comprehensive REST API that allows developers to programmatically interact with the platform's features. This documentation covers all available endpoints, authentication methods, and usage examples.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL & Versioning](#base-url--versioning)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Projects API](#projects-api)
6. [Components API](#components-api)
7. [Templates API](#templates-api)
8. [Analytics API](#analytics-api)
9. [Admin API](#admin-api)
10. [Webhooks](#webhooks)
11. [SDKs & Libraries](#sdks--libraries)

## Authentication

### API Keys

All API requests require authentication using API keys. Include your API key in the request headers:

```http
Authorization: Bearer YOUR_API_KEY
```

### Getting an API Key

1. Log into your dashboard
2. Navigate to Settings > API Keys
3. Click "Generate New Key"
4. Copy and securely store your key

### Authentication Types

- **User API Keys**: Access user-specific resources
- **Project API Keys**: Scoped to specific projects
- **Admin API Keys**: Full platform access (admin only)

## Base URL & Versioning

```
Base URL: https://api.ai-guided-saas.com
Current Version: v1
Full URL: https://api.ai-guided-saas.com/v1
```

### Version Headers

```http
Accept: application/vnd.ai-guided-saas.v1+json
Content-Type: application/json
```

## Rate Limiting

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1,000 requests/hour
- **Enterprise**: 10,000 requests/hour

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project configuration",
    "details": {
      "field": "name",
      "issue": "Project name is required"
    },
    "timestamp": "2025-01-11T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Projects API

### List Projects

```http
GET /v1/projects
```

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (`active`, `archived`, `draft`)
- `template` (optional): Filter by template ID

**Response:**
```json
{
  "data": [
    {
      "id": "proj_123456789",
      "name": "My SaaS App",
      "description": "A revolutionary SaaS application",
      "status": "active",
      "template_id": "template_nextjs_saas",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-10T15:30:00Z",
      "owner": {
        "id": "user_123",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "settings": {
        "framework": "Next.js",
        "database": "PostgreSQL",
        "deployment": "Vercel"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Create Project

```http
POST /v1/projects
```

**Request Body:**
```json
{
  "name": "My New Project",
  "description": "Project description",
  "template_id": "template_nextjs_saas",
  "settings": {
    "framework": "Next.js",
    "database": "PostgreSQL",
    "ai_assistance": true
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "proj_987654321",
    "name": "My New Project",
    "status": "initializing",
    "created_at": "2025-01-11T10:30:00Z"
  }
}
```

### Get Project

```http
GET /v1/projects/{project_id}
```

### Update Project

```http
PUT /v1/projects/{project_id}
```

### Delete Project

```http
DELETE /v1/projects/{project_id}
```

### Deploy Project

```http
POST /v1/projects/{project_id}/deploy
```

**Request Body:**
```json
{
  "environment": "production",
  "build_command": "npm run build",
  "env_vars": {
    "NODE_ENV": "production",
    "DATABASE_URL": "postgresql://..."
  }
}
```

## Components API

### List Components

```http
GET /v1/projects/{project_id}/components
```

### Create Component

```http
POST /v1/projects/{project_id}/components
```

**Request Body:**
```json
{
  "name": "UserProfile",
  "type": "react_component",
  "description": "User profile display component",
  "props": [
    {
      "name": "user",
      "type": "object",
      "required": true
    },
    {
      "name": "showEmail",
      "type": "boolean",
      "default": false
    }
  ]
}
```

### Generate Component with AI

```http
POST /v1/projects/{project_id}/components/generate
```

**Request Body:**
```json
{
  "prompt": "Create a responsive user dashboard with charts and metrics",
  "framework": "react",
  "styling": "tailwind",
  "complexity": "medium"
}
```

### Update Component

```http
PUT /v1/projects/{project_id}/components/{component_id}
```

### Delete Component

```http
DELETE /v1/projects/{project_id}/components/{component_id}
```

## Templates API

### List Templates

```http
GET /v1/templates
```

**Parameters:**
- `category` (optional): Filter by category
- `framework` (optional): Filter by framework
- `featured` (optional): Show only featured templates

**Response:**
```json
{
  "data": [
    {
      "id": "template_nextjs_saas",
      "name": "Next.js SaaS Starter",
      "description": "Complete SaaS application template",
      "category": "saas",
      "framework": "Next.js",
      "features": [
        "Authentication",
        "Payments",
        "Dashboard",
        "API Routes"
      ],
      "preview_url": "https://demo.example.com",
      "downloads": 1250,
      "rating": 4.8,
      "created_at": "2024-12-01T00:00:00Z"
    }
  ]
}
```

### Get Template

```http
GET /v1/templates/{template_id}
```

### Create Custom Template

```http
POST /v1/templates
```

## Analytics API

### Project Analytics

```http
GET /v1/projects/{project_id}/analytics
```

**Parameters:**
- `period` (optional): Time period (`7d`, `30d`, `90d`, `1y`)
- `metrics` (optional): Comma-separated metrics to include

**Response:**
```json
{
  "data": {
    "period": "30d",
    "metrics": {
      "deployments": {
        "total": 15,
        "successful": 14,
        "failed": 1
      },
      "ai_requests": {
        "total": 342,
        "code_generation": 156,
        "debugging": 98,
        "documentation": 88
      },
      "performance": {
        "build_time_avg": 45.2,
        "deployment_time_avg": 12.8
      }
    },
    "timeline": [
      {
        "date": "2025-01-01",
        "deployments": 2,
        "ai_requests": 15
      }
    ]
  }
}
```

### Platform Analytics (Admin)

```http
GET /v1/admin/analytics
```

## Admin API

### List Users

```http
GET /v1/admin/users
```

### Get User

```http
GET /v1/admin/users/{user_id}
```

### Update User

```http
PUT /v1/admin/users/{user_id}
```

### System Health

```http
GET /v1/admin/health
```

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "ai_service": "healthy",
    "deployment_service": "healthy",
    "storage": "healthy"
  },
  "metrics": {
    "uptime": "99.9%",
    "response_time": "120ms",
    "active_users": 1250
  }
}
```

## Webhooks

### Configure Webhooks

```http
POST /v1/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/ai-guided-saas",
  "events": [
    "project.created",
    "project.deployed",
    "component.generated"
  ],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

- `project.created` - New project created
- `project.updated` - Project updated
- `project.deployed` - Project deployed
- `project.deleted` - Project deleted
- `component.generated` - AI component generated
- `user.registered` - New user registered

### Webhook Payload Example

```json
{
  "event": "project.deployed",
  "timestamp": "2025-01-11T10:30:00Z",
  "data": {
    "project_id": "proj_123456789",
    "deployment_id": "deploy_987654321",
    "environment": "production",
    "status": "success",
    "url": "https://my-app.vercel.app"
  }
}
```

## SDKs & Libraries

### JavaScript/TypeScript SDK

```bash
npm install @ai-guided-saas/sdk
```

```javascript
import { AIGuidedSaasClient } from '@ai-guided-saas/sdk';

const client = new AIGuidedSaasClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.ai-guided-saas.com/v1'
});

// Create a project
const project = await client.projects.create({
  name: 'My App',
  template_id: 'template_nextjs_saas'
});

// Generate a component
const component = await client.components.generate(project.id, {
  prompt: 'Create a user dashboard',
  framework: 'react'
});
```

### Python SDK

```bash
pip install ai-guided-saas
```

```python
from ai_guided_saas import Client

client = Client(api_key='your_api_key')

# List projects
projects = client.projects.list()

# Create component
component = client.components.create(
    project_id='proj_123',
    name='UserDashboard',
    type='react_component'
)
```

### cURL Examples

#### Create Project
```bash
curl -X POST https://api.ai-guided-saas.com/v1/projects \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "template_id": "template_nextjs_saas"
  }'
```

#### Generate Component
```bash
curl -X POST https://api.ai-guided-saas.com/v1/projects/proj_123/components/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a responsive navigation bar",
    "framework": "react"
  }'
```

## Best Practices

### API Usage

1. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
2. **Handle rate limits** gracefully with exponential backoff
3. **Validate responses** and handle errors appropriately
4. **Use pagination** for large datasets
5. **Cache responses** when appropriate

### Security

1. **Keep API keys secure** - never expose in client-side code
2. **Use HTTPS** for all API requests
3. **Implement webhook signature verification**
4. **Rotate API keys** regularly
5. **Use least privilege** principle for API key scopes

### Performance

1. **Batch requests** when possible
2. **Use appropriate page sizes** for pagination
3. **Implement caching** for frequently accessed data
4. **Monitor API usage** and optimize accordingly

## Support

### Getting Help

- **Documentation**: This guide and inline API docs
- **Support Email**: api-support@ai-guided-saas.com
- **Community Forum**: https://community.ai-guided-saas.com
- **Status Page**: https://status.ai-guided-saas.com

### Reporting Issues

When reporting API issues, please include:
- Request ID (from error response)
- Timestamp of the request
- Full request details (excluding sensitive data)
- Expected vs actual behavior

---

*Last updated: January 2025*
*API Version: v1.0.0*
