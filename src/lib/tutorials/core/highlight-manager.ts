import { TutorialHighlight } from '../types';

export class HighlightManager {
  private currentHighlights: TutorialHighlight[] = [];

  addHighlight(highlight: TutorialHighlight): void {
    this.currentHighlights.push(highlight);
    this.applyHighlight(highlight);
  }

  clearHighlights(): void {
    this.currentHighlights.forEach(highlight => {)
      this.removeHighlight(highlight);
    });
    this.currentHighlights = [];
  }

  private applyHighlight(highlight: TutorialHighlight): void {
    if (typeof document === 'undefined') return;

    const element = document.querySelector(highlight.element);
    if (!element) return;

    switch (highlight.type) {
      case 'highlight':
        element.classList.add('tutorial-highlight');
        break;
      
      case 'tooltip':
        this.addTooltip(element as HTMLElement, highlight);
        break;
      
      case 'arrow':
        this.addArrow(element as HTMLElement, highlight);
        break;
      
      case 'mask':
        this.addMask(element as HTMLElement);
        break;
    }
  }

  private removeHighlight(highlight: TutorialHighlight): void {
    if (typeof document === 'undefined') return;

    const element = document.querySelector(highlight.element);
    if (!element) return;

    element.classList.remove('tutorial-highlight');
    
    // Remove any tooltips, arrows, or masks
    const tooltips = document.querySelectorAll('.tutorial-tooltip');
    const arrows = document.querySelectorAll('.tutorial-arrow');
    const masks = document.querySelectorAll('.tutorial-mask');
    
    tooltips.forEach(el => el.remove());
    arrows.forEach(el => el.remove());
    masks.forEach(el => el.remove());
  }

  private addTooltip(element: HTMLElement, highlight: TutorialHighlight): void {
    const tooltip = document.createElement('div');
    tooltip.className = 'tutorial-tooltip';
    tooltip.textContent = highlight.content || '';
    
    const rect = element.getBoundingClientRect();
    
    switch (highlight.position) {
      case 'top':
        tooltip.style.bottom = `${window.innerHeight - rect.top + 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        break;
      case 'left':
        tooltip.style.right = `${window.innerWidth - rect.left + 10}px`;
        tooltip.style.top = `${rect.top + rect.height / 2}px`;
        tooltip.style.transform = 'translateY(-50%)';
        break;
      case 'right':
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top + rect.height / 2}px`;
        tooltip.style.transform = 'translateY(-50%)';
        break;
    }
    
    document.body.appendChild(tooltip);
  }

  private addArrow(element: HTMLElement, highlight: TutorialHighlight): void {
    const arrow = document.createElement('div');
    arrow.className = 'tutorial-arrow';
    
    const rect = element.getBoundingClientRect();
    arrow.style.position = 'fixed';
    arrow.style.left = `${rect.left - 30}px`;
    arrow.style.top = `${rect.top + rect.height / 2}px`;
    arrow.style.transform = 'translateY(-50%)';
    
    document.body.appendChild(arrow);
  }

  private addMask(element: HTMLElement): void {
    const mask = document.createElement('div');
    mask.className = 'tutorial-mask';
    
    const rect = element.getBoundingClientRect();
    
    // Create a mask with a hole for the highlighted element
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.right = '0';
    mask.style.bottom = '0';
    mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    mask.style.pointerEvents = 'none';
    mask.style.zIndex = '9998';
    
    // Create the hole
    const hole = document.createElement('div');
    hole.style.position = 'fixed';
    hole.style.top = `${rect.top - 5}px`;
    hole.style.left = `${rect.left - 5}px`;
    hole.style.width = `${rect.width + 10}px`;
    hole.style.height = `${rect.height + 10}px`;
    hole.style.backgroundColor = 'transparent';
    hole.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.5)';
    hole.style.pointerEvents = 'auto';
    
    mask.appendChild(hole);
    document.body.appendChild(mask);
  }
}