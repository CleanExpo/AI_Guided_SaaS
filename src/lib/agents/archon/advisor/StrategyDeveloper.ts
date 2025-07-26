import { generateAIResponse } from '@/lib/ai';
import { SituationAnalysis, Recommendation, Strategy } from './types';

export class StrategyDeveloper {
  async developStrategies(
    situation: SituationAnalysis,
    recommendations: Recommendation[],
    constraints: string[]
  ): Promise<Strategy[]> {
    const strategyPrompt = `Develop implementation strategies for these recommendations:

Situation Summary: ${situation.summary}

Key Recommendations:
${recommendations.map((r) => `${r.title}: ${r.description}`).join('\n')}

Constraints:
${constraints.join('\n')}

Create 2-3 comprehensive strategies that:
1. Implement multiple recommendations
2. Include phased approaches
3. Define success criteria
4. Specify KPIs
5. Consider dependencies

Format as JSON array of Strategy objects.`;

    const response = await generateAIResponse(strategyPrompt, {
      model: 'gpt-4',
      temperature: 0.4,
      responseFormat: 'json'
    });

    return JSON.parse(response) as Strategy[];
  }
}