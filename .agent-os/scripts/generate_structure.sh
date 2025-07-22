#!/bin/bash
# Generate Project Structure Script v1.0
# Create Clean-Architecture folder tree based on stack.json or proposed stack

set -euo pipefail

# Default values
PROJECT_PATH="."
STACK_FILE=""
DRY_RUN=false
ARCHITECTURE_TYPE="clean"
AGENT_OS_HOME="${AGENT_OS_HOME:-$HOME/.agent-os}"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Usage help
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Generate Clean Architecture project structure based on detected or proposed tech stack.

OPTIONS:
    --stack FILE              Stack JSON file (from detect_stack.py)
    --project-path PATH       Target project directory (default: .)
    --architecture TYPE       Architecture type: clean|feature (default: clean)
    --dry-run                 Show what would be created without creating
    --help                    Show this help message

EXAMPLES:
    $0 --stack reports/stack.json
    $0 --stack stack.json --project-path ./my-project --dry-run
    $0 --architecture feature --project-path ./feature-based-app

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --stack)
            STACK_FILE="$2"
            shift 2
            ;;
        --project-path)
            PROJECT_PATH="$2"
            shift 2
            ;;
        --architecture)
            ARCHITECTURE_TYPE="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Validate inputs
if [[ -n "$STACK_FILE" && ! -f "$STACK_FILE" ]]; then
    print_error "Stack file not found: $STACK_FILE"
    exit 1
fi

if [[ ! -d "$PROJECT_PATH" ]]; then
    print_error "Project path does not exist: $PROJECT_PATH"
    exit 1
fi

# Load stack information
load_stack_info() {
    if [[ -n "$STACK_FILE" ]]; then
        if command -v jq >/dev/null 2>&1; then
            FRAMEWORK=$(jq -r '.webFramework.name // "unknown"' "$STACK_FILE")
            LANGUAGE=$(jq -r '.runtime.language // "javascript"' "$STACK_FILE")
            DATABASE=$(jq -r '.database.primary // "none"' "$STACK_FILE")
            AUTH_SYSTEM=$(jq -r '.auth.system // "none"' "$STACK_FILE")
            STYLING_SYSTEM=$(jq -r '.styling.system // "none"' "$STACK_FILE")
        else
            print_warning "jq not installed, using defaults"
            FRAMEWORK="unknown"
            LANGUAGE="javascript"
            DATABASE="none"
            AUTH_SYSTEM="none"
            STYLING_SYSTEM="none"
        fi
    else
        print_info "No stack file provided, using defaults"
        FRAMEWORK="unknown"
        LANGUAGE="javascript"
        DATABASE="none"
        AUTH_SYSTEM="none"
        STYLING_SYSTEM="none"
    fi
}

# Create directory if not exists (with dry-run support)
create_dir() {
    local dir_path="$1"
    local description="$2"
    
    if [[ "$DRY_RUN" == true ]]; then
        echo "[DRY-RUN] Would create directory: $dir_path - $description"
    else
        mkdir -p "$dir_path"
        print_info "Created: $dir_path - $description"
    fi
}

# Create file with content (with dry-run support)
create_file() {
    local file_path="$1"
    local content="$2"
    local description="$3"
    
    if [[ "$DRY_RUN" == true ]]; then
        echo "[DRY-RUN] Would create file: $file_path - $description"
    else
        mkdir -p "$(dirname "$file_path")"
        echo "$content" > "$file_path"
        print_info "Created: $file_path - $description"
    fi
}

