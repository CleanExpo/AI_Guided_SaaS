import { ProjectData, ProjectFeatures, ProjectStructure } from './types';

export class ProjectGenerator {
  static generateProjectStructure(data: ProjectData, features: ProjectFeatures): ProjectStructure {
    const structure: ProjectStructure = {
      name: data.name,
      type: 'directory',
      path: '/',
      children: []
    };

    // Common files
    structure.children!.push(
      {
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        content: `# ${data.name}\n\n${data.description}`
      },
      {
        name: '.gitignore',
        type: 'file',
        path: '/.gitignore',
        content: this.generateGitignore(data.type)
      }
    );

    // Package.json for JS projects
    if (['web', 'mobile', 'api'].includes(data.type)) {
      structure.children!.push({
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        content: JSON.stringify({
          name: data.name.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          description: data.description,
          scripts: {
            dev: data.settings.startCommand || 'npm run dev',
            build: data.settings.buildCommand || 'npm run build',
            test: data.settings.testCommand || 'npm test'
          },
          dependencies: data.settings.dependencies || {}
        }, null, 2)
      });
    }

    // TypeScript config
    if (features.typescript) {
      structure.children!.push({
        name: 'tsconfig.json',
        type: 'file',
        path: '/tsconfig.json',
        content: this.generateTsConfig(data.type)
      });
    }

    // ESLint config
    if (features.eslint) {
      structure.children!.push({
        name: '.eslintrc.json',
        type: 'file',
        path: '/.eslintrc.json',
        content: this.generateEslintConfig(data.type, features.typescript)
      });
    }

    // Framework-specific structure
    this.addFrameworkStructure(structure, data, features);

    // Docker files
    if (features.docker) {
      structure.children!.push(
        {
          name: 'Dockerfile',
          type: 'file',
          path: '/Dockerfile',
          content: this.generateDockerfile(data.type, data.framework)
        },
        {
          name: 'docker-compose.yml',
          type: 'file',
          path: '/docker-compose.yml',
          content: this.generateDockerCompose(data.name)
        }
      );
    }

    // CI/CD files
    if (features.ci_cd) {
      structure.children!.push({
        name: '.github',
        type: 'directory',
        path: '/.github',
        children: [{
          name: 'workflows',
          type: 'directory',
          path: '/.github/workflows',
          children: [{
            name: 'ci.yml',
            type: 'file',
            path: '/.github/workflows/ci.yml',
            content: this.generateGithubWorkflow(data.name)
          }]
        }]
      });
    }

    return structure;
  }

  private static addFrameworkStructure(structure: ProjectStructure, data: ProjectData, features: ProjectFeatures) {
    switch (data.framework) {
      case 'nextjs':
        structure.children!.push(
          {
            name: 'src',
            type: 'directory',
            path: '/src',
            children: [
              {
                name: 'app',
                type: 'directory',
                path: '/src/app',
                children: [
                  {
                    name: 'page.tsx',
                    type: 'file',
                    path: '/src/app/page.tsx',
                    content: `export default function Home() {\n  return <h1>Welcome to ${data.name}</h1>\n}`
                  },
                  {
                    name: 'layout.tsx',
                    type: 'file',
                    path: '/src/app/layout.tsx',
                    content: this.generateNextLayout(data.name)
                  }
                ]
              },
              {
                name: 'components',
                type: 'directory',
                path: '/src/components',
                children: []
              },
              {
                name: 'lib',
                type: 'directory',
                path: '/src/lib',
                children: []
              }
            ]
          },
          {
            name: 'public',
            type: 'directory',
            path: '/public',
            children: []
          },
          {
            name: 'next.config.js',
            type: 'file',
            path: '/next.config.js',
            content: '/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {}\n\nmodule.exports = nextConfig'
          }
        );
        break;

      case 'react':
        structure.children!.push(
          {
            name: 'src',
            type: 'directory',
            path: '/src',
            children: [
              {
                name: 'App.tsx',
                type: 'file',
                path: '/src/App.tsx',
                content: this.generateReactApp(data.name)
              },
              {
                name: 'index.tsx',
                type: 'file',
                path: '/src/index.tsx',
                content: this.generateReactIndex()
              },
              {
                name: 'components',
                type: 'directory',
                path: '/src/components',
                children: []
              }
            ]
          },
          {
            name: 'public',
            type: 'directory',
            path: '/public',
            children: [{
              name: 'index.html',
              type: 'file',
              path: '/public/index.html',
              content: this.generateHtmlTemplate(data.name)
            }]
          }
        );
        break;

      case 'express':
        structure.children!.push({
          name: 'src',
          type: 'directory',
          path: '/src',
          children: [
            {
              name: 'index.ts',
              type: 'file',
              path: '/src/index.ts',
              content: this.generateExpressServer()
            },
            {
              name: 'routes',
              type: 'directory',
              path: '/src/routes',
              children: []
            },
            {
              name: 'middleware',
              type: 'directory',
              path: '/src/middleware',
              children: []
            },
            {
              name: 'models',
              type: 'directory',
              path: '/src/models',
              children: []
            }
          ]
        });
        break;
    }
  }

