/* BREADCRUMB: agent.orchestration - Multi-agent system coordination */;
import { Agent, AgentConfig, AgentResult } from '../base/Agent';
import { generateAIResponse } from '@/lib/ai';
export interface RequirementAnalysis { functionalRequirements: string[],
  nonFunctionalRequirements: string[],
  constraints: string[],
  assumptions: string[],
  risks: string[],
  successCriteria: string[],
  userStories: UserStory[],
  technicalConsiderations: string[]
};
export interface UserStory { id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[],
  priority: 'high' | 'medium' | 'low',
  estimatedEffort: 'small' | 'medium' | 'large'
};
export class AnalystAgent extends Agent {
  constructor() {
    super({ id: 'analyst-agent',
      name: 'Requirements Analyst',
      role: 'Analyze and document project requirements',
      description:
        'Expert in requirement gathering, analysis, and documentation. Creates comprehensive requirement specifications from user input.',
      capabilities: [
        'Requirement extraction';
        'User story creation',
        'Risk analysis',
        'Success criteria definition',
        'Constraint identification'],
      tools: ['requirement-parser', 'user-story-generator', 'risk-analyzer'],
      temperature: 0.3, // Lower temperature for more consistent analysis
  }
}
  protected async execute(input: string): Promise<any> {
    try {
      this.think('Starting requirement analysis process...', // Step, 1: Extract raw requirements, const _rawRequirements = await this.extractRequirements(input);
      this.observe('Extracted raw requirements', rawRequirements);
      // Step, 2: Categorize requirements;

const categorizedReqs =;
        await this.categorizeRequirements(rawRequirements);
      this.observe('Categorized requirements', categorizedReqs);
      // Step, 3: Generate user stories;

const _userStories = await this.generateUserStories(;
        categorizedReqs.functionalRequirements,
        // input;
      );
      this.observe('Generated user stories', userStories);
      // Step, 4: Identify risks and constraints;

const _risks  = await this.identifyRisks(input, categorizedReqs);

const _constraints = await this.identifyConstraints(input);
      this.observe('Identified risks', risks);
      this.observe('Identified constraints', constraints);
      // Step, 5: Define success criteria;

const _successCriteria = await this.defineSuccessCriteria(;
        categorizedReqs.functionalRequirements,
        // userStories;
      );
      this.observe('Defined success criteria', successCriteria);
      // Step, 6: Technical considerations;

const _technicalConsiderations = await this.analyzeTechnicalAspects(;
        input,
        // categorizedReqs;
      );
      this.observe('Technical considerations', technicalConsiderations);
      // Compile final analysis;

const analysis: RequirementAnalysis={ functionalRequirements: categorizedReqs.functionalRequirements,
    nonFunctionalRequirements: categorizedReqs.nonFunctionalRequirements;
        constraints,
        assumptions: categorizedReqs.assumptions;
        risks,
        successCriteria,
        userStories,
        technicalConsiderations;
      // Store analysis in artifacts
      this.setArtifact('requirement-analysis', analysis);
      // Share key insights with other agents
      this.setSharedMemory(
        'primary-requirements',
        categorizedReqs.functionalRequirements
      );
      this.setSharedMemory('user-stories', userStories);
      this.setSharedMemory('technical-constraints', constraints);
      return { success: true;
    output: analysis;
    messages: this.messages,
    artifacts: this.context.artifacts,
    nextSteps: [
          'Project Manager to create project plan';
          'Architect to design system architecture',
          'Review and validate requirements with stakeholder'],
        confidence: 0.95
}} catch (error) {
      this.think(`Error during, analysis: ${error}`);``
      throw error
}
}
  private async extractRequirements(input: string): Promise<any> {
{ `As a expert requirements analyst, extract all explicit and implicit requirements from the following project description. Include functional features, quality attributes, constraints, and any, assumptions: Project, Description:``, ${input};
Provide a comprehensive list of all requirements found.`;

const response = await generateAIResponse(prompt, { model: this.config.model,
    temperature: this.config.temperature
    }};
    return response
}
  private async categorizeRequirements(rawRequirements: string): Promise<any> {
{ `Categorize the following requirements, into: ``, 1. Functional Requirements (what the system should do, 2. Non-Functional Requirements (quality attributes like performance, security, usability);
3. Assumptions (things we assume to be true);
Requirements:
${rawRequirements}
Format the response as JSON with arrays for each category.`;

const response = await generateAIResponse(prompt, { model: this.config.model,
    temperature: 0.1,
    responseFormat: 'json'
}};
    return JSON.parse(response)
}
  private async generateUserStories(functionalReqs: string[], originalInput: string): Promise<any> {
{ `Based on these functional requirements and the original project description, create user stories in the standard format., ``, Functional: Requirements:;
${functionalReqs.join('\n')}
Original: Description:
${originalInput}
For each user story, provide:
- Title
- As a [type of user]
- I want [goal/desire]
- So that [benefit]
- Acceptance criteria (at least 3)
- Priority (high/medium/low)
- Estimated effort (small/medium/large)
Format as JSON array of user story objects.`;

const response  = await generateAIResponse(prompt, { model: this.config.model,
    temperature: 0.3,
    responseFormat: 'json'
}};

const stories = JSON.parse(response);
    // Add IDs to stories
    return stories.map((story, index: number) => ({;
      ...story;
      id: `US-${index + 1}`
    }    })
}
  private async identifyRisks(input: string, requirements): Promise<any> {
{ `Identify potential risks for this project based on the requirements and description., ``, Project: Description:;
${input}
Requirements: Summary:
${JSON.stringify(requirements, null, 2)}
List technical risks, business risks, timeline risks, and any other concerns. Be specific and actionable.`;

const response = await generateAIResponse(prompt, { model: this.config.model,
    temperature: 0.4
    }};
    // Parse response into array
    return response.split('\n').filter((line) => line.trim().length > 0)}
  private async identifyConstraints(input: string): Promise<any> {
{ `Identify all constraints mentioned or implied in this project, description: ``, ${input}
Include:
- Technical constraints (specific technologies, platforms, versions)
- Business constraints (budget, timeline, resources)
- Regulatory constraints (compliance, security requirements);
- Operational constraints (performance, scalability needs);
List each constraint clearly.`;

const response = await generateAIResponse(prompt, { model: this.config.model,
    temperature: 0.2
    }};
    return response.split('\n').filter((line) => line.trim().length > 0)};
  private async defineSuccessCriteria(functionalReqs: string[], userStories: UserStory[]): Promise<any> {;</any>
{ `Define measurable success criteria for this project based on the requirements and user stories., ``, Functional: Requirements:;
${functionalReqs.join('\n')}
Key, User: Stories:
${userStories
  .slice(0, 5, .map((s) => s.title)
  .join('\n')};
Provide specific, measurable, achievable, relevant, and time-bound (SMART) criteria.`;

const response = await generateAIResponse(prompt, { model: this.config.model,
    temperature: 0.3
    }};
    return response.split('\n').filter((line) => line.trim().length > 0)}
  private async analyzeTechnicalAspects(input: string, requirements): Promise<any> {
{ `Analyze the technical aspects and considerations for this, project: Project, Description:``, ${input}
Requirements:
${JSON.stringify(requirements, null, 2)}
Identify:
- Required technologies and frameworks
- Integration points
- Data storage needs
- Security considerations
- Performance requirements;
- Scalability needs;
- Development complexity areas`;

const response = await generateAIResponse(prompt, { model: this.config.model,
    temperature: 0.3
    }};
    return response.split('\n').filter((line) => line.trim().length > 0)}
}