# Generate Clean Architecture structure
generate_clean_architecture() {
    local base_path="$1"
    
    print_info "Generating Clean Architecture structure..."
    
    # Domain layer (core business logic)
    create_dir "$base_path/src/domain/entities" "Business entities and domain models"
    create_dir "$base_path/src/domain/value-objects" "Immutable value objects"
    create_dir "$base_path/src/domain/repositories" "Repository interfaces"
    create_dir "$base_path/src/domain/services" "Domain services"
    create_dir "$base_path/src/domain/events" "Domain events"
    
    # Application layer (use cases)
    create_dir "$base_path/src/application/use-cases" "Application use cases"
    create_dir "$base_path/src/application/services" "Application services"
    create_dir "$base_path/src/application/dto" "Data transfer objects"
    create_dir "$base_path/src/application/ports" "Interfaces for external systems"
    create_dir "$base_path/src/application/queries" "Query handlers"
    create_dir "$base_path/src/application/commands" "Command handlers"
    
    # Infrastructure layer (external concerns)
    create_dir "$base_path/src/infrastructure/database" "Database implementations"
    create_dir "$base_path/src/infrastructure/external-services" "Third-party integrations"
    create_dir "$base_path/src/infrastructure/messaging" "Message queues and events"
    create_dir "$base_path/src/infrastructure/config" "Configuration management"
    create_dir "$base_path/src/infrastructure/monitoring" "Observability setup"
    
    # Presentation layer (UI and API)
    if [[ "$FRAMEWORK" == "next" ]]; then
        create_dir "$base_path/src/presentation/app" "Next.js App Router pages"
        create_dir "$base_path/src/presentation/api" "API route handlers"
        create_dir "$base_path/src/presentation/components" "React components"
        create_dir "$base_path/src/presentation/middleware" "Request/response middleware"
    else
        create_dir "$base_path/src/presentation/pages" "Application pages"
        create_dir "$base_path/src/presentation/components" "UI components"
        create_dir "$base_path/src/presentation/api" "API handlers"
        create_dir "$base_path/src/presentation/middleware" "Middleware"
    fi
    
    # Shared utilities
    create_dir "$base_path/src/shared/utils" "Shared utility functions"
    create_dir "$base_path/src/shared/constants" "Application constants"
    create_dir "$base_path/src/shared/types" "Shared TypeScript types"
    create_dir "$base_path/src/shared/errors" "Error definitions"
    
    # Testing directories
    create_dir "$base_path/tests/unit" "Unit tests"
    create_dir "$base_path/tests/integration" "Integration tests"
    create_dir "$base_path/tests/e2e" "End-to-end tests"
    create_dir "$base_path/tests/mocks" "Test mocks and fixtures"
    
    # Documentation
    create_dir "$base_path/docs/architecture" "Architecture documentation"
    create_dir "$base_path/docs/api" "API documentation"
    create_dir "$base_path/docs/deployment" "Deployment guides"
}

# Generate Feature-based Architecture structure
generate_feature_architecture() {
    local base_path="$1"
    
    print_info "Generating Feature-based Architecture structure..."
    
    # Shared utilities and components
    create_dir "$base_path/src/shared/ui" "Reusable UI components"
    create_dir "$base_path/src/shared/utils" "Utility functions"
    create_dir "$base_path/src/shared/types" "Shared TypeScript types"
    create_dir "$base_path/src/shared/hooks" "Shared React hooks"
    create_dir "$base_path/src/shared/constants" "Application constants"
    
    # Feature modules
    if [[ "$AUTH_SYSTEM" != "none" ]]; then
        create_dir "$base_path/src/features/authentication/components" "Auth components"
        create_dir "$base_path/src/features/authentication/hooks" "Auth hooks"
        create_dir "$base_path/src/features/authentication/services" "Auth services"
        create_dir "$base_path/src/features/authentication/types" "Auth types"
        create_dir "$base_path/src/features/authentication/__tests__" "Auth tests"
    fi
    
    create_dir "$base_path/src/features/user-management/components" "User management components"
    create_dir "$base_path/src/features/user-management/hooks" "User management hooks"
    create_dir "$base_path/src/features/user-management/services" "User management services"
    create_dir "$base_path/src/features/user-management/types" "User management types"
    create_dir "$base_path/src/features/user-management/__tests__" "User management tests"
    
    if [[ "$DATABASE" != "none" ]]; then
        create_dir "$base_path/src/features/billing/components" "Billing components"
        create_dir "$base_path/src/features/billing/hooks" "Billing hooks"
        create_dir "$base_path/src/features/billing/services" "Billing services"
        create_dir "$base_path/src/features/billing/types" "Billing types"
        create_dir "$base_path/src/features/billing/__tests__" "Billing tests"
    fi
    
    # App structure (Next.js specific)
    if [[ "$FRAMEWORK" == "next" ]]; then
        create_dir "$base_path/src/app/(auth)" "Auth route groups"
        create_dir "$base_path/src/app/(dashboard)" "Protected routes"
        create_dir "$base_path/src/app/api" "API routes"
    else
        create_dir "$base_path/src/app/pages" "Application pages"
        create_dir "$base_path/src/app/layouts" "Page layouts"
        create_dir "$base_path/src/app/api" "API routes"
    fi
    
    # Core libraries
    create_dir "$base_path/src/lib/database" "Database configuration"
    create_dir "$base_path/src/lib/auth" "Authentication setup"
    create_dir "$base_path/src/lib/monitoring" "Observability setup"
    create_dir "$base_path/src/lib/validation" "Input validation schemas"
    
    # Testing
    create_dir "$base_path/tests/integration" "Integration tests"
    create_dir "$base_path/tests/e2e" "End-to-end tests"
    create_dir "$base_path/tests/utils" "Test utilities"
}

