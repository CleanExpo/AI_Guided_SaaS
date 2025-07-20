import { Agent, AgentConfig, AgentResult } from '../base/Agent'
import { generateAIResponse } from '@/lib/ai'

export interface AdvisoryReport {
  situation: SituationAnalysis
  recommendations: Recommendation[]
  strategies: Strategy[]
  risks: RiskAssessment[]
  alternatives: Alternative[]
  decisionMatrix: DecisionMatrix
  actionPlan: ActionPlan
  confidence: number
}

export interface SituationAnalysis {
  summary: string
  context: string[]
  stakeholders: Stakeholder[]
  constraints: string[]
  opportunities: string[]
  challenges: string[]
}

export interface Stakeholder {
  name: string
  role: string
  interests: string[]
  influence: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  rationale: string
  prerequisites: string[]
  expectedOutcome: string
  timeframe: string
  resources: ResourceRequirement[]
}

export interface ResourceRequirement {
  type: 'human' | 'technical' | 'financial' | 'time'
  description: string
  quantity: string
  availability: 'immediate' | 'short-term' | 'long-term'
}

export interface Strategy {
  name: string
  approach: string
  phases: Phase[]
  successCriteria: string[]
  keyPerformanceIndicators: KPI[]
  dependencies: string[]
}

export interface Phase {
  name: string
  duration: string
  activities: string[]
  deliverables: string[]
  milestones: string[]
}

export interface KPI {
  name: string
  description: string
  target: string
  measurement: string
  frequency: string
}

export interface RiskAssessment {
  risk: string
  category: 'technical' | 'business' | 'operational' | 'strategic'
  likelihood: number // 1-5
  impact: number // 1-5
  riskScore: number // likelihood * impact
  mitigation: string[]
  monitoring: string
  owner: string
}

export interface Alternative {
  name: string
  description: string
  pros: string[]
  cons: string[]
  feasibility: 'high' | 'medium' | 'low'
  cost: 'high' | 'medium' | 'low'
  timeToImplement: string
  recommendation: string
}

export interface DecisionMatrix {
  criteria: DecisionCriterion[]
  options: DecisionOption[]
  scores: Score[][]
  weightedScores: number[]
  recommendation: string
}

export interface DecisionCriterion {
  name: string
  weight: number // 0-1, sum to 1
  description: string
}

export interface DecisionOption {
  name: string
  description: string
}

export interface Score {
  value: number // 1-10
  rationale: string
}

export interface ActionPlan {
  immediateActions: Action[]
  shortTermActions: Action[]
  longTermActions: Action[]
  contingencyPlans: ContingencyPlan[]
  successMetrics: string[]
  reviewSchedule: string
}

export interface Action {
  id: string
  task: string
  responsible: string
  deadline: string
  dependencies: string[]
  expectedResult: string
  verificationMethod: string
}

export interface ContingencyPlan {
  trigger: string
  plan: string
  actions: string[]
  escalation: string
}

