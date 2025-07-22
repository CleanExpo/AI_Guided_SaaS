#!/bin/bash
# Create Development Roadmap Script v1.0
# Render sprint roadmap from template, inject stack & architecture data

set -euo pipefail

# Default values
PROJECT_PATH="."
STACK_FILE=""
OUTPUT_FILE="docs/roadmap.md"
TEMPLATE_FILE=""
SPRINTS=12
DRY_RUN=false
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

Generate a development roadmap based on detected tech stack and architecture.

OPTIONS:
    --stack FILE              Stack JSON file (from detect_stack.py)
    --project-path PATH       Project directory (default: .)
    --output FILE             Output roadmap file (default: docs/roadmap.md)
    --template FILE           Custom roadmap template
    --sprints NUMBER          Number of sprints (default: 12)
    --dry-run                 Show output without writing file
    --help                    Show this help message

EXAMPLES:
    $0 --stack reports/stack.json
    $0 --stack stack.json --output PROJECT_ROADMAP.md --sprints 8
    $0 --project-path ./my-project --dry-run

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
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --template)
            TEMPLATE_FILE="$2"
            shift 2
            ;;
        --sprints)
            SPRINTS="$2"
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

# Stack information variables
FRAMEWORK="unknown"
LANGUAGE="javascript"
DATABASE="none"
AUTH_SYSTEM="none"
STYLING_SYSTEM="none"
TESTING_FRAMEWORKS=""
DEPLOYMENT_PLATFORM="none"
RED_FLAGS_COUNT=0
RECOMMENDATIONS_COUNT=0

# Load stack information
load_stack_info() {
    if [[ -n "$STACK_FILE" ]]; then
        if command -v jq >/dev/null 2>&1; then
            FRAMEWORK=$(jq -r '.webFramework.name // "unknown"' "$STACK_FILE")
            LANGUAGE=$(jq -r '.runtime.language // "javascript"' "$STACK_FILE")
            DATABASE=$(jq -r '.database.primary // "none"' "$STACK_FILE")
            AUTH_SYSTEM=$(jq -r '.auth.system // "none"' "$STACK_FILE")
            STYLING_SYSTEM=$(jq -r '.styling.system // "none"' "$STACK_FILE")
            DEPLOYMENT_PLATFORM=$(jq -r '.deployment.platform // "none"' "$STACK_FILE")
            RED_FLAGS_COUNT=$(jq -r '.redFlags | length' "$STACK_FILE" 2>/dev/null || echo "0")
            RECOMMENDATIONS_COUNT=$(jq -r '.recommendations | length' "$STACK_FILE" 2>/dev/null || echo "0")
            
            # Get testing frameworks
            TESTING_FRAMEWORKS=$(jq -r '
                .testing | 
                to_entries | 
                map(select(.value != null) | "\(.key): \(.value)") | 
                join(", ")
            ' "$STACK_FILE" 2>/dev/null || echo "none")
            
        else
            print_warning "jq not installed, using defaults"
        fi
    else
        print_info "No stack file provided, using generic roadmap"
    fi
}

# Get current date and calculate sprint dates
calculate_sprint_dates() {
    local current_date=$(date +%Y-%m-%d)
    local sprint_dates=()
    
    for ((i=1; i<=SPRINTS; i++)); do
        # Calculate date for each sprint (2 weeks each)
        local weeks_ahead=$((2 * (i-1)))
        if command -v date >/dev/null 2>&1; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS date
                local sprint_date=$(date -v+${weeks_ahead}w +%Y-%m-%d)
            else
                # Linux date
                local sprint_date=$(date -d "+${weeks_ahead} weeks" +%Y-%m-%d)
            fi
            sprint_dates+=("$sprint_date")
        else
            sprint_dates+=("TBD")
        fi
    done
    
    printf '%s\n' "${sprint_dates[@]}"
}

# Generate framework-specific tasks
get_framework_tasks() {
    local framework="$1"
    local tasks=""
    
    case "$framework" in
        "next")
            tasks="- Set up Next.js App Router structure
- Configure TypeScript and ESLint
- Implement layout components
- Set up API routes
- Configure middleware for auth
- Optimize bundle with next/bundle-analyzer"
            ;;
        "react")
            tasks="- Set up React application structure
- Configure routing with React Router
- Implement component architecture
- Set up state management
- Configure build optimization
- Add error boundaries"
            ;;
        "vue")
            tasks="- Set up Vue.js application
