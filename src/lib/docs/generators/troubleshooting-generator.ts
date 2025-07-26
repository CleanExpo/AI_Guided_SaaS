import { DocumentationSection } from '../types';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  process.env.SUPABASE_SERVICE_ROLE_KEY || '')
);

export class TroubleshootingGuideGenerator {
  async generate(): Promise<DocumentationSection> {
    try {
      const { data: issues } = await supabase
        .from('support_issues')
        .select('*')
        .order('frequency', { ascending: false })
        .limit(20);

      return {
        id: 'troubleshooting-guide',
        title: 'Troubleshooting Guide',
        content: this.buildContent(issues || []),
        metadata: {
          category: 'support',
          tags: ['troubleshooting', 'errors', 'solutions'],
          difficulty: 'intermediate',
          estimatedTime: '15 minutes',
          lastUpdated: new Date(),
          version: '1.0.0'
        },
        relatedSections: ['error-codes', 'faq', 'support-contact'],
        interactiveElements: [
          {
            id: 'error-analyzer',
            type: 'demo',
            title: 'Error Analyzer',
            description: 'Paste your error message for automated analysis',
            config: {
              analyzeErrors: true,
              suggestSolutions: true
            }
          }
        ],
        codeExamples: this.generateExamples()
      };
    } catch (error) {
      logger.error('Failed to generate troubleshooting guide:', error);
      return this.getDefaultGuide();
    }
  }

  private buildContent(issues: any[]): string {
    let content = '# Troubleshooting Guide\n\n';
    content += 'This guide addresses the most common issues based on support data.\n\n';

    // Group by category
    const grouped = this.groupByCategory(issues);

    Object.entries(grouped).forEach(([category, categoryIssues]) => {
      content += `## ${this.formatCategory(category)}\n\n`;
      
      categoryIssues.forEach((issue, index) => {
        content += this.formatIssue(issue, index + 1);
      });
    });

    return content;
  }

  private groupByCategory(issues: any[]): Record<string, any[]> {
    return issues.reduce((acc, issue) => {
      const category = issue.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(issue);
      return acc;
    }, {} as Record<string, any[]>);
  }

  private formatIssue(issue: any, number: number): string {
    let content = `### ${number}. ${issue.title}\n\n`;
    content += `**Problem:** ${issue.description}\n\n`;
    
    if (issue.symptoms) {
      content += '**Symptoms:**\n';
      issue.symptoms.forEach((symptom: string) => {
        content += `- ${symptom}\n`;
      });
      content += '\n';
    }

    content += '**Solution:**\n';
    if (issue.steps) {
      issue.steps.forEach((step: string, index: number) => {
        content += `${index + 1}. ${step}\n`;
      });
    } else {
      content += `${issue.solution}\n`;
    }
    content += '\n';

    if (issue.prevention) {
      content += `**Prevention:** ${issue.prevention}\n\n`;
    }

    return content;
  }

  private generateExamples(): any[] {
    return [
      {
        id: 'error-handling-example',
        title: 'Error Handling Pattern',
        language: 'typescript',
        code: `try {
  await performOperation();
} catch (error) {
  console.error('Operation failed:', error);
  
  // Check for specific error types
  if (error instanceof NetworkError) {
    await retryWithBackoff(performOperation);
  } else if (error instanceof ValidationError) {
    showValidationErrors(error.details);
  } else {
    showGenericError();
  }
}`,
        runnable: false
      }
    ];
  }

  private formatCategory(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getDefaultGuide(): DocumentationSection {
    return {
      id: 'troubleshooting-guide',
      title: 'Troubleshooting Guide',
      content: this.getDefaultContent(),
      metadata: {
        category: 'support',
        tags: ['troubleshooting', 'errors', 'solutions'],
        difficulty: 'intermediate',
        estimatedTime: '15 minutes',
        lastUpdated: new Date(),
        version: '1.0.0'
      },
      relatedSections: ['error-codes', 'faq'],
      interactiveElements: [],
      codeExamples: []
    };
  }

  private getDefaultContent(): string {
    return `# Troubleshooting Guide

## Common Issues

### 1. Build Failures
**Problem:** Project fails to build with module resolution errors.
**Solution:** 
1. Clear node_modules and package-lock.json
2. Run npm install --legacy-peer-deps
3. Ensure all import paths are correct

### 2. Authentication Errors
**Problem:** Users cannot log in or access protected routes.
**Solution:**
1. Verify environment variables are set correctly
2. Check Supabase configuration
3. Ensure auth tokens are valid

### 3. API Connection Issues
**Problem:** API requests fail or timeout.
**Solution:**
1. Check network connectivity
2. Verify API endpoint URLs
3. Review CORS configuration
`;
  }
}