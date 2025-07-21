'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { motion, HTMLMotionProps } from 'framer-motion'
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react'

// Unified Button Component
interface UnifiedButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export const UnifiedButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-primary-600 text-white, hover:bg-primary-700, active:bg-primary-800 shadow-sm',
      secondary: 'bg-secondary-600 text-white, hover:bg-secondary-700, active:bg-secondary-800 shadow-sm',
      outline: 'bg-white border-2 border-neutral-300 text-neutral-700, hover:bg-neutral-50, active:bg-neutral-100',
      ghost: 'bg-transparent text-neutral-700, hover:bg-neutral-100, active:bg-neutral-200',
      danger: 'bg-error-600 text-white, hover:bg-error-700, active:bg-error-800 shadow-sm'}
    
    const sizes = {
      xs: 'px-2.5 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'}
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'focus:outline-none, focus:ring-2, focus:ring-primary-500, focus:ring-offset-2',
          'disabled:opacity-50, disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading && (
          <Loader2 className={cn("h-4 w-4 animate-spin", children && "mr-2")} />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn(children && "mr-2")}>{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn(children && "ml-2")}>{icon}</span>
        )}
      </motion.button>
    )
  }
)
UnifiedButton.displayName = 'UnifiedButton'

// Unified Card Component
interface UnifiedCardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'elevated' | 'outline' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
}

export const UnifiedCard = React.forwardRef<HTMLDivElement, UnifiedCardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md',
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-white border border-neutral-200 shadow-sm',
      elevated: 'bg-white shadow-lg',
      outline: 'bg-transparent border-2 border-neutral-300',
      gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200'}
    
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'}
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200',
          variants[variant],
          paddings[padding],
          interactive && 'cursor-pointer, hover:shadow-xl, hover:-translate-y-1',
          className
        )}
        whileHover={interactive ? { y: -4 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
UnifiedCard.displayName = 'UnifiedCard'

// Unified Alert Component
interface UnifiedAlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string, description: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  className?: string
}

export function UnifiedAlert({ 
  type = 'info', 
  title, 
  description, 
  dismissible = false,
  onDismiss,
  icon,
  className 
}: UnifiedAlertProps) {
  const types = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600" />,
      title: 'text-blue-900',
      description: 'text-blue-700'},
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'text-green-900',
      description: 'text-green-700'},
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      title: 'text-yellow-900',
      description: 'text-yellow-700'},
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      title: 'text-red-900',
      description: 'text-red-700'}}
  
  const config = types[type]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-start p-4 rounded-lg border',
        config.bg,
        className
      )}
    >
      <div className="flex-shrink-0">
        {icon || config.icon}
      </div>
      <div className="ml-3 flex-1">
        {title && (
          <h3 className={cn('text-sm font-medium mb-1', config.title)}>
            {title}
          </h3>
        )}
        <p className={cn('text-sm', config.description)}>
          {description}
        </p>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-3 flex-shrink-0 rounded-md p-1.5, hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

// Unified Progress Component
interface UnifiedProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  animated?: boolean
  className?: string
}

export function UnifiedProgress({ 
  value, 
  max = 100, 
  size = 'md',
  variant = 'primary',
  showValue = false,
  animated = true,
  className 
}: UnifiedProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'}
  
  const variants = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600'}
  
  return (
    <div className={cn('w-full', className)}>
      {showValue && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-neutral-600">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn('bg-neutral-200 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={cn('h-full rounded-full', variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// Unified Badge Component
interface UnifiedBadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  dot?: boolean, children: React.ReactNode
  className?: string
}

export function UnifiedBadge({ 
  variant = 'default', 
  size = 'sm',
  icon,
  dot = false,
  children,
  className 
}: UnifiedBadgeProps) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    outline: 'bg-transparent border border-neutral-300 text-neutral-700'}
  
  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-sm',
    md: 'px-2.5 py-1 text-base',
    lg: 'px-3 py-1.5 text-lg'}
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-medium rounded-full',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && (
        <span className="w-1.5 h-1.5 bg-current rounded-full" />
      )}
      {icon}
      {children}
    </span>
  )
}

// Unified Step Indicator Component
interface Step {
  id: string, title: string
  description?: string
  icon?: React.ReactNode
}

interface UnifiedStepsProps {
  steps: Step[]
  currentStep: number
  variant?: 'linear' | 'circular'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UnifiedSteps({ 
  steps, 
  currentStep, 
  variant = 'linear',
  size = 'md',
  className 
}: UnifiedStepsProps) {
  return (
    <div className={cn('w-full', className)}>
      {variant === 'linear' ? (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
                      isCompleted ? 'bg-primary-600 text-white' : 
                      isActive ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 
                      'bg-neutral-200 text-neutral-600'
                    )}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <div className="text-center mt-2">
                    <p className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-primary-700' : 'text-neutral-600'
                    )}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 max-w-[100px]">
                    <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary-600"
                        initial={{ width: 0 }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      ) : (
        // Circular variant implementation
        <div className="relative">
          {/* Circular steps implementation */}
        </div>
      )}
    </div>
  )
}

// Export all components
export default {
  UnifiedButton,
  UnifiedCard,
  UnifiedAlert,
  UnifiedProgress,
  UnifiedBadge,
  UnifiedSteps}