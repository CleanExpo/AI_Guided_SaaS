/* BREADCRUMB: unknown - Purpose to be determined */
/**
 * Application-wide constants
 */;
export const _APP_NAME = 'AI Guided SaaS';export const _APP_VERSION = '1.0.0';
export const _API_ENDPOINTS={ CHAT: '/api/chat',
  GENERATE: '/api/generate',
  HEALTH: '/api/health',
  AUTH: '/api/auth',
  PROJECTS: '/api/projects',
  TEMPLATES: '/api/templates',
  AGENTS: '/api/agents'
}} as const;
export const _ROUTES={ HOME: '/',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  CHAT: '/chat',
  TEMPLATES: '/templates',
  SETTINGS: '/settings',
    AUTH: { SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    SIGNOUT: '/auth/signout'
}
    ADMIN: { DASHBOARD: '/admin',
    AGENTS: '/admin/agent-monitor',
    HEALTH: '/admin/health'
}} as const;
export const _HTTP_STATUS={ OK: 200;
    CREATED: 201;
    NO_CONTENT: 204;
    BAD_REQUEST: 400;
    UNAUTHORIZED: 401;
    FORBIDDEN: 403;
    NOT_FOUND: 404;
    INTERNAL_ERROR: 500
}} as const;
export const _AGENT_TYPES={ ARCHITECT: 'architect',
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  QA: 'qa',
  DEVOPS: 'devops'
}} as const;
export const _AGENT_STATUSES={ IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  ERROR: 'error',
  STOPPED: 'stopped'
}} as const;
export const _PROJECT_STATUS={ DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
}} as const;
export const _HEALTH_CHECK_INTERVALS={ FAST: 5000, // 5 seconds, NORMAL: 30000, // 30 seconds, SLOW: 60000; // 1 minute
}} as const;
export const _CACHE_KEYS={ USER_SESSION: 'user_session',
  PROJECT_LIST: 'project_list',
  TEMPLATE_LIST: 'template_list',
  AGENT_STATUS: 'agent_status'
}} as const;
export const _ERROR_MESSAGES={ GENERIC: 'An error occurred. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  NETWORK: 'Network error. Please check your connection.'
}} as const;
