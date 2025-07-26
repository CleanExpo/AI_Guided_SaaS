import { ProjectAnalyzer } from '../analyzers/ProjectAnalyzer.js';
import { DependencyGuardian } from '../guardians/DependencyGuardian.js';
import { ProductionValidator } from '../validators/ProductionValidator.js';

export interface TodoItem {
  id: string;
  phase: 'immediate' | 'dependencies' | 'production';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  task: string;
  description: string;
  command?: string;
  estimatedEffort?: string;
  dependencies?: string[];
  completed: boolean;
}

export class TodoListManager {
  private projectAnalyzer: ProjectAnalyzer;
  private dependencyGuardian: DependencyGuardian;
  private productionValidator: ProductionValidator;

  constructor() {
    this.projectAnalyzer = new ProjectAnalyzer();
    this.dependencyGuardian = new DependencyGuardian();
    this.productionValidator = new ProductionValidator();
  }

  async generateTodoList(projectPath: string, priorityFilter: string = 'all'): Promise<string> {
    // Gather all analysis data
    const [projectAnalysis, dependencyReport, productionValidation] = await Promise.all([
      this.projectAnalyzer.analyze(projectPath, 'deep'),
      this.dependencyGuardian.check(projectPath, { checkSecurity: true, checkUpdates: true }),
      this.productionValidator.validate(projectPath, 'production'),
    ]);

    // Generate todos from all sources
    const todos: TodoItem[] = [
      ...this.generateProjectTodos(projectAnalysis, projectPath),
      ...this.generateDependencyTodos(dependencyReport),
      ...this.generateProductionTodos(productionValidation),
    ];

    // Sort by priority and phase
    const sortedTodos = this.sortTodos(todos);

    // Filter by priority if requested
    const filteredTodos = priorityFilter === 'all' 
      ? sortedTodos 
      : sortedTodos.filter(todo => todo.priority === priorityFilter);

    // Format as actionable list
    return this.formatTodoList(filteredTodos, projectAnalysis);
  }

  private generateProjectTodos(analysis: any, projectPath: string): TodoItem[] {
    const todos: TodoItem[] = [];
    let todoId = 1;

    // Missing components
    analysis.missingComponents.forEach((component: string) => {
      todos.push({
        id: `PROJ-${todoId++}`,
        phase: 'immediate',
        priority: this.getComponentPriority(component),
        category: 'Project Structure',
        task: `Add ${component}`,
        description: this.getComponentDescription(component),
        command: this.getComponentCommand(component, projectPath),
        estimatedEffort: this.getComponentEffort(component),
        completed: false,
      });
    });

    // Test coverage
    if (analysis.fileStats.testFiles < analysis.fileStats.sourceFiles * 0.5) {
      todos.push({
        id: `PROJ-${todoId++}`,
        phase: 'immediate',
        priority: 'high',
        category: 'Testing',
        task: 'Increase test coverage',
        description: `Current coverage is low. Add tests for ${analysis.fileStats.sourceFiles - analysis.fileStats.testFiles} source files`,
        command: 'npm test -- --coverage',
        estimatedEffort: '2-3 days',
        completed: false,
      });
    }

    // Documentation
    if (!analysis.structure.hasDocumentation) {
      todos.push({
        id: `PROJ-${todoId++}`,
        phase: 'production',
        priority: 'medium',
        category: 'Documentation',
        task: 'Create project documentation',
        description: 'Add README.md with setup instructions, API documentation, and contribution guidelines',
        estimatedEffort: '1 day',
        completed: false,
      });
    }

    return todos;
  }

  private generateDependencyTodos(report: any): TodoItem[] {
    const todos: TodoItem[] = [];
    let todoId = 1;

    // Critical vulnerabilities
    report.vulnerabilities
      .filter((v: any) => v.severity === 'critical' || v.severity === 'high')
      .forEach((vuln: any) => {
        todos.push({
          id: `DEP-${todoId++}`,
          phase: 'immediate',
          priority: 'critical',
          category: 'Security',
          task: `Fix ${vuln.severity} vulnerability in ${vuln.name}`,
          description: vuln.title,
          command: `npm update ${vuln.name} --save`,
          estimatedEffort: '30 minutes',
          completed: false,
        });
      });

    // Major updates
    const majorUpdates = report.outdated.filter((d: any) => d.severity === 'major');
    if (majorUpdates.length > 5) {
      todos.push({
        id: `DEP-${todoId++}`,
        phase: 'dependencies',
        priority: 'medium',
        category: 'Dependencies',
        task: 'Update major dependencies',
        description: `${majorUpdates.length} dependencies have major version updates available`,
        command: 'npm update --save',
        estimatedEffort: '1-2 days',
        dependencies: ['All tests pass'],
        completed: false,
      });
    }

    // Conflicts
    if (report.conflicts.length > 0) {
      todos.push({
        id: `DEP-${todoId++}`,
        phase: 'immediate',
        priority: 'high',
        category: 'Dependencies',
        task: 'Resolve dependency conflicts',
        description: `${report.conflicts.length} conflicting dependencies detected`,
        command: 'npm dedupe',
        estimatedEffort: '2-4 hours',
        completed: false,
      });
    }

    return todos;
  }

  private generateProductionTodos(validation: any): TodoItem[] {
    const todos: TodoItem[] = [];
    let todoId = 1;

    validation.criticalIssues.forEach((issue: any) => {
      todos.push({
        id: `PROD-${todoId++}`,
        phase: 'production',
        priority: 'critical',
        category: 'Production Readiness',
        task: issue.title,
        description: issue.description,
        command: issue.fix,
        estimatedEffort: issue.effort || '1-2 hours',
        completed: false,
      });
    });

    validation.warnings.forEach((warning: any) => {
      todos.push({
        id: `PROD-${todoId++}`,
        phase: 'production',
        priority: 'medium',
        category: 'Production Optimization',
        task: warning.title,
        description: warning.description,
        command: warning.fix,
        estimatedEffort: warning.effort || '30 minutes',
        completed: false,
      });
    });

    return todos;
  }

