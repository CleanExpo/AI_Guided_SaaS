import { generateAIResponse } from '@/lib/ai';
import { SituationAnalysis, Recommendation, Alternative, DecisionMatrix, DecisionOption, DecisionCriterion } from './types';

export class DecisionMatrixCreator {
  async createDecisionMatrix(
    recommendations: Recommendation[],
    alternatives: Alternative[],
    situation: SituationAnalysis
  ): Promise<DecisionMatrix> {
    const matrixPrompt = `Create a decision matrix to evaluate options:

Primary Options (from recommendations):
${recommendations
  .slice(0, 3)
  .map((r) => r.title)
  .join('\n')}

Alternative Options:
${alternatives
  .slice(0, 2)
  .map((a) => a.name)
  .join('\n')}

Stakeholder Priorities:
${situation.stakeholders
  .filter((s) => s.influence === 'high')
  .map((s) => `${s.name}: ${s.interests.join(', ')}`)
  .join('\n')}

Create a decision matrix with:
1. 4-6 weighted criteria
2. Scores for each option (1-10)
3. Rationale for scores
4. Weighted total scores
5. Final recommendation

Format as JSON DecisionMatrix object.`;

    const response = await generateAIResponse(matrixPrompt, {
      model: 'gpt-4',
      temperature: 0.3,
      responseFormat: 'json'
    });

    const matrix = JSON.parse(response);
    
    // Calculate weighted scores
    const weightedScores = matrix.options.map((_: DecisionOption, optionIndex: number) => {
      return matrix.criteria.reduce((total: number, criterion: DecisionCriterion, criterionIndex: number) => {
        return total + matrix.scores[criterionIndex][optionIndex].value * criterion.weight;
      }, 0);
    });

    return {
      ...matrix,
      weightedScores
    } as DecisionMatrix;
  }
}