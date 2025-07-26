import { Infrastructure, Component, ArchitectureOverview } from './types';
import { generateAIResponse } from '@/lib/ai';
import { architecturePrompts } from './prompts';

export class InfrastructurePlanner {
  async planInfrastructure(
    components: Component[],
    overview: ArchitectureOverview,
    timeline: any
  ): Promise<Infrastructure> {
    const prompt = architecturePrompts.infrastructure
      .replace('{components}', JSON.stringify(components, null, 2))
      .replace('{overview}', JSON.stringify(overview, null, 2))
      .replace('{timeline}', JSON.stringify(timeline, null, 2));

    const response = await generateAIResponse(prompt, {
      temperature: 0.3,
      model: 'gpt-4'
    });

    try {
      const infrastructure = JSON.parse(response);
      return this.validateInfrastructure(infrastructure);
    } catch (error) {
      throw new Error(`Failed to parse infrastructure: ${error}`);
    }
  }

  private validateInfrastructure(infra: any): Infrastructure {
    return {
      cloudProvider: infra.cloudProvider || 'AWS',
      services: infra.services || [],
      networking: infra.networking || {
        vpc: true,
        subnets: ['public', 'private'],
        loadBalancer: 'application',
        cdn: true,
        dns: 'route53'
      },
      monitoring: infra.monitoring || {
        apm: 'datadog',
        logging: 'cloudwatch',
        metrics: 'prometheus',
        alerting: ['pagerduty', 'slack']
      },
      backup: infra.backup || {
        frequency: 'daily',
        retention: '30 days',
        type: 'incremental',
        locations: ['primary-region', 'dr-region']
      }
    };
  }

  estimateCost(infrastructure: Infrastructure): { monthly: number; annual: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let totalMonthly = 0;

    // Estimate costs based on services
    infrastructure.services.forEach(service => {
      const cost = this.getServiceCost(service.type, service.configuration);
      breakdown[service.name] = cost;
      totalMonthly += cost;
    });

    // Add networking costs
    if (infrastructure.networking.cdn) {
      breakdown['CDN'] = 50;
      totalMonthly += 50;
    }

    if (infrastructure.networking.loadBalancer) {
      breakdown['Load Balancer'] = 25;
      totalMonthly += 25;
    }

    // Add monitoring costs
    breakdown['Monitoring'] = 100;
    totalMonthly += 100;

    // Add backup costs
    breakdown['Backup'] = 50;
    totalMonthly += 50;

    return {
      monthly: totalMonthly,
      annual: totalMonthly * 12,
      breakdown
    };
  }

  private getServiceCost(type: string, config: any): number {
    // Simplified cost estimation
    const baseCosts: Record<string, number> = {
      'compute': 100,
      'database': 150,
      'storage': 50,
      'queue': 25,
      'cache': 30,
      'function': 20
    };

    return baseCosts[type] || 50;
  }
}