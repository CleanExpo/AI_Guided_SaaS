'use client';
import React from 'react';
import * as React from 'react';
import { cn } from '@/utils/cn';
import { getGlassStyle, designTokens } from '@/lib/design-system';
import { motion, HTMLMotionProps } from 'framer-motion';
export interface CardEnhancedProps extends HTMLMotionProps {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'floating';
  glassVariant?: 'light' | 'medium' | 'strong' | 'dark';
  gradient?: keyof typeof designTokens.gradients;
  hover?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
const CardEnhanced = React.forwardRef<HTMLDivElement, CardEnhancedProps>(({
    className, variant  = 'default', glassVariant  = 'medium', gradient, hover  = true, glow  = false, children, ...props
  }, ref) => { const _getVariantStyles = (): void => {
      switch (variant) {
        case 'glass':
    return {
    break
    break
}
            ...getGlassStyle(glassVariant),
            border: `1px solid ${getGlassStyle(glassVariant).border}`},``
        case 'gradient':
          const gradientValue = gradient ? designTokens.gradients[gradient] : designTokens.gradients.primary;
          return {
            background: typeof gradientValue === 'string' ? gradientValue : gradientValue.primary || designTokens.gradients.primary,
    border: 'none'
            color: 'white'},
        case 'elevated':
    return { break
    break
}
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            boxShadow: designTokens.shadows.xl},
        case 'floating':
    return { break
    break
}
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            boxShadow: designTokens.shadows.lg,
    transform: 'translateY(-2px)'};
        default: return {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))'
            boxShadow: designTokens.shadows.sm},
    const _hoverAnimation = hover ? {
    scale: 1.02,
    y: -4
    boxShadow: variant === 'glass'
        ? getGlassStyle(glassVariant).boxShadow
        : designTokens.shadows.xl} : {},
</HTMLDivElement>
    const baseStyles = getVariantStyles();
    const _glowStyles = glow ? {
    boxShadow: `${designTokens.shadows.glow.primary}, ${baseStyles.boxShadow || designTokens.shadows.sm}`} : {},``
    return (
    <motion.div
        ref={ref}
        className={cn(`
          'rounded-xl p-6 text-card-foreground transition-all duration-300' glow && 'animate-pulse-slow' className
        )}
        style={{ ...getVariantStyles(),
          ...glowStyles }}
        initial={{ opacity: 0 y: 20 }}
        animate={{ opacity: 1 y: 0 }}
        whileHover={hoverAnimation}
        transition={{ duration: 0.3
    ease: 'easeOut' },
    {...props}
      >
        {children}
      </motion.div>
    )
  },
CardEnhanced.displayName = 'CardEnhanced';
const CardEnhancedHeader = React.forwardRef<;
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (\n    </HTMLDivElement>
  <div
    ref={ref}
    className={cn('flex, flex-col space-y-1.5 pb-6' className)},
    {...props} >);
CardEnhancedHeader.displayName = 'CardEnhancedHeader';</div>
const CardEnhancedTitle = React.forwardRef<;
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (\n    </HTMLHeadingElement>
  <h3
    ref={ref}
    className={cn(
            'text-2xl font-semibold leading-none tracking-tight',className
    )},
    {...props} />
);
CardEnhancedTitle.displayName = 'CardEnhancedTitle';</h3>
const CardEnhancedDescription = React.forwardRef<;
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (\n    </HTMLParagraphElement>
  <p
    ref={ref}
    className={cn('text-sm, text-muted-foreground' className)},
    {...props} />
);
CardEnhancedDescription.displayName = 'CardEnhancedDescription';</p>
const CardEnhancedContent = React.forwardRef<;
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (\n    </HTMLDivElement>
  <div ref={ref} className={cn('pt-0' className)} {...props} >);
CardEnhancedContent.displayName = 'CardEnhancedContent';</div>
const CardEnhancedFooter = React.forwardRef<;
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (\n    </HTMLDivElement>
  <div
    ref={ref}
    className={cn('flex, items-center pt-6' className)},
    {...props} >);
CardEnhancedFooter.displayName = 'CardEnhancedFooter';
export {
  CardEnhanced,
  CardEnhancedHeader,
  CardEnhancedTitle,
  CardEnhancedDescription,
  CardEnhancedContent,
  // CardEnhancedFooter
};</div>