# Tech Stack Recommendation Workflow

## Purpose
Analyze product requirements and recommend optimal technology stack for new projects or greenfield development.

## Prerequisites
- Product brief or requirements document
- Target deployment environment known
- Performance and scale requirements defined
- Team expertise and constraints identified

## Workflow Steps

### 1. Requirements Analysis
Parse the product brief to extract key capability requirements:

#### Core Capabilities Analysis
Create a capabilities matrix from the product description:

```
Capability Category | Required Features | Priority | Complexity
--------------------|-------------------|----------|----------
User Management     | Registration, profiles, roles | High | Medium
Data Processing     | CRUD, search, analytics | High | High
Real-time Features  | Live updates, notifications | Medium | High
Authentication      | OAuth, SSO, 2FA | High | Medium
Payment Processing  | Subscriptions, one-time | High | Medium
API Integration     | Third-party services | Medium | Low
Mobile Support      | Responsive, PWA, native | High | Medium
Scalability        | Auto-scaling, CDN | Medium | High
Compliance         | GDPR, SOC2, HIPAA | High | High
```

#### Scale and Performance Requirements
Extract performance targets:
- **Expected Users**: Concurrent users, daily active users, growth projections
- **Data Volume**: Records, storage needs, backup requirements
- **Performance**: Response times, uptime SLA, geographic distribution
- **Budget**: Development budget, operational costs, timeline constraints

### 2. Constraint Assessment
Identify technical and business constraints:

#### Team Constraints
```bash
# Document team expertise
Team Skill Matrix:
- Frontend: React (Advanced), Vue (Basic), Angular (None)
- Backend: Node.js (Advanced), Python (Intermediate), Java (Basic)
- Database: PostgreSQL (Advanced), MongoDB (Intermediate)
- DevOps: AWS (Basic), Vercel (Advanced), Docker (Basic)
- Mobile: React Native (Basic), Flutter (None)
```

#### Infrastructure Constraints
- **Cloud Preference**: AWS, Azure, GCP, hybrid, on-premises
- **Compliance Requirements**: SOC2, HIPAA, PCI-DSS, GDPR
- **Budget Limitations**: Development, hosting, third-party services
- **Timeline**: Launch deadline, MVP requirements, iterative releases

### 3. Stack Component Selection
Map requirements to recommended components using compatibility rules:

#### Runtime & Language Selection
```typescript
// Selection criteria
interface RuntimeCriteria {
  performance: 'high' | 'medium' | 'low';
  teamExpertise: 'advanced' | 'intermediate' | 'basic';
  ecosystem: 'mature' | 'growing' | 'emerging';
  scalability: 'horizontal' | 'vertical' | 'both';
}

const runtimeRecommendations = {
  'high-performance + advanced-team': 'Node.js with TypeScript',
  'rapid-prototyping + basic-team': 'Node.js with JavaScript',
  'data-heavy + advanced-team': 'Python with FastAPI',
  'enterprise + java-team': 'Java with Spring Boot',
  'microservices + go-team': 'Go with Gin/Fiber'
};
```

#### Framework Selection Matrix
```
Requirements | Best Choice | Alternative | Avoid
-------------|-------------|-------------|-------
SPA + SEO | Next.js | Nuxt.js | Create React App
Static Site | Next.js + SSG | Gatsby | WordPress
Dashboard | React + Vite | Vue + Nuxt | jQuery + Bootstrap
E-commerce | Next.js + Commerce | Shopify + Liquid | Custom PHP
Blog/CMS | Next.js + Contentful | WordPress + Headless | Joomla
Real-time App | Next.js + Socket.io | SvelteKit + WebSockets | PHP + polling
```

#### Database Selection Logic
```
Data Type | Volume | Consistency | Recommended | Alternative
----------|---------|-------------|-------------|-------------
Relational | < 10M records | Strong | PostgreSQL + Prisma | MySQL + TypeORM
Document | Variable | Eventual | MongoDB + Mongoose | PostgreSQL + JSONB
Key-Value | High frequency | Eventual | Redis + Node | Memcached
Analytics | Big data | Eventual | BigQuery + dbt | PostgreSQL + TimescaleDB
Search | Text heavy | Eventual | Elasticsearch | PostgreSQL + Full-text
Graph | Connected data | Strong | Neo4j | PostgreSQL + Graph extensions
```

