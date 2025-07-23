/**
 * Validation utility functions
 */
export function isValidEmail(email: string): string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export function isValidUrl(url: string): string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
}
export function isValidPhone(phone: string): string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;};
export function isStrongPassword(password: string): string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex =;
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8$/;
  return passwordRegex.test(password);
};
export function validateRequired(value; fieldName: string): string | null {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
}
  return null;
};
export function validateMinLength(,;
    value: string,
    minLength: number,
    fieldName: string
): string | null {
  if(value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
}
  return null;
};
export function validateMaxLength(,;
    value: string,
    maxLength: number,
    fieldName: string
): string | null {
  if(value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
}
  return null;
};
export function validateRange(,;
    value: number,
    min: number,
    max: number,
    fieldName: string
): string | null {
  if(value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
}
  return null;
};
export interface ValidationResult {
  isValid: boolean,
    errors: Record<string, string>;
};
export function validateForm(, ;
    data: Record<string, any>, rules: Record<string, any>): Record<string, any>, rules: Record<string, any>): ValidationResult {
  const errors: Record<string, string> = {};
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    if(rule.required) {
      const _error = validateRequired(value, field);
      if (error) {
        errors[field] = error;
        continue;
}
}
    if (value && rule.email && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
      continue;
}
    if (value && rule.url && !isValidUrl(value)) {
      errors[field] = 'Invalid URL';
      continue;
}
    if(value && rule.minLength) {
      const _error = validateMinLength(value, rule.minLength, field);
      if (error) {
        errors[field] = error;
        continue;
}
}
    if(value && rule.maxLength) { const _error = validateMaxLength(value, rule.maxLength, field);
      if (error) {
        errors[field] = error;
}
  return {;
    isValid: Object.keys(errors).length === 0,
    errors;
};
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError'
}
}