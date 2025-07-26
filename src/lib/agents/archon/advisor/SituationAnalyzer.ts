import { generateAIResponse } from '@/lib/ai';
import { SituationAnalysis } from './types';

export class SituationAnalyzer {
  async analyzeSituation(
    input: string,
    projectContext: Record<string, unknown>,
    requirements: string[],
    constraints: string[],
    challenges: string[]
  ): Promise<SituationAnalysis> {
    const analysisPrompt = `Analyze the current situation based on this input:

Request: "${input}"

Project Context:
${JSON.stringify(projectContext, null, 2)}

Requirements:
${requirements.join('\n')}

Constraints:
${constraints.join('\n')}

Current Challenges:
${challenges.join('\n')}

Provide a comprehensive situation analysis, including:
1. Executive summary
2. Key context points
3. Stakeholder analysis
4. Constraints
5. Opportunities
6. Challenges

Format as JSON SituationAnalysis object.`;

    const response = await generateAIResponse(analysisPrompt, {
      model: 'gpt-4',
      temperature: 0.4,
      responseFormat: 'json'
    });

    return JSON.parse(response);
  }
}