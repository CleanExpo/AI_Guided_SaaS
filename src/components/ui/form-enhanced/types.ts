import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'underlined' | 'outlined';
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: 'default' | 'error' | 'success' | 'warning';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  label?: string;
  required?: boolean;
  loading?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'outlined';
  textareaSize?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';
  helperText?: string;
  errorText?: string;
  label?: string;
  required?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  maxLength?: number;
  showCount?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'filled' | 'outlined';
  selectSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: 'default' | 'error' | 'success' | 'warning';
  helperText?: string;
  errorText?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checkboxSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  state?: 'default' | 'error' | 'success' | 'warning';
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  radioSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  state?: 'default' | 'error' | 'success' | 'warning';
  label?: string;
  description?: string;
}

export interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  state?: 'default' | 'error' | 'success' | 'warning';
}