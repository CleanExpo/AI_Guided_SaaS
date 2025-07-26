export const architecturePrompts = {
  overview: `As a System Architect, analyze the requirements and define the high-level architecture.

Requirements:
{requirements}

Constraints:
{constraints}

Quality Standards:
{qualityStandards}

Provide:
1. Architecture style (microservices, monolithic, serverless, etc.) with justification
2. Key architectural principles (5-7 principles)
3. Technical constraints and their implications
4. Quality attributes (performance, scalability, security, etc.) with specific requirements
5. High-level architecture diagram description

Format as JSON with structure matching ArchitectureOverview interface.`,

  components: `Design the system components based on the architecture overview and requirements.

Architecture Style: {architectureStyle}
Requirements: {requirements}
User Stories: {userStories}

For each component, define:
1. Unique ID and name
2. Type (frontend, backend, service, database, external)
3. Primary responsibility
4. Technology stack
5. Interfaces it exposes
6. Dependencies on other components
7. Scalability approach

Consider:
- Separation of concerns
- Single responsibility principle
- Loose coupling
- High cohesion
- Reusability

Format as JSON array of Component objects.`,

  dataModel: `Design the data model for the system.

Components: {components}
Requirements: {requirements}

Define:
1. Core entities with attributes
2. Relationships between entities
3. Data flow between components
4. Storage strategy (SQL, NoSQL, hybrid)
5. Caching strategy
6. File storage needs

Consider:
- Data consistency requirements
- Performance needs
- Scalability requirements
- Compliance and privacy

Format as JSON matching DataModel interface.`,

  apiDesign: `Design the API architecture for the system.

Components: {components}
Data Model: {dataModel}

Define:
1. API style (REST, GraphQL, gRPC, etc.)
2. Versioning strategy
3. Authentication and authorization approach
4. Rate limiting strategy
5. Key endpoints with request/response formats
6. Error handling standards
7. Documentation approach

Consider:
- API consistency
- Developer experience
- Performance
- Security
- Backward compatibility

Format as JSON matching APIDesign interface.`,

  infrastructure: `Plan the infrastructure for the system.

Components: {components}
Architecture Overview: {overview}
Timeline: {timeline}

Define:
1. Cloud provider selection with justification
2. Required cloud services
3. Networking configuration
4. Monitoring and observability setup
5. Backup and disaster recovery strategy

Consider:
- Cost optimization
- Scalability requirements
- Geographic distribution
- Compliance requirements
- Performance needs

Format as JSON matching Infrastructure interface.`,

  security: `Design the security architecture.

Components: {components}
Infrastructure: {infrastructure}
API Design: {apiDesign}

Define:
1. Authentication method
2. Authorization model
3. Data encryption strategy
4. Secrets management
5. Compliance requirements
6. Security headers
7. Vulnerability scanning approach

Consider:
- OWASP Top 10
- Zero trust principles
- Defense in depth
- Least privilege
- Compliance requirements

Format as JSON matching SecurityArchitecture interface.`,

  deployment: `Define the deployment strategy.

Infrastructure: {infrastructure}
Components: {components}
Timeline: {timeline}

Define:
1. Deployment type (rolling, blue-green, canary)
2. Environment configuration
3. CI/CD pipeline design
4. Rollback strategy
5. Scaling approach

Consider:
- Zero-downtime deployments
- Risk mitigation
- Automation
- Monitoring during deployment
- Cost efficiency

Format as JSON matching DeploymentStrategy interface.`
};