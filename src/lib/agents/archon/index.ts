/* BREADCRUMB: agent.orchestration - Multi-agent system coordination */
// Archon Refinement Agents;
export { PromptRefinerAgent } from './PromptRefinerAgent';export { ToolsRefinerAgent } from './ToolsRefinerAgent';
export { AgentRefinerAgent } from './AgentRefinerAgent';
export { AdvisorAgent } from './AdvisorAgent';
// Export types;
export type { RefinedPrompt,
  PromptImprovement,
  PromptClarity,
  PromptExample,
  OutputSpecification from './PromptRefinerAgent';
export type {
  ToolRefinement,
  Tool,
  ToolAddition,
  ToolModification,
  ToolRemoval,
  ToolIntegration,
  ToolPerformanceAnalysis from './ToolsRefinerAgent';
export type {
  AgentRefinement,
  AgentConfiguration,
  RefinedAgent,
  CollaborationStrategy,
  PerformanceMetrics from './AgentRefinerAgent';
export type {
  AdvisoryReport,
  Recommendation,
  Strategy,
  RiskAssessment,
  Alternative,
  DecisionMatrix,
  ActionPlan from './AdvisorAgent';

}}}}