# Development Roadmap Creation Workflow

## Purpose
Generate comprehensive development roadmaps with sprint planning, tech stack-specific tasks, and success metrics based on detected or proposed technology stack.

## Prerequisites
- Tech stack analysis completed (stack.json available)
- Project requirements understood
- Timeline constraints identified
- Agent OS create_roadmap.sh script available

## Workflow Steps

### 1. Roadmap Scope Definition
Define the roadmap parameters and constraints:

```bash
# Review available stack information
if [ -f "reports/stack.json" ]; then
    echo "📊 Stack analysis available"
    cat reports/stack.json | jq '{
        framework: .webFramework.name,
        language: .runtime.language,
        database: .database.primary,
        confidence: .confidence,
        redFlags: (.redFlags | length),
        recommendations: (.recommendations | length)
    }'
else
    echo "⚠️ No stack analysis - generic roadmap will be created"
fi

# Define project parameters
echo "📋 Project Scope Definition:"
echo "- Project Type: [SaaS/Dashboard/E-commerce/Blog/etc.]"
echo "- Team Size: [1-2/3-5/5+] developers"
echo "- Timeline: [MVP in X weeks/Full launch in Y months]"
echo "- Complexity: [Low/Medium/High]"
echo "- Budget Constraints: [Startup/Growth/Enterprise]"
```

#### Timeline and Sprint Configuration
```bash
# Standard configurations based on project type
PROJECT_TYPES=(
    "mvp:8:2"           # MVP: 8 sprints of 2 weeks each
    "saas:12:2"         # SaaS: 12 sprints of 2 weeks each  
    "enterprise:16:3"   # Enterprise: 16 sprints of 3 weeks each
    "dashboard:6:2"     # Dashboard: 6 sprints of 2 weeks each
    "ecommerce:14:2"    # E-commerce: 14 sprints of 2 weeks each
)

# Calculate timeline based on project type
calculate_timeline() {
    local project_type=$1
    case "$project_type" in
        "mvp") echo "8 sprints, 16 weeks total (4 months)" ;;
        "saas") echo "12 sprints, 24 weeks total (6 months)" ;;
        "enterprise") echo "16 sprints, 48 weeks total (12 months)" ;;
        "dashboard") echo "6 sprints, 12 weeks total (3 months)" ;;
        "ecommerce") echo "14 sprints, 28 weeks total (7 months)" ;;
        *) echo "12 sprints, 24 weeks total (6 months - default)" ;;
    esac
}
```

### 2. Stack-Specific Task Analysis
Extract framework and technology-specific requirements:

#### Framework Task Mapping
```bash
# Generate framework-specific task breakdown
analyze_framework_tasks() {
    local framework=$1
    local complexity=$2
    
    case "$framework" in
        "next")
            echo "Next.js Tasks:"
            echo "- App Router setup and configuration"
            echo "- Server-side rendering optimization"
            echo "- API routes implementation"
            echo "- Image optimization setup"
            echo "- Middleware configuration"
            ;;
        "react")
            echo "React SPA Tasks:"
            echo "- Client-side routing setup"
            echo "- State management implementation"
            echo "- Code splitting configuration"
            echo "- Bundle optimization"
            echo "- Error boundary implementation"
            ;;
        "vue"|"nuxt")
            echo "Vue.js Tasks:"
            echo "- Vue Router configuration"
            echo "- Vuex/Pinia state management"
            echo "- Component composition API"
            echo "- Build optimization"
            echo "- SSR/SSG configuration"
            ;;
    esac
}
```

#### Database Integration Tasks
```bash
analyze_database_tasks() {
    local database=$1
    local orm=$2
    
    echo "Database Tasks ($database + $orm):"
    
    case "$database" in
        "postgresql"|"supabase")
            echo "- Database schema design and creation"
            echo "- Migration system setup"
            echo "- Connection pooling configuration"
            echo "- Row-level security (if Supabase)"
            echo "- Backup and recovery procedures"
            ;;
        "mongodb")
            echo "- Document schema design"
            echo "- Index strategy implementation"
            echo "- Aggregation pipeline setup"
            echo "- Replica set configuration"
            echo "- Data validation rules"
            ;;
        "redis")
            echo "- Cache strategy implementation"
            echo "- Session storage configuration"
            echo "- Pub/sub messaging setup"
            echo "- Data persistence tuning"
            echo "- Memory optimization"
            ;;
    esac
}
```

