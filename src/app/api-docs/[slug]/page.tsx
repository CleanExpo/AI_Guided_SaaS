'use client';

import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Code, Key, Globe, Download } from 'lucide-react';
import Link from 'next/link';

interface ApiDoc {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  version: string;
}

const apiDocs: Record<string, ApiDoc> = {
  auth: {
    slug: 'auth',
    title: 'Authentication API',
    description: 'Secure authentication and authorization endpoints',
    category: 'Security',
    version: 'v1',
    content: `
# Authentication API

The Authentication API provides secure endpoints for user authentication, authorization, and session management.

## Base URL

\`\`\`
https://api.aiguidedSaaS.com/v1/auth
\`\`\`

## Authentication Methods

### API Key Authentication

Include your API key in the request headers:

\`\`\`http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
\`\`\`

### OAuth 2.0

We support OAuth 2.0 with the following providers:
- Google
- GitHub
- Microsoft
- Custom OIDC providers

## Endpoints

### POST /auth/login

Authenticate a user with email and password.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "developer"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
\`\`\`

### POST /auth/register

Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "organization": "Acme Corp"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "emailVerified": false
    },
    "message": "Verification email sent"
  }
}
\`\`\`

### POST /auth/refresh

Refresh an expired access token.

**Request Body:**
\`\`\`json
{
  "refreshToken": "refresh_token_here"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": 3600
  }
}
\`\`\`

### POST /auth/logout

Invalidate the current session.

**Headers:**
\`\`\`http
Authorization: Bearer jwt_token_here
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Successfully logged out"
}
\`\`\`

### GET /auth/me

Get current user information.

**Headers:**
\`\`\`http
Authorization: Bearer jwt_token_here
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "developer",
      "organization": "Acme Corp",
      "createdAt": "2024-01-15T10:00:00Z",
      "lastLoginAt": "2024-01-15T14:30:00Z"
    }
  }
}
\`\`\`

## Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
\`\`\`

### Common Error Codes

- \`INVALID_CREDENTIALS\` - Invalid login credentials
- \`EMAIL_NOT_VERIFIED\` - Email address not verified
- \`ACCOUNT_LOCKED\` - Account temporarily locked
- \`TOKEN_EXPIRED\` - JWT token has expired
- \`INVALID_TOKEN\` - Invalid or malformed token
- \`RATE_LIMITED\` - Too many requests

## Rate Limiting

Authentication endpoints are rate limited:
- Login: 5 attempts per minute per IP
- Register: 3 attempts per minute per IP
- Refresh: 10 requests per minute per user

## Security Best Practices

1. **Store tokens securely** - Use secure, httpOnly cookies or secure storage
2. **Implement token refresh** - Refresh tokens before they expire
3. **Validate on server** - Always validate tokens on your backend
4. **Use HTTPS** - Never send tokens over unencrypted connections
5. **Implement logout** - Properly invalidate sessions on logout
    `,
  },
  endpoints: {
    slug: 'endpoints',
    title: 'API Endpoints Reference',
    description: 'Complete reference for all available API endpoints',
    category: 'Reference',
    version: 'v1',
    content: `
# API Endpoints Reference

Complete documentation for all AI Guided SaaS API endpoints.

## Base URL

\`\`\`
https://api.aiguidedSaaS.com/v1
\`\`\`

## Projects API

### GET /projects

List all projects for the authenticated user.

**Query Parameters:**
- \`page\` (optional) - Page number (default: 1)
- \`limit\` (optional) - Items per page (default: 20, max: 100)
- \`status\` (optional) - Filter by status: active, archived, draft

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_123",
        "name": "My Awesome App",
        "description": "A revolutionary web application",
        "status": "active",
        "framework": "nextjs",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
\`\`\`

### POST /projects

Create a new project.

**Request Body:**
\`\`\`json
{
  "name": "My New Project",
  "description": "Project description",
  "framework": "nextjs",
  "template": "saas-starter",
  "settings": {
    "typescript": true,
    "tailwindcss": true,
    "database": "postgresql"
  }
}
\`\`\`

### GET /projects/{id}

Get project details by ID.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "project": {
      "id": "proj_123",
      "name": "My Awesome App",
      "description": "A revolutionary web application",
      "status": "active",
      "framework": "nextjs",
      "settings": {},
      "deployments": [],
      "collaborators": [],
      "createdAt": "2024-01-15T10:00:00Z"
    }
  }
}
\`\`\`

### PUT /projects/{id}

Update project settings.

### DELETE /projects/{id}

Delete a project (requires confirmation).

## Components API

### GET /projects/{id}/components

List all components in a project.

### POST /projects/{id}/components

Create a new component.

**Request Body:**
\`\`\`json
{
  "name": "UserCard",
  "type": "react",
  "props": {
    "user": "object",
    "showAvatar": "boolean"
  },
  "code": "component_code_here"
}
\`\`\`

### GET /projects/{id}/components/{componentId}

Get component details and code.

### PUT /projects/{id}/components/{componentId}

Update component code and properties.

## Deployments API

### GET /projects/{id}/deployments

List project deployments.

### POST /projects/{id}/deployments

Create a new deployment.

**Request Body:**
\`\`\`json
{
  "environment": "production",
  "provider": "vercel",
  "settings": {
    "domain": "myapp.com",
    "environmentVariables": {
      "NODE_ENV": "production"
    }
  }
}
\`\`\`

### GET /deployments/{id}

Get deployment status and logs.

### POST /deployments/{id}/rollback

Rollback to a previous deployment.

## Analytics API

### GET /projects/{id}/analytics

Get project analytics data.

**Query Parameters:**
- \`timeRange\` - Time range: 1d, 7d, 30d, 90d
- \`metrics\` - Comma-separated metrics: pageviews, users, sessions

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "metrics": {
      "pageviews": 12847,
      "uniqueUsers": 3421,
      "sessions": 5632
    },
    "timeSeries": [
      {
        "date": "2024-01-15",
        "pageviews": 1247,
        "users": 342
      }
    ]
  }
}
\`\`\`

## Collaboration API

### GET /projects/{id}/collaborators

List project collaborators.

### POST /projects/{id}/collaborators

Invite a new collaborator.

**Request Body:**
\`\`\`json
{
  "email": "collaborator@example.com",
  "role": "developer",
  "permissions": ["read", "write"]
}
\`\`\`

### PUT /projects/{id}/collaborators/{userId}

Update collaborator permissions.

### DELETE /projects/{id}/collaborators/{userId}

Remove a collaborator.

## Templates API

### GET /templates

List available project templates.

### GET /templates/{id}

Get template details and preview.

## AI API

### POST /ai/generate

Generate code using AI.

**Request Body:**
\`\`\`json
{
  "prompt": "Create a user authentication form",
  "context": {
    "framework": "react",
    "styling": "tailwindcss"
  },
  "type": "component"
}
\`\`\`

### POST /ai/optimize

Optimize existing code.

### POST /ai/explain

Get AI explanation of code.

## Webhooks API

### GET /webhooks

List configured webhooks.

### POST /webhooks

Create a new webhook.

**Request Body:**
\`\`\`json
{
  "url": "https://yourapp.com/webhook",
  "events": ["deployment.success", "deployment.failed"],
  "secret": "webhook_secret"
}
\`\`\`

## Response Format

All API responses follow this format:

**Success Response:**
\`\`\`json
{
  "success": true,
  "data": {},
  "meta": {}
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
\`\`\`

## HTTP Status Codes

- \`200\` - Success
- \`201\` - Created
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`403\` - Forbidden
- \`404\` - Not Found
- \`429\` - Rate Limited
- \`500\` - Internal Server Error
    `,
  },
  sdks: {
    slug: 'sdks',
    title: 'SDKs and Libraries',
    description:
      'Official SDKs and client libraries for popular programming languages',
    category: 'SDKs',
    version: 'v1',
    content: `
# SDKs and Libraries

Official SDKs and client libraries to integrate AI Guided SaaS into your applications.

## JavaScript/TypeScript SDK

### Installation

\`\`\`bash
npm install @aiguidedSaaS/sdk
# or
yarn add @aiguidedSaaS/sdk
\`\`\`

### Quick Start

\`\`\`typescript
import { AiGuidedSaaS } from '@aiguidedSaaS/sdk'

const client = new AiGuidedSaaS({
  apiKey: 'your_api_key_here',
  environment: 'production' // or 'development'
})

// Create a new project
const project = await client.projects.create({
  name: 'My New Project',
  framework: 'nextjs'
})

// Generate a component
const component = await client.ai.generateComponent({
  prompt: 'Create a user profile card',
  framework: 'react'
})
\`\`\`

### Configuration

\`\`\`typescript
const client = new AiGuidedSaaS({
  apiKey: process.env.AIGUIDEDAAS_API_KEY,
  baseUrl: 'https://api.aiguidedSaaS.com/v1',
  timeout: 30000,
  retries: 3,
  onError: (error) => {
    console.error('API Error:', error)
  }
})
\`\`\`

### Projects

\`\`\`typescript
// List projects
const projects = await client.projects.list({
  page: 1,
  limit: 20,
  status: 'active'
})

// Get project details
const project = await client.projects.get('proj_123')

// Update project
const updatedProject = await client.projects.update('proj_123', {
  name: 'Updated Project Name'
})

// Delete project
await client.projects.delete('proj_123')
\`\`\`

### Components

\`\`\`typescript
// List components
const components = await client.components.list('proj_123')

// Create component
const component = await client.components.create('proj_123', {
  name: 'UserCard',
  type: 'react',
  code: 'component_code_here'
})

// Update component
await client.components.update('proj_123', 'comp_456', {
  code: 'updated_code_here'
})
\`\`\`

### AI Features

\`\`\`typescript
// Generate code
const result = await client.ai.generate({
  prompt: 'Create a login form with validation',
  context: {
    framework: 'react',
    styling: 'tailwindcss'
  }
})

// Optimize code
const optimized = await client.ai.optimize({
  code: 'existing_code_here',
  goals: ['performance', 'accessibility']
})

// Explain code
const explanation = await client.ai.explain({
  code: 'complex_code_here'
})
\`\`\`

## Python SDK

### Installation

\`\`\`bash
pip install aiguidedSaaS-sdk
\`\`\`

### Quick Start

\`\`\`python
from aiguidedSaaS import AiGuidedSaaS

client = AiGuidedSaaS(
    api_key="your_api_key_here",
    environment="production"
)

# Create a project
project = client.projects.create(
    name="My Python Project",
    framework="fastapi"
)

# Generate code
component = client.ai.generate_component(
    prompt="Create a user authentication endpoint",
    framework="fastapi"
)
\`\`\`

### Configuration

\`\`\`python
import os
from aiguidedSaaS import AiGuidedSaaS

client = AiGuidedSaaS(
    api_key=os.getenv("AIGUIDEDAAS_API_KEY"),
    base_url="https://api.aiguidedSaaS.com/v1",
    timeout=30,
    max_retries=3
)
\`\`\`

### Error Handling

\`\`\`python
from aiguidedSaaS.exceptions import (
    AiGuidedSaaSError,
    AuthenticationError,
    RateLimitError
)

try:
    project = client.projects.get("proj_123")
except AuthenticationError:
    print("Invalid API key")
except RateLimitError:
    print("Rate limit exceeded")
except AiGuidedSaaSError as e:
    print(f"API Error: {e.message}")
\`\`\`

## Go SDK

### Installation

\`\`\`bash
go get github.com/aiguidedSaaS/go-sdk
\`\`\`

### Quick Start

\`\`\`go
package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/aiguidedSaaS/go-sdk"
)

func main() {
    client := aiguidedSaaS.NewClient("your_api_key_here")
    
    // Create project
    project, err := client.Projects.Create(context.Background(), &aiguidedSaaS.CreateProjectRequest{
        Name:      "My Go Project",
        Framework: "gin",
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Created project: %s\\n", project.ID)
}
\`\`\`

## PHP SDK

### Installation

\`\`\`bash
composer require aiguidedSaaS/php-sdk
\`\`\`

### Quick Start

\`\`\`php
<?php
require_once 'vendor/autoload.php';

use AiGuidedSaaS\\Client;

$client = new Client([
    'api_key' => 'your_api_key_here',
    'environment' => 'production'
]);

// Create project
$project = $client->projects()->create([
    'name' => 'My PHP Project',
    'framework' => 'laravel'
]);

echo "Created project: " . $project['id'];
?>
\`\`\`

## Ruby SDK

### Installation

\`\`\`bash
gem install aiguidedSaaS-sdk
\`\`\`

### Quick Start

\`\`\`ruby
require 'aiguidedSaaS'

client = AiGuidedSaaS::Client.new(
  api_key: 'your_api_key_here',
  environment: 'production'
)

# Create project
project = client.projects.create(
  name: 'My Ruby Project',
  framework: 'rails'
)

puts "Created project: #{project.id}"
\`\`\`

## CLI Tool

### Installation

\`\`\`bash
npm install -g @aiguidedSaaS/cli
\`\`\`

### Authentication

\`\`\`bash
aiguidedSaaS auth login
\`\`\`

### Project Management

\`\`\`bash
# Create project
aiguidedSaaS projects create "My Project" --framework nextjs

# List projects
aiguidedSaaS projects list

# Deploy project
aiguidedSaaS deploy --environment production
\`\`\`

## Webhook Verification

### Node.js

\`\`\`javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
\`\`\`

### Python

\`\`\`python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)
\`\`\`

## Rate Limiting

All SDKs implement automatic rate limiting and retry logic:

- **Rate Limits**: 1000 requests per hour per API key
- **Burst Limits**: 100 requests per minute
- **Retry Strategy**: Exponential backoff with jitter

## Error Handling

All SDKs provide consistent error handling:

\`\`\`typescript
try {
  const result = await client.projects.create(data)
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth error
  } else if (error instanceof RateLimitError) {
    // Handle rate limit
  } else {
    // Handle other errors
  }
}
\`\`\`

## Support

- **Documentation**: [https://docs.aiguidedSaaS.com](https://docs.aiguidedSaaS.com)
- **GitHub Issues**: Report SDK issues on our GitHub repositories
- **Community**: Join our [Discord community](https://discord.gg/aiguidedSaaS)
- **Email**: sdk-support@aiguidedSaaS.com
    `,
  },
};

