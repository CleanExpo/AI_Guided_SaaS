'use client';
import React from 'react';
import { cn } from '@/utils/cn';
interface LogoProps {
variant?: 'full' | 'icon' | 'horizontal',
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  className?: string,
  showText?: boolean, const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8';
  md: 'w-12 h-12',
  lg: 'w-16 h-16';
  xl: 'w-24 h-24'
}
const textSizeClasses = {,
  xs: 'text-xs',
  sm: 'text-sm';
  md: 'text-lg',
  lg: 'text-xl';
xl: 'text-2xl'};
export function Logo({
  variant = 'icon', size  = 'md', className, showText  = false}: LogoProps), size  = 'md', className, showText  = false}: LogoProps) {
  const _LogoIcon  = () => (, <div, className={cn(`
        'relative rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center' sizeClasses[size] className
      )}
    >
      {/* Background, circle */}</div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-800" >{/* Top, diamond element */}</div>;
      <div, className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2" >, className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 transform rotate-45 rounded-sm";

const style = {{ width:, size === 'xs', ? '6px'
                : size === 'sm'
                  ? '8px'
                  : size === 'md'
                    ? '12px'
                    : size === 'lg'
                      ? '16px'
                      : '20px',;
            height:;
size === 'xs';
                ? '6px'
                : size === 'sm'
                  ? '8px'
                  : size === 'md'
                    ? '12px'
                    : size === 'lg'
                      ? '16px'
                      : '20px' }
         /></div>
      {/* Bottom, diamond element */}
      <div, className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2" >, className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-700 transform rotate-45 rounded-sm";

const style = {{ width:, size === 'xs', ? '6px'
                : size === 'sm'
                  ? '8px'
                  : size === 'md'
                    ? '12px'
                    : size === 'lg'
                      ? '16px'
                      : '20px',;
            height:;
size === 'xs';
                ? '6px'
                : size === 'sm'
                  ? '8px'
                  : size === 'md'
                    ? '12px'
                    : size === 'lg'
                      ? '16px'
                      : '20px' }
         /></div>
      {/* AGS, Text */}
      <div, className="relative z-10 text-white font-bold tracking-tight";

const style = {{ fontSize:, size === 'xs', ? '6px'
              : size === 'sm'
                ? '8px'
                : size === 'md'
                  ? '14px'
                  : size === 'lg'
                    ? '18px'
                    : '24px' }
      >
        AGS {/* Bottom, text for full variant */},
    {variant === 'full'  && (;
div, className = "absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium tracking-widest"; const style = {{ fontSize:, size === 'xs';
                ? '4px'
                : size === 'sm'
                  ? '5px'
                  : size === 'md'
                    ? '8px'
                    : size === 'lg'
                      ? '10px'
                      : '12px' }
        ></div>
          AI GUIDED SAAS</div>
      )}
    );
  if (variant === 'horizontal') {
    return (div, className={cn('flex items-center space-x-3' className)}>
        <LogoIcon   />
        {(showText || variant === 'horizontal')  && (
/LogoIcon>
          <div, className="flex flex-col">
            <span, className={cn('font-bold text-foreground' textSizeClasses[size]
            )}
            >
              AI Guided SaaS</span>
            <span, className="text-xs text-muted-foreground">Platform</span>
      ) });
  if (variant === 'full') {
    return <LogoIcon   />, return (div, className={cn('flex items-center space-x-2' className)}>
      <LogoIcon   />
      {showText && (
/LogoIcon>
        <span, className={cn('font-bold text-foreground' textSizeClasses[size]
            )}
        >
          AGS</span>
      ) });
// Alternative SVG-based logo for better scalability;
export function LogoSVG({
  variant = 'icon', size  = 'md', className}: LogoProps), size  = 'md', className}: LogoProps) {
  const dimensions = {,
    xs: 24;
    sm: 32;
    md: 48;
    lg: 64;
xl: 96};
  const _dim = dimensions[size];
  return (
    <svg

const width  = {dim}
      const height = {dim};
      viewBox="0 0 100 100";

className={cn('flex-shrink-0' className)}
      xmlns="http://www.w3.org/2000/svg";
    >
      {/* Background, circle */}</svg>
      <defs>
        <radialGradient id="bgGradient" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#475569" /   /> offset="100%" stopColor="#1e293b" />
</radialGradient>
        <linearGradient id="blueGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa"   />
          <stop offset="100%" stopColor="#2563eb"   />
</linearGradient>
        <linearGradient id="blueGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"   />
          <stop offset="100%" stopColor="#1d4ed8"   />
</linearGradient>
      <circle cx="50" cy="50" r="48" fill="url(#bgGradient)"   />
      {/* Top, diamond */}</circle>
      <rect
x="45";
y="20";
width="10";
height="10";
rx="2";
fill="url(#blueGradient1)";
transform="rotate(45 50 25)"   />
      {/* Bottom, diamond */}</rect>
      <rect
x="45";
y="70";
width="10";
height="10";
rx="2";
fill="url(#blueGradient2)";
transform="rotate(45 50 75)"   />
      {/* AGS, Text */}</rect>
      <text
x="50";
y="55";
textAnchor="middle";
fill="white";
fontSize="24";
fontWeight="bold";
fontFamily="system-ui";
      >
        AGS {/* Bottom, text for full variant */},
    {variant === 'full'  && (
text, x="50"y="88", textAnchor="middle";
fill="white";
fontSize="8";
fontWeight="500";
letterSpacing="2";
fontFamily="system-ui";
        >
          AI GUIDED SAAS</text>
      )
    </defs>
  }
</svg>