### 4. Generate Stack Proposal
Create comprehensive stack recommendation:

#### Primary Stack Recommendation
```json
{
  "recommendation": "high-confidence",
  "stack": {
    "runtime": {
      "language": "typescript",
      "version": "5.x",
      "environment": "node",
      "rationale": "Team expertise + type safety + ecosystem maturity"
    },
    "webFramework": {
      "name": "next",
      "version": "14.x",
      "type": "meta-framework",
      "rationale": "SSR + SEO + Vercel deployment + React ecosystem"
    },
    "database": {
      "primary": "postgresql",
      "version": "15.x",
      "orm": "prisma",
      "rationale": "ACID compliance + JSON support + excellent TypeScript integration"
    },
    "auth": {
      "system": "nextauth",
      "providers": ["google", "github", "credentials"],
      "rationale": "Next.js native + multiple providers + good DX"
    },
    "styling": {
      "system": "tailwind",
      "version": "3.x",
      "components": "shadcn-ui",
      "rationale": "Utility-first + component library + design system ready"
    },
    "stateManagement": {
      "client": "zustand",
      "server": "react-query",
      "rationale": "Simple client state + excellent server state caching"
    },
    "testing": {
      "unit": "jest",
      "integration": "testing-library",
      "e2e": "playwright",
      "rationale": "Industry standard + React focus + fast E2E"
    },
    "deployment": {
      "platform": "vercel",
      "type": "serverless",
      "rationale": "Next.js optimized + edge functions + excellent DX"
    }
  },
  "confidence": 92,
  "rationale": "High team expertise alignment with proven production stack"
}
```

#### Alternative Stack Options
```json
{
  "alternatives": [
    {
      "name": "Performance Optimized",
      "changes": {
        "webFramework": "react + vite",
        "deployment": "aws + docker"
      },
      "tradeoffs": "Better performance, more complex deployment",
      "confidence": 78
    },
    {
      "name": "Cost Optimized",
      "changes": {
        "database": "mongodb-atlas",
        "deployment": "netlify"
      },
      "tradeoffs": "Lower hosting costs, less SQL expertise needed",
      "confidence": 84
    }
  ]
}
```

### 5. Risk and Compatibility Analysis
Assess potential issues and compatibility:

#### Technology Risk Assessment
```
Component | Maturity Risk | Learning Curve | Vendor Lock-in | Community Support
----------|---------------|----------------|----------------|------------------
Next.js | Low | Medium | Medium (Vercel) | High
TypeScript | Low | Medium | None | High
PostgreSQL | Low | Low | None | High
Prisma | Medium | Medium | Medium | High
Tailwind | Low | Low | None | High
Vercel | Low | Low | High | Medium
```

#### Compatibility Verification
```bash
# Check version compatibility
npm info next@latest peerDependencies
npm info @types/react versions --json | jq '.[-5:]'

# Verify platform support
curl -s https://api.vercel.com/v1/platforms | jq '.node.versions'
```

### 6. Create Stack Proposal Document
Generate formal recommendation document:

```markdown
# Tech Stack Recommendation: [Project Name]

## Executive Summary
Based on analysis of project requirements and team constraints, we recommend a **Next.js + TypeScript + PostgreSQL** stack with **92% confidence**.

## Requirements Alignment
- ✅ **Scalability**: Next.js serverless + Vercel edge network
- ✅ **Performance**: SSR + static generation + optimized images
- ✅ **SEO**: Built-in SEO optimization + meta tags
- ✅ **Team Skills**: Leverages existing React + Node.js expertise
- ✅ **Development Speed**: Excellent developer experience + tooling
- ✅ **Maintenance**: Strong typing + testing framework + documentation

## Recommended Architecture

### Core Stack
- **Runtime**: Node.js 20+ with TypeScript 5
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL 15 + Prisma ORM
- **Authentication**: NextAuth.js with OAuth providers
- **Styling**: Tailwind CSS 3 + shadcn/ui components
- **Deployment**: Vercel serverless platform

### Supporting Tools
- **State Management**: Zustand + TanStack Query
- **Testing**: Jest + Testing Library + Playwright
- **Code Quality**: ESLint + Prettier + Husky
- **Monitoring**: Vercel Analytics + Sentry error tracking

## Cost Analysis
- **Development**: $0 (open source tools)
- **Hosting**: ~$20/month (Vercel Pro) + $25/month (database)
- **Third-party**: ~$50/month (auth + monitoring services)
- **Total Monthly**: ~$95/month estimated

## Implementation Roadmap
1. **Week 1-2**: Setup + authentication + basic UI
2. **Week 3-4**: Database schema + core features
3. **Week 5-6**: Advanced features + testing
4. **Week 7-8**: Optimization + deployment

## Risk Mitigation
- **Vercel Lock-in**: Deployable to other Node.js platforms
- **Learning Curve**: Team training on TypeScript best practices
- **Scaling**: Database migration path to managed services
```

