export const inputVariants = {
  default: 'border border-input bg-background',
  filled: 'border-0 bg-brand-secondary-100 dark:bg-brand-secondary-800',
  underlined: 'border-0 border-b-2 border-input bg-transparent rounded-none',
  outlined: 'border-2 border-input bg-background'
};

export const inputSizes = {
  xs: 'h-7 px-2 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
  xl: 'h-12 px-4 text-lg'
};

export const inputStates = {
  default: '',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
};

export const textareaSizes = {
  sm: 'min-h-[60px] px-3 py-2 text-sm',
  md: 'min-h-[80px] px-3 py-2 text-sm',
  lg: 'min-h-[120px] px-4 py-3 text-base'
};

export const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
};

export const checkboxSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

export const radioSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
};

export const baseInputClasses = 'flex w-full rounded-md font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const baseTextareaClasses = 'flex w-full rounded-md border border-input bg-background font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const baseSelectClasses = 'flex w-full rounded-md border border-input bg-background font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none';