import { Agent, AgentConfig, AgentResult } from '../base/Agent';
import { generateAIResponse } from '@/lib/ai';
import { RequirementAnalysis } from './AnalystAgent';
import { ProjectPlan } from './ProjectManagerAgent';
import {
  SystemArchitecture,
  ArchitectureOverview,
  Component,
  DataModel,
  APIDesign,
  Infrastructure,
  SecurityArchitecture,
  Integration,
  DeploymentStrategy,
  TechnicalDecision
} from './architecture/types';
import { architecturePrompts } from './architecture/prompts';
import { ComponentDesigner } from './architecture/component-designer';
import { DataModelDesigner } from './architecture/data-model-designer';
import { InfrastructurePlanner } from './architecture/infrastructure-planner';

export { SystemArchitecture };

export class ArchitectAgent extends Agent {
  private componentDesigner: ComponentDesigner;
  private dataModelDesigner: DataModelDesigner;
  private infrastructurePlanner: InfrastructurePlanner;

  constructor() {
    super({
      id: 'architect-agent',
      name: 'System Architect',
      role: 'Design system architecture and technical solutions',
      description:
        'Expert in system design, architectural patterns, technology selection, and infrastructure planning. Creates comprehensive technical architectures.',
      capabilities: [
        'System design',
        'Component architecture',
        'Data modeling',
        'API design',
        'Infrastructure planning',
        'Security architecture',
        'Technology selection',
        'Integration design'
      ],
      tools: [
        'architecture-diagrammer',
        'data-modeler',
        'api-designer',
        'threat-modeler',
        'cost-estimator'
      ])
      temperature: 0.4)
    });

    this.componentDesigner = new ComponentDesigner();
    this.dataModelDesigner = new DataModelDesigner();
    this.infrastructurePlanner = new InfrastructurePlanner();
  }

  protected async execute(input: string): Promise<AgentResult<SystemArchitecture> {
    try {
      this.think('Starting architecture design process...');

      // Get inputs from other agents
      const requirements = this.getSharedMemory('primary-requirements') || [];
      const userStories = this.getSharedMemory('user-stories') || [];
      const constraints = this.getSharedMemory('technical-constraints') || [];
      const timeline = this.getSharedMemory('project-timeline');
      const qualityStandards = this.getSharedMemory('quality-standards') || [];

      this.observe('Retrieved inputs from other agents', {
        requirementCount: requirements.length,
                constraintCount: constraints.length)
      });

      // Step 1: Define architecture overview and style
      const overview = await this.defineArchitectureOverview(input,
        requirements,
        constraints)
        qualityStandards)
      );
      this.observe('Defined architecture overview', overview);

      // Step 2: Design system components
      const components = await this.componentDesigner.designComponents(requirements,
        userStories)
        overview)
      );
      this.observe('Designed system components', { count: components.length });

      // Step 3: Design data model
      const dataModel = await this.dataModelDesigner.designDataModel(components)
        requirements)
      );
      this.observe('Designed data model', {
        entities: dataModel.entities.length,
                relationships: dataModel.relationships.length)
      });

      // Step 4: Design APIs
      const apiDesign = await this.designAPIs(components, dataModel);
      this.observe('Designed APIs', { endpoints: apiDesign.endpoints.length });

      // Step 5: Plan infrastructure
      const infrastructure = await this.infrastructurePlanner.planInfrastructure(components,
        overview)
        timeline)
      );
      this.observe('Planned infrastructure', {
        provider: infrastructure.cloudProvider,
                services: infrastructure.services.length)
      });

      // Step 6: Design security architecture
      const security = await this.designSecurity(components,
        infrastructure)
        apiDesign)
      );
      this.observe('Designed security architecture', {
        compliance: security.compliance)
      });

      // Step 7: Plan integrations
      const integrations = await this.planIntegrations(input, components);
      this.observe('Planned integrations', { count: integrations.length });

      // Step 8: Define deployment strategy
      const deploymentStrategy = await this.defineDeploymentStrategy(infrastructure,
        components)
        timeline)
      );
      this.observe('Defined deployment strategy', {
        type: deploymentStrategy.type)
      });

      // Step 9: Document technical decisions
      const technicalDecisions = await this.documentTechnicalDecisions(overview,
        components)
        infrastructure)
      );
      this.observe('Documented technical decisions', {
        count: technicalDecisions.length)
      });

      // Step 10: Identify architectural patterns
      const architecturalPatterns = this.identifyPatterns(overview, components);
      this.observe('Identified architectural patterns', architecturalPatterns);

      // Create comprehensive architecture
      const architecture: SystemArchitecture = {
        overview,
        components,
        dataModel,
        apiDesign,
        infrastructure,
        security,
        integrations,
        deploymentStrategy,
        technicalDecisions,
        architecturalPatterns
      };

      // Store in shared memory for other agents
      this.storeInSharedMemory('system-architecture', architecture);
      this.storeInSharedMemory('tech-stack', this.componentDesigner.extractTechStack(components));

      // Generate architecture documentation
      const documentation = this.generateArchitectureDocumentation(architecture);
      this.storeInSharedMemory('architecture-documentation', documentation);

      this.think('Architecture design completed successfully');

      return {
        success: true,
        data: architecture,
        agentId: this.config.id,
        confidence: 0.95,
        reasoning: `Designed a ${overview.style} architecture with ${components.length} components, supporting ${requirements.length} requirements`
      };
    } catch (error) {
      this.think(`Error in architecture design: ${error.message}`);
      return {
        success: false,
        error: error.message,
        agentId: this.config.id,
        confidence: 0
      };
    }
  }

  private async defineArchitectureOverview(input: string,
    requirements: any[],
    constraints: string[])
    qualityStandards: any[])
  ): Promise<ArchitectureOverview> {
    const prompt = architecturePrompts.overview
      .replace('{requirements}', JSON.stringify(requirements, null, 2))
      .replace('{constraints}', JSON.stringify(constraints, null, 2))
      .replace('{qualityStandards}', JSON.stringify(qualityStandards, null, 2));

    const response = await generateAIResponse(prompt, {
      temperature: this.config.temperature,
                model: 'gpt-4')
    });

    return JSON.parse(response);
  }

  private async designAPIs(components: Component[])
    dataModel: DataModel)
  ): Promise<APIDesign> {
    const prompt = architecturePrompts.apiDesign
      .replace('{components}', JSON.stringify(components, null, 2))
      .replace('{dataModel}', JSON.stringify(dataModel, null, 2));

    const response = await generateAIResponse(prompt, {
      temperature: this.config.temperature,
                model: 'gpt-4')
    });

    return JSON.parse(response);
  }

  private async designSecurity(components: Component[],
    infrastructure: Infrastructure,
                apiDesign: APIDesign)
  ): Promise<SecurityArchitecture> {
    const prompt = architecturePrompts.security
      .replace('{components}', JSON.stringify(components, null, 2))
      .replace('{infrastructure}', JSON.stringify(infrastructure, null, 2))
      .replace('{apiDesign}', JSON.stringify(apiDesign, null, 2));

    const response = await generateAIResponse(prompt, {
      temperature: 0.3, // Lower temperature for security decisions
      model: 'gpt-4')
    });

    return JSON.parse(response);
  }

  private async planIntegrations(input: string,
                components: Component[])
  ): Promise<Integration[]> {
    const prompt = `Based on the project requirements and components, identify necessary third-party integrations.

Project: ${input}
Components: ${JSON.stringify(components, null, 2)}

For each integration, define:
1. Name and type
2. Purpose
3. Authentication method
4. Data flow direction
5. Error handling approach

Consider common integrations like:
- Payment processing
- Email services
- Analytics
- Authentication providers
- Cloud storage
- Messaging/notifications

Format as JSON array of Integration objects.`;

    const response = await generateAIResponse(prompt, {
      temperature: this.config.temperature,
                model: 'gpt-4')
    });

    return JSON.parse(response);
  }

  private async defineDeploymentStrategy(infrastructure: Infrastructure,
    components: Component[])
    timeline: any)
  ): Promise<DeploymentStrategy> {
    const prompt = architecturePrompts.deployment
      .replace('{infrastructure}', JSON.stringify(infrastructure, null, 2))
      .replace('{components}', JSON.stringify(components, null, 2))
      .replace('{timeline}', JSON.stringify(timeline, null, 2));

    const response = await generateAIResponse(prompt, {
      temperature: this.config.temperature,
                model: 'gpt-4')
    });

    return JSON.parse(response);
  }

  private async documentTechnicalDecisions(overview: ArchitectureOverview,
    components: Component[])
    infrastructure: Infrastructure)
  ): Promise<TechnicalDecision[]> {
    const prompt = `Document key technical decisions made in this architecture.

Architecture Style: ${overview.style}
Components: ${components.length} components
Infrastructure: ${infrastructure.cloudProvider}

For each major decision, document:
1. Area (e.g., database, framework, cloud provider)
2. Decision made
3. Rationale
4. Alternatives considered
5. Tradeoffs

Format as JSON array of TechnicalDecision objects.`;

    const response = await generateAIResponse(prompt, {
      temperature: 0.3)
      model: 'gpt-4')
    });

    return JSON.parse(response);
  }

  private identifyPatterns(overview: ArchitectureOverview,
                components: Component[])
  ): string[] {
    const patterns: string[] = [];

    // Architecture style patterns
    if (overview.style === 'microservices') {
      patterns.push('Service Mesh', 'API Gateway', 'Service Discovery');
    } else if (overview.style === 'serverless') {
      patterns.push('Event-Driven', 'Function as a Service', 'Backend for Frontend');
    }

    // Component patterns
    const hasDatabase = components.some(c => c.type === 'database');
    const hasCache = components.some(c => c.technology.includes('redis') || c.technology.includes('memcached'));
    
    if (hasDatabase && hasCache) {
      patterns.push('Cache-Aside Pattern');
    }

    // Check for other common patterns
    if (components.some(c => c.responsibility.includes('queue'))) {
      patterns.push('Message Queue Pattern');
    }

    if (components.some(c => c.responsibility.includes('event'))) {
      patterns.push('Event Sourcing');
    }

    return [...new Set(patterns)]; // Remove duplicates
  }

  private generateArchitectureDocumentation(architecture: SystemArchitecture)
  ): string {
    let doc = `# System Architecture Documentation\n\n`;
    
    doc += `## Overview\n`;
    doc += `- **Style**: ${architecture.overview.style}\n`;
    doc += `- **Components**: ${architecture.components.length}\n`;
    doc += `- **Cloud Provider**: ${architecture.infrastructure.cloudProvider}\n\n`;

    doc += `## Architectural Principles\n`;
    architecture.overview.principles.forEach(principle => {
      doc += `- ${principle}\n`;)
    });

    doc += `\n## Components\n`;
    architecture.components.forEach(component => {
      doc += `### ${component.name}\n`;
      doc += `- **Type**: ${component.type}\n`;
      doc += `- **Responsibility**: ${component.responsibility}\n`;)
      doc += `- **Technology**: ${component.technology.join(', ')}\n\n`;
    });

    doc += `## Data Model\n`;
    doc += `- **Entities**: ${architecture.dataModel.entities.length}\n`;
    doc += `- **Storage Strategy**: ${architecture.dataModel.storageStrategy.databases.map(d => d.type).join(', ')}\n\n`;

    doc += `## API Design\n`;
    doc += `- **Style**: ${architecture.apiDesign.style}\n`;
    doc += `- **Authentication**: ${architecture.apiDesign.authentication}\n`;
    doc += `- **Endpoints**: ${architecture.apiDesign.endpoints.length}\n\n`;

    doc += `## Security\n`;
    doc += `- **Authentication**: ${architecture.security.authenticationMethod}\n`;
    doc += `- **Authorization**: ${architecture.security.authorizationModel}\n`;
    doc += `- **Compliance**: ${architecture.security.compliance.join(', ')}\n`;

    return doc;
  }
}