'use client';

// Re-export all enhanced form components from the modular structure
export * from './form-enhanced';

// Backward compatibility aliases
export { InputEnhanced } from './form-enhanced/InputEnhanced';
export { TextareaEnhanced } from './form-enhanced/TextareaEnhanced';
export { SelectEnhanced } from './form-enhanced/SelectEnhanced';
export { CheckboxEnhanced } from './form-enhanced/CheckboxEnhanced';
export { RadioEnhanced } from './form-enhanced/RadioEnhanced';
export { FormGroup } from './form-enhanced/FormGroup';

// Export types for external use
export type {
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  FormGroupProps
} from './form-enhanced/types';