### 3. Generate Roadmap Structure
Execute the roadmap creation script with appropriate parameters:

#### Basic Roadmap Generation
```bash
# Generate roadmap with existing stack analysis
./.agent-os/scripts/create_roadmap.sh --stack reports/stack.json

# Generate roadmap with custom sprint count
./.agent-os/scripts/create_roadmap.sh --stack reports/stack.json --sprints 8

# Generate roadmap for specific project type
./.agent-os/scripts/create_roadmap.sh \
    --stack reports/stack.json \
    --sprints 12 \
    --output docs/development-roadmap.md
```

#### Advanced Roadmap Options
```bash
# Dry run to preview roadmap content
./.agent-os/scripts/create_roadmap.sh --dry-run --stack reports/stack.json

# Custom project path and output location
./.agent-os/scripts/create_roadmap.sh \
    --project-path ./enterprise-project \
    --stack ./enterprise-stack.json \
    --output PROJECT_ROADMAP.md \
    --sprints 16

# MVP-focused short roadmap
./.agent-os/scripts/create_roadmap.sh \
    --stack reports/stack.json \
    --sprints 6 \
    --output docs/mvp-roadmap.md
```

### 4. Roadmap Customization and Enhancement
Tailor the generated roadmap to specific project needs:

#### Risk Assessment Integration
```bash
# Analyze red flags from stack analysis
if [ -f "reports/stack.json" ]; then
    RED_FLAGS=$(cat reports/stack.json | jq '.redFlags | length')
    if [ "$RED_FLAGS" -gt 0 ]; then
        echo "⚠️ Found $RED_FLAGS red flags to address in roadmap"
        
        # Extract critical issues for Sprint 1
        cat reports/stack.json | jq -r '.redFlags[] | 
            select(.severity == "critical") | 
            "- CRITICAL: \(.issue) - \(.solution)"'
        
        # Extract high priority issues for Sprint 2-3
        cat reports/stack.json | jq -r '.redFlags[] | 
            select(.severity == "high") | 
            "- HIGH: \(.issue) - \(.solution)"'
    fi
fi
```

#### Recommendation Integration
```bash
# Incorporate stack recommendations into roadmap
if [ -f "reports/stack.json" ]; then
    RECOMMENDATIONS=$(cat reports/stack.json | jq '.recommendations | length')
    if [ "$RECOMMENDATIONS" -gt 0 ]; then
        echo "💡 Incorporating $RECOMMENDATIONS recommendations"
        
        # Add recommendations to appropriate sprints
        cat reports/stack.json | jq -r '.recommendations[]' | while read rec; do
            echo "  📋 Recommendation: $rec"
        done
    fi
fi
```

#### Team and Resource Planning
```bash
# Calculate resource requirements based on stack complexity
calculate_resources() {
    local framework=$1
    local database=$2
    local team_size=$3
    
    echo "Resource Planning:"
    echo "- Frontend Developers: $([ "$framework" = "next" ] && echo "2-3" || echo "1-2")"
    echo "- Backend Developers: $([ "$database" != "none" ] && echo "1-2" || echo "1")"
    echo "- DevOps Engineers: $([ "$team_size" -gt 3 ] && echo "1" || echo "0.5")"
    echo "- UI/UX Designers: 1"
    echo "- QA Engineers: $([ "$team_size" -gt 5 ] && echo "1" || echo "0.5")"
}
```

### 5. Sprint Planning and Task Breakdown
Create detailed sprint plans with specific deliverables:

#### Sprint Template Structure
```markdown
### Sprint X: [Sprint Name] ([Start Date] - [End Date])
**Goal**: [Clear sprint objective]

**Stack Focus**: [Relevant technologies for this sprint]

**Tasks**:
- [ ] **[Category]**: Specific task with acceptance criteria
  - Acceptance Criteria: Clear, testable requirements
  - Dependencies: List of blockers or prerequisites
  - Estimated Effort: Story points or hours
  - Assigned Team Members: Role assignments

**Deliverables**:
- [ ] **[Deliverable 1]**: Description and success metrics
- [ ] **[Deliverable 2]**: Description and success metrics

**Definition of Done**:
- [ ] Code reviewed and merged
- [ ] Tests written and passing (≥80% coverage)
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] Stakeholder approval received

**Risks and Mitigations**:
- **Risk**: Potential issue description
  - **Likelihood**: Low/Medium/High
  - **Impact**: Low/Medium/High  
  - **Mitigation**: Action plan to address risk

**Success Metrics**:
- Technical: Performance benchmarks, code quality metrics
- Business: User engagement, feature adoption rates
```

