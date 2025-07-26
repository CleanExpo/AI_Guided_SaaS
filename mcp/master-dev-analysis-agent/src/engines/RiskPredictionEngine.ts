import { Logger } from '../utils/logger.js';

interface Risk {
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  mitigation: string;
}

export class RiskPredictionEngine {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('RiskPredictionEngine');
  }

  async assessRisks(analysis: any): Promise<any> {
    this.logger.info('Assessing project risks');

    const risks = await this.identifyRisks(analysis);
    const categorizedRisks = this.categorizeRisks(risks);

    return categorizedRisks;
  }

  async predictRisks(analysis: any, categories?: string[]): Promise<any> {
    const allRisks = await this.identifyRisks(analysis);
    
    const filteredRisks = categories 
      ? allRisks.filter(risk => categories.includes(risk.category))
      : allRisks;

    return this.categorizeRisks(filteredRisks);
  }

  private async identifyRisks(analysis: any): Promise<Risk[]> {
    const risks: Risk[] = [];

    // Security risks
    if (analysis.securityVulnerabilities.length > 0) {
      risks.push({
        description: 'Unaddressed security vulnerabilities in codebase',
        probability: 90,
        impact: 'critical',
        category: 'security',
        mitigation: 'Conduct security audit and fix all vulnerabilities'
      });
    }

    // Performance risks
    if (analysis.scalabilityConcerns.includes('No containerization setup')) {
      risks.push({
        description: 'Lack of containerization may impact deployment flexibility',
        probability: 70,
        impact: 'medium',
        category: 'performance',
        mitigation: 'Implement Docker containerization'
      });
    }

    // Deployment risks
    if (analysis.productionReadinessScore < 7) {
      risks.push({
        description: 'Low production readiness score indicates deployment risks',
        probability: 85,
        impact: 'high',
        category: 'deployment',
        mitigation: 'Complete production readiness checklist'
      });
    }

    // Maintainability risks
    if (analysis.technicalDebt.length > 3) {
      risks.push({
        description: 'High technical debt will impact future development velocity',
        probability: 95,
        impact: 'medium',
        category: 'maintainability',
        mitigation: 'Allocate time for technical debt reduction'
      });
    }

    // Testing risks
    if (analysis.metrics.testCoverage < 60) {
      risks.push({
        description: 'Low test coverage increases regression risk',
        probability: 80,
        impact: 'high',
        category: 'quality',
        mitigation: 'Increase test coverage to at least 80%'
      });
    }

    // Dependency risks
    if (analysis.metrics.dependencies > 100) {
      risks.push({
        description: 'Large number of dependencies increases security attack surface',
        probability: 60,
        impact: 'medium',
        category: 'security',
        mitigation: 'Audit and reduce unnecessary dependencies'
      });
    }

    return risks;
  }

  private categorizeRisks(risks: Risk[]): any {
    const categorized = {
      critical: [] as any[],
      high: [] as any[],
      medium: [] as any[],
      low: [] as any[]
    };

    risks.forEach(risk => {
      const riskItem = {
        description: risk.description,
        probability: risk.probability,
        category: risk.category,
        mitigation: risk.mitigation
      };

      categorized[risk.impact].push(riskItem);
    });

    // Sort by probability within each category
    Object.keys(categorized).forEach(key => {
      categorized[key as keyof typeof categorized].sort((a: any, b: any) => b.probability - a.probability);
    });

    return categorized;
  }
}