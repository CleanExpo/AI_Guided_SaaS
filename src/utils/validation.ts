/**
 * Validation utility functions
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function isStrongPassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateMinLength(value: string,
  minLength: number,
                fieldName: string)
): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
}

export function validateMaxLength(value: string,
  maxLength: number,
                fieldName: string)
): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
}

export function validateRange(value: number,
  min: number,
  max: number,
                fieldName: string)
): string | null {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
  phone?: boolean;
  strongPassword?: boolean;
  custom?: (value: unknown, data: Record<string, unknown>) => string | null;
}

export function validateForm(data: Record<string, unknown>)
  rules: Record<string, ValidationRule>)
): ValidationResult {
  const errors: Record<string, string> = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required) {
      const error = validateRequired(value, field);
      if (error) {
        errors[field] = error;
        continue;
      }
    }
    
    if (value && typeof value === 'string' && rule.minLength) {
      const error = validateMinLength(value, rule.minLength, field);
      if (error) {
        errors[field] = error;
      }
    }
    
    if (value && typeof value === 'string' && rule.maxLength) {
      const error = validateMaxLength(value, rule.maxLength, field);
      if (error) {
        errors[field] = error;
      }
    }
    
    if (value && typeof value === 'number' && rule.min !== undefined && rule.max !== undefined) {
      const error = validateRange(value, rule.min, rule.max, field);
      if (error) {
        errors[field] = error;
      }
    }
    
    if (value && typeof value === 'string' && rule.email) {
      if (!isValidEmail(value)) {
        errors[field] = `${field} must be a valid email address`;
      }
    }
    
    if (value && typeof value === 'string' && rule.url) {
      if (!isValidUrl(value)) {
        errors[field] = `${field} must be a valid URL`;
      }
    }
    
    if (value && typeof value === 'string' && rule.phone) {
      if (!isValidPhone(value)) {
        errors[field] = `${field} must be a valid phone number`;
      }
    }
    
    if (value && typeof value === 'string' && rule.strongPassword) {
      if (!isStrongPassword(value)) {
        errors[field] = `${field} must contain at least 8 characters, including uppercase, lowercase, number, and special character`;
      }
    }
    
    if (rule.custom && typeof rule.custom === 'function') {
      const error = rule.custom(value, data);
      if (error) {
        errors[field] = error;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}