#### Example Sprint Breakdown
```bash
# Generate detailed sprint breakdown
create_sprint_breakdown() {
    local sprint_number=$1
    local framework=$2
    local focus_area=$3
    
    case "$sprint_number" in
        1)
            echo "Sprint 1: Foundation & Setup"
            echo "Focus: Development environment, CI/CD, basic architecture"
            echo "Key deliverables:"
            echo "- Development environment fully configured"
            echo "- CI/CD pipeline operational"
            echo "- Basic $framework structure implemented"
            echo "- Team onboarded and productive"
            ;;
        2)
            echo "Sprint 2: Core Architecture"
            echo "Focus: Database setup, authentication, basic CRUD"
            echo "Key deliverables:"
            echo "- Database schema implemented and tested"
            echo "- Authentication system functional"
            echo "- Basic user management working"
            echo "- API foundation established"
            ;;
    esac
}
```

### 6. Success Metrics and KPI Definition
Define measurable success criteria for each phase:

#### Technical Metrics
```bash
# Define technical KPIs based on stack
define_technical_metrics() {
    local framework=$1
    local database=$2
    
    echo "Technical Success Metrics:"
    
    # Performance metrics
    echo "Performance:"
    echo "- Page load time: < 2 seconds (P95)"
    echo "- API response time: < 200ms (P95)"
    echo "- Time to First Byte: < 500ms"
    
    # Quality metrics
    echo "Code Quality:"
    echo "- Test coverage: ≥ 80%"
    echo "- TypeScript coverage: ≥ 95%"
    echo "- ESLint errors: 0"
    echo "- Security vulnerabilities: 0 critical, 0 high"
    
    # Framework-specific metrics
    case "$framework" in
        "next")
            echo "Next.js Specific:"
            echo "- Lighthouse Performance Score: ≥ 90"
            echo "- Core Web Vitals: All green"
            echo "- Bundle size: < 500KB"
            ;;
        "react")
            echo "React Specific:"
            echo "- Component render time: < 16ms"
            echo "- Memory usage: < 50MB"
            echo "- Bundle size: < 1MB"
            ;;
    esac
    
    # Database-specific metrics
    case "$database" in
        "postgresql"|"supabase")
            echo "Database:"
            echo "- Query response time: < 100ms (P95)"
            echo "- Connection pool utilization: < 80%"
            echo "- Database size growth: < 10% per month"
            ;;
    esac
}
```

#### Business Metrics
```bash
define_business_metrics() {
    local project_type=$1
    
    echo "Business Success Metrics:"
    
    case "$project_type" in
        "saas")
            echo "SaaS Metrics:"
            echo "- User onboarding completion: > 70%"
            echo "- Monthly Active Users: Target based on goals"
            echo "- Customer Acquisition Cost: Define target"
            echo "- Monthly Recurring Revenue: Growth target"
            echo "- Churn rate: < 5% monthly"
            ;;
        "ecommerce")
            echo "E-commerce Metrics:"
            echo "- Conversion rate: > 2%"
            echo "- Cart abandonment: < 60%"
            echo "- Average order value: Target amount"
            echo "- Customer lifetime value: Define target"
            ;;
        "dashboard")
            echo "Dashboard Metrics:"
            echo "- Daily active users: Target engagement"
            echo "- Feature adoption: > 60% for core features"
            echo "- User session duration: Target time"
            echo "- Task completion rate: > 80%"
            ;;
    esac
}
```

### 7. Risk Assessment and Mitigation Planning
Identify and plan for potential risks:

#### Technical Risk Analysis
```bash
assess_technical_risks() {
    local stack_confidence=$1
    local team_experience=$2
    
    echo "Technical Risk Assessment:"
    
    # Stack-related risks
    if [ "$stack_confidence" -lt 80 ]; then
        echo "HIGH RISK: Low stack confidence ($stack_confidence%)"
        echo "Mitigation: Conduct proof-of-concept in Sprint 1"
        echo "Mitigation: Identify alternative stack options"
    fi
    
    # Team experience risks
    case "$team_experience" in
        "junior")
            echo "MEDIUM RISK: Junior team experience"
            echo "Mitigation: Pair programming and mentorship"
            echo "Mitigation: Extended testing and review phases"
            ;;
        "mixed")
            echo "LOW RISK: Mixed experience team"
            echo "Mitigation: Knowledge sharing sessions"
            ;;
    esac
    
    # Technology-specific risks
    echo "Technology Risks:"
    echo "- Dependency updates breaking changes"
    echo "- Third-party service outages"
    echo "- Performance bottlenecks under load"
    echo "- Security vulnerabilities"
}
```