  private sortTodos(todos: TodoItem[]): TodoItem[] {
    const phaseOrder = { immediate: 0, dependencies: 1, production: 2 };
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

    return todos.sort((a, b) => {
      // First sort by phase
      const phaseDiff = phaseOrder[a.phase] - phaseOrder[b.phase];
      if (phaseDiff !== 0) return phaseDiff;

      // Then by priority
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private formatTodoList(todos: TodoItem[], analysis: any): string {
    const phases = {
      immediate: todos.filter(t => t.phase === 'immediate'),
      dependencies: todos.filter(t => t.phase === 'dependencies'),
      production: todos.filter(t => t.phase === 'production'),
    };

    let output = `# 📋 Dynamic TODO List

**Project Status**: ${analysis.phase} phase (${analysis.completionPercentage}% complete)
**Total Tasks**: ${todos.length}
**Critical**: ${todos.filter(t => t.priority === 'critical').length} | **High**: ${todos.filter(t => t.priority === 'high').length} | **Medium**: ${todos.filter(t => t.priority === 'medium').length}

---

## Phase 1: Immediate Actions (${phases.immediate.length} tasks)
*These tasks should be completed first as they block other work*

${this.formatPhase(phases.immediate)}

## Phase 2: Dependencies Resolution (${phases.dependencies.length} tasks)
*Tasks that depend on Phase 1 completion*

${this.formatPhase(phases.dependencies)}

## Phase 3: Production Preparation (${phases.production.length} tasks)
*Final tasks before deployment*

${this.formatPhase(phases.production)}

---

## 📊 Effort Summary
- **Total Estimated Effort**: ${this.calculateTotalEffort(todos)}
- **Critical Path**: ${this.identifyCriticalPath(todos)}

## 🎯 Next Steps
1. Start with all critical priority items in Phase 1
2. Run tests after each major change
3. Update this list after completing each phase

*Generated on ${new Date().toLocaleString()}*
`;

    return output;
  }

  private formatPhase(todos: TodoItem[]): string {
    if (todos.length === 0) return '*No tasks in this phase*\n';

    return todos.map(todo => {
      const priority = this.getPriorityEmoji(todo.priority);
      const checkbox = todo.completed ? '✅' : '☐';
      
      let formatted = `${checkbox} **[${todo.id}]** ${priority} ${todo.task}\n`;
      formatted += `   - **Category**: ${todo.category}\n`;
      formatted += `   - **Description**: ${todo.description}\n`;
      
      if (todo.command) {
        formatted += `   - **Command**: \`${todo.command}\`\n`;
      }
      
      if (todo.estimatedEffort) {
        formatted += `   - **Effort**: ${todo.estimatedEffort}\n`;
      }
      
      if (todo.dependencies && todo.dependencies.length > 0) {
        formatted += `   - **Dependencies**: ${todo.dependencies.join(', ')}\n`;
      }
      
      return formatted;
    }).join('\n');
  }

  private getPriorityEmoji(priority: string): string {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }

  private getComponentPriority(component: string): TodoItem['priority'] {
    if (component.includes('Test')) return 'high';
    if (component.includes('CI/CD')) return 'high';
    if (component.includes('Configuration')) return 'critical';
    if (component.includes('Documentation')) return 'medium';
    return 'medium';
  }

  private getComponentDescription(component: string): string {
    const descriptions: Record<string, string> = {
      'Test Suite': 'Implement comprehensive testing with unit, integration, and e2e tests',
      'Documentation': 'Create README.md, API docs, and setup instructions',
      'CI/CD Pipeline': 'Set up automated testing and deployment pipeline',
      'Configuration Management': 'Add environment variables and configuration files',
      'Environment Variables': 'Create .env files for different environments',
      'API Tests': 'Add integration tests for all API endpoints',
    };

    return descriptions[component] || `Implement ${component} for production readiness`;
  }

  private getComponentCommand(component: string, projectPath: string): string | undefined {
    const commands: Record<string, string> = {
      'Test Suite': 'npm init jest',
      'Documentation': 'echo "# Project Name" > README.md',
      'CI/CD Pipeline': 'mkdir -p .github/workflows && touch .github/workflows/ci.yml',
      'Configuration Management': 'touch .env.example .env.local',
      'Environment Variables': 'cp .env.example .env.local',
    };

    return commands[component];
  }

  private getComponentEffort(component: string): string {
    const efforts: Record<string, string> = {
      'Test Suite': '2-3 days',
      'Documentation': '1 day',
      'CI/CD Pipeline': '4-6 hours',
      'Configuration Management': '2-4 hours',
      'Environment Variables': '1-2 hours',
      'API Tests': '1-2 days',
    };

    return efforts[component] || '4-8 hours';
  }

  private calculateTotalEffort(todos: TodoItem[]): string {
    let totalHours = 0;

    todos.forEach(todo => {
      if (todo.estimatedEffort) {
        const match = todo.estimatedEffort.match(/(\d+)/);
        if (match) {
          totalHours += parseInt(match[1]);
        }
      }
    });

    const days = Math.floor(totalHours / 8);
    const hours = totalHours % 8;

    return `${days} days, ${hours} hours`;
  }

  private identifyCriticalPath(todos: TodoItem[]): string {
    const criticalTasks = todos.filter(t => t.priority === 'critical');
    if (criticalTasks.length === 0) return 'No critical tasks';

    return criticalTasks.map(t => t.task).join(' → ');
  }
}