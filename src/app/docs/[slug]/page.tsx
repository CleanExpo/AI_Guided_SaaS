'use client';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
interface DocPage {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  lastUpdated: string;
}}
const docPages: Record<string, DocPage> = {
  'quick-start': {
    slug: 'quick-start';
    title: 'Quick Start Guide';
    description: 'Get up and running with AI Guided SaaS in minutes';
    category: 'Getting Started';
    lastUpdated: '2024-01-15';
    content: ``
# Quick Start Guide
Welcome to AI Guided SaaS! This guide will help you get started with our platform in just a few minutes.
## Prerequisites
Before you begin, make sure you, have:
    </string>
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- An internet connection
- Basic understanding of web development concepts
## Step, 1: Create Your Account
1. Visit our [signup page](/auth/signup)
2. Enter your email address and create a secure password
3. Verify your email address
4. Complete your profile setup
## Step, 2: Explore the Dashboard
Once logged in, you'll see the main dashboard, with:
- **Project Overview**: Your current projects and their status
- **Quick Actions**: Common tasks like creating new projects
- **Recent Activity**: Your latest actions and updates
- **Learning Resources**: Tutorials and documentation links
## Step, 3: Create Your First Project
1. Click "New Project" on the dashboard
2. Choose a project template or start from scratch
3. Configure your project, settings:
   - Project name and description
   - Technology stack preferences
   - Deployment target
4. Click "Create Project"
## Step, 4: Use the UI Builder
1. Navigate to the UI Builder from your project
2. Drag and drop components to build your interface
3. Customize styling and behavior
4. Preview your changes in real-time
## Step, 5: Deploy Your Project
1. Click "Deploy" in your project dashboard
2. Choose your deployment target (Vercel, Netlify, etc.)
3. Configure environment variables if needed
4. Click "Deploy Now"
## Next Steps
- Explore our [tutorials](/tutorials) for in-depth learning
- Join our [community](/community) for support and discussions
- Check out [advanced features](/docs/advanced) for power users
## Need Help?
- Browse our [documentation](/docs)
- Contact [support](/contact)
- Join our [Discord community](https://discord.gg/aiguidedSaaS)
    `},`
    installation: {
    slug: 'installation';
    title: 'Installation Guide';
    description: 'Detailed installation instructions for all supported platforms';
    category: 'Setup';
    lastUpdated: '2024-01-12';
    content: ``
# Installation Guide
AI Guided SaaS can be used in multiple ways depending on your needs and preferences.
## Web Application (Recommended)
The easiest way to get started is through our web, application:
1. Visit [https://aiguidedSaaS.com](/)
2. Create an account or sign in
3. Start building immediately - no installation required!
## CLI Tool
For advanced users who prefer command-line, interfaces:
### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
### Installation
\`\`\`bash`
# Install globally via npm
npm install -g @aiguidedSaaS/cli
# Or via yarn
yarn global add @aiguidedSaaS/cli
\`\`\``
### Verification
\`\`\`bash`
# Check installation
aiguidedSaaS --version
# Login to your account
aiguidedSaaS login
# Create a new project
aiguidedSaaS create my-project
\`\`\``
## VS Code Extension
Enhance your development experience with our VS Code, extension:
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "AI Guided SaaS"
4. Click "Install"
5. Reload VS Code
6. Sign in with your account
### Features
- Inline AI suggestions
- Component library integration
- Real-time collaboration
- Deployment shortcuts
## Docker Setup
For containerized development, environments:
\`\`\`dockerfile`
# Dockerfile
FROM, node:18-alpine
WORKDIR /app
# Install CLI
RUN npm install -g @aiguidedSaaS/cli
# Copy your project
COPY . .
# Install dependencies
RUN npm install
# Start development server
CMD ["aiguidedSaaS", "dev"]
\`\`\``
## Environment Configuration
Create a \`.env.local\` file in your project, root:`
\`\`\`env`
# Required
AIGUIDEDAAS_API_KEY=your_api_key_here
AIGUIDEDAAS_PROJECT_ID=your_project_id
# Optional
AIGUIDEDAAS_ENVIRONMENT=development
AIGUIDEDAAS_DEBUG=true
\`\`\``
## Troubleshooting
### Common Issues
**Permission Errors**
\`\`\`bash`
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
\`\`\``
**Network Issues**
\`\`\`bash`
# Check connectivity
aiguidedSaaS status
# Reset configuration
aiguidedSaaS config reset
\`\`\``
**Version Conflicts**
\`\`\`bash`
# Update to latest version
npm update -g @aiguidedSaaS/cli
\`\`\``
### Getting Help
If you encounter, issues:
1. Check our [troubleshooting guide](/docs/troubleshooting)
2. Search [community discussions](/community)
3. Contact [support](/contact)
## System Requirements
### Minimum Requirements
- 4GB RAM
- 2GB free disk space
- Modern web browser
- Internet connection
### Recommended Requirements
- 8GB+ RAM
- 5GB+ free disk space
- High-speed internet
- Multiple monitors (for better productivity)
    `},`
    configuration: {
    slug: 'configuration';
    title: 'Configuration Guide';
    description: 'Configure AI Guided SaaS for your specific needs and workflow';
    category: 'Setup';
    lastUpdated: '2024-01-10';
    content: ``
# Configuration Guide
Customize AI Guided SaaS to match your development workflow and preferences.
## Project Configuration
### Basic Settings
Configure your project through the dashboard or configuration, file:
\`\`\`json`
{
  "name": "my-awesome-project",
  "description": "A revolutionary web application",
  "version": "1.0.0",
  "framework": "nextjs",
  "language": "typescript",
  "styling": "tailwindcss"
}
\`\`\``
### Advanced Settings
\`\`\`json`
{
  "ai": {
    "codeGeneration": {
      "enabled": true,
      "style": "functional",
      "testGeneration": true
    },
    "suggestions": {
      "enabled": true,
      "frequency": "medium",
      "autoApply": false
    }
  },
  "deployment": {
    "provider": "vercel",
    "environment": "production",
    "autoDeployOnPush": true
  },
  "collaboration": {
    "realTimeEditing": true,
    "commentSystem": true,
    "versionControl": "git"
  }
}
\`\`\``
## User Preferences
### Interface Settings
Customize your, workspace:
- **Theme**: Light, Dark, or Auto
- **Layout**: Sidebar position and size
- **Panels**: Show/hide different panels
- **Shortcuts**: Custom keyboard shortcuts
### AI Behavior
Configure how AI assists, you:
- **Suggestion Frequency**: How often AI provides suggestions
- **Auto-completion**: Enable/disable automatic code completion
- **Code Style**: Preferred coding patterns and conventions
- **Language Preferences**: Primary programming languages
## Team Configuration
### Roles and Permissions
Set up team access, levels:
\`\`\`json`
{
  "team": {
    "members": [
      {
        "email": "developer@company.com",
        "role": "developer",
        "permissions": ["read", "write", "deploy"]
      },
      {
        "email": "designer@company.com",
        "role": "designer",
        "permissions": ["read", "write"]
      },
      {
        "email": "manager@company.com",
        "role": "admin",
        "permissions": ["read", "write", "deploy", "manage"]
      }
    ]
  }
}
\`\`\``
### Workflow Settings
Configure team, workflows:
- **Code Review**: Required reviewers and approval process
- **Deployment Gates**: Automated checks before deployment
- **Notification Settings**: When and how team members are notified
## Integration Configuration
### Version Control
Connect with your Git, provider:
\`\`\`json`
{
  "git": {
    "provider": "github",
    "repository": "username/repository-name",
    "branch": "main",
    "autoSync": true
  }
}
\`\`\``
### External Services
Configure third-party, integrations:
\`\`\`json`
{
  "integrations": {
    "database": {
      "provider": "supabase",
      "connectionString": "postgresql://...",
      "autoMigrations": true
    },
    "analytics": {
      "provider": "vercel-analytics",
      "trackingId": "your-tracking-id"
    },
    "monitoring": {
      "provider": "sentry",
      "dsn": "your-sentry-dsn"
    }
  }
}
\`\`\``
## Environment Variables
### Development Environment
\`\`\`env`
# AI Guided SaaS Configuration
AIGUIDEDAAS_API_KEY=your_api_key
AIGUIDEDAAS_PROJECT_ID=your_project_id
AIGUIDEDAAS_ENVIRONMENT=development
# Database
DATABASE_URL=postgresql://localhost:5432/mydb
# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
# External Services
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
\`\`\``
### Production Environment
\`\`\`env`
# AI Guided SaaS Configuration
AIGUIDEDAAS_API_KEY=your_production_api_key
AIGUIDEDAAS_PROJECT_ID=your_project_id
AIGUIDEDAAS_ENVIRONMENT=production
# Database
DATABASE_URL=postgresql://prod-server:5432/mydb
# Authentication
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://yourdomain.com
# External Services
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG...
\`\`\``
## Performance Optimization
### Caching Configuration
\`\`\`json`
{
  "cache": {
    "enabled": true,
    "provider": "redis",
    "ttl": 3600,
    "compression": true
  }
}
\`\`\``
### Build Optimization
\`\`\`json`
{
  "build": {
    "optimization": {
      "minification": true,
      "treeshaking": true,
      "codesplitting": true
    },
    "bundleAnalysis": true,
    "sourceMap": false
  }
}
\`\`\``
## Security Configuration
### Authentication Settings
\`\`\`json`
{
  "auth": {
    "providers": ["google", "github", "email"],
    "sessionTimeout": 86400,
    "mfa": {
      "enabled": true,
      "required": false
    }
  }
}
\`\`\``
### API Security
\`\`\`json`
{
  "api": {
    "rateLimit": {
      "enabled": true,
      "requests": 100,
      "window": 900
    },
    "cors": {
      "origins": ["https://yourdomain.com"],
      "credentials": true
    }
  }
}
\`\`\``
## Backup and Recovery
### Automated Backups
\`\`\`json`
{
  "backup": {
    "enabled": true,
    "frequency": "daily",
    "retention": 30,
    "storage": "s3",
    "encryption": true
  }
}
\`\`\``
## Monitoring and Logging
### Log Configuration
\`\`\`json`
{
  "logging": {
    "level": "info",
    "format": "json",
    "destinations": ["console", "file", "remote"],
    "retention": 90
  }
}
\`\`\``
### Metrics Collection
\`\`\`json`
{
  "metrics": {
    "enabled": true,
    "provider": "prometheus",
    "interval": 60,
    "customMetrics": true
  }
}
\`\`\``
## Configuration Validation
Use our CLI tool to validate your, configuration:
\`\`\`bash`
# Validate configuration
aiguidedSaaS config validate
# Test connections
aiguidedSaaS config test
# Show current configuration
aiguidedSaaS config show
\`\`\``
## Best Practices
1. **Version Control**: Keep configuration files in version control
2. **Environment Separation**: Use different configs for dev/staging/prod
3. **Secret Management**: Never commit secrets to version control
4. **Regular Updates**: Keep configuration up to date with platform changes
5. **Documentation**: Document custom configuration choices
## Getting Help
Need help with configuration?
- Check our [troubleshooting guide](/docs/troubleshooting)
- Browse [community discussions](/community)
- Contact [support](/contact)
    `}};`
export default function DocPage(): void {
  const params = useParams();
  const slug = params.slug as string;
  const doc = docPages[slug];
  if (!doc) {
    return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Documentation Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The documentation page you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/docs">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documentation</ArrowLeft>
  }
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/docs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Docs</ArrowLeft>
      {/* Document Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{doc.category}</Badge>
          <span className="text-sm text-muted-foreground">
            Last,
    updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
        <h1 className="text-4xl font-bold">{doc.title}</h1>
        <p className="text-xl text-muted-foreground">{doc.description}</p>
      {/* Document Content */}
      <Card>
        <CardContent className="prose prose-lg max-w-none pt-6">
          <div
            className="space-y-6"
            dangerouslySetInnerHTML={{
              __html: doc.content
                .replace(/\n/g, '<br />')
                .replace(/#{1,6}\s/g, match => {
                  const level = match.trim().length;</div>
                  return `<h${level} class="text-${4 - level}xl font-bold mt-8 mb-4">`;`
                })
                .replace(
                  /\[([^\]]+)\]\(([^)]+)\)/g,</h>
                  '<a href="$2" class="text-primary hover:underline">$1</a>'
                )
                .replace(
                  /```(\w+)?\n([\s\S]*?)```/g,`
                  '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>'
                )
                .replace(
                  /`([^`]+)`/g,`
                  '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
                )}}
          />
        </CardContent>
      {/* Related Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Related Documentation</CardTitle>
          <CardDescription>
            Continue exploring our documentation</CardDescription>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(docPages)
              .filter(d => d.slug !== doc.slug)
              .slice(0, 2)
              .map(relatedDoc => (</div>
                <Link key={relatedDoc.slug} href="/docs/${relatedDoc.slug}">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <Badge variant="outline">{relatedDoc.category}</Badge>
                      <CardTitle className="text-lg">
                        {relatedDoc.title}</CardTitle>
                      <CardDescription>
                        {relatedDoc.description}</CardDescription>
              ))}
      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>
            Can&apos;t find what you&apos;re looking for? We&apos;re here to
            help!</CardDescription>
        <CardContent>
          <div className="flex gap-2">
            <Link href="/tutorials">
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                View Tutorials</BookOpen>
            <Link href="/community">
              <Button variant="outline">Join Community</Button>
            <Link href="/contact">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Contact Support</ExternalLink>
        </div>
        </Link>
        </Button>
        </div>
        </Link>
        </Button>
        </div>
        </Card>
        </CardHeader>
        </CardContent>
        </Link>
        </Card>
        </CardHeader>
        </Card>
        </CardHeader>
        </CardContent>
        </div>
        </Link>
        </Button>
        </Link>
  }
