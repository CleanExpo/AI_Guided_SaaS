# Project Structure Generation Workflow

## Purpose
Create professional project scaffolding based on detected or proposed tech stack using Clean Architecture or Feature-based patterns.

## Prerequisites
- Tech stack analysis completed (stack.json available)
- Architecture pattern decided (Clean Architecture vs Feature-based)
- Project directory prepared
- Agent OS generate_structure.sh script available

## Workflow Steps

### 1. Pre-Generation Analysis
Review stack information and project requirements:

```bash
# Verify stack information is available
if [ -f "reports/stack.json" ]; then
    echo "✅ Stack analysis found"
    cat reports/stack.json | jq '.webFramework.name, .runtime.language, .database.primary'
else
    echo "⚠️ No stack analysis found - using defaults"
fi

# Check project directory state
ls -la
echo "Current files: $(ls -1 | wc -l)"
```

#### Architecture Pattern Selection
Choose between patterns based on project characteristics:

```
Project Type | Team Size | Complexity | Recommended Pattern
-------------|-----------|------------|-------------------
Enterprise | >5 devs | High | Clean Architecture
SaaS Product | 3-5 devs | Medium-High | Clean Architecture  
Startup MVP | 1-3 devs | Medium | Feature-based
Dashboard | 2-4 devs | Medium | Feature-based
Static Site | 1-2 devs | Low | Feature-based
Microservice | Any | High | Clean Architecture
```

### 2. Structure Generation
Execute the structure generation script:

#### Basic Generation (Auto-detect stack)
```bash
# Generate with existing stack analysis
./.agent-os/scripts/generate_structure.sh --stack reports/stack.json

# Generate with specific architecture type
./.agent-os/scripts/generate_structure.sh --architecture clean

# Generate for different project path
./.agent-os/scripts/generate_structure.sh --project-path ./new-project --stack stack.json
```

#### Advanced Generation Options
```bash
# Dry run to preview structure
./.agent-os/scripts/generate_structure.sh --dry-run --verbose

# Feature-based architecture for rapid development
./.agent-os/scripts/generate_structure.sh --architecture feature --stack reports/stack.json

# Custom project with Clean Architecture
./.agent-os/scripts/generate_structure.sh \
    --architecture clean \
    --project-path ./enterprise-app \
    --stack reports/stack.json
```

### 3. Post-Generation Setup
Configure the generated structure for the specific tech stack:

#### TypeScript Configuration
If TypeScript detected, enhance tsconfig.json:

```bash
# Check if TypeScript is in use
if grep -q '"typescript"' package.json; then
    echo "Setting up TypeScript path mapping..."
    
    # For Clean Architecture
    if [ -d "src/domain" ]; then
        cat >> tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/domain/*": ["./src/domain/*"],
      "@/application/*": ["./src/application/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/presentation/*": ["./src/presentation/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
EOF
    fi
    
    # For Feature-based
    if [ -d "src/features" ]; then
        cat >> tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/shared/*": ["./src/shared/*"],
      "@/features/*": ["./src/features/*"],
      "@/app/*": ["./src/app/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
EOF
    fi
fi
```

#### Next.js Specific Setup
If Next.js framework detected:

```bash
# Ensure Next.js configuration is properly set up
if grep -q '"next"' package.json; then
    echo "Configuring Next.js specific structure..."
    
    # Create Next.js specific directories
    mkdir -p public/images public/icons
    mkdir -p src/styles/globals.css
    
    # Create basic layout file for App Router
    if [ -d "src/app" ] || [ -d "src/presentation/app" ]; then
        echo "Creating Next.js App Router layout..."
        # Layout creation handled by script
    fi
fi
```

#### Database Integration Setup
Configure database-specific directories:

```bash
# PostgreSQL + Prisma setup
if grep -q '"prisma"' package.json; then
    echo "Setting up Prisma structure..."
    mkdir -p prisma/migrations prisma/seeds
    
    # Clean Architecture: database in infrastructure
    if [ -d "src/infrastructure" ]; then
        mkdir -p src/infrastructure/database/prisma
        mkdir -p src/infrastructure/database/repositories
    fi
    
    # Feature-based: database in lib
    if [ -d "src/lib" ]; then
        mkdir -p src/lib/database/schema
        mkdir -p src/lib/database/repositories
    fi
fi

# MongoDB setup
if grep -q '"mongoose"' package.json; then
    echo "Setting up MongoDB structure..."
    mkdir -p src/models src/schemas
fi

# Supabase setup
if grep -q '"@supabase"' package.json; then
    echo "Setting up Supabase structure..."
    mkdir -p supabase/functions supabase/migrations
fi
```

### 4. Create Essential Configuration Files
Generate framework-specific configuration files:

#### ESLint Configuration
```bash
# Create or enhance .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  },
  "overrides": [
    {
      "files": ["src/domain/**/*.ts"],
      "rules": {
        "import/no-external-modules": "error"
      }
    }
  ]
}
EOF
```

#### Prettier Configuration
```bash
# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF
```

#### Testing Configuration
If testing framework detected:

```bash
# Jest configuration for Clean Architecture
if grep -q '"jest"' package.json && [ -d "src/domain" ]; then
    cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/application/(.*)$': '<rootDir>/src/application/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@/presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1'
  },
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html']
};
EOF
fi
```

### 5. Initialize Version Control
Set up Git with appropriate ignores:

```bash
# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Enhance .gitignore for architecture
cat >> .gitignore << 'EOF'

# Architecture artifacts
reports/stack*.json
docs/generated/
*.architecture.tmp

# Environment files
.env.local
.env.development.local
.env.production.local

# Database
/prisma/migrations/dev.db*
/supabase/.temp

# Testing
coverage/
.nyc_output

# IDE
.vscode/settings.json
.idea/workspace.xml
EOF
```

### 6. Create Example Implementation Files
Generate starter files based on architecture:

#### Clean Architecture Examples
```bash
if [ -d "src/domain" ]; then
    echo "Creating Clean Architecture examples..."
    
    # Domain Entity Example
    cat > src/domain/entities/User.ts << 'EOF'
export interface UserProps {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {
    this.validate();
  }

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    return new User({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get name(): string { return this.props.name; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  private validate(): void {
    if (!this.props.email?.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (!this.props.name?.trim()) {
      throw new Error('Name is required');
    }
  }

  updateName(name: string): User {
    return new User({
      ...this.props,
      name: name.trim(),
      updatedAt: new Date()
    });
  }

  toJSON(): UserProps {
    return { ...this.props };
  }
}
EOF

    # Repository Interface Example
    cat > src/domain/repositories/UserRepository.ts << 'EOF'
import { User } from '../entities/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}
EOF

    # Use Case Example
    cat > src/application/use-cases/CreateUser.ts << 'EOF'
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export interface CreateUserDTO {
  email: string;
  name: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = User.create(dto);
    
    // Save to repository
    await this.userRepository.save(user);
    
    return user;
  }
}
EOF
fi
```

#### Feature-based Examples
```bash
if [ -d "src/features" ]; then
    echo "Creating Feature-based examples..."
    
    # User feature structure
    mkdir -p src/features/user-management/{components,hooks,services,types,__tests__}
    
    # User service example
    cat > src/features/user-management/services/userService.ts << 'EOF'
import { User, CreateUserData } from '../types/user';

export class UserService {
  private apiUrl = '/api/users';

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  async getUserById(id: string): Promise<User> {
    const response = await fetch(`${this.apiUrl}/${id}`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }

    return response.json();
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }
}

export const userService = new UserService();
EOF

    # User types example
    cat > src/features/user-management/types/user.ts << 'EOF'
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
}

export interface UpdateUserData {
  name?: string;
  avatar?: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface UserWithRole extends User {
  role: UserRole;
  permissions: string[];
}
EOF
fi
```

### 7. Documentation Generation
Create architecture-specific documentation:

```bash
# Create architecture documentation
mkdir -p docs/architecture

# Architecture overview
cat > docs/architecture/README.md << EOF
# Project Architecture

This project follows the **$([ -d "src/domain" ] && echo "Clean Architecture" || echo "Feature-based Architecture")** pattern.

## Directory Structure

$(tree src 2>/dev/null || find src -type d | sed 's|[^/]*/|  |g')

## Key Principles

$(if [ -d "src/domain" ]; then
echo "### Clean Architecture Layers

1. **Domain Layer** (\`src/domain/\`)
   - Contains core business logic and entities
   - Zero external dependencies
   - Pure business rules and domain models

2. **Application Layer** (\`src/application/\`)
   - Use cases and application services
   - Orchestrates domain objects
   - Depends only on domain layer

3. **Infrastructure Layer** (\`src/infrastructure/\`)
   - External integrations (database, APIs, etc.)
   - Framework-specific implementations
   - Depends on domain and application layers

4. **Presentation Layer** (\`src/presentation/\`)
   - UI components and API controllers
   - User interface logic
   - Depends on all other layers

### Dependency Rules
- Inner layers cannot depend on outer layers
- Dependencies point inward toward the domain
- Interfaces are defined in inner layers, implemented in outer layers"
else
echo "### Feature-based Organization

1. **Shared Resources** (\`src/shared/\`)
   - Reusable utilities and components
   - Common types and constants
   - Shared business logic

2. **Feature Modules** (\`src/features/\*)
   - Self-contained feature implementations
   - Feature-specific components, hooks, services
   - Feature-specific types and tests

3. **Application Layer** (\`src/app/\`)
   - Application routing and pages
   - Global application setup
   - Route-specific logic

4. **Core Libraries** (\`src/lib/\`)
   - Configuration and setup
   - Database connections
   - External service integrations"
fi)

## Getting Started

1. Install dependencies: \`npm install\`
2. Set up environment: \`cp .env.example .env.local\`
3. Run development server: \`npm run dev\`
4. Run tests: \`npm test\`

## Development Guidelines

- Follow the established directory structure
- Write tests for all business logic
- Use TypeScript for type safety
- Follow the defined coding standards
- Update documentation when adding features
EOF

# Create ADR for architecture decision
cat > docs/architecture/adr/ADR-002-project-structure.md << EOF
# ADR-002: Project Structure Implementation

**Status:** Accepted  
**Date:** $(date +%Y-%m-%d)  
**Deciders:** Development Team  

## Context and Problem Statement

We need to implement a consistent project structure that supports maintainability, scalability, and team collaboration while aligning with our chosen architecture pattern.

## Decision

We have implemented a **$([ -d "src/domain" ] && echo "Clean Architecture" || echo "Feature-based Architecture")** structure with the following characteristics:

$([ -d "src/domain" ] && echo "
- **Domain-Driven Design**: Core business logic isolated from external concerns
- **Dependency Inversion**: Dependencies flow inward toward domain
- **Testability**: Business logic easily testable in isolation
- **Framework Independence**: Core logic not tied to specific frameworks" || echo "
- **Feature Co-location**: Related functionality grouped together  
- **Shared Resources**: Common utilities and components centralized
- **Scalability**: Easy to add new features without affecting existing ones
- **Team Autonomy**: Teams can work on features independently")

## Rationale

This structure provides:
1. **Clear Separation of Concerns**: Each layer/feature has a specific responsibility
2. **Maintainability**: Easy to locate and modify specific functionality
3. **Testability**: Structure supports comprehensive testing strategies
4. **Team Productivity**: Clear guidelines for where code should be placed
5. **Scalability**: Architecture supports application growth

## Implementation Notes

- All new features should follow the established structure
- Cross-cutting concerns are handled in the shared layer
- Business logic is kept separate from framework code
- Testing structure mirrors the source structure

## Consequences

**Positive:**
- Consistent codebase organization
- Easier onboarding for new developers  
- Better separation of business logic
- Improved testability and maintainability

**Negative:**
- Initial learning curve for team members
- More directories to navigate
- Potential over-engineering for simple features

## Links
- [Architecture Standards](../../standards/application-architecture.md)
- [Project README](../README.md)
EOF
```