- Configure Vue Router
- Implement Vuex/Pinia for state management
- Create component library
- Set up build optimization
- Configure testing with Vue Test Utils"
            ;;
        *)
            tasks="- Set up application framework
- Configure routing
- Implement core architecture
- Set up state management
- Configure build tools
- Add error handling"
            ;;
    esac
    
    echo "$tasks"
}

# Generate database-specific tasks
get_database_tasks() {
    local database="$1"
    local tasks=""
    
    case "$database" in
        "supabase")
            tasks="- Set up Supabase project
- Configure database schemas
- Implement authentication with Supabase Auth
- Set up real-time subscriptions
- Configure storage buckets
- Add database migrations"
            ;;
        "prisma"|"postgresql")
            tasks="- Set up PostgreSQL database
- Configure Prisma ORM
- Design database schema
- Implement database migrations
- Set up connection pooling
- Add database seeding"
            ;;
        "mongodb")
            tasks="- Set up MongoDB database
- Configure Mongoose ODM
- Design document schemas
- Implement database indexes
- Set up aggregation pipelines
- Add data validation"
            ;;
        *)
            tasks="- Set up database
- Design data models
- Implement data access layer
- Set up migrations
- Configure connections
- Add data validation"
            ;;
    esac
    
    echo "$tasks"
}

# Generate auth-specific tasks
get_auth_tasks() {
    local auth_system="$1"
    local tasks=""
    
    case "$auth_system" in
        "nextauth")
            tasks="- Configure NextAuth.js providers
- Set up OAuth with Google/GitHub
- Implement session management
- Add protected routes
- Configure JWT tokens
- Add role-based access control"
            ;;
        "supabase-auth")
            tasks="- Configure Supabase authentication
- Set up email/password auth
- Implement social login providers
- Add user profiles
- Configure row-level security
- Add email verification"
            ;;
        "auth0")
            tasks="- Set up Auth0 application
- Configure authentication rules
- Implement user management
- Add multi-factor authentication
- Set up user roles and permissions
- Configure enterprise connections"
            ;;
        *)
            tasks="- Implement user authentication
- Set up user registration
- Add password management
- Configure session handling
- Implement authorization
- Add security measures"
            ;;
    esac
    
    echo "$tasks"
}

# Generate testing-specific tasks
get_testing_tasks() {
    local testing="$1"
    local tasks=""
    
    if [[ "$testing" == *"jest"* ]]; then
        tasks="$tasks
- Set up Jest testing framework
- Write unit tests for business logic
- Add component testing with Testing Library"
    fi
    
    if [[ "$testing" == *"playwright"* ]] || [[ "$testing" == *"cypress"* ]]; then
        tasks="$tasks
- Set up end-to-end testing
- Write user journey tests
- Add visual regression testing"
    fi
    
    if [[ -z "$tasks" ]]; then
        tasks="- Set up testing framework
- Write unit tests
- Add integration tests
- Implement E2E testing
- Set up test coverage reporting
- Add continuous testing pipeline"
    fi
    
    echo "$tasks"
}

# Generate deployment-specific tasks
get_deployment_tasks() {
    local platform="$1"
    local tasks=""
    
    case "$platform" in
        "vercel")
            tasks="- Configure Vercel project
- Set up environment variables
- Configure build settings
- Add preview deployments
- Set up custom domains
- Configure edge functions"
            ;;
        "netlify")
            tasks="- Configure Netlify project
- Set up build configuration
- Configure serverless functions
- Add form handling
- Set up redirects and headers
- Configure split testing"
            ;;
        "docker")
            tasks="- Create Dockerfile
- Set up docker-compose
- Configure container orchestration
- Add health checks
- Set up logging
- Configure scaling"
            ;;
        *)
            tasks="- Set up deployment pipeline
- Configure environment management
- Add CI/CD workflows
- Set up monitoring
- Configure logging
- Add performance optimization"
            ;;
    esac
    
    echo "$tasks"
}

