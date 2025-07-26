/**
 * Gradient Engine for vibrant, colorful interfaces
 */

import { DesignToken, UIComponent, ThemeOptions } from '../types';

export class GradientEngine {
  async generateDesignTokens(options?: ThemeOptions): Promise<Map<string, DesignToken>> {
    const tokens = new Map<string, DesignToken>();
    
    // Vibrant gradients
    tokens.set('--gradient-sunset', {
      name: '--gradient-sunset',
      value: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      category: 'gradient'
    });
    
    tokens.set('--gradient-ocean', {
      name: '--gradient-ocean',
      value: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      category: 'gradient'
    });
    
    tokens.set('--gradient-forest', {
      name: '--gradient-forest',
      value: 'linear-gradient(135deg, #0BA360 0%, #3CBA92 100%)',
      category: 'gradient'
    });
    
    tokens.set('--gradient-lavender', {
      name: '--gradient-lavender',
      value: 'linear-gradient(135deg, #C471F5 0%, #FA71CD 100%)',
      category: 'gradient'
    });
    
    tokens.set('--gradient-flame', {
      name: '--gradient-flame',
      value: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)',
      category: 'gradient'
    });
    
    // Animated gradients
    tokens.set('--gradient-animated', {
      name: '--gradient-animated',
      value: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      category: 'gradient'
    });
    
    // Mesh gradients
    tokens.set('--gradient-mesh-vibrant', {
      name: '--gradient-mesh-vibrant',
      value: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0, transparent 50%)',
      category: 'gradient'
    });
    
    return tokens;
  }
  
  async styleComponent(component: UIComponent, tokens: Map<string, DesignToken>): Promise<any> {
    return {
      component,
      styles: this.getGradientStyles(component.type),
      tokens: Array.from(tokens.keys())
    };
  }
  
  private getGradientStyles(componentType: string): string {
    const styles: Record<string, string> = {
      button: `
        background: var(--gradient-sunset);
        background-size: 200% 200%;
        animation: gradient-shift 3s ease infinite;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 12px 24px;
        font-weight: 600;
        transition: transform 0.2s ease;
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        &:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
      `,
      
      card: `
        background: var(--gradient-mesh-vibrant);
        background-attachment: fixed;
        border-radius: 20px;
        padding: 30px;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(40px);
          border-radius: inherit;
          z-index: 0;
        }
        
        > * {
          position: relative;
          z-index: 1;
        }
      `
    };
    
    return styles[componentType] || '';
  }
}