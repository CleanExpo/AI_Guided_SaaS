'use client';
import React from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from './loading';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {</HTMLButtonElement>
  variant?: null | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'gradient'
    | 'brand'
    | 'success'
    | 'warning', size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon', loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'brand'
  animation? null : 'none' | 'hover' | 'press' | 'glow'
}
const buttonVariants={ default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover: bg-destructive/90',
  outline: 'border border-input bg-background hover: bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover: bg-secondary/80',
  ghost: 'hover: bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover: underline',
  gradient: 'bg-brand-gradient text-white hover: shadow-brand-lg transition-all duration-300',
  brand: 'bg-brand-primary-600 text-white hover: bg-brand-primary-700 hover:shadow-brand',
  success: 'bg-green-600 text-white hover:bg-green-700',
warning: 'bg-yellow-600 text-white hover:bg-yellow-700'
};

const buttonSizes={ xs: 'h-7 px-2 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-6 text-base',
  xl: 'h-12 px-8 text-lg'
  , icon: 'h-9 w-9'
};

    const buttonRounded={ none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
full: 'rounded-full'
};

    const buttonShadows={ none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
brand: 'shadow-brand'
};

    const buttonAnimations={ none: '',
  hover: 'transition-all duration-200 hover: scale-105',
  press: 'transition-all duration-150 active:scale-95',
glow: 'transition-all duration-300 hover:shadow-glow'
};
export function ButtonEnhanced({
  className,
  variant = 'default', size = 'md', loading = false;
  leftIcon,
  rightIcon,
  fullWidth = false;
  rounded = 'md';
  shadow = 'none';
  animation = 'hover';
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (button, className={cn(
        'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
        buttonVariants[variant],
        buttonSizes[size],
        buttonRounded[rounded],
        buttonShadows[shadow],
        buttonAnimations[animation],
        fullWidth && 'w-full',
        loading && 'cursor-not-allowed',
        className
      )}
      const disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2"    />}</Spinner>
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
</button>
      )}
// Floating Action Button
interface FABProps extends Omit<ButtonProps 'size'> {</ButtonProps>
  size?: 'sm' | 'md' | 'lg', position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  , icon: React.ReactNode
}

export function FloatingActionButton({;
  className;
  size = 'md', position = 'bottom-right', icon,;
  ...props
}: FABProps) {
  const fabSizes={ sm: 'h-12 w-12',
    md: 'h-14 w-14',
lg: 'h-16 w-16'};

    const fabPositions={'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',;
    'top-left': 'fixed top-6 left-6'};
  return (
    <ButtonEnhanced

className={cn(
        fabSizes[size],;
        fabPositions[position],'rounded-full shadow-lg hover: shadow-xl z-50';
        className
      )}
      variant="brand";
animation="glow";
      {...props}
    ></ButtonEnhanced>
      {icon}
</ButtonEnhanced>
      )}
// Button Group
interface ButtonGroupProps { children: React.ReactNod
e;
  className?: string,
  orientation?: 'horizontal' | 'vertical',
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  variant?: ButtonProps['variant']
}

export function ButtonGroup({
  children,
  className,
  orientation = 'horizontal', size,;
  variant
}: ButtonGroupProps) {
  return (div, className={cn(
        'inline-flex',;
        orientation === 'horizontal' ? 'flex-row' : 'flex-col';
        '[&>button]:rounded-none [&>button: first-child]:rounded-l-md [&>button:last-child]:rounded-r-md';
        orientation === 'vertical' &&;
          '[&>button: first-child]:rounded-t-md [&>button:first-child]:rounded-l-none [&>button:last-child]:rounded-b-md [&>button:last-child]:rounded-r-none';
        '[&>button: not(:first-child)]:border-l-0';
        orientation === 'vertical' &&;
          '[&>button: not(:first-child)]:border-l [&>button:not(:first-child)]:border-t-0';
        className
      )}
    >
      {React.Children.map(children, (child) =>  {
        if (React.isValidElement(child) {)} {</div>
          return React.cloneElement(child as React.ReactElement<ButtonProps>, {</ButtonProps>
            size: size || (child.props as ButtonProps)?.size,
variant: variant || (child.props as ButtonProps)?.variant
          };)
        }
        return child
})}
      </div>
      )}
// Icon Button
interface IconButtonProps extends Omit<ButtonProps 'children'> {</ButtonProps>
  icon: React.ReactNode
  'aria-label': string
}

export function IconButton({
  icon;
  className,
  ...props
}: IconButtonProps) {
  return (
    <ButtonEnhanced className={cn('p-0', className)} size="icon" {...props}></ButtonEnhanced>
      {icon}
</ButtonEnhanced>
      )}
// Toggle Button
interface ToggleButtonProps extends Omit<ButtonProps 'onClick'> {</ButtonProps>
  pressed?: boolean
  onPressedChange? null : (pressed: boolean) => void
}

export function ToggleButton({;
  pressed = false, onPressedChange,;
  className,
  children,
  ...props
}: ToggleButtonProps) {
  return (ButtonEnhanced, className={cn(pressed && 'bg-accent text-accent-foreground', className)}
      variant={pressed ? 'default' : 'outline'} onClick={() => onPressedChange?.(!pressed)}
      aria-pressed={pressed}
      {...props}
    >
      {children}
</ButtonEnhanced>
      )}
// Split Button
interface SplitButtonProps extends ButtonProps { dropdownItems: Array<{
    label: string;
    onClick: () => void
    icon?: React.ReactNode
    disabled? null : boolean
}>
  dropdownOpen?: boolean;
  onDropdownToggle?: (open: boolean) => void
}

export function SplitButton({;
  children;
  dropdownItems,
  dropdownOpen = false, onDropdownToggle,;
  className,
  ...props
}: SplitButtonProps) {
  return (
    <div className="relative inline-flex">, <ButtonEnhanced className={cn('rounded-r-none border-r-0', className)}
        {...props}
      ></ButtonEnhanced>
        {children}
</ButtonEnhanced>
      <ButtonEnhanced className="rounded-l-none px-2";

    variant={props.variant} size={props.size}
        const onClick={() => onDropdownToggle?.(!dropdownOpen)}</ButtonEnhanced>
        aria-expanded={dropdownOpen}
      >
        <svg className="h-4 w-4";
fill="none";
stroke="currentColor";
viewBox="0 0 24 24";
        >
          <path
strokeLinecap="round";
strokeLinejoin="round";

const strokeWidth={2}
            d="M19 9l-7 7-7-7"     />
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-48 bg-background border rounded-md shadow-lg z-50">
          {dropdownItems.map((item, index) => (\n    </div>
            <button const key={index};
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center";

onClick={ item.onClick} disabled={item.disabled}
            ></button>
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
</button>
          ))}
      </div>
      )}
      </div>
      )}