  private static generateGitignore(projectType: string): string {
    const common = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
out/

# Misc
.DS_Store
*.pem
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo`;

    const typeSpecific: Record<string, string> = {
      web: '\n# Next.js\n.next/\n*.tsbuildinfo\nnext-env.d.ts',
      api: '\n# Logs\nlogs/\n*.log',
      mobile: '\n# React Native\n.expo/\n*.jks\n*.p8\n*.p12\n*.key\n*.mobileprovision'
    };

    return common + (typeSpecific[projectType] || '');
  }

  private static generateTsConfig(projectType: string): string {
    const configs: Record<string, any> = {
      web: {
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true
        },
        include: ['src'],
        exclude: ['node_modules']
      },
      api: {
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
          lib: ['ES2020'],
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          moduleResolution: 'node'
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist']
      }
    };

    return JSON.stringify(configs[projectType] || configs.web, null, 2);
  }

  private static generateEslintConfig(projectType: string, typescript: boolean): string {
    const base: any = {
      extends: [
        'eslint:recommended',
        ...(typescript ? ['plugin:@typescript-eslint/recommended'] : [])
      ].filter(Boolean),
      parser: typescript ? '@typescript-eslint/parser' : undefined,
      plugins: typescript ? ['@typescript-eslint'] : [],
      rules: {
        'no-console': 'warn',
        'no-unused-vars': 'warn'
      }
    };

    if (projectType === 'web') {
      base.extends.push('plugin:react/recommended', 'plugin:react-hooks/recommended');
    }

    return JSON.stringify(base, null, 2);
  }

  private static generateNextLayout(name: string): string {
    return `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${name}',
  description: 'Generated by Kiro IDE'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`;
  }

  private static generateReactApp(name: string): string {
    return `import React from 'react'

function App() {
  return (
    <div className="App">
      <h1>Welcome to ${name}</h1>
      <p>Edit src/App.tsx to get started</p>
    </div>
  )
}

export default App`;
  }

  private static generateReactIndex(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`;
  }

  private static generateExpressServer(): string {
    return `import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' })
})

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).send('Something broke!')
})

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})`;
  }

  private static generateHtmlTemplate(name: string): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${name} - Created with Kiro IDE" />
    <title>${name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
  }

  private static generateDockerfile(projectType: string, framework: string): string {
    if (projectType === 'web' && framework === 'nextjs') {
      return `FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \\
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
  elif [ -f package-lock.json ]; then npm ci; \\
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`;
    }

    return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`;
  }

  private static generateDockerCompose(name: string): string {
    return `version: '3.8'

services:
  app:
    build: .
    container_name: ${name.toLowerCase().replace(/\s+/g, '-')}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped`;
  }

  private static generateGithubWorkflow(name: string): string {
    return `name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - run: npm ci
    - run: npm run build --if-present
    - run: npm test`;
  }
}