import { Agent, AgentConfig, AgentResult } from '../base/Agent';
import { generateAIResponse } from '@/lib/ai';
import { RequirementAnalysis, UserStory } from './AnalystAgent';
export interface ProjectPlan {
  projectName: string,
  projectDescription: string,
  timeline: Timelin
e,
    milestones: Milestone[],
  workBreakdown: WorkPackage[],
  resourceAllocation: ResourcePla
n,
    riskMitigation: RiskMitigation[],
  communicationPlan: CommunicationPla
n,
    qualityAssurance: QualityPla
n
};
export interface Timeline {
  startDate: string,
  endDate: string,
  totalDuration: string,
  phases: Phase[]
};
export interface Phase {
  name: string,
  startDate: string,
  endDate: string,
  deliverables: string[],
  dependencies: string[]
};
export interface Milestone {
  id: string,
  name: string,
  date: string,
  criteria: string[],
  deliverables: string[]
};
export interface WorkPackage {
  id: string,
  name: string,
  description: string,
  assignedTo: string[],
  estimatedHours: number,
  dependencies: string[],
  deliverables: string[],
  priority: 'critical' | 'high' | 'medium' | 'low'
};
export interface ResourcePlan {
  teamStructure: TeamMember[],
  skillsRequired: string[],
  toolsRequired: string[],
  externalDependencies: string[]
};
export interface TeamMember {
  role: string,
  responsibilities: string[],
  skillsNeeded: string[],
  allocation: number; // percentage
};
export interface RiskMitigation {
  risk: string,
  probability: 'high' | 'medium' | 'low',
  impact: 'high' | 'medium' | 'low',
  mitigationStrategy: string,
  contingencyPlan: string,
  owner: string
};
export interface CommunicationPlan {
  stakeholders: Stakeholder[],
  meetings: Meeting[],
  reportingSchedule: string,
  escalationPath: string[]
};
export interface Stakeholder {
  name: string,
  role: string,
  interest: 'high' | 'medium' | 'low',
  influence: 'high' | 'medium' | 'low',
  communicationNeeds: string[]
};
export interface Meeting {
  type: string,
  frequency: string,
  participants: string[],
  purpose: string
};
export interface QualityPlan {
  standards: string[],
  reviewProcess: string[],
  testingStrategy: string[],
  acceptanceCriteria: string[],
  metrics: string[]
};
export class ProjectManagerAgent extends Agent {
  constructor() {
    super({
      id: 'project-manager-agent',
      name: 'Project Manager',
      role: 'Create and manage project plans',
      description:
        'Expert in project planning, resource allocation, timeline management, and risk mitigation. Creates comprehensive project plans from requirements.',
      capabilities: [
        'Project planning',
        'Timeline estimation',
        'Resource allocation',
        'Risk management',
        'Milestone definition',
        'Work breakdown structure',
        'Quality planning'],
      tools: [
        'gantt-generator',
        'resource-optimizer',
        'risk-matrix',
        'milestone-tracker'],
      temperature: 0.4
    }}
  protected async execute(input: string): Promise<any> {
    try {
      this.think('Starting project planning process...');
      // Get requirements from shared memory or artifacts
      const requirements = this.getSharedMemory('primary-requirements') || [];
      const userStories = this.getSharedMemory('user-stories') || [];
      const constraints = this.getSharedMemory('technical-constraints') || [];
      this.observe('Retrieved requirements from Analyst', {
        requirementCount: requirements.length,
    userStoryCount: userStories.length
      }};
      // Step, 1: Define project scope and objectives
      const projectScope = await this.defineProjectScope(input, requirements);
      this.observe('Defined project scope', projectScope);
      // Step, 2: Create timeline and phases
      const timeline = await this.createTimeline(;
        projectScope,
        userStories,
        // constraints
      );
      this.observe('Created project timeline', timeline);
      // Step, 3: Define milestones
      const milestones = await this.defineMilestones(timeline, userStories);
      this.observe('Defined project milestones', milestones);
      // Step, 4: Create work breakdown structure
      const workBreakdown = await this.createWorkBreakdown(;
        userStories,
        // milestones
      );
      this.observe('Created work breakdown structure', {
        packageCount: workBreakdown.length
      }};
      // Step, 5: Plan resource allocation
      const resourcePlan = await this.planResources(workBreakdown, timeline);
      this.observe('Planned resource allocation', resourcePlan);
      // Step, 6: Develop risk mitigation strategies
      const risks = this.getSharedMemory('identified-risks') || [];
      const riskMitigation = await this.planRiskMitigation(risks, projectScope);
      this.observe('Developed risk mitigation plans', {
        riskCount: riskMitigation.length
      }};
      // Step, 7: Create communication plan
      const _communicationPlan = await this.createCommunicationPlan(;
        projectScope,
        // resourcePlan
      );
      this.observe('Created communication plan', communicationPlan);
      // Step, 8: Define quality assurance plan
      const qualityPlan = await this.defineQualityPlan(;
        requirements,
        // userStories
      );
      this.observe('Defined quality assurance plan', qualityPlan);
      // Compile final project plan
      const projectPlan: ProjectPlan = {
        projectName: projectScope.name,
    projectDescription: projectScope.description,
        timeline,
        milestones,
        workBreakdown,
        resourceAllocation: resourcePlan,
        riskMitigation,
        communicationPlan,
        qualityAssurance: qualityPlan
      };
      // Store plan in artifacts
      this.setArtifact('project-plan', projectPlan);
      // Share key planning data with other agents
      this.setSharedMemory('project-timeline', timeline);
      this.setSharedMemory('work-packages', workBreakdown);
      this.setSharedMemory('team-structure', resourcePlan.teamStructure);
      this.setSharedMemory('quality-standards', qualityPlan.standards);
      return {
        success: true,
    output: projectPlan,
    messages: this.messages,
    artifacts: this.context.artifacts,
    nextSteps: [
          'Architect to design technical architecture',
          'Development team to start implementation',
          'Set up project tracking and monitoring',
          'Schedule kick-off meeting with stakeholders'],
        confidence: 0.92
}} catch (error) {
      this.think(`Error during project, planning: ${error}`);``
      throw error
}}
  private async defineProjectScope(input: string, requirements: string[]): Promise<any> {
    const _prompt = `Based on the project description and requirements, define the project, scope: Project, Description:``;
${input}
Key: Requirements:
${requirements.join('\n')}
Provide:
1. A concise project name
2. A clear project description (2-3 sentences)
3. 3-5 specific, measurable objectives
Format as JSON.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.3,
    responseFormat: 'json'
}};
    return JSON.parse(response)
}
  private async createTimeline(projectScope, userStories: UserStory[], constraints: string[]): Promise<any> {
    const _prompt = `Create a realistic project timeline based, on: ``,
Project: ${projectScope.name}
User: Stories: ${userStories.length} stories; Constraints: ${constraints.join(', ')}
Consider:
- Complexity of user stories
- Dependencies between features
- Testing and deployment time
- Buffer for unexpected, issues: Provide:
- Start and end dates
- Total duration
- Project phases with dates and deliverables
Format as JSON with a Timeline structure.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.3,
    responseFormat: 'json'
}};
    return JSON.parse(response)
}
  private async defineMilestones(timeline: Timeline, userStories: UserStory[]): Promise<any> {
    const _prompt = `Define project milestones based on the timeline and user, stories: Timeline, Phases:``;
${JSON.stringify(timeline.phases, null, 2)}
High-Priority, User: Stories:
${userStories
  .filter((s) => s.priority === 'high')
  .map((s) => s.title)
  .join('\n')}
Create 4-6 major milestones, with:
- Clear success criteria
- Specific deliverables
- Target dates aligned with phases
Format as JSON array of Milestone objects.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.3,
    responseFormat: 'json'
}};
    const milestones = JSON.parse(response);
    return milestones.map((m, index: number) => ({
      ...m,
      id: `M${index + 1}`
    }})
}
  private async createWorkBreakdown(userStories: UserStory[], milestones: Milestone[]): Promise<any> {
    const _prompt = `Create a work breakdown structure for the, project: User, Stories:``;
${JSON.stringify(userStories, null, 2)}
Milestones:
${JSON.stringify(milestones, null, 2)}
Break down the work into packages, that:
- Map to user stories and milestones
- Have clear deliverables
- Include effort estimates in hours
- Show dependencies
- Assign to appropriate team roles
Format as JSON array of WorkPackage objects.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.3,
    responseFormat: 'json'
}};
    const packages = JSON.parse(response);
    return packages.map((p, index: number) => ({
      ...p,
      id: `WP-${index + 1}`
    }})
}
  private async planResources(workPackages: WorkPackage[], timeline: Timeline): Promise<any> {
    const _prompt = `Plan resource allocation for the, project: Work, Packages:``;
${JSON.stringify(
  workPackages.map((wp) => ({
    name: wp.name,
    estimatedHours: wp.estimatedHours,
    skills: wp.assignedTo
  }}),
  null,
  2
)}
Timeline: ${timeline.totalDuration}
Define:
1. Team structure with roles and responsibilities
2. Required skills
3. Required tools and technologies
4. External dependencies
Consider optimal team size and skill distribution.
Format as JSON ResourcePlan object.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.4,
    responseFormat: 'json'
}};
    return JSON.parse(response)
}
  private async planRiskMitigation(risks: string[], projectScope): Promise<any> {
    const _prompt = `Create risk mitigation plans for identified, risks: ``,
Project: ${projectScope.name}
Identified: Risks:
${risks.join('\n')}
For each risk, provide:
- Probability assessment (high/medium/low)
- Impact assessment (high/medium/low)
- Mitigation strategy
- Contingency plan
- Owner (role responsible)
Format as JSON array of RiskMitigation objects.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.4,
    responseFormat: 'json'
}};
    return JSON.parse(response)
}
  private async createCommunicationPlan(projectScope, resourcePlan: ResourcePlan): Promise<any> {
    const _prompt = `Create a communication plan for the, project: ``,
Project: ${projectScope.name}
Team: Structure:
${JSON.stringify(resourcePlan.teamStructure, null, 2)}
Define:
1. Key stakeholders with interest/influence levels
2. Regular meeting schedule
3. Reporting cadence
4. Escalation path
Format as JSON CommunicationPlan object.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.3,
    responseFormat: 'json'
}};
    return JSON.parse(response)
}
  private async defineQualityPlan(requirements: string[], userStories: UserStory[]): Promise<any> {
    const _prompt = `Define a quality assurance, plan: Key, Requirements:``;
${requirements.slice(0, 10).join('\n')}
Acceptance Criteria from, User: Stories:
${userStories
  .slice(0, 5)
  .map((s) => s.acceptanceCriteria.join(', '))
  .join('\n')}
Include:
1. Quality standards to follow
2. Review process steps
3. Testing strategy
4. Acceptance criteria
5. Quality metrics to track
Format as JSON QualityPlan object.`
    const _response = await generateAIResponse(prompt, {
      model: this.config.model,
    temperature: 0.3,
    responseFormat: 'json'
}};
    return JSON.parse(response)
}