export default function ApiDocPage() {
  const params = useParams();
  const slug = params.slug as string;
  const doc = apiDocs[slug];

  if (!doc) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            API Documentation Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The API documentation you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/api-docs">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to API Docs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/api-docs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to API Docs
          </Button>
        </Link>
      </div>

      {/* Document Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{doc.category}</Badge>
          <Badge variant="outline">v{doc.version}</Badge>
        </div>
        <h1 className="text-4xl font-bold">{doc.title}</h1>
        <p className="text-xl text-muted-foreground">{doc.description}</p>
      </div>

      {/* Document Content */}
      <Card>
        <CardContent className="prose prose-lg max-w-none pt-6">
          <div
            className="space-y-6"
            dangerouslySetInnerHTML={{
              __html: doc.content
                .replace(/\n/g, '<br />')
                .replace(/#{1,6}\s/g, match => {
                  const level = match.trim().length;
                  return `<h${level} class="text-${4 - level}xl font-bold mt-8 mb-4">`;
                })
                .replace(
                  /\[([^\]]+)\]\(([^)]+)\)/g,
                  '<a href="$2" class="text-primary hover:underline">$1</a>'
                )
                .replace(
                  /```(\w+)?\n([\s\S]*?)```/g,
                  '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>'
                )
                .replace(
                  /`([^`]+)`/g,
                  '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
                ),
            }}
          />
        </CardContent>
      </Card>

      {/* Related Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Related API Documentation</CardTitle>
          <CardDescription>Explore more API documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(apiDocs)
              .filter(d => d.slug !== doc.slug)
              .slice(0, 2)
              .map(relatedDoc => (
                <Link
                  key={relatedDoc.slug}
                  href={`/api-docs/${relatedDoc.slug}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        <Badge variant="outline">{relatedDoc.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {relatedDoc.title}
                      </CardTitle>
                      <CardDescription>
                        {relatedDoc.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle>Developer Tools</CardTitle>
          <CardDescription>
            Tools to help you integrate with our API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Key className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">API Keys</div>
                <div className="text-sm text-muted-foreground">
                  Manage your API keys
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">API Explorer</div>
                <div className="text-sm text-muted-foreground">
                  Test API endpoints
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Download className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Postman Collection</div>
                <div className="text-sm text-muted-foreground">
                  Import our collection
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Get support for API integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Link href="/tutorials">
              <Button>View Tutorials</Button>
            </Link>
            <Link href="/community">
              <Button variant="outline">Join Community</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
