'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { designTokens } from '@/lib/design-system';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2, disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground, hover:bg-primary/90 shadow-lg, hover:shadow-xl',
        destructive: 'bg-destructive text-destructive-foreground, hover:bg-destructive/90 shadow-lg, hover:shadow-xl',
        outline: 'border border-input bg-background, hover:bg-accent, hover:text-accent-foreground shadow-sm, hover:shadow-md',
        secondary: 'bg-secondary text-secondary-foreground, hover:bg-secondary/80 shadow-sm, hover:shadow-md',
        ghost: 'hover:bg-accent, hover:text-accent-foreground',
        link: 'text-primary underline-offset-4, hover:underline',
        gradient: 'text-white shadow-lg, hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600, hover:from-blue-700, hover:to-purple-700',
        glass: 'text-foreground shadow-lg, hover:shadow-xl backdrop-blur-md bg-white/10 border border-white/20, hover:bg-white/20',
        glow: 'bg-primary text-primary-foreground shadow-lg, hover:shadow-xl',
        floating: 'bg-background text-foreground border border-border shadow-lg, hover:shadow-xl transform, hover:scale-105'},
    size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-lg px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-10 w-10'},
    animation: {
        none: '',
        pulse: 'animate-pulse-slow',
        bounce: 'animate-bounce-subtle',
        float: 'animate-float',
        shimmer: 'relative, before:absolute, before:inset-0, before:bg-shimmer-gradient, before:animate-shimmer'}},
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none'}}
);

export interface ButtonPremiumProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
    'size' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop' |
    'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'transition'>,</React>
    VariantProps<typeof buttonVariants>  {
  asChild?: boolean;
  glow?: boolean;
  ripple?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
</typeof>
const ButtonPremium = React.forwardRef<HTMLButtonElement, ButtonPremiumProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    glow = false,
    ripple = true,
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    ...props 
  }, ref) => {</HTMLButtonElement>
        </Array>
    const [ripples, setRipples] = React.useState<Array<{ id: number, x: number, y: number }>>([]);
    const rippleId = React.useRef(0);

    const Comp = asChild ? Slot : motion.button;
</Array>
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !loading) {
            </HTMLButtonElement>
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const newRipple = { id: rippleId.current++, x, y };
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
}
      if (props.onClick) {
        props.onClick(event);
}
    };

    const getGlowStyles = () => {
      if (!glow) return {};
      
      switch (variant) {
        case 'gradient':
          return { boxShadow: `${designTokens.shadows.glow.primary}, 0 0 30px rgba(59, 130, 246, 0.3)` };
        case 'destructive':
          return { boxShadow: `${designTokens.shadows.glow.primary}, 0 0 30px rgba(239, 68, 68, 0.3)` };
        default:
          return { boxShadow: designTokens.shadows.glow.primary }
}
    };

    const motionProps = asChild ? {} : {
      whileHover: { scale: variant === 'floating' ? 1.05 : 1.02 },
    whileTap: { scale: 0.98 }};

    return (
    <Comp
        className={cn(
          buttonVariants({ variant, size, animation className }),
          glow && 'animate-pulse-slow',
          loading && 'cursor-not-allowed opacity-70'
        )}
        ref={ref}
        style={getGlowStyles()}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...motionProps}
        {...props}
      >
        {/* Shimmer effect for shimmer animation */}
        {animation === 'shimmer' && (</Comp>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        
        {/* Ripple effects */}
        {ripples.map(ripple => (</div>
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20}}
          />
        ))}
        
        {/* Loading spinner */}
        {loading && (</span>
          <div className="absolute inset-0 flex items-center justify-center"></div>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /></div>
        )}
        
        {/* Content */}
        <div className={cn('flex items-center gap-2' loading && 'opacity-0')}>
          {icon && iconPosition === 'left' && (</div>
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}

    );
  };

ButtonPremium.displayName = 'ButtonPremium';

export { ButtonPremium, buttonVariants }
}
