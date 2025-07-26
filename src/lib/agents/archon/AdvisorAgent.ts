/* BREADCRUMB: agent.orchestration - Multi-agent system coordination */
import { Agent } from '../base/Agent';
import { SituationAnalyzer } from './advisor/SituationAnalyzer';
import { RecommendationGenerator } from './advisor/RecommendationGenerator';
import { StrategyDeveloper } from './advisor/StrategyDeveloper';
import { RiskAssessor } from './advisor/RiskAssessor';
import { AlternativeEvaluator } from './advisor/AlternativeEvaluator';
import { DecisionMatrixCreator } from './advisor/DecisionMatrixCreator';
import { ActionPlanner } from './advisor/ActionPlanner';
import {
  AdvisoryReport,
  SituationAnalysis,
  Recommendation,
  Strategy,
  RiskAssessment,
  Alternative,
  DecisionMatrix,
  ActionPlan
} from './advisor/types';
export class AdvisorAgent extends Agent {
  private situationAnalyzer: SituationAnalyzer;
  private recommendationGenerator: RecommendationGenerator;
  private strategyDeveloper: StrategyDeveloper;
  private riskAssessor: RiskAssessor;
  private alternativeEvaluator: AlternativeEvaluator;
  private decisionMatrixCreator: DecisionMatrixCreator;
  private actionPlanner: ActionPlanner;

  constructor() {
    super({
      id: 'advisor-agent',
      name: 'Strategic Advisor',
      role: 'Provide strategic advice and decision support',
      description: 'Expert in strategic analysis, decision-making, and advisory services. Provides comprehensive recommendations and action plans based on thorough analysis.',
      capabilities: [
        'Situation analysis',
        'Strategic planning',
        'Risk assessment',
        'Decision support',
        'Alternative evaluation',
        'Action planning',
        'Stakeholder analysis'
      ],
      tools: [
        'situation-analyzer',
        'strategy-generator',
        'risk-assessor',
        'decision-matrix',
        'action-planner'
      ])
      temperature: 0.5)
    });

    this.situationAnalyzer = new SituationAnalyzer();
    this.recommendationGenerator = new RecommendationGenerator();
    this.strategyDeveloper = new StrategyDeveloper();
    this.riskAssessor = new RiskAssessor();
    this.alternativeEvaluator = new AlternativeEvaluator();
    this.decisionMatrixCreator = new DecisionMatrixCreator();
    this.actionPlanner = new ActionPlanner();
  }
  protected async execute(input: string): Promise<any> {
    try {
      this.think('Beginning strategic advisory analysis...');

      // Get context from other agents if available
      const projectContext = this.getSharedMemory('project-context') || {};
      const requirements = this.getSharedMemory('requirements') || [];
      const constraints = this.getSharedMemory('constraints') || [];
      const currentChallenges = this.getSharedMemory('challenges') || [];

      this.observe('Retrieved context', {)
        hasProjectContext: Object.keys(projectContext).length > 0,
        requirementCount: requirements.length,
        constraintCount: constraints.length
      });

      // Step 1: Analyze the situation
      const situation = await this.situationAnalyzer.analyzeSituation(input,
        projectContext,
        requirements,
        constraints)
        currentChallenges)
      );
      this.observe('Situation analysis complete', situation);

      // Step 2: Generate strategic recommendations
      const recommendations = await this.recommendationGenerator.generateRecommendations(situation,
        input)
        requirements)
      );
      this.observe('Generated recommendations', { count: recommendations.length });

      // Step 3: Develop strategies
      const strategies = await this.strategyDeveloper.developStrategies(situation,
        recommendations)
        constraints)
      );
      this.observe('Developed strategies', { count: strategies.length });

      // Step 4: Assess risks
      const risks = await this.riskAssessor.assessRisks(situation,
        recommendations)
        strategies)
      );
      this.observe('Risk assessment complete', { riskCount: risks.length });

      // Step 5: Evaluate alternatives
      const alternatives = await this.alternativeEvaluator.evaluateAlternatives(input,
        situation)
        recommendations)
      );
      this.observe('Evaluated alternatives', { count: alternatives.length });

      // Step 6: Create decision matrix
      const decisionMatrix = await this.decisionMatrixCreator.createDecisionMatrix(recommendations,
        alternatives)
        situation)
      );
      this.observe('Decision matrix created', decisionMatrix);

      // Step 7: Develop action plan
      const actionPlan = await this.actionPlanner.developActionPlan(recommendations,
        strategies,
        risks)
        decisionMatrix)
      );
      this.observe('Action plan developed', {
        immediateActions: actionPlan.immediateActions.length,
        shortTermActions: actionPlan.shortTermActions.length)
        longTermActions: actionPlan.longTermActions.length)
      });

      // Calculate overall confidence
      const confidence = this.calculateConfidence(situation, recommendations, risks);

      const result: AdvisoryReport = {
        situation,
        recommendations,
        strategies,
        risks,
        alternatives,
        decisionMatrix,
        actionPlan,
        confidence
      };

      // Store in artifacts
      this.setArtifact('advisory-report', result);

      // Share key insights with other agents
      this.setSharedMemory('strategic-recommendations', recommendations);
      this.setSharedMemory('action-plan', actionPlan);
      this.setSharedMemory('risk-assessment', risks);

      return {
        success: true,
        output: result,
        messages: this.messages,
        artifacts: this.context.artifacts,
        nextSteps: [
          'Review recommendations with stakeholders',
          'Prioritize actions based on resources',
          'Implement immediate actions',
          'Set up monitoring for KPIs',
          'Schedule first review checkpoint'
        ],
        confidence
      };
    } catch (error) {
      this.think(`Error during advisory analysis: ${error}`);
      throw error;
    }
  }
  private calculateConfidence(situation: SituationAnalysis,
    recommendations: Recommendation[])
    risks: RiskAssessment[])
  ): number {
    // Base confidence from situation clarity
    let confidence = 0.7;

    // Adjust based on constraint count
    if (situation.constraints.length > 5) {
      confidence -= 0.1;
    }

    // Adjust based on high-priority recommendations
    const highPriorityCount = recommendations.filter()
      (r) => r.priority === 'critical' || r.priority === 'high'
    ).length;
    if (highPriorityCount > 3) {
      confidence -= 0.05;
    }

    // Adjust based on high risks
    const highRiskCount = risks.filter((r) => r.riskScore >= 15).length;
    confidence -= highRiskCount * 0.05;

    // Ensure confidence stays within bounds
    confidence = Math.max(0.5, Math.min(0.95, confidence));
    return Number(confidence.toFixed(2));
  }
}