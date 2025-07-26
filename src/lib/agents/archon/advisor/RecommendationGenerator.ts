import { generateAIResponse } from '@/lib/ai';
import { SituationAnalysis, Recommendation } from './types';

export class RecommendationGenerator {
  async generateRecommendations(
    situation: SituationAnalysis,
    input: string,
    requirements: string[]
  ): Promise<Recommendation[]> {
    const recommendPrompt = `Generate strategic recommendations based on this analysis:

Situation:
${JSON.stringify(situation, null, 2)}

Original Request: "${input}"

Requirements:
${requirements.join('\n')}

Create 4-6 actionable recommendations that:
1. Address key challenges
2. Leverage opportunities
3. Consider stakeholder interests
4. Are feasible within constraints
5. Have clear outcomes

For each recommendation, include:
- Priority level
- Rationale
- Prerequisites
- Expected outcomes
- Timeframe
- Required resources

Format as JSON array of Recommendation objects.`;

    const response = await generateAIResponse(recommendPrompt, {
      model: 'gpt-4',
      temperature: 0.5,
      responseFormat: 'json'
    });

    const recommendations = JSON.parse(response);
    return recommendations.map((r: Omit<Recommendation, 'id'>, index: number) => ({
      ...r,
      id: `REC-${index + 1}`
    })) as Recommendation[];
  }
}