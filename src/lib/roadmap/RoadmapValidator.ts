import { DevelopmentRoadmap, RoadmapPhase } from '@/lib/requirements/ClientRequirementsProcessor';
export interface RoadmapMilestone {;
  id: string;
  phaseId: string;
  name: string;
  expectedDate: Date
  actualDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'blocked'
  completionCriteria: CompletionCriterion[];
  dependencies: string[]; deliverables: string[]
};
export interface CompletionCriterion {;
  id: string;
  description: string;
  type: 'feature' | 'test' | 'performance' | 'documentation'
  validation: {
    method: 'automated' | 'manual' | 'hybrid'
    script?: string
    threshold?: number
  }
  status: 'pending' | 'passed' | 'failed'
  lastChecked?: Date
  result?: any
};
export interface RoadmapValidationResult {;
  roadmapId: string;
  validationDate: Date;
  overallStatus: 'on_track' | 'at_risk' | 'delayed' | 'blocked'
  completionPercentage: number;
    milestones: {
    total: number;
  completed: number;
  inProgress: number;
  delayed: number;
  blocked: number
  }
  deviations: RoadmapDeviation[]; recommendations: string[]
  nextMilestone?: RoadmapMilestone, estimatedCompletionDate: Date
};
export interface RoadmapDeviation {;
  type: 'delay' | 'scope_change' | 'blocker' | 'resource_issue'
  severity: 'low' | 'medium' | 'high' | 'critical'
  milestoneId: string;
  description: string;
  impact: string;
  suggestedAction: string
};
export class RoadmapValidator {;
  private milestones: Map<string, RoadmapMilestone> = new Map()
  private validationHistory: RoadmapValidationResult[] = []
  constructor(private roadmap: DevelopmentRoadmap) {
    this.initializeMilestones()
  }
  private initializeMilestones() {
    let cumulativeDays = 0;
    const startDate = new Date();
    this.roadmap.phases.forEach((phase, index) => {
      // Parse duration (e.g., "2 weeks", "1 month")
      const durationDays = this.parseDurationToDays(phase.duration);
      const milestone: RoadmapMilestone = {;
        id: `milestone_${phase.id}`;`
        phaseId: phase.id;
        name: phase.name;
        expectedDate: new Date(startDate.getTime() + cumulativeDays * 24 * 60 * 60 * 1000);
        status: 'pending';
        completionCriteria: this.generateCompletionCriteria(phase);
        dependencies: phase.dependencies;
        deliverables: phase.tasks
      }
      this.milestones.set(milestone.id, milestone)
      cumulativeDays += durationDays
    })
  }
  private parseDurationToDays(duration: string): number {
    const match = duration.match(/(\d+)(?:-(\d+))?\s*(day|week|month)/);
    if (!match) return 7 // Default to 1 week
    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : min;
    const avg = (min + max) / 2;
    switch (match[3]) {
      case 'day':
        return avg
      case 'week':
        return avg * 7
      case 'month':
        return avg * 30, default:
        return 7
    }
  }
  private generateCompletionCriteria(phase: RoadmapPhase): CompletionCriterion[] {
    const criteria: CompletionCriterion[] = [];
    // Feature completion criteria
    phase.tasks.forEach((task, index) => {
      criteria.push({
        id: `${phase.id}_feature_${index}`;`
        description: task; type: 'feature';
    validation: {
          method: 'automated';
          script: `validate_feature_${phase.id}_${index}``
        },
        status: 'pending'
      })
    })
    // Test criteria based on phase type
    if (phase.name.toLowerCase().includes('development')) {
      criteria.push({
        id: `${phase.id}_test_coverage`;`
        description: 'Unit test coverage > 80%';
        type: 'test';
    validation: {
          method: 'automated';
          threshold: 80
        },
        status: 'pending'
      })
    }
    // Performance criteria for certain phases
    if (phase.agents.includes('agent_backend') || phase.agents.includes('agent_frontend')) {
      criteria.push({
        id: `${phase.id}_performance`;`
        description: 'API response time < 200ms';
        type: 'performance';
    validation: {
          method: 'automated';
          threshold: 200
        },
        status: 'pending'
      })
    }
    // Documentation criteria
    criteria.push({
      id: `${phase.id}_documentation`;`
      description: 'Technical documentation complete';
      type: 'documentation';
    validation: {
        method: 'manual'
      },
      status: 'pending'
    })
    return criteria
  }
  async validateRoadmap(): Promise<RoadmapValidationResult> {
    const result: RoadmapValidationResult = {;
      roadmapId: this.roadmap.id;
      validationDate: new Date();
      overallStatus: 'on_track';
      completionPercentage: 0;
    milestones: {
        total: this.milestones.size;
        completed: 0;
        inProgress: 0;
        delayed: 0;
        blocked: 0
      },
      deviations: [];
      recommendations: [];
      estimatedCompletionDate: new Date()
    }
    // Validate each milestone
    for (const [id, milestone] of this.milestones) {
      await this.validateMilestone(milestone)
      // Update counts
      switch (milestone.status) {
        case 'completed':
          result.milestones.completed++
          break
        case 'in_progress':
          result.milestones.inProgress++
          break
        case 'delayed':
          result.milestones.delayed++
          result.deviations.push(this.createDelayDeviation(milestone))
          break
        case 'blocked':
          result.milestones.blocked++
          result.deviations.push(this.createBlockedDeviation(milestone))
          break
      }
    }
    // Calculate completion percentage
    result.completionPercentage = Math.round(
      (result.milestones.completed / result.milestones.total) * 100
    )
    // Determine overall status
    if (result.milestones.blocked > 0) {
      result.overallStatus = 'blocked'
    } else if (result.milestones.delayed > result.milestones.total * 0.3) {
      result.overallStatus = 'delayed'
    } else if (result.milestones.delayed > 0) {
      result.overallStatus = 'at_risk'
    }
    // Find next milestone
    result.nextMilestone = this.findNextMilestone()
    // Estimate completion date
    result.estimatedCompletionDate = this.estimateCompletionDate()
    // Generate recommendations
    result.recommendations = this.generateRecommendations(result)
    // Store validation history
    this.validationHistory.push(result)
    return result
  }
  private async validateMilestone(milestone: RoadmapMilestone): Promise<void> {
    const now = new Date();
    // Check if milestone is overdue
    if (now > milestone.expectedDate && milestone.status !== 'completed') {
      milestone.status = 'delayed'
    }
    // Validate completion criteria
    let passedCriteria = 0;
    let failedCriteria = 0;
    for (const criterion of milestone.completionCriteria) {
      const result = await this.validateCriterion(criterion);
      criterion.status = result ? 'passed' : 'failed'
      criterion.lastChecked = now
      if (result) passedCriteria++
      else failedCriteria++
    }
    // Update milestone status based on criteria
    if (passedCriteria === milestone.completionCriteria.length) {
      milestone.status = 'completed'
      milestone.actualDate = now
    } else if (passedCriteria > 0) {
      milestone.status = 'in_progress'
    } else if (failedCriteria > 0 && now > milestone.expectedDate) {
      milestone.status = 'delayed'
    }
    // Check for blockers
    if (milestone.dependencies.length > 0) {
      const blockedByIncomplete = milestone.dependencies.some(dep => {;
        const depMilestone = Array.from(this.milestones.values()).find(m => m.phaseId === dep);
        return depMilestone && depMilestone.status !== 'completed'
      })
      if (blockedByIncomplete) {
        milestone.status = 'blocked'
      }
    }
  }
  private async validateCriterion(criterion: CompletionCriterion): Promise<boolean> {
    switch (criterion.validation.method) {
      case 'automated':
        return this.runAutomatedValidation(criterion)
      case 'manual':
        return this.checkManualValidation(criterion)
      case 'hybrid':
        const auto = await this.runAutomatedValidation(criterion);
        const manual = await this.checkManualValidation(criterion);
        return auto && manual, default:
        return false
    }
  }
  private async runAutomatedValidation(criterion: CompletionCriterion): Promise<boolean> {
    // Simulate automated validation
    try {
      switch (criterion.type) {
        case 'test':
          // Check test coverage
          const coverage = await this.getTestCoverage();
          return coverage >= (criterion.validation.threshold || 80)
        case 'performance':
          // Check performance metrics
          const responseTime = await this.getAverageResponseTime();
          return responseTime <= (criterion.validation.threshold || 200)
        case 'feature':
          // Check if feature endpoint exists and works
          const featureWorks = await this.checkFeatureEndpoint(criterion.description);
          return featureWorks, default:
          return true
      }
    } catch (error) {
      console.error(`Validation error for ${criterion.id}:`, error)`
      return false
    }
  }
  private async checkManualValidation(criterion: CompletionCriterion): Promise<boolean> {
    // In a real system, this would check a database or external system
    // For now, simulate manual validation
    return Math.random() > 0.2 // 80% pass rate
  }
  private async getTestCoverage(): Promise<number> {
    // In reality, this would run coverage tools
    return 75 + Math.random() * 20 // 75-95%
  }
  private async getAverageResponseTime(): Promise<number> {
    // In reality, this would query monitoring system
    return 100 + Math.random() * 150 // 100-250ms
  }
  private async checkFeatureEndpoint(feature: string): Promise<boolean> {
    // In reality, this would make actual API calls
    return Math.random() > 0.1 // 90% success rate
  }
  private createDelayDeviation(milestone: RoadmapMilestone): RoadmapDeviation {
    const delayDays = Math.ceil(;
      (new Date().getTime() - milestone.expectedDate.getTime()) / (24 * 60 * 60 * 1000)
    )
    return {
      type: 'delay';
      severity: delayDays > 14 ? 'high' : delayDays > 7 ? 'medium' : 'low';
      milestoneId: milestone.id;
      description: `${milestone.name} is delayed by ${delayDays} days`;`
      impact: `Project completion may be delayed by approximately ${delayDays} days`;`
      suggestedAction: 'Allocate additional resources or adjust scope'
    }
  }
  private createBlockedDeviation(milestone: RoadmapMilestone): RoadmapDeviation {
    return {
      type: 'blocker';
      severity: 'critical';
      milestoneId: milestone.id;
      description: `${milestone.name} is blocked by incomplete dependencies`;`
      impact: 'Cannot proceed until dependencies are resolved';
      suggestedAction: 'Prioritize completion of blocking dependencies'
    }
  }
  private findNextMilestone(): RoadmapMilestone | undefined {
    return Array.from(this.milestones.values()).find(
      m => m.status === 'pending' || m.status === 'in_progress'
    )
  }
  private estimateCompletionDate(): Date {
    const remainingMilestones = Array.from(this.milestones.values()).filter(;
      m => m.status !== 'completed'
    )
    if (remainingMilestones.length === 0) {
      return new Date()
    }
    // Calculate average delay factor
    const delayFactor = this.calculateDelayFactor();
    // Get the last milestone's expected date
    const lastMilestone = Array.from(this.milestones.values()).reduce((latest, current) => ;
      current.expectedDate > latest.expectedDate ? current : latest
    )
    // Apply delay factor
    const estimatedDate = new Date(lastMilestone.expectedDate);
    estimatedDate.setDate(estimatedDate.getDate() + Math.ceil(delayFactor * 7)) // Add delay in days
    return estimatedDate
  }
  private calculateDelayFactor(): number {
    const delayedMilestones = Array.from(this.milestones.values()).filter(;
      m => m.status === 'delayed' && m.actualDate
    )
    if (delayedMilestones.length === 0) return 0
    const totalDelayDays = delayedMilestones.reduce((sum, m) => {;
      const delay = (m.actualDate!.getTime() - m.expectedDate.getTime()) / (24 * 60 * 60 * 1000);
      return sum + delay
    }, 0)
    return totalDelayDays / delayedMilestones.length / 7 // Convert to weeks
  }
  private generateRecommendations(result: RoadmapValidationResult): string[] {
    const recommendations: string[] = [];
    if (result.overallStatus === 'blocked') {
      recommendations.push('Urgent: Resolve blocking dependencies immediately')
    }
    if (result.milestones.delayed > 0) {
      recommendations.push('Consider reallocating resources to delayed milestones')
      recommendations.push('Review and adjust remaining milestone timelines')
    }
    if (result.completionPercentage < 50 && result.milestones.total > 5) {
      recommendations.push('Consider breaking down large milestones into smaller tasks')
    }
    if (result.deviations.filter(d => d.severity === 'high' || d.severity === 'critical').length > 0) {
      recommendations.push('Schedule emergency planning session to address critical issues')
    }
    // Performance based recommendations
    const recentValidations = this.validationHistory.slice(-3);
    if (recentValidations.length >= 3) {
      const decliningPerformance = recentValidations.every((v, i) => ;
        i === 0 || v.completionPercentage <= recentValidations[i - 1].completionPercentage
      )
      if (decliningPerformance) {
        recommendations.push('Performance trend is declining - consider team health check')
      }
    }
    return recommendations
  }
  getValidationHistory(): RoadmapValidationResult[] {
    return, this.validationHistory
  }
  getMilestoneDetails(milestoneId: string): RoadmapMilestone | undefined {
    return this.milestones.get(milestoneId)
  }
}
