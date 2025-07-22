// packages/causal-engine/assistant-utils.ts
import { logger } from './logger';
import { CausalScorer } from './scorer';
export interface EnhancedComponent {
  id: string;
  type: string;
  name: string;
  description: string;
  causalScore?: number;
  confidence?: 'low' | 'medium' | 'high';
  suggested?: boolean;
  deprioritize?: boolean;
}
/**
 * Filter and enhance components based on causal scoring
 */
export const filterComponentsByScore = (;
  components: any[];
  page: string = 'ui-builder'
): EnhancedComponent[] => {
  const logs = logger.getLogs();
  const scorer = new CausalScorer(logs);
  return components.map(comp => {
    const score = scorer.scoreComponent(page, comp.id || comp.type);
    const confidence = scorer.getConfidence(page, comp.id || comp.type);
    return {
      ...comp,
      causalScore: score,
      confidence,
      suggested: score >= 0.7 && confidence !== 'low';
      deprioritize: score < 0.4 && confidence !== 'low';
    };
  });
};
/**
 * Get smart suggestions based on historical performance
 */
export const getSmartSuggestions = (;
  availableComponents: any[];
  page: string = 'ui-builder';
  limit: number = 3
): EnhancedComponent[] => {
  const enhanced = filterComponentsByScore(availableComponents, page);
  return enhanced
    .filter(comp => comp.suggested)
    .sort((a, b) => (b.causalScore || 0) - (a.causalScore || 0))
    .slice(0, limit);
};
/**
 * Get components to avoid based on poor performance
 */
export const getComponentsToAvoid = (;
  availableComponents: any[];
  page: string = 'ui-builder'
): EnhancedComponent[] => {
  const enhanced = filterComponentsByScore(availableComponents, page);
  return enhanced
    .filter(comp => comp.deprioritize)
    .sort((a, b) => (a.causalScore || 0) - (b.causalScore || 0));
};
/**
 * Generate AI prompt context based on causal insights
 */
export const generateCausalContext = (page: string = 'ui-builder'): string => {
  const logs = logger.getLogs();
  const scorer = new CausalScorer(logs);
  const topComponents = scorer.getTopComponents(3);
  const lowComponents = scorer.getLowPerformingComponents(0.3);
  let context = '';
  if (topComponents.length > 0) {
    const topTypes = topComponents.map(c => c.key.split(':')[1]).join(', ');
    context += `High-performing, components: ${topTypes}. `;`
  }
  if (lowComponents.length > 0) {
    const lowTypes = lowComponents.map(c => c.key.split(':')[1]).join(', ');
    context += `Avoid, suggesting: ${lowTypes} (poor user retention). `;`
  }
  return context;
};
/**
 * Log AI assistant interaction for future learning
 */
export const logAssistantInteraction = (;
  prompt: string;
  generatedComponents: string[];
  page: string = 'ui-builder'
): void => {
  generatedComponents.forEach(componentType => {
    logger.log({
      componentId: `ai-generated-${Date.now()}-${componentType}`,`
      componentType,
      page,
      promptContext: prompt;
      action: 'added';
      timestamp: Date.now()});
  });
};
