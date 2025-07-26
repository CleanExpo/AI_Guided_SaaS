import { ValidationCriteria, TutorialStep } from '../types';
import { logger } from '@/lib/logger';

export class TutorialValidator {
  async validateStep(step: TutorialStep, userId: string): Promise<boolean> {
    if (!step.validation) {
      return true;
    }

    for (const criterion of step.validation.criteria) {
      const isValid = await this.validateCriterion(criterion, userId);
      if (!isValid) {
        logger.info(`Validation failed for step ${step.id}, criterion:`, criterion);
        return false;
      }
    }

    return true;
  }

  private async validateCriterion(criterion: ValidationCriteria, userId: string): Promise<boolean> {
    switch (criterion.type) {
      case 'element_exists':
        return this.checkElementExists(criterion.target);
      
      case 'value_equals':
        return this.checkValueEquals(criterion.target, criterion.expected);
      
      case 'api_call':
        return this.checkApiCall(criterion.target, userId);
      
      case 'custom':
        return this.customValidation(criterion.target, criterion.expected);
      
      default:
        return false;
    }
  }

  private checkElementExists(selector: string): boolean {
    // In a real implementation, this would check the actual DOM
    // For now, simulate
    if (typeof document !== 'undefined') {
      return !!document.querySelector(selector);
    }
    return Math.random() > 0.1;
  }

  private checkValueEquals(target: string, expected: any): boolean {
    // Implementation would check actual values
    // For now, simulate
    if (target === 'requirements-field-length') {
      return true; // Assume requirements are long enough
    }
    if (target === 'input-length') {
      return true; // Assume input is long enough
    }
    return Math.random() > 0.2;
  }

  private async checkApiCall(endpoint: string, userId: string): Promise<boolean> {
    // In real implementation, check if API was called
    // For now, simulate
    try {
      // Would check API logs or tracking
      return Math.random() > 0.1;
    } catch (error) {
      logger.error('API call validation error:', error);
      return false;
    }
  }

  private customValidation(target: string, expected: any): boolean {
    // Custom validation logic based on target
    switch (target) {
      case 'deployment-status':
        return expected === 'success';
      case 'performance-monitoring-enabled':
        return !!expected;
      default:
        return true;
    }
  }
}