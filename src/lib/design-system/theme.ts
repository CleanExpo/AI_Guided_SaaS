// Unified Design System Theme
// Combines Lovable.dev's friendly aesthetics with VS Code's professional power

export const theme = {
  // Brand Colors, colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'},
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75'},
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'},
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'},
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'},
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'}
  },
  
  // Typography, typography: {
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace"},
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'},
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700},
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2}
  },
  
  // Spacing, spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem'},
  
  // Border Radius, borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'},
  
  // Shadows, shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none'},
  
  // Transitions, transitions: {
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
    slower: '500ms'},
  
  // Z-index, zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    60: 60,
    70: 70,
    80: 80,
    90: 90,
    100: 100,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070},
  
  // Breakpoints, breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'},
  
  // Component Variants, components: {
    button: {
      primary: {
        bg: 'primary.600',
        color: 'white',
        hover: 'primary.700',
        active: 'primary.800'},
      secondary: {
        bg: 'secondary.600',
        color: 'white',
        hover: 'secondary.700',
        active: 'secondary.800'},
      outline: {
        bg: 'transparent',
        color: 'neutral.700',
        border: 'neutral.300',
        hover: 'neutral.50',
        active: 'neutral.100'},
      ghost: {
        bg: 'transparent',
        color: 'neutral.700',
        hover: 'neutral.100',
        active: 'neutral.200'}
    },
    card: {
      default: {
        bg: 'white',
        border: 'neutral.200',
        shadow: 'base',
        radius: 'lg'},
      elevated: {
        bg: 'white',
        border: 'transparent',
        shadow: 'lg',
        radius: 'xl'}
    },
    input: {
      default: {
        bg: 'white',
        border: 'neutral.300',
        focus: 'primary.500',
        radius: 'md'}
    }
  }
}

// Helper functions
export const getColor = (path: string): string => {
  const keys = path.split('.')
  let value: any = theme.colors
  
  for (const key of keys) {
    value = value[key]
    if (!value) return '#000000'
  }
  
  return value
}

export const getSpacing = (size: keyof typeof theme.spacing): string => {
  return theme.spacing[size]
}

export const getShadow = (size: keyof typeof theme.shadows): string => {
  return theme.shadows[size]
}

export const getRadius = (size: keyof typeof theme.borderRadius): string => {
  return theme.borderRadius[size]
}

export const getTransition = (speed: keyof typeof theme.transitions): string => {
  return `all ${theme.transitions[speed]} ease-in-out`
}

// CSS Variables for runtime theming
export const generateCSSVariables = () => {
  const vars: Record<string, string> = {}
  
  // Colors
  Object.entries(theme.colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      vars[`--color-${colorName}-${shade}`] = value
    })
  })
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value
  })
  
  // Typography
  vars['--font-heading'] = theme.typography.fonts.heading
  vars['--font-body'] = theme.typography.fonts.body
  vars['--font-mono'] = theme.typography.fonts.mono
  
  return vars
}