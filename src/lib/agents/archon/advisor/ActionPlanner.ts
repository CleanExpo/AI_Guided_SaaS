import { generateAIResponse } from '@/lib/ai';
import { Recommendation, Strategy, RiskAssessment, DecisionMatrix, ActionPlan, Action } from './types';

export class ActionPlanner {
  async developActionPlan(
    recommendations: Recommendation[],
    strategies: Strategy[],
    risks: RiskAssessment[],
    decisionMatrix: DecisionMatrix
  ): Promise<ActionPlan> {
    const actionPrompt = `Develop a comprehensive action plan:

Selected Option: ${decisionMatrix.recommendation}

Key Recommendations:
${recommendations
  .filter((r) => r.priority === 'critical' || r.priority === 'high')
  .map((r) => r.title)
  .join('\n')}

Implementation Strategies:
${strategies.map((s) => `${s.name}: ${s.phases.map((p) => p.name).join(' → ')}`).join('\n')}

High Risks to Mitigate:
${risks
  .filter((r) => r.riskScore >= 12)
  .map((r) => r.risk)
  .join('\n')}

Create an action plan with:
1. Immediate actions (within 1 week)
2. Short-term actions (1-4 weeks)
3. Long-term actions (1-3 months)
4. Contingency plans for high risks
5. Success metrics
6. Review schedule

Format as JSON ActionPlan object.`;

    const response = await generateAIResponse(actionPrompt, {
      model: 'gpt-4',
      temperature: 0.4,
      responseFormat: 'json'
    });

    const plan = JSON.parse(response);
    
    // Add IDs to actions
    let actionId = 1;
    plan.immediateActions = plan.immediateActions.map((a: Omit<Action, 'id'>) => ({
      ...a,
      id: `ACT-${actionId++}`
    }));
    plan.shortTermActions = plan.shortTermActions.map((a: Omit<Action, 'id'>) => ({
      ...a,
      id: `ACT-${actionId++}`
    }));
    plan.longTermActions = plan.longTermActions.map((a: Omit<Action, 'id'>) => ({
      ...a,
      id: `ACT-${actionId++}`
    }));

    return plan as ActionPlan;
  }
}