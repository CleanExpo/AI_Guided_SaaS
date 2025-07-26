import { generateAIResponse } from '@/lib/ai';
import { SituationAnalysis, Recommendation, Alternative } from './types';

export class AlternativeEvaluator {
  async evaluateAlternatives(
    input: string,
    situation: SituationAnalysis,
    recommendations: Recommendation[]
  ): Promise<Alternative[]> {
    const alternativePrompt = `Evaluate alternative approaches to the recommendations:

Original Request: "${input}"

Current Situation:
${situation.summary}

Primary Recommendations:
${recommendations
  .slice(0, 3)
  .map((r) => r.title)
  .join('\n')}

Identify 3-4 alternative approaches that:
1. Could achieve similar outcomes
2. Have different trade-offs
3. Might be more suitable under certain conditions

For each alternative:
- Describe the approach
- List pros and cons
- Assess feasibility
- Estimate cost
- Estimate implementation time
- Provide recommendation on when to use

Format as JSON array of Alternative objects.`;

    const response = await generateAIResponse(alternativePrompt, {
      model: 'gpt-4',
      temperature: 0.5,
      responseFormat: 'json'
    });

    return JSON.parse(response) as Alternative[];
  }
}