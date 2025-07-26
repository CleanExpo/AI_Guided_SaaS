import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectAnalyzer } from '../analyzers/ProjectAnalyzer.js';

export class RequirementsEngine {
  private projectAnalyzer: ProjectAnalyzer;

  constructor() {
    this.projectAnalyzer = new ProjectAnalyzer();
  }

  async generate(projectPath: string, format: string = 'markdown'): Promise<string> {
    const analysis = await this.projectAnalyzer.analyze(projectPath, 'deep');
    const existingRequirements = await this.findExistingRequirements(projectPath);
    const generatedRequirements = this.generateFromAnalysis(analysis, projectPath);
    const mergedRequirements = this.mergeRequirements(existingRequirements, generatedRequirements);

    switch (format) {
      case 'markdown':
        return this.formatAsMarkdown(mergedRequirements);
      case 'json':
        return JSON.stringify(mergedRequirements, null, 2);
      case 'yaml':
        return this.formatAsYaml(mergedRequirements);
      default:
        return this.formatAsMarkdown(mergedRequirements);
    }
  }

  private async findExistingRequirements(projectPath: string): Promise<any> {
    const possiblePaths = [
      'requirements.md',
      'REQUIREMENTS.md',
      'docs/requirements.md',
      'requirements.txt',
      'requirements.json',
    ];

    for (const reqPath of possiblePaths) {
      try {
        const fullPath = path.join(projectPath, reqPath);
        const content = await fs.readFile(fullPath, 'utf-8');
        return this.parseExistingRequirements(content, reqPath);
      } catch (error) {
        // File doesn't exist, continue
      }
    }

    return null;
  }

  private parseExistingRequirements(content: string, filename: string): any {
    if (filename.endsWith('.json')) {
      return JSON.parse(content);
    }

    // Parse markdown or text format
    const requirements = {
      functional: [],
      nonFunctional: [],
      technical: [],
      constraints: [],
    };

    const lines = content.split('\n');
    let currentSection = 'functional';

    for (const line of lines) {
      if (line.includes('Functional Requirements')) currentSection = 'functional';
      else if (line.includes('Non-Functional Requirements')) currentSection = 'nonFunctional';
      else if (line.includes('Technical Requirements')) currentSection = 'technical';
      else if (line.includes('Constraints')) currentSection = 'constraints';
      else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        (requirements as any)[currentSection].push(line.trim().substring(1).trim());
      }
    }