### 8. Validation and Quality Check
Verify the generated structure:

```bash
# Structure validation
echo "🔍 Validating generated structure..."

# Check essential directories exist
REQUIRED_DIRS=(
    "src"
    "docs" 
    "tests"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir directory created"
    else
        echo "❌ Missing $dir directory"
    fi
done

# Check configuration files
CONFIG_FILES=(
    ".eslintrc.json"
    ".prettierrc"
    ".gitignore"
    "README.md"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file configured"
    else
        echo "⚠️ Missing $file"
    fi
done

# Check architecture-specific structure
if [ -d "src/domain" ]; then
    echo "✅ Clean Architecture structure detected"
    echo "  - Domain layer: $(ls src/domain | wc -l) directories"
    echo "  - Application layer: $(ls src/application | wc -l) directories" 
    echo "  - Infrastructure layer: $(ls src/infrastructure | wc -l) directories"
    echo "  - Presentation layer: $(ls src/presentation | wc -l) directories"
elif [ -d "src/features" ]; then
    echo "✅ Feature-based Architecture structure detected"
    echo "  - Features: $(ls src/features | wc -l) feature modules"
    echo "  - Shared: $(ls src/shared | wc -l) shared directories"
fi

# Validate TypeScript configuration
if [ -f "tsconfig.json" ] && grep -q "paths" tsconfig.json; then
    echo "✅ TypeScript path mapping configured"
fi

echo "🎉 Structure generation complete!"
```

## Output Artifacts

### Core Structure Files
- **Directory Structure**: Complete folder hierarchy
- **Configuration Files**: ESLint, Prettier, TypeScript configs
- **Documentation**: Architecture docs, ADRs, README
- **Example Files**: Starter implementations following architecture

### Architecture-Specific Artifacts

#### Clean Architecture
- Domain entities and value objects
- Repository interfaces  
- Use case implementations
- Infrastructure implementations
- Presentation layer components

#### Feature-based Architecture
- Feature modules with complete structure
- Shared utilities and components
- Service layer implementations
- Type definitions and interfaces

## Integration Points

### Next Steps After Structure Generation
1. **Install Dependencies**: Run `npm install` to install packages
2. **Environment Setup**: Configure `.env` files with required variables
3. **Database Setup**: Initialize database schema if applicable
4. **Development Server**: Start development with `npm run dev`
5. **Create Roadmap**: Use `create-development-roadmap.md` workflow

### AI Assistant Integration
This workflow should be triggered by:
- `/create-architecture` command
- Project initialization requests
- Architecture setup after stack recommendation
- Structure modernization requests

## Error Handling

### Common Issues
- **Permission denied**: Ensure write access to target directory
- **Existing files**: Script handles existing files gracefully
- **Missing dependencies**: Stack analysis should be run first
- **Platform differences**: Scripts are cross-platform compatible

### Validation Checklist
- [ ] All required directories created
- [ ] Configuration files generated
- [ ] Architecture pattern correctly implemented
- [ ] Example files follow established patterns
- [ ] Documentation is complete and accurate
- [ ] Git repository is properly configured
- [ ] TypeScript configuration includes path mapping
- [ ] Testing structure is set up correctly

This workflow ensures consistent, professional project structure generation that aligns with best practices and chosen architecture patterns.
