export interface AdvisoryReport {
  situation: SituationAnalysis;
  recommendations: Recommendation[];
  strategies: Strategy[];
  risks: RiskAssessment[];
  alternatives: Alternative[];
  decisionMatrix: DecisionMatrix;
  actionPlan: ActionPlan;
  confidence: number;
}

export interface SituationAnalysis {
  summary: string;
  context: string[];
  stakeholders: Stakeholder[];
  constraints: string[];
  opportunities: string[];
  challenges: string[];
}

export interface Stakeholder {
  name: string;
  role: string;
  interests: string[];
  influence: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  rationale: string;
  prerequisites: string[];
  expectedOutcome: string;
  timeframe: string;
  resources: ResourceRequirement[];
}

export interface ResourceRequirement {
  type: 'human' | 'technical' | 'financial' | 'time';
  description: string;
  quantity: string;
  availability: 'immediate' | 'short-term' | 'long-term';
}

export interface Strategy {
  name: string;
  approach: string;
  phases: Phase[];
  successCriteria: string[];
  keyPerformanceIndicators: KPI[];
  dependencies: string[];
}

export interface Phase {
  name: string;
  duration: string;
  activities: string[];
  deliverables: string[];
  milestones: string[];
}

export interface KPI {
  name: string;
  description: string;
  target: string;
  measurement: string;
  frequency: string;
}

export interface RiskAssessment {
  risk: string;
  category: 'technical' | 'business' | 'operational' | 'strategic';
  likelihood: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // likelihood * impact
  mitigation: string[];
  monitoring: string;
  owner: string;
}

export interface Alternative {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  feasibility: 'high' | 'medium' | 'low';
  cost: 'high' | 'medium' | 'low';
  timeToImplement: string;
  recommendation: string;
}

export interface DecisionMatrix {
  criteria: DecisionCriterion[];
  options: DecisionOption[];
  scores: Score[][];
  weightedScores: number[];
  recommendation: string;
}

export interface DecisionCriterion {
  name: string;
  weight: number; // 0-1, sum to 1
  description: string;
}

export interface DecisionOption {
  name: string;
  description: string;
}

export interface Score {
  value: number; // 1-10
  rationale: string;
}

export interface ActionPlan {
  immediateActions: Action[];
  shortTermActions: Action[];
  longTermActions: Action[];
  contingencyPlans: ContingencyPlan[];
  successMetrics: string[];
  reviewSchedule: string;
}

export interface Action {
  id: string;
  task: string;
  responsible: string;
  deadline: string;
  dependencies: string[];
  expectedResult: string;
  verificationMethod: string;
}

export interface ContingencyPlan {
  trigger: string;
  plan: string;
  actions: string[];
  escalation: string;
}