export class AdvisorAgent extends Agent {
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
      ],
      temperature: 0.5
    })
  }

  protected async execute(input: string): Promise<AgentResult> {
    try {
      this.think('Beginning strategic advisory analysis...')

      // Get context from other agents if available
      const projectContext = this.getSharedMemory('project-context') || {}
      const requirements = this.getSharedMemory('requirements') || []
      const constraints = this.getSharedMemory('constraints') || []
      const currentChallenges = this.getSharedMemory('challenges') || []

      this.observe('Retrieved context', {
        hasProjectContext: Object.keys(projectContext).length > 0,
        requirementCount: requirements.length,
        constraintCount: constraints.length
      })

      // Step 1: Analyze the situation
      const situation = await this.analyzeSituation(
        input,
        projectContext,
        requirements,
        constraints,
        currentChallenges
      )
      this.observe('Situation analysis complete', situation)

      // Step 2: Generate strategic recommendations
      const recommendations = await this.generateRecommendations(
        situation,
        input,
        requirements
      )
      this.observe('Generated recommendations', { count: recommendations.length })

      // Step 3: Develop strategies
      const strategies = await this.developStrategies(
        situation,
        recommendations,
        constraints
      )
      this.observe('Developed strategies', { count: strategies.length })

      // Step 4: Assess risks
      const risks = await this.assessRisks(
        situation,
        recommendations,
        strategies
      )
      this.observe('Risk assessment complete', { riskCount: risks.length })

      // Step 5: Evaluate alternatives
      const alternatives = await this.evaluateAlternatives(
        input,
        situation,
        recommendations
      )
      this.observe('Evaluated alternatives', { count: alternatives.length })

      // Step 6: Create decision matrix
      const decisionMatrix = await this.createDecisionMatrix(
        recommendations,
        alternatives,
        situation
      )
      this.observe('Decision matrix created', decisionMatrix)

      // Step 7: Develop action plan
      const actionPlan = await this.developActionPlan(
        recommendations,
        strategies,
        risks,
        decisionMatrix
      )
      this.observe('Action plan developed', {
        immediateActions: actionPlan.immediateActions.length,
        shortTermActions: actionPlan.shortTermActions.length,
        longTermActions: actionPlan.longTermActions.length
      })

      // Calculate overall confidence
      const confidence = this.calculateConfidence(
        situation,
        recommendations,
        risks
      )

      const result: AdvisoryReport = {
        situation,
        recommendations,
        strategies,
        risks,
        alternatives,
        decisionMatrix,
        actionPlan,
        confidence
      }

      // Store in artifacts
      this.setArtifact('advisory-report', result)
      
      // Share key insights with other agents
      this.setSharedMemory('strategic-recommendations', recommendations)
      this.setSharedMemory('action-plan', actionPlan)
      this.setSharedMemory('risk-assessment', risks)

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
      }

    } catch (error) {
      this.think(`Error during advisory analysis: ${error}`)
      throw error
    }
  }

  private async analyzeSituation(
    input: string,
    projectContext: any,
    requirements: string[],
    constraints: string[],
    challenges: string[]
  ): Promise<SituationAnalysis> {
    const analysisPrompt = `Analyze the current situation based on this input:

Request:
"${input}"

Project Context:
${JSON.stringify(projectContext, null, 2)}

Requirements:
${requirements.join('\n')}

Constraints:
${constraints.join('\n')}

Current Challenges:
${challenges.join('\n')}

Provide a comprehensive situation analysis including:
1. Executive summary
2. Key context points
3. Stakeholder analysis
4. Constraints
5. Opportunities
6. Challenges

Format as JSON SituationAnalysis object.`

    const response = await generateAIResponse(analysisPrompt, {
      model: this.config.model,
      temperature: 0.4,
      responseFormat: 'json'
    })

    return JSON.parse(response)
  }

  private async generateRecommendations(
    situation: SituationAnalysis,
    input: string,
    requirements: string[]
  ): Promise<Recommendation[]> {
    const recommendPrompt = `Generate strategic recommendations based on this analysis:

Situation:
${JSON.stringify(situation, null, 2)}

Original Request:
"${input}"

Requirements:
${requirements.join('\n')}

Create 4-6 actionable recommendations that:
1. Address key challenges
2. Leverage opportunities
3. Consider stakeholder interests
4. Are feasible within constraints
5. Have clear outcomes

For each recommendation include:
- Priority level
- Rationale
- Prerequisites
- Expected outcomes
- Timeframe
- Required resources

Format as JSON array of Recommendation objects.`

    const response = await generateAIResponse(recommendPrompt, {
      model: this.config.model,
      temperature: 0.5,
      responseFormat: 'json'
    })

    const recommendations = JSON.parse(response)
    return recommendations.map((r: any, index: number) => ({
      ...r,
      id: `REC-${index + 1}`
    }))
  }

  private async developStrategies(
    situation: SituationAnalysis,
    recommendations: Recommendation[],
    constraints: string[]
  ): Promise<Strategy[]> {
    const strategyPrompt = `Develop implementation strategies for these recommendations:

Situation Summary:
${situation.summary}

Key Recommendations:
${recommendations.map(r => `${r.title}: ${r.description}`).join('\n')}

Constraints:
${constraints.join('\n')}

Create 2-3 comprehensive strategies that:
1. Implement multiple recommendations
2. Include phased approaches
3. Define success criteria
4. Specify KPIs
5. Consider dependencies

Format as JSON array of Strategy objects.`

    const response = await generateAIResponse(strategyPrompt, {
      model: this.config.model,
      temperature: 0.4,
      responseFormat: 'json'
    })

    return JSON.parse(response)
  }

  private async assessRisks(
    situation: SituationAnalysis,
    recommendations: Recommendation[],
    strategies: Strategy[]
  ): Promise<RiskAssessment[]> {
    const riskPrompt = `Assess risks associated with the recommendations and strategies:

Situation Challenges:
${situation.challenges.join('\n')}

Recommendations:
${recommendations.map(r => r.title).join('\n')}

Strategies:
${strategies.map(s => s.name).join('\n')}

Identify and assess risks:
1. Technical risks
2. Business risks
3. Operational risks
4. Strategic risks

For each risk:
- Assess likelihood (1-5)
- Assess impact (1-5)
- Calculate risk score
- Propose mitigation strategies
- Define monitoring approach
- Assign ownership

Format as JSON array of RiskAssessment objects.`

    const response = await generateAIResponse(riskPrompt, {
      model: this.config.model,
      temperature: 0.4,
      responseFormat: 'json'
    })

    const risks = JSON.parse(response)
    return risks.map((r: any) => ({
      ...r,
      riskScore: r.likelihood * r.impact
    }))
  }

  private async evaluateAlternatives(
    input: string,
    situation: SituationAnalysis,
    recommendations: Recommendation[]
  ): Promise<Alternative[]> {
    const alternativePrompt = `Evaluate alternative approaches to the recommendations:

Original Request:
"${input}"

Current Situation:
${situation.summary}

Primary Recommendations:
${recommendations.slice(0, 3).map(r => r.title).join('\n')}

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

Format as JSON array of Alternative objects.`

    const response = await generateAIResponse(alternativePrompt, {
      model: this.config.model,
      temperature: 0.5,
      responseFormat: 'json'
    })

    return JSON.parse(response)
  }

  private async createDecisionMatrix(
    recommendations: Recommendation[],
    alternatives: Alternative[],
    situation: SituationAnalysis
  ): Promise<DecisionMatrix> {
    const matrixPrompt = `Create a decision matrix to evaluate options:

Primary Options (from recommendations):
${recommendations.slice(0, 3).map(r => r.title).join('\n')}

Alternative Options:
${alternatives.slice(0, 2).map(a => a.name).join('\n')}

Stakeholder Priorities:
${situation.stakeholders.filter(s => s.influence === 'high').map(s => `${s.name}: ${s.interests.join(', ')}`).join('\n')}

Create a decision matrix with:
1. 4-6 weighted criteria
2. Scores for each option (1-10)
3. Rationale for scores
4. Weighted total scores
5. Final recommendation

Format as JSON DecisionMatrix object.`

    const response = await generateAIResponse(matrixPrompt, {
      model: this.config.model,
      temperature: 0.3,
      responseFormat: 'json'
    })

    const matrix = JSON.parse(response)
    
    // Calculate weighted scores
    const weightedScores = matrix.options.map((_: any, optionIndex: number) => {
      return matrix.criteria.reduce((total: number, criterion: any, criterionIndex: number) => {
        return total + (matrix.scores[criterionIndex][optionIndex].value * criterion.weight)
      }, 0)
    })

    return {
      ...matrix,
      weightedScores
    }
  }

  private async developActionPlan(
    recommendations: Recommendation[],
    strategies: Strategy[],
    risks: RiskAssessment[],
    decisionMatrix: DecisionMatrix
  ): Promise<ActionPlan> {
    const actionPrompt = `Develop a comprehensive action plan:

Selected Option: ${decisionMatrix.recommendation}

Key Recommendations:
${recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').map(r => r.title).join('\n')}

Implementation Strategies:
${strategies.map(s => `${s.name}: ${s.phases.map(p => p.name).join(' → ')}`).join('\n')}

High Risks to Mitigate:
${risks.filter(r => r.riskScore >= 12).map(r => r.risk).join('\n')}

Create an action plan with:
1. Immediate actions (within 1 week)
2. Short-term actions (1-4 weeks)
3. Long-term actions (1-3 months)
4. Contingency plans for high risks
5. Success metrics
6. Review schedule

Format as JSON ActionPlan object.`

    const response = await generateAIResponse(actionPrompt, {
      model: this.config.model,
      temperature: 0.4,
      responseFormat: 'json'
    })

    const plan = JSON.parse(response)
    
    // Add IDs to actions
    let actionId = 1
    plan.immediateActions = plan.immediateActions.map((a: any) => ({
      ...a,
      id: `ACT-${actionId++}`
    }))
    plan.shortTermActions = plan.shortTermActions.map((a: any) => ({
      ...a,
      id: `ACT-${actionId++}`
    }))
    plan.longTermActions = plan.longTermActions.map((a: any) => ({
      ...a,
      id: `ACT-${actionId++}`
    }))

    return plan
  }

  private calculateConfidence(
    situation: SituationAnalysis,
    recommendations: Recommendation[],
    risks: RiskAssessment[]
  ): number {
    // Base confidence from situation clarity
    let confidence = 0.7

    // Adjust based on constraint count
    if (situation.constraints.length > 5) {
      confidence -= 0.1
    }

    // Adjust based on high-priority recommendations
    const highPriorityCount = recommendations.filter(r => 
      r.priority === 'critical' || r.priority === 'high'
    ).length
    if (highPriorityCount > 3) {
      confidence -= 0.05
    }

    // Adjust based on high risks
    const highRiskCount = risks.filter(r => r.riskScore >= 15).length
    confidence -= highRiskCount * 0.05

    // Ensure confidence stays within bounds
    confidence = Math.max(0.5, Math.min(0.95, confidence))

    return Number(confidence.toFixed(2))
  }
}