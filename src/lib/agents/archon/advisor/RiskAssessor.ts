import { generateAIResponse } from '@/lib/ai';
import { SituationAnalysis, Recommendation, Strategy, RiskAssessment } from './types';

export class RiskAssessor {
  async assessRisks(
    situation: SituationAnalysis,
    recommendations: Recommendation[],
    strategies: Strategy[]
  ): Promise<RiskAssessment[]> {
    const riskPrompt = `Assess risks associated with the recommendations and strategies:

Situation Challenges:
${situation.challenges.join('\n')}

Recommendations:
${recommendations.map((r) => r.title).join('\n')}

Strategies:
${strategies.map((s) => s.name).join('\n')}

Identify and assess risks:
1. Technical risks
2. Business risks
3. Operational risks
4. Strategic risks

For each risk:
- Assess likelihood (1-5)
- Assess impact (1-5)
- Calculate risk score
- Propose mitigation strategies
- Define monitoring approach
- Assign ownership

Format as JSON array of RiskAssessment objects.`;

    const response = await generateAIResponse(riskPrompt, {
      model: 'gpt-4',
      temperature: 0.4,
      responseFormat: 'json'
    });

    const risks = JSON.parse(response);
    return risks.map((r: Omit<RiskAssessment, 'riskScore'>) => ({
      ...r,
      riskScore: r.likelihood * r.impact
    })) as RiskAssessment[];
  }
}