# Generate roadmap content
generate_roadmap() {
    local project_name=$(basename "$PROJECT_PATH")
    local current_date=$(date +"%Y-%m-%d")
    local sprint_dates=($(calculate_sprint_dates))
    
    # Build roadmap content
    local roadmap_content="# Development Roadmap: $project_name

Generated on: $current_date
Duration: $SPRINTS sprints ($(($SPRINTS * 2)) weeks)

## Project Overview

### Tech Stack Summary
- **Framework**: $FRAMEWORK
- **Language**: $LANGUAGE
- **Database**: $DATABASE
- **Authentication**: $AUTH_SYSTEM
- **Styling**: $STYLING_SYSTEM
- **Testing**: $TESTING_FRAMEWORKS
- **Deployment**: $DEPLOYMENT_PLATFORM

### Health Check
- **Red Flags**: $RED_FLAGS_COUNT issues to address
- **Recommendations**: $RECOMMENDATIONS_COUNT improvements suggested

---

## Sprint Planning

### Phase 1: Foundation (Sprints 1-3)

#### Sprint 1: Project Setup & Architecture (${sprint_dates[0]:-TBD})
**Goal**: Establish solid foundation and development environment

**Tasks**:
$(get_framework_tasks "$FRAMEWORK")
- Set up development environment
- Configure linting and formatting
- Create initial documentation
- Set up version control workflows

**Deliverables**:
- Working development environment
- Basic application structure
- Development guidelines documented
- CI/CD pipeline configured

---

#### Sprint 2: Database & Data Layer (${sprint_dates[1]:-TBD})
**Goal**: Implement data persistence and core data models

**Tasks**:
$(get_database_tasks "$DATABASE")
- Design entity relationships
- Implement data validation
- Add error handling

**Deliverables**:
- Database schema implemented
- Core data models created
- Data access layer functional
- Basic CRUD operations working

---

#### Sprint 3: Authentication & Security (${sprint_dates[2]:-TBD})
**Goal**: Secure the application with proper authentication

**Tasks**:
$(get_auth_tasks "$AUTH_SYSTEM")
- Implement security headers
- Add input validation
- Configure CORS policies

**Deliverables**:
- User authentication working
- Protected routes implemented
- Security measures in place
- User management functional

---

### Phase 2: Core Features (Sprints 4-8)

#### Sprint 4: Core Business Logic (${sprint_dates[3]:-TBD})
**Goal**: Implement primary application features

**Tasks**:
- Identify core business requirements
- Implement main use cases
- Add business logic validation
- Create service layer
- Implement error handling
- Add logging and monitoring

**Deliverables**:
- Core features functional
- Business logic implemented
- Service layer created
- Error handling robust

---

#### Sprint 5: User Interface Development (${sprint_dates[4]:-TBD})
**Goal**: Create intuitive and responsive user interface

**Tasks**:
- Implement UI component library
- Create responsive layouts
- Add interactive elements
- Implement form handling
- Add loading states
- Configure styling system ($STYLING_SYSTEM)

**Deliverables**:
- UI components library ready
- Responsive design implemented
- User interactions smooth
- Forms functional and validated

---

#### Sprint 6: API Development (${sprint_dates[5]:-TBD})
**Goal**: Build robust API layer

**Tasks**:
- Design API endpoints
- Implement RESTful/GraphQL APIs
- Add API documentation
- Implement rate limiting
- Add API versioning
- Configure API security

**Deliverables**:
- API endpoints functional
- API documentation complete
- Rate limiting configured
- API security implemented

---

#### Sprint 7: Integration & Data Flow (${sprint_dates[6]:-TBD})
**Goal**: Connect all application layers

**Tasks**:
- Integrate frontend with backend
- Implement real-time features
- Add data synchronization
- Configure caching strategies
- Add offline capabilities
- Implement error boundaries

**Deliverables**:
- Full-stack integration complete
- Real-time features working
- Caching optimized
- Offline functionality added

---

#### Sprint 8: Testing Implementation (${sprint_dates[7]:-TBD})
**Goal**: Ensure application reliability through comprehensive testing

**Tasks**:
$(get_testing_tasks "$TESTING_FRAMEWORKS")
- Add performance testing
- Implement accessibility testing
- Create testing documentation

**Deliverables**:
- Test suite comprehensive
- Coverage targets met
- Performance benchmarks established
- Accessibility compliance verified

---

### Phase 3: Optimization & Launch (Sprints 9-12)

#### Sprint 9: Performance Optimization (${sprint_dates[8]:-TBD})
**Goal**: Optimize application performance

**Tasks**:
- Analyze performance bottlenecks
- Implement code splitting
- Optimize database queries
- Add caching layers
- Compress assets
- Optimize images and media

**Deliverables**:
- Performance benchmarks met
- Load times optimized
- Database queries efficient
- Assets optimized

---

#### Sprint 10: Security Hardening (${sprint_dates[9]:-TBD})
**Goal**: Strengthen application security

**Tasks**:
- Conduct security audit
- Implement security headers
- Add input sanitization
- Configure HTTPS
- Add security monitoring
- Implement backup strategies

**Deliverables**:
- Security audit complete
- Vulnerabilities addressed
- Security monitoring active
- Backup systems operational

---

#### Sprint 11: Deployment & DevOps (${sprint_dates[10]:-TBD})
**Goal**: Prepare for production deployment

**Tasks**:
$(get_deployment_tasks "$DEPLOYMENT_PLATFORM")
- Set up production environment
- Configure monitoring and alerting
- Add error tracking

**Deliverables**:
- Production deployment ready
- Monitoring systems active
- CI/CD pipeline complete
- Error tracking configured

---

#### Sprint 12: Launch Preparation (${sprint_dates[11]:-TBD})
**Goal**: Final preparations and go-live

**Tasks**:
- Conduct final testing
- Prepare launch documentation
- Set up analytics
- Configure customer support
- Plan rollback procedures
- Execute soft launch

**Deliverables**:
- Application production-ready
- Documentation complete
- Analytics configured
- Support processes ready
- Launch executed successfully

---

## Success Metrics

### Technical Metrics
- **Performance**: Page load < 2s, API response < 200ms
- **Reliability**: 99.9% uptime, error rate < 0.1%
- **Security**: Zero critical vulnerabilities
- **Code Quality**: Test coverage > 80%, zero linting errors

### Business Metrics
- **User Experience**: User satisfaction score > 4.5/5
- **Adoption**: User onboarding completion > 80%
- **Performance**: Core user journeys complete successfully > 95%
- **Growth**: Monthly active users growth > 10%

## Risk Mitigation

### Technical Risks
- **Dependency Updates**: Regular security updates and compatibility checks
- **Performance Degradation**: Continuous monitoring and optimization
- **Data Loss**: Automated backups and disaster recovery plans
- **Security Breaches**: Regular security audits and incident response plans

### Business Risks
- **Feature Scope Creep**: Strict sprint planning and change management
- **Timeline Delays**: Buffer time built into each sprint
- **Resource Constraints**: Clear prioritization and resource allocation
- **Market Changes**: Regular stakeholder reviews and pivot planning

## Next Steps

After roadmap completion:
1. **Post-Launch Optimization**: Performance monitoring and improvements
2. **Feature Expansion**: User feedback-driven feature development
3. **Scaling**: Infrastructure scaling and optimization
4. **Maintenance**: Regular updates and security patches

---

*This roadmap was generated by Agent OS v1.0 based on detected tech stack and architecture patterns.*
*Last updated: $current_date*"

    echo "$roadmap_content"
}

