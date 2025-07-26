import { gettingStartedTutorial } from './getting-started';
import { projectCreationTutorial } from './project-creation';
import { aiAssistantTutorial } from './ai-assistant';
import { deploymentTutorial } from './deployment';
import { advancedFeaturesTutorial } from './advanced-features';
import { Tutorial } from '../types';

export const tutorials: Tutorial[] = [
  gettingStartedTutorial,
  projectCreationTutorial,
  aiAssistantTutorial,
  deploymentTutorial,
  advancedFeaturesTutorial
];

export {
  gettingStartedTutorial,
  projectCreationTutorial,
  aiAssistantTutorial,
  deploymentTutorial,
  advancedFeaturesTutorial
};