# Create foundational files
create_foundational_files() {
    local base_path="$1"
    
    print_info "Creating foundational files..."
    
    # README.md
    local readme_content="# $(basename "$base_path")

## Architecture

This project follows the $(echo "$ARCHITECTURE_TYPE" | tr '[:lower:]' '[:upper:]') architecture pattern.

## Tech Stack

- **Framework**: $FRAMEWORK
- **Language**: $LANGUAGE
- **Database**: $DATABASE
- **Authentication**: $AUTH_SYSTEM
- **Styling**: $STYLING_SYSTEM

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Project Structure

See \`docs/architecture/\` for detailed architecture documentation.

## Development

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run test\` - Run tests
- \`npm run lint\` - Lint code

## Documentation

- [Architecture Decision Records](./docs/architecture/adr/)
- [API Documentation](./docs/api/)
- [Deployment Guide](./docs/deployment/)
"
    
    create_file "$base_path/README.md" "$readme_content" "Project README"
    
    # ADR Template
    local adr_template="# ADR-001: Initial Architecture Pattern

**Status:** Accepted
**Date:** $(date +%Y-%m-%d)
**Deciders:** Development Team

## Context and Problem Statement

We need to establish a consistent architecture pattern for this $FRAMEWORK application that promotes maintainability, testability, and scalability.

## Decision Drivers

- Maintainable codebase structure
- Clear separation of concerns
- Testability requirements
- Team development efficiency
- Future scalability needs

## Considered Options

- Clean Architecture with Domain-Driven Design
- Feature-based modular architecture
- Traditional layered architecture

## Decision Outcome

Chosen option: **$(echo "$ARCHITECTURE_TYPE" | tr '[:lower:]' '[:upper:]') Architecture**

### Positive Consequences

- Clear separation of business logic from external concerns
- Improved testability through dependency inversion
- Better maintainability and code organization
- Easier onboarding for new team members

### Negative Consequences

- Initial setup complexity
- Potential over-engineering for simple applications
- Learning curve for team members unfamiliar with the pattern

## Implementation Notes

- Domain layer contains core business logic with zero external dependencies
- Application layer orchestrates use cases and business workflows
- Infrastructure layer handles external integrations and data persistence
- Presentation layer manages UI and API concerns

## Links

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Project Architecture Standards](../../standards/application-architecture.md)
"
    
    create_file "$base_path/docs/architecture/adr/ADR-001-architecture-pattern.md" "$adr_template" "Initial ADR"
    
    # .gitignore additions for architecture
    local gitignore_additions="
# Architecture artifacts
reports/stack.json
docs/generated/
*.architecture.tmp

# Development artifacts
.vscode/settings.json
.idea/workspace.xml
"
    
    if [[ -f "$base_path/.gitignore" ]]; then
        if [[ "$DRY_RUN" == false ]]; then
            echo "$gitignore_additions" >> "$base_path/.gitignore"
            print_info "Updated .gitignore with architecture-specific entries"
        else
            echo "[DRY-RUN] Would append to .gitignore"
        fi
    else
        create_file "$base_path/.gitignore" "$gitignore_additions" "Architecture .gitignore"
    fi
}

# Create example files based on detected stack
create_example_files() {
    local base_path="$1"
    
    print_info "Creating example files based on detected stack..."
    
    # TypeScript configuration enhancements
    if [[ "$LANGUAGE" == "typescript" ]]; then
        local tsconfig_paths=""
        if [[ "$ARCHITECTURE_TYPE" == "clean" ]]; then
            tsconfig_paths='    "paths": {
      "@/domain/*": ["./src/domain/*"],
      "@/application/*": ["./src/application/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/presentation/*": ["./src/presentation/*"],
      "@/shared/*": ["./src/shared/*"]
    }'
        else
            tsconfig_paths='    "paths": {
      "@/shared/*": ["./src/shared/*"],
      "@/features/*": ["./src/features/*"],
      "@/app/*": ["./src/app/*"],
      "@/lib/*": ["./src/lib/*"]
    }'
        fi
        
        # Check if tsconfig.json exists and update paths
        if [[ -f "$base_path/tsconfig.json" ]]; then
            if [[ "$DRY_RUN" == false ]]; then
                print_info "TypeScript paths should be added to existing tsconfig.json"
            else
                echo "[DRY-RUN] Would update tsconfig.json with path mappings"
            fi
        fi
    fi
    
    # Example domain entity (Clean Architecture)
    if [[ "$ARCHITECTURE_TYPE" == "clean" ]]; then
        local user_entity="export class User {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly name: string,
    private readonly createdAt: Date
  ) {
    this.validateEmail(email);
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}
"
        
        local file_ext=$([ "$LANGUAGE" == "typescript" ] && echo "ts" || echo "js")
        create_file "$base_path/src/domain/entities/User.$file_ext" "$user_entity" "Example User entity"
    fi
}

# Main execution
main() {
    print_info "Agent OS Project Structure Generator v1.0"
    print_info "Project: $PROJECT_PATH"
    print_info "Architecture: $ARCHITECTURE_TYPE"
    
    if [[ -n "$STACK_FILE" ]]; then
        print_info "Stack file: $STACK_FILE"
    fi
    
    if [[ "$DRY_RUN" == true ]]; then
        print_warning "DRY RUN MODE - No files will be created"
    fi
    
    # Load stack information
    load_stack_info
    
    print_info "Detected stack: $FRAMEWORK ($LANGUAGE) with $DATABASE database"
    
    # Generate structure based on architecture type
    case "$ARCHITECTURE_TYPE" in
        "clean")
            generate_clean_architecture "$PROJECT_PATH"
            ;;
        "feature")
            generate_feature_architecture "$PROJECT_PATH"
            ;;
        *)
            print_error "Unknown architecture type: $ARCHITECTURE_TYPE"
            exit 1
            ;;
    esac
    
    # Create foundational files
    create_foundational_files "$PROJECT_PATH"
    
    # Create example files
    create_example_files "$PROJECT_PATH"
    
    if [[ "$DRY_RUN" == false ]]; then
        print_success "Project structure generated successfully!"
        print_info "Next steps:"
        echo "  1. Review the generated structure"
        echo "  2. Customize ADR-001 with specific requirements"
        echo "  3. Add project-specific configuration files"
        echo "  4. Begin implementing domain logic"
    else
        print_info "Dry run completed. Use without --dry-run to create the structure."
    fi
}

# Run main function
main "$@"