### 7. Generate stack.json File
Create machine-readable stack file for automation:

```bash
# Generate proposed stack JSON
cat > stack-proposal.json << EOF
{
  "runtime": {
    "language": "typescript",
    "version": ">=20.0.0",
    "environment": "node",
    "confidence": 95
  },
  "webFramework": {
    "name": "next",
    "version": "^14.0.0",
    "type": "meta-framework",
    "confidence": 92
  },
  "database": {
    "primary": "postgresql",
    "orm": "prisma",
    "confidence": 88
  },
  "auth": {
    "system": "nextauth",
    "confidence": 90
  },
  "styling": {
    "system": "tailwind",
    "confidence": 94
  },
  "testing": {
    "unit": "jest",
    "integration": "testing-library",
    "e2e": "playwright",
    "confidence": 87
  },
  "deployment": {
    "platform": "vercel",
    "type": "serverless",
    "confidence": 90
  },
  "detectedComponents": [],
  "redFlags": [],
  "recommendations": [
    "Implement TypeScript strict mode for better type safety",
    "Set up automated testing pipeline from day one",
    "Configure proper environment management for secrets",
    "Plan for database migration strategy early"
  ],
  "confidence": 92
}
EOF
```

## Decision Framework

### High Confidence (90%+)
- ✅ **Proceed**: Start implementation immediately
- ✅ **Commit**: Full team alignment and resource allocation

### Medium Confidence (75-89%)
- ⚠️ **Validate**: Prototype key components first
- ⚠️ **Plan B**: Identify alternative stack options

### Low Confidence (<75%)
- ❌ **Research**: Need more requirements analysis
- ❌ **Consult**: Bring in domain experts or conduct spike solutions

## Output Artifacts

### Required Files
- `stack-proposal.json` - Machine-readable stack definition
- `docs/stack-recommendation.md` - Human-readable justification
- `docs/implementation-plan.md` - Development roadmap

### Optional Files
- `docs/alternatives-analysis.md` - Alternative stack comparisons
- `docs/cost-benefit-analysis.md` - Financial projections
- `docs/risk-assessment.md` - Risk mitigation strategies

## Integration Points

### Next Steps After Stack Recommendation
1. **Generate Structure**: Use `generate-project-structure.md` workflow
2. **Create Roadmap**: Use `create-development-roadmap.md` workflow
3. **Begin Implementation**: Follow recommended development sequence

### AI Assistant Integration
This workflow should be triggered by:
- `/recommend-tech-stack` command with product brief
- New project setup requests
- Architecture review for greenfield projects
- Technology selection consultations

## Quality Assurance

### Recommendation Validation Checklist
- [ ] **Requirements Coverage**: All key capabilities addressed
- [ ] **Team Alignment**: Stack matches team expertise levels
- [ ] **Budget Fit**: Costs align with project budget
- [ ] **Timeline Realistic**: Implementation timeframe achievable
- [ ] **Scalability Path**: Growth strategy defined
- [ ] **Risk Assessment**: Major risks identified and mitigated
- [ ] **Alternatives Considered**: Multiple options evaluated
- [ ] **Documentation Complete**: All artifacts generated

This workflow ensures data-driven, comprehensive technology stack recommendations that balance requirements, constraints, and best practices.