#### Project Risk Planning
```bash
assess_project_risks() {
    echo "Project Risk Assessment:"
    echo "- Scope creep: Regular stakeholder reviews"
    echo "- Resource constraints: Flexible sprint planning"
    echo "- Timeline pressure: MVP-first approach"
    echo "- Quality compromise: Non-negotiable quality gates"
    echo "- Technical debt: Regular refactoring sprints"
}
```

### 8. Post-Generation Validation and Refinement
Review and enhance the generated roadmap:

#### Roadmap Quality Check
```bash
# Validate roadmap completeness
validate_roadmap() {
    local roadmap_file=$1
    
    echo "🔍 Validating roadmap quality..."
    
    # Check essential sections exist
    sections=(
        "Project Overview"
        "Sprint Planning"
        "Success Metrics"
        "Risk Mitigation"
        "Implementation Notes"
    )
    
    for section in "${sections[@]}"; do
        if grep -q "$section" "$roadmap_file"; then
            echo "✅ $section section present"
        else
            echo "❌ Missing $section section"
        fi
    done
    
    # Validate sprint structure
    sprint_count=$(grep -c "#### Sprint" "$roadmap_file")
    echo "📊 Found $sprint_count sprints in roadmap"
    
    # Check for stack-specific content
    if grep -q "Next.js\|React\|Vue" "$roadmap_file"; then
        echo "✅ Framework-specific tasks included"
    fi
    
    if grep -q "PostgreSQL\|MongoDB\|Supabase" "$roadmap_file"; then
        echo "✅ Database-specific tasks included"
    fi
}
```

#### Stakeholder Review Preparation
```bash
prepare_stakeholder_review() {
    local roadmap_file=$1
    
    echo "📋 Preparing stakeholder review materials..."
    
    # Create executive summary
    cat > "$(dirname "$roadmap_file")/executive-summary.md" << 'EOF'
# Development Roadmap - Executive Summary

## Timeline Overview
- **Total Duration**: X weeks across Y sprints
- **Key Milestones**: MVP (Week X), Beta (Week Y), Launch (Week Z)
- **Resource Requirements**: Z developers, X designers, Y QA

## Investment Summary
- **Development Cost**: Estimated based on team size and timeline
- **Infrastructure Cost**: Monthly operational expenses
- **Third-party Services**: Integration and service costs
- **Total Investment**: Development + operational costs

## Risk Assessment
- **Technical Risks**: [High/Medium/Low] - [Mitigation strategy]
- **Timeline Risks**: [High/Medium/Low] - [Buffer strategies]
- **Resource Risks**: [High/Medium/Low] - [Contingency plans]

## Success Metrics
- **Technical**: Performance, quality, and reliability targets
- **Business**: User engagement, conversion, and growth metrics
- **Operational**: Team productivity and delivery metrics

## Recommendation
Based on analysis of requirements, team capabilities, and technical constraints, we recommend proceeding with the proposed roadmap with [confidence level] confidence.
EOF
    
    echo "✅ Executive summary created"
}
```

### 9. Continuous Roadmap Management
Set up processes for roadmap maintenance:

#### Progress Tracking Setup
```bash
setup_progress_tracking() {
    echo "📊 Setting up progress tracking..."
    
    # Create progress tracking template
    cat > docs/sprint-progress-template.md << 'EOF'
# Sprint X Progress Report

**Sprint Goal**: [Original sprint objective]
**Sprint Dates**: [Start] - [End]
**Team Members**: [List team members and roles]

## Progress Summary
- **Completed**: X/Y tasks (Z% completion)
- **In Progress**: X tasks
- **Blocked**: X tasks (see blockers section)
- **Added**: X tasks (scope changes)

## Key Achievements
- [ ] **Achievement 1**: Description and impact
- [ ] **Achievement 2**: Description and impact

## Challenges and Blockers
- **Challenge 1**: Description, impact, and resolution plan
- **Challenge 2**: Description, impact, and resolution plan

## Metrics Update
- **Technical Metrics**: Current vs. target values
- **Business Metrics**: Current vs. target values
- **Quality Metrics**: Test coverage, defect rates, etc.

## Next Sprint Planning
- **Carry Over**: Tasks moving to next sprint
- **New Priorities**: Emerging requirements
- **Resource Changes**: Team availability updates
- **Timeline Impact**: Any schedule adjustments needed

## Stakeholder Updates
- **Key Communications**: Important updates for stakeholders
- **Decisions Needed**: Items requiring stakeholder input
- **Risks Escalation**: Issues requiring management attention
EOF
    
    echo "✅ Progress tracking template created"
}
```

#### Roadmap Update Procedures
```bash
setup_roadmap_updates() {
    echo "🔄 Setting up roadmap update procedures..."
    
    # Create roadmap update script
    cat > .agent-os/scripts/update_roadmap.sh << 'EOF'
#!/bin/bash
# Update roadmap based on current progress and new information

ROADMAP_FILE=${1:-"docs/roadmap.md"}
BACKUP_DIR="docs/roadmap-history"

# Create backup
mkdir -p "$BACKUP_DIR"
cp "$ROADMAP_FILE" "$BACKUP_DIR/roadmap-$(date +%Y%m%d-%H%M%S).md"

# Update roadmap with new information
echo "🔄 Updating roadmap with current progress..."

# Re-run roadmap generation with updated stack info
if [ -f "reports/stack.json" ]; then
    ./.agent-os/scripts/create_roadmap.sh \
        --stack reports/stack.json \
        --output "$ROADMAP_FILE"
fi

echo "✅ Roadmap updated and backed up"
EOF
    
    chmod +x .agent-os/scripts/update_roadmap.sh
    echo "✅ Roadmap update script created"
}
```

## Output Artifacts

### Core Roadmap Files
- **`docs/roadmap.md`**: Comprehensive development roadmap
- **`docs/executive-summary.md`**: Stakeholder-focused summary
- **`docs/sprint-progress-template.md`**: Progress tracking template

### Supporting Documentation
- **Risk Assessment**: Detailed risk analysis and mitigation plans
- **Success Metrics**: KPIs and measurement criteria
- **Resource Planning**: Team structure and skill requirements
- **Timeline Analysis**: Critical path and dependency mapping

### Process Files
- **Update Procedures**: Scripts for maintaining roadmap currency
- **Progress Tracking**: Templates for sprint reporting
- **Stakeholder Communication**: Review and approval processes

## Integration Points

### Workflow Dependencies
1. **Stack Analysis**: Requires completed tech stack identification
2. **Architecture Design**: Benefits from project structure definition
3. **Team Planning**: Integrates with resource allocation decisions
4. **Stakeholder Alignment**: Connects to business requirement validation

### Continuous Integration
- **Sprint Reviews**: Regular roadmap validation and updates
- **Progress Tracking**: Automated metrics collection and reporting
- **Risk Monitoring**: Continuous assessment of project health
- **Stakeholder Communication**: Regular updates and decision points

### AI Assistant Integration
This workflow should be triggered by:
- `/create-roadmap` command
- Project planning requests
- Timeline estimation needs
- Sprint planning sessions
- Stakeholder review preparation

## Quality Assurance

### Roadmap Validation Checklist
- [ ] **Completeness**: All project phases covered
- [ ] **Specificity**: Tasks are concrete and actionable
- [ ] **Measurability**: Success criteria are quantifiable
- [ ] **Achievability**: Timeline is realistic given constraints
- [ ] **Relevance**: Tasks align with project objectives
- [ ] **Time-bound**: Clear deadlines and milestones
- [ ] **Risk-aware**: Potential issues identified and planned for
- [ ] **Stakeholder-aligned**: Business requirements addressed

### Success Metrics
- **Roadmap Accuracy**: Actual vs. planned delivery dates
- **Scope Stability**: Changes to original requirements
- **Quality Achievement**: Meeting defined success criteria
- **Stakeholder Satisfaction**: Approval and feedback ratings
- **Team Productivity**: Velocity and delivery consistency

This workflow ensures comprehensive, actionable development roadmaps that provide clear guidance for successful project delivery while maintaining flexibility for adaptation as projects evolve.