# Main execution
main() {
    print_info "Agent OS Roadmap Generator v1.0"
    print_info "Project: $PROJECT_PATH"
    print_info "Sprints: $SPRINTS"
    
    if [[ -n "$STACK_FILE" ]]; then
        print_info "Stack file: $STACK_FILE"
    fi
    
    if [[ "$DRY_RUN" == true ]]; then
        print_warning "DRY RUN MODE - No file will be written"
    fi
    
    # Load stack information
    load_stack_info
    
    print_info "Stack: $FRAMEWORK ($LANGUAGE) + $DATABASE + $AUTH_SYSTEM"
    
    if [[ $RED_FLAGS_COUNT -gt 0 ]]; then
        print_warning "Found $RED_FLAGS_COUNT red flags that should be addressed early"
    fi
    
    if [[ $RECOMMENDATIONS_COUNT -gt 0 ]]; then
        print_info "$RECOMMENDATIONS_COUNT recommendations will be incorporated into roadmap"
    fi
    
    # Generate roadmap content
    local roadmap_content
    roadmap_content=$(generate_roadmap)
    
    if [[ "$DRY_RUN" == true ]]; then
        echo "$roadmap_content"
    else
        # Ensure output directory exists
        local output_dir
        output_dir=$(dirname "$PROJECT_PATH/$OUTPUT_FILE")
        mkdir -p "$output_dir"
        
        # Write roadmap to file
        echo "$roadmap_content" > "$PROJECT_PATH/$OUTPUT_FILE"
        
        print_success "Development roadmap created: $PROJECT_PATH/$OUTPUT_FILE"
        print_info "Roadmap includes:"
        echo "  - $SPRINTS sprints ($(($SPRINTS * 2)) weeks total)"
        echo "  - Tech stack-specific tasks"
        echo "  - Success metrics and risk mitigation"
        echo "  - Phase-based delivery approach"
    fi
}

# Run main function
main "$@"