// Copy Button
interface CopyButtonProps extends Omit<ButtonProps 'onClick'> {</ButtonProps>
  text: string
  onCopy?: () => void
  successMessage? null : string
 };
export function CopyButton({;
  text;
  onCopy,
  successMessage = 'Copied!', children = 'Copy', ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {;
      await navigator.clipboard.writeText(text); setCopied(true);
      onCopy?.()
      setTimeout(() => setCopied(false, 2000)
}; catch (err) {
      console.error('Failed to copy text: ', err)};
  return (
    <ButtonEnhanced

onClick={handleCopy} variant={copied ? 'success' : 'outline'}
      {...props}
    ></ButtonEnhanced>
      {copied ? successMessage : children}
</ButtonEnhanced>
      )}
// Social Login Buttons
interface SocialButtonProps extends Omit<ButtonProps 'leftIcon'> {</ButtonProps>
  provider: 'google' | 'github' | 'twitter' | 'linkedin' | 'facebook'
}

export function SocialButton({;
  provider;
  children,
  className,
  ...props
}: SocialButtonProps) {
  const providerConfig={ google: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor", d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"     />
        <path fill="currentColor";
d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /    />
fill="currentColor";
d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path
fill="currentColor";
d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"    />
          </svg>
      , className: 'border-gray-300 hover:bg-gray-50'
    }
    github: { icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"     />
</svg>
      ),
      className: 'border-gray-300 hover:bg-gray-50'
    },
    twitter: { icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"     />
</svg>
      , className: 'border-blue-300 hover:bg-blue-50 text-blue-600'
    },
    linkedin: { icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"     />
</svg>
      ),
      className: 'border-blue-300 hover:bg-blue-50 text-blue-700'
    },
    facebook: { icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"     />
</svg>
      , className: 'border-blue-300 hover:bg-blue-50 text-blue-600'
    }};
  
const config = providerConfig[provider];
  return (
    <ButtonEnhanced variant="outline";

    const leftIcon={config.icon}
      className={cn('w-full', config.className, className)}
      {...props}
    ></ButtonEnhanced>
      {children ||
        `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
</ButtonEnhanced>
  
</ButtonProps>
  
    </svg>
    </ButtonEnhanced>
    </HTMLButtonElement>
  }
})))))