/**
 * Glassmorphism Engine for Apple Glass aesthetic
 */

import { DesignToken, UIComponent, ThemeOptions } from '../types';

export class GlassmorphismEngine {
  async generateDesignTokens(options?: ThemeOptions): Promise<Map<string, DesignToken>> {
    const tokens = new Map<string, DesignToken>();
    
    // Glass effects
    tokens.set('--glass-bg', {
      name: '--glass-bg',
      value: 'rgba(255, 255, 255, 0.1)',
      category: 'color'
    });
    
    tokens.set('--glass-bg-hover', {
      name: '--glass-bg-hover',
      value: 'rgba(255, 255, 255, 0.15)',
      category: 'color'
    });
    
    tokens.set('--glass-border', {
      name: '--glass-border',
      value: 'rgba(255, 255, 255, 0.2)',
      category: 'color'
    });
    
    tokens.set('--glass-blur', {
      name: '--glass-blur',
      value: '16px',
      category: 'effect'
    });
    
    tokens.set('--glass-blur-heavy', {
      name: '--glass-blur-heavy',
      value: '24px',
      category: 'effect'
    });
    
    // Shadows
    tokens.set('--shadow-sm', {
      name: '--shadow-sm',
      value: '0 2px 8px rgba(0, 0, 0, 0.04)',
      category: 'shadow'
    });
    
    tokens.set('--shadow-md', {
      name: '--shadow-md',
      value: '0 8px 32px rgba(0, 0, 0, 0.08)',
      category: 'shadow'
    });
    
    tokens.set('--shadow-lg', {
      name: '--shadow-lg',
      value: '0 16px 48px rgba(0, 0, 0, 0.12)',
      category: 'shadow'
    });
    
    tokens.set('--shadow-xl', {
      name: '--shadow-xl',
      value: '0 24px 64px rgba(0, 0, 0, 0.16)',
      category: 'shadow'
    });
    
    // Gradients
    tokens.set('--gradient-primary', {
      name: '--gradient-primary',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      category: 'gradient'
    });
    
    tokens.set('--gradient-secondary', {
      name: '--gradient-secondary',
      value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      category: 'gradient'
    });
    
    tokens.set('--gradient-mesh', {
      name: '--gradient-mesh',
      value: 'radial-gradient(at 47% 33%, hsl(162, 77%, 78%) 0, transparent 59%), radial-gradient(at 82% 65%, hsl(218, 80%, 71%) 0, transparent 55%)',
      category: 'gradient'
    });
    
    // Border radius
    tokens.set('--radius-sm', {
      name: '--radius-sm',
      value: '12px',
      category: 'spacing'
    });
    
    tokens.set('--radius-md', {
      name: '--radius-md',
      value: '16px',
      category: 'spacing'
    });
    
    tokens.set('--radius-lg', {
      name: '--radius-lg',
      value: '24px',
      category: 'spacing'
    });
    
    tokens.set('--radius-xl', {
      name: '--radius-xl',
      value: '32px',
      category: 'spacing'
    });
    
    tokens.set('--radius-full', {
      name: '--radius-full',
      value: '9999px',
      category: 'spacing'
    });
    
    // Animation
    tokens.set('--transition-fast', {
      name: '--transition-fast',
      value: 'all 0.15s ease',
      category: 'animation'
    });
    
    tokens.set('--transition-smooth', {
      name: '--transition-smooth',
      value: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      category: 'animation'
    });
    
    tokens.set('--transition-bounce', {
      name: '--transition-bounce',
      value: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      category: 'animation'
    });
    
    tokens.set('--transition-spring', {
      name: '--transition-spring',
      value: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      category: 'animation'
    });
    
    // Colors
    tokens.set('--color-primary', {
      name: '--color-primary',
      value: '#667eea',
      category: 'color'
    });
    
    tokens.set('--color-secondary', {
      name: '--color-secondary',
      value: '#764ba2',
      category: 'color'
    });
    
    tokens.set('--color-accent', {
      name: '--color-accent',
      value: '#f093fb',
      category: 'color'
    });
    
    // Apply customizations
    if (options?.customizations) {
      for (const [key, value] of Object.entries(options.customizations)) {
        if (tokens.has(key)) {
          const token = tokens.get(key)!;
          token.value = value;
          tokens.set(key, token);
        }
      }
    }
    
    return tokens;
  }
  
  async styleComponent(component: UIComponent, tokens: Map<string, DesignToken>): Promise<any> {
    const baseStyles = this.getBaseStyles(component.type);
    const tokenStyles = this.applyTokens(baseStyles, tokens);
    
    return {
      component,
      styles: tokenStyles,
      tokens: Array.from(tokens.keys())
    };
  }
  
  private getBaseStyles(componentType: string): string {
    const styles: Record<string, string> = {
      button: `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 12px 24px;
        font-weight: 500;
        transition: var(--transition-smooth);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      `,
      
      card: `
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        padding: 24px;
        transition: var(--transition-smooth);
        position: relative;
        overflow: hidden;
      `,
      
      navbar: `
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur-heavy));
        -webkit-backdrop-filter: blur(var(--glass-blur-heavy));
        border-bottom: 1px solid var(--glass-border);
        padding: 16px 24px;
        position: sticky;
        top: 0;
        z-index: 1000;
        transition: var(--transition-smooth);
      `,
      
      sidebar: `
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur-heavy));
        -webkit-backdrop-filter: blur(var(--glass-blur-heavy));
        border-right: 1px solid var(--glass-border);
        padding: 24px 16px;
        height: 100vh;
        position: sticky;
        top: 0;
        overflow-y: auto;
      `,
      
      modal: `
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(var(--glass-blur-heavy));
        -webkit-backdrop-filter: blur(var(--glass-blur-heavy));
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        padding: 32px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
      `,
      
      input: `
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 12px 16px;
        width: 100%;
        transition: var(--transition-smooth);
        font-size: 16px;
      `
    };
    
    return styles[componentType] || '';
  }
  
  private applyTokens(styles: string, tokens: Map<string, DesignToken>): string {
    let processedStyles = styles;
    
    // Add hover states
    processedStyles += `
      &:hover {
        background: var(--glass-bg-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    `;
    
    // Add gradient mesh overlay
    processedStyles += `
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--gradient-mesh);
        opacity: 0.05;
        pointer-events: none;
        transition: var(--transition-smooth);
      }
      
      &:hover::before {
        opacity: 0.08;
      }
    `;
    
    return processedStyles;
  }
}