    return requirements;
  }

  private generateFromAnalysis(analysis: any, projectPath: string): any {
    const requirements = {
      projectInfo: {
        name: path.basename(projectPath),
        type: this.determineProjectType(analysis),
        phase: analysis.phase,
        completionPercentage: analysis.completionPercentage,
      },
      functional: this.generateFunctionalRequirements(analysis),
      nonFunctional: this.generateNonFunctionalRequirements(analysis),
      technical: this.generateTechnicalRequirements(analysis),
      constraints: this.generateConstraints(analysis),
      dependencies: this.generateDependencyRequirements(analysis),
      testing: this.generateTestingRequirements(analysis),
      deployment: this.generateDeploymentRequirements(analysis),
      security: this.generateSecurityRequirements(analysis),
    };

    return requirements;
  }

  private determineProjectType(analysis: any): string {
    const { structure, technologyStack } = analysis;
    
    if (structure.hasAPI && structure.hasFrontend) return 'Full-Stack Application';
    if (structure.hasAPI && !structure.hasFrontend) return 'API/Backend Service';
    if (!structure.hasAPI && structure.hasFrontend) return 'Frontend Application';
    if (technologyStack.frameworks.includes('Next.js')) return 'Next.js Full-Stack Application';
    if (technologyStack.frameworks.includes('Express')) return 'Express.js API Service';
    
    return 'General Application';
  }

  private generateFunctionalRequirements(analysis: any): string[] {
    const requirements = [];

    if (analysis.structure.hasAPI) {
      requirements.push('RESTful API endpoints for data operations');
      requirements.push('Request/response validation and error handling');
      requirements.push('API versioning and documentation');
    }

    if (analysis.structure.hasFrontend) {
      requirements.push('Responsive user interface for all device sizes');
      requirements.push('User authentication and authorization flows');
      requirements.push('Interactive data visualization and management');
    }

    if (analysis.structure.hasDatabase) {
      requirements.push('Data persistence with ACID compliance');
      requirements.push('Database migrations and schema versioning');
      requirements.push('Data backup and recovery mechanisms');
    }

    return requirements;
  }

  private generateNonFunctionalRequirements(analysis: any): string[] {
    return [
      'Response time < 200ms for API endpoints',
      'Support for 1000+ concurrent users',
      '99.9% uptime availability',
      'Page load time < 3 seconds',
      'Accessibility compliance (WCAG 2.1 AA)',
      'Cross-browser compatibility',
      'Mobile-first responsive design',
      'Internationalization support',
    ];
  }

  private generateTechnicalRequirements(analysis: any): string[] {
    const requirements = [];
    const { technologyStack } = analysis;

    if (technologyStack.languages.includes('TypeScript')) {
      requirements.push('TypeScript strict mode compliance');
      requirements.push('Type safety for all API contracts');
    }

    if (technologyStack.tools.includes('ESLint')) {
      requirements.push('Code style adherence to ESLint configuration');
    }

    requirements.push('Minimum 80% code coverage for unit tests');
    requirements.push('Automated CI/CD pipeline');
    requirements.push('Docker containerization support');
    requirements.push('Environment-based configuration management');
    requirements.push('Structured logging with correlation IDs');
    requirements.push('Application performance monitoring');

    return requirements;
  }

  private generateConstraints(analysis: any): string[] {
    return [
      'Must use existing technology stack',
      'Must comply with company coding standards',
      'Must integrate with existing authentication system',
      'Budget constraints for third-party services',
      'Timeline: MVP within 3 months',
      'Must support gradual migration from legacy system',
    ];
  }

  private generateDependencyRequirements(analysis: any): string[] {
    return [
      'Regular dependency updates for security patches',
      'Dependency vulnerability scanning in CI/CD',
      'Lock file maintenance (package-lock.json)',
      'License compliance for all dependencies',
      'Minimal dependency footprint',
    ];
  }

  private generateTestingRequirements(analysis: any): string[] {
    const requirements = [
      'Unit tests for all business logic',
      'Integration tests for API endpoints',
      'End-to-end tests for critical user flows',
      'Performance testing for load scenarios',
      'Security testing for vulnerabilities',
      'Accessibility testing',
    ];

    if (!analysis.structure.hasTests) {
      requirements.unshift('CRITICAL: Implement comprehensive test suite');
    }

    return requirements;
  }

  private generateDeploymentRequirements(analysis: any): string[] {
    return [
      'Zero-downtime deployment strategy',
      'Rollback capability within 5 minutes',
      'Infrastructure as Code (IaC)',
      'Multi-environment support (dev, staging, production)',
      'SSL/TLS certificate management',
      'CDN integration for static assets',
      'Database migration automation',
      'Health check endpoints',
      'Graceful shutdown handling',
    ];
  }

  private generateSecurityRequirements(analysis: any): string[] {
    return [
      'OWASP Top 10 vulnerability protection',
      'Input validation and sanitization',
      'SQL injection prevention',
      'XSS (Cross-Site Scripting) protection',
      'CSRF (Cross-Site Request Forgery) protection',
      'Secure session management',
      'API rate limiting',
      'Secrets management (no hardcoded credentials)',
      'Security headers implementation',
      'Regular security audits',
    ];
  }

  private mergeRequirements(existing: any, generated: any): any {
    if (!existing) return generated;

    // Merge logic to combine existing and generated requirements
    const merged = { ...generated };
    
    // Preserve any custom requirements from existing
    if (existing.custom) {
      merged.custom = existing.custom;
    }

    return merged;
  }

  private formatAsMarkdown(requirements: any): string {
    let markdown = `# Project Requirements

## Project Information
- **Name**: ${requirements.projectInfo.name}
- **Type**: ${requirements.projectInfo.type}
- **Phase**: ${requirements.projectInfo.phase}
- **Completion**: ${requirements.projectInfo.completionPercentage}%

## Functional Requirements
${requirements.functional.map((r: string) => `- ${r}`).join('\n')}

## Non-Functional Requirements
${requirements.nonFunctional.map((r: string) => `- ${r}`).join('\n')}

## Technical Requirements
${requirements.technical.map((r: string) => `- ${r}`).join('\n')}

## Constraints
${requirements.constraints.map((r: string) => `- ${r}`).join('\n')}

## Dependency Requirements
${requirements.dependencies.map((r: string) => `- ${r}`).join('\n')}

## Testing Requirements
${requirements.testing.map((r: string) => `- ${r}`).join('\n')}

## Deployment Requirements
${requirements.deployment.map((r: string) => `- ${r}`).join('\n')}

## Security Requirements
${requirements.security.map((r: string) => `- ${r}`).join('\n')}

---
*Generated by Master Development Analysis Agent on ${new Date().toISOString()}*
`;

    return markdown;
  }

  private formatAsYaml(requirements: any): string {
    // Simple YAML formatting (in production, use a proper YAML library)
    const yaml = `projectInfo:
  name: ${requirements.projectInfo.name}
  type: ${requirements.projectInfo.type}
  phase: ${requirements.projectInfo.phase}
  completionPercentage: ${requirements.projectInfo.completionPercentage}

functional:
${requirements.functional.map((r: string) => `  - ${r}`).join('\n')}

nonFunctional:
${requirements.nonFunctional.map((r: string) => `  - ${r}`).join('\n')}

technical:
${requirements.technical.map((r: string) => `  - ${r}`).join('\n')}

constraints:
${requirements.constraints.map((r: string) => `  - ${r}`).join('\n')}

dependencies:
${requirements.dependencies.map((r: string) => `  - ${r}`).join('\n')}

testing:
${requirements.testing.map((r: string) => `  - ${r}`).join('\n')}

deployment:
${requirements.deployment.map((r: string) => `  - ${r}`).join('\n')}

security:
${requirements.security.map((r: string) => `  - ${r}`).join('\n')}
`;

    return yaml;
  }
}