export interface Task {
  id: string;
  description: string;
  type: 'atomic' | 'composite' | 'parallel' | 'sequential';
  dependencies: string[];
  priority: number;
  estimatedDuration: number;
  requiredCapabilities: string[];
  subtasks?: Task[];
}

export interface DecompositionPlan {
  tasks: Task[];
  dependencies: Map<string, string[]>;
  criticalPath: string[];
  parallelizableGroups: string[][];
  estimatedTotalDuration: number;
}

export class TaskDecomposer {
  async decompose(options: {
    task: string;
    constraints: string[];
    allowParallel: boolean;
  }): Promise<DecompositionPlan> {
    // Analyze task complexity
    const complexity = await this.analyzeComplexity(options.task);
    
    // Generate initial decomposition
    const initialTasks = await this.generateInitialDecomposition(options.task, complexity);
    
    // Apply constraints
    const constrainedTasks = this.applyConstraints(initialTasks, options.constraints);
    
    // Identify dependencies
    const dependencies = await this.identifyDependencies(constrainedTasks);
    
    // Optimize for parallel execution if allowed
    const optimizedTasks = options.allowParallel 
      ? this.optimizeForParallel(constrainedTasks, dependencies)
      : constrainedTasks;
    
    // Calculate critical path
    const criticalPath = this.calculateCriticalPath(optimizedTasks, dependencies);
    
    // Group parallelizable tasks
    const parallelGroups = this.identifyParallelGroups(optimizedTasks, dependencies);
    
    // Estimate durations
    const totalDuration = this.estimateTotalDuration(optimizedTasks, dependencies, parallelGroups);
    
    return {
      tasks: optimizedTasks,
      dependencies,
      criticalPath,
      parallelizableGroups: parallelGroups,
      estimatedTotalDuration: totalDuration,
    };
  }

  async createWorkflowPlan(workflow: string, agents: string[]): Promise<any> {
    // Parse workflow description
    const workflowSteps = await this.parseWorkflow(workflow);
    
    // Match steps to available agents
    const agentAssignments = this.assignAgentsToSteps(workflowSteps, agents);
    
    // Create execution plan
    const executionPlan = this.createExecutionPlan(workflowSteps, agentAssignments);
    
    return {
      steps: workflowSteps,
      assignments: agentAssignments,
      execution: executionPlan,
    };
  }

  private async analyzeComplexity(task: string): Promise<number> {
    // Analyze task description to estimate complexity
    const factors = {
      length: task.length / 100,
      technicalTerms: this.countTechnicalTerms(task),
      dependencies: this.estimateDependencies(task),
      uncertainty: this.estimateUncertainty(task),
    };
    
    return Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;
  }

  private async generateInitialDecomposition(task: string, complexity: number): Promise<Task[]> {
    // Generate tasks based on complexity
    const numSubtasks = Math.ceil(complexity * 5);
    const tasks: Task[] = [];
    
    // Create hierarchical decomposition
    const rootTask: Task = {
      id: 'root',
      description: task,
      type: 'composite',
      dependencies: [],
      priority: 1,
      estimatedDuration: 0,
      requiredCapabilities: [],
      subtasks: [],
    };
    
    // Generate subtasks
    for (let i = 0; i < numSubtasks; i++) {
      const subtask: Task = {
        id: `task_${i}`,
        description: `Subtask ${i + 1} of ${task}`,
        type: 'atomic',
        dependencies: i > 0 ? [`task_${i - 1}`] : [],
        priority: 0.8,
        estimatedDuration: Math.random() * 60 + 30, // 30-90 minutes
        requiredCapabilities: this.inferRequiredCapabilities(task),
      };
      tasks.push(subtask);
    }
    
    rootTask.subtasks = tasks;
    return [rootTask, ...tasks];
  }

  private applyConstraints(tasks: Task[], constraints: string[]): Task[] {
    // Apply each constraint to modify tasks
    let modifiedTasks = [...tasks];
    
    for (const constraint of constraints) {
      modifiedTasks = this.applyConstraint(modifiedTasks, constraint);
    }
    
    return modifiedTasks;
  }

  private applyConstraint(tasks: Task[], constraint: string): Task[] {
    // Parse and apply individual constraint
    if (constraint.includes('deadline')) {
      return this.applyDeadlineConstraint(tasks, constraint);
    } else if (constraint.includes('resource')) {
      return this.applyResourceConstraint(tasks, constraint);
    } else if (constraint.includes('quality')) {
      return this.applyQualityConstraint(tasks, constraint);
    }
    
    return tasks;
  }

  private async identifyDependencies(tasks: Task[]): Promise<Map<string, string[]>> {
    const dependencies = new Map<string, string[]>();
    
    for (const task of tasks) {
      if (task.dependencies.length > 0) {
        dependencies.set(task.id, task.dependencies);
      }
      
      // Infer additional dependencies based on task descriptions
      const inferredDeps = await this.inferDependencies(task, tasks);
      if (inferredDeps.length > 0) {
        const existing = dependencies.get(task.id) || [];
        dependencies.set(task.id, [...new Set([...existing, ...inferredDeps])]);
      }
    }
    
    return dependencies;
  }

  private optimizeForParallel(tasks: Task[], dependencies: Map<string, string[]>): Task[] {
    // Identify tasks that can be parallelized
    const parallelCandidates = this.findParallelCandidates(tasks, dependencies);
    
    // Reorganize tasks for optimal parallel execution
    return this.reorganizeForParallel(tasks, parallelCandidates);
  }

  private calculateCriticalPath(tasks: Task[], dependencies: Map<string, string[]>): string[] {
    // Use CPM algorithm to find critical path
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    const criticalPath: string[] = [];
    
    // Find tasks with no dependencies (start nodes)
    const startTasks = tasks.filter(t => !dependencies.has(t.id) || dependencies.get(t.id)!.length === 0);
    
    // Perform forward pass to calculate earliest start times
    const earliestStart = new Map<string, number>();
    const earliestFinish = new Map<string, number>();
    
    for (const task of startTasks) {
      this.calculateEarliestTimes(task.id, taskMap, dependencies, earliestStart, earliestFinish);
    }
    
    // Find the maximum earliest finish time
    let maxFinishTime = 0;
    let endTaskId = '';
    
    for (const [taskId, finishTime] of earliestFinish) {
      if (finishTime > maxFinishTime) {
        maxFinishTime = finishTime;
        endTaskId = taskId;
      }
    }
    
    // Backward pass to find critical path
    this.traceCriticalPath(endTaskId, dependencies, earliestStart, taskMap, criticalPath);
    
    return criticalPath.reverse();
  }

  private calculateEarliestTimes(
    taskId: string,
    taskMap: Map<string, Task>,
    dependencies: Map<string, string[]>,
    earliestStart: Map<string, number>,
    earliestFinish: Map<string, number>
  ): void {
    if (earliestStart.has(taskId)) return;
    
    const task = taskMap.get(taskId)!;
    const deps = dependencies.get(taskId) || [];
    
    let maxDepFinish = 0;
    for (const depId of deps) {
      if (!earliestFinish.has(depId)) {
        this.calculateEarliestTimes(depId, taskMap, dependencies, earliestStart, earliestFinish);
      }
      maxDepFinish = Math.max(maxDepFinish, earliestFinish.get(depId)!);
    }
    
    earliestStart.set(taskId, maxDepFinish);
    earliestFinish.set(taskId, maxDepFinish + task.estimatedDuration);
  }

  private traceCriticalPath(
    taskId: string,
    dependencies: Map<string, string[]>,
    earliestStart: Map<string, number>,
    taskMap: Map<string, Task>,
    criticalPath: string[]
  ): void {
    criticalPath.push(taskId);
    
    const deps = dependencies.get(taskId) || [];
    if (deps.length === 0) return;
    
    // Find the dependency that determines the start time
    const taskStart = earliestStart.get(taskId)!;
    
    for (const depId of deps) {
      const depFinish = earliestStart.get(depId)! + taskMap.get(depId)!.estimatedDuration;
      if (Math.abs(depFinish - taskStart) < 0.001) {
        this.traceCriticalPath(depId, dependencies, earliestStart, taskMap, criticalPath);
        break;
      }
    }
  }

  private identifyParallelGroups(tasks: Task[], dependencies: Map<string, string[]>): string[][] {
    const groups: string[][] = [];
    const assigned = new Set<string>();
    
    // Group tasks by their dependency level
    const levels = this.calculateDependencyLevels(tasks, dependencies);
    
    for (const [level, taskIds] of levels) {
      const group = taskIds.filter(id => !assigned.has(id));
      if (group.length > 1) {
        groups.push(group);
        group.forEach(id => assigned.add(id));
      }
    }
    
    return groups;
  }

  private calculateDependencyLevels(
    tasks: Task[],
    dependencies: Map<string, string[]>
  ): Map<number, string[]> {
    const levels = new Map<number, string[]>();
    const taskLevels = new Map<string, number>();
    
    // Calculate level for each task
    for (const task of tasks) {
      this.calculateTaskLevel(task.id, dependencies, taskLevels);
    }
    
    // Group by level
    for (const [taskId, level] of taskLevels) {
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)!.push(taskId);
    }
    
    return levels;
  }

  private calculateTaskLevel(
    taskId: string,
    dependencies: Map<string, string[]>,
    taskLevels: Map<string, number>
  ): number {
    if (taskLevels.has(taskId)) {
      return taskLevels.get(taskId)!;
    }
    
    const deps = dependencies.get(taskId) || [];
    if (deps.length === 0) {
      taskLevels.set(taskId, 0);
      return 0;
    }
    
    let maxDepLevel = 0;
    for (const depId of deps) {
      const depLevel = this.calculateTaskLevel(depId, dependencies, taskLevels);
      maxDepLevel = Math.max(maxDepLevel, depLevel);
    }
    
    const level = maxDepLevel + 1;
    taskLevels.set(taskId, level);
    return level;
  }

  private estimateTotalDuration(
    tasks: Task[],
    dependencies: Map<string, string[]>,
    parallelGroups: string[][]
  ): number {
    // Calculate duration considering parallel execution
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    let totalDuration = 0;
    
    // For each parallel group, take the max duration
    const groupedTasks = new Set(parallelGroups.flat());
    
    for (const group of parallelGroups) {
      const groupDuration = Math.max(...group.map(id => taskMap.get(id)!.estimatedDuration));
      totalDuration += groupDuration;
    }
    
    // Add sequential tasks
    for (const task of tasks) {
      if (!groupedTasks.has(task.id) && task.type !== 'composite') {
        totalDuration += task.estimatedDuration;
      }
    }
    
    return totalDuration;
  }

  // Helper methods
  private countTechnicalTerms(text: string): number {
    const technicalTerms = ['algorithm', 'database', 'API', 'framework', 'architecture', 'implementation'];
    return technicalTerms.filter(term => text.toLowerCase().includes(term.toLowerCase())).length;
  }

  private estimateDependencies(text: string): number {
    const dependencyWords = ['depends', 'requires', 'after', 'before', 'then', 'first'];
    return dependencyWords.filter(word => text.toLowerCase().includes(word)).length;
  }

  private estimateUncertainty(text: string): number {
    const uncertaintyWords = ['might', 'maybe', 'possibly', 'could', 'should', 'approximate'];
    return uncertaintyWords.filter(word => text.toLowerCase().includes(word)).length * 0.5;
  }

  private inferRequiredCapabilities(task: string): string[] {
    const capabilities: string[] = [];
    
    if (task.toLowerCase().includes('code') || task.toLowerCase().includes('implement')) {
      capabilities.push('coding');
    }
    if (task.toLowerCase().includes('research') || task.toLowerCase().includes('analyze')) {
      capabilities.push('research');
    }
    if (task.toLowerCase().includes('design') || task.toLowerCase().includes('architect')) {
      capabilities.push('design');
    }
    if (task.toLowerCase().includes('test') || task.toLowerCase().includes('verify')) {
      capabilities.push('testing');
    }
    
    return capabilities;
  }

  private async inferDependencies(task: Task, allTasks: Task[]): Promise<string[]> {
    // Infer dependencies based on task descriptions
    const dependencies: string[] = [];
    
    for (const otherTask of allTasks) {
      if (otherTask.id === task.id) continue;
      
      // Check if this task mentions needing output from another
      if (task.description.toLowerCase().includes(otherTask.description.toLowerCase().split(' ')[0])) {
        dependencies.push(otherTask.id);
      }
    }
    
    return dependencies;
  }

  private findParallelCandidates(
    tasks: Task[],
    dependencies: Map<string, string[]>
  ): Set<string> {
    const candidates = new Set<string>();
    
    // Tasks at the same dependency level can potentially be parallelized
    const levels = this.calculateDependencyLevels(tasks, dependencies);
    
    for (const [level, taskIds] of levels) {
      if (taskIds.length > 1) {
        taskIds.forEach(id => candidates.add(id));
      }
    }
    
    return candidates;
  }

  private reorganizeForParallel(tasks: Task[], parallelCandidates: Set<string>): Task[] {
    // Reorganize tasks to group parallel tasks together
    const parallelTasks = tasks.filter(t => parallelCandidates.has(t.id));
    const sequentialTasks = tasks.filter(t => !parallelCandidates.has(t.id));
    
    // Mark parallel tasks
    parallelTasks.forEach(t => {
      if (t.type === 'atomic') {
        t.type = 'parallel';
      }
    });
    
    return [...sequentialTasks, ...parallelTasks];
  }

  private applyDeadlineConstraint(tasks: Task[], constraint: string): Task[] {
    // Reduce estimated durations to meet deadline
    const deadlineMatch = constraint.match(/deadline:\s*(\d+)/);
    if (deadlineMatch) {
      const deadline = parseInt(deadlineMatch[1]);
      const currentTotal = tasks.reduce((sum, t) => sum + t.estimatedDuration, 0);
      
      if (currentTotal > deadline) {
        const ratio = deadline / currentTotal;
        tasks.forEach(t => {
          t.estimatedDuration *= ratio;
        });
      }
    }
    
    return tasks;
  }

  private applyResourceConstraint(tasks: Task[], constraint: string): Task[] {
    // Modify task requirements based on resource constraints
    return tasks.map(t => ({
      ...t,
      requiredCapabilities: t.requiredCapabilities.filter(cap => 
        !constraint.toLowerCase().includes(`no ${cap}`)
      ),
    }));
  }

  private applyQualityConstraint(tasks: Task[], constraint: string): Task[] {
    // Add quality assurance subtasks
    if (constraint.toLowerCase().includes('high quality')) {
      const qaTasks: Task[] = [];
      
      tasks.forEach((task, index) => {
        if (task.type === 'atomic') {
          const qaTask: Task = {
            id: `${task.id}_qa`,
            description: `Quality assurance for ${task.description}`,
            type: 'atomic',
            dependencies: [task.id],
            priority: 0.9,
            estimatedDuration: task.estimatedDuration * 0.3,
            requiredCapabilities: ['testing', 'review'],
          };
          qaTasks.push(qaTask);
        }
      });
      
      return [...tasks, ...qaTasks];
    }
    
    return tasks;
  }

  private async parseWorkflow(workflow: string): Promise<any[]> {
    // Parse workflow description into steps
    const steps = workflow.split(/[,;.]/).map(s => s.trim()).filter(s => s.length > 0);
    
    return steps.map((step, index) => ({
      id: `step_${index}`,
      description: step,
      order: index,
    }));
  }

  private assignAgentsToSteps(steps: any[], agents: string[]): Map<string, string> {
    const assignments = new Map<string, string>();
    
    // Simple round-robin assignment for now
    steps.forEach((step, index) => {
      const agentIndex = index % agents.length;
      assignments.set(step.id, agents[agentIndex]);
    });
    
    return assignments;
  }

  private createExecutionPlan(steps: any[], assignments: Map<string, string>): any {
    return {
      sequential: steps.map(step => ({
        step: step.id,
        agent: assignments.get(step.id),
        action: step.description,
      })),
      parallel: [], // Could identify parallel opportunities
    };
  }
}