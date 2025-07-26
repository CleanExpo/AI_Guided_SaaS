import { Logger } from '../utils/logger.js';

export class RequirementsEngine {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('RequirementsEngine');
  }

  async generateRequirements(analysis: any): Promise<any> {
    this.logger.info('Generating project requirements from analysis');

    const requirements = {
      functional: this.extractFunctionalRequirements(analysis),
      nonFunctional: this.extractNonFunctionalRequirements(analysis),
      technical: this.extractTechnicalRequirements(analysis),
      compliance: this.extractComplianceRequirements(analysis)
    };

    return requirements;
  }

  private extractFunctionalRequirements(analysis: any): string[] {
    const reqs = [];
    
    if (analysis.phase === 'Development') {
      reqs.push('Complete core feature implementation');
      reqs.push('Implement user authentication and authorization');
      reqs.push('Create data models and database schema');
    }

    if (analysis.missingElements.some((e: any) => e.name.includes('API'))) {
      reqs.push('Implement RESTful API endpoints');
    }

    return reqs;
  }

  private extractNonFunctionalRequirements(analysis: any): string[] {
    const reqs = [];
    
    if (analysis.metrics.testCoverage < 80) {
      reqs.push('Achieve minimum 80% test coverage');
    }

    if (analysis.scalabilityConcerns.length > 0) {
      reqs.push('Implement horizontal scaling capabilities');
    }

    reqs.push('Ensure 99.9% uptime SLA');
    reqs.push('Support 1000+ concurrent users');

    return reqs;
  }

  private extractTechnicalRequirements(analysis: any): string[] {
    const reqs = [];
    
    if (!analysis.architectureConsistency || analysis.architectureConsistency !== 'Good') {
      reqs.push('Refactor to follow consistent architecture patterns');
    }

    if (analysis.technicalDebt.length > 0) {
      reqs.push('Address technical debt: ' + analysis.technicalDebt.join(', '));
    }

    reqs.push('Implement comprehensive logging and monitoring');
    reqs.push('Set up automated CI/CD pipeline');

    return reqs;
  }

  private extractComplianceRequirements(analysis: any): string[] {
    const reqs = [];
    
    if (analysis.securityVulnerabilities.length > 0) {
      reqs.push('Fix all identified security vulnerabilities');
    }

    reqs.push('Implement GDPR compliance measures');
    reqs.push('Add data encryption at rest and in transit');
    reqs.push('Implement audit logging for all data access');

    return reqs;
  }
}