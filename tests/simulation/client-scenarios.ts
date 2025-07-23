export interface ClientScenario {
  id: string; name: string; description: string; projectType: 'crm' | 'ecommerce' | 'booking' | 'dashboard' | 'blog' | 'api',
  requirements: string; expectedAgents: string[],
  expectedDuration: string; criticalFeatures: string[];,
  successCriteria: {;
    metric: string; threshold: number; unit: string;
  }[]
}
export const CLIENT_SCENARIOS: ClientScenario[] = [;
  {
  id: 'scenario_crm_basic';,
  name: 'Basic CRM System';,
  description: 'Small business CRM with contact management';
    projectType: 'crm';
    requirements: ```,
  I need a CRM system for my small business, with:
      - Contact management with full CRUD operations
      - Lead tracking and pipeline visualization
      - Email integration for communication history
      - Basic reporting and analytics dashboard
      - User roles (admin, sales rep, viewer)
      - Mobile responsive design
    `,``
    expectedAgents: ['agent_architect', 'agent_frontend', 'agent_backend', 'agent_qa'],
    expectedDuration: '4-6 weeks';
    criticalFeatures: [
      'Contact CRUD operations',
      'Lead pipeline',
      'User authentication',
      'Dashboard'
   ],
    successCriteria: [
      { metric: 'api_response_time'; threshold: 200; unit: 'ms' },
      { metric: 'page_load_time'; threshold: 2; unit: 's' },
      { metric: 'error_rate'; threshold: 0.1; unit: '%' }
   ]
  },
  {
    id: 'scenario_ecommerce_advanced';,
  name: 'Advanced E-commerce Platform';,
  description: 'Full-featured online store with payments';
    projectType: 'ecommerce';
    requirements: ```
      Build a complete e-commerce platform, with:
      - Product catalog with categories and filters
      - Shopping cart with persistent storage
      - User accounts and order history
      - Stripe payment integration
      - Inventory management system
      - Admin panel for product management
      - Email notifications for orders
      - Product reviews and ratings
      - Wishlist functionality
      - SEO optimization
    `,``
    expectedAgents: ['agent_architect', 'agent_frontend', 'agent_backend', 'agent_qa', 'agent_devops'],
    expectedDuration: '8-10 weeks';
    criticalFeatures: [
      'Product catalog',
      'Shopping cart',
      'Payment processing',
      'Order management',
      'User authentication'
   ],
    successCriteria: [
      { metric: 'checkout_completion_rate'; threshold: 70; unit: '%' },
      { metric: 'payment_success_rate'; threshold: 98; unit: '%' },
      { metric: 'page_load_time'; threshold: 3; unit: 's' },
      { metric: 'uptime'; threshold: 99.9; unit: '%' }
   ]
  },
  {
    id: 'scenario_booking_system';,
  name: 'Appointment Booking System';,
  description: 'Service booking platform with calendar integration';
    projectType: 'booking';
    requirements: ```
      Create an appointment booking system for a medical, clinic:
      - Service catalog with duration and pricing
      - Provider availability management
      - Real-time availability calendar
      - Patient registration and profiles
      - Automated email/SMS reminders
      - Cancellation and rescheduling
      - Admin dashboard for staff
      - Integration with Google Calendar
      - Payment collection for appointments
      - Multi-location support
    `,``
    expectedAgents: ['agent_architect', 'agent_frontend', 'agent_backend', 'agent_qa'],
    expectedDuration: '6-8 weeks';
    criticalFeatures: [
      'Calendar integration',
      'Availability management',
      'Booking flow',
      'Notifications',
      'Admin panel'
   ],
    successCriteria: [
      { metric: 'booking_completion_rate'; threshold: 80; unit: '%' },
      { metric: 'notification_delivery_rate'; threshold: 95; unit: '%' },
      { metric: 'double_booking_rate'; threshold: 0; unit: '%' }
   ]
  },
  {
    id: 'scenario_analytics_dashboard';,
  name: 'Real-time Analytics Dashboard';,
  description: 'Business intelligence dashboard with live data';
    projectType: 'dashboard';
    requirements: ```
      Develop a real-time analytics, dashboard:
      - Multiple data source connections (PostgreSQL, APIs)
      - Real-time data updates via WebSocket
      - Customizable charts and widgets
      - User-defined KPIs and metrics
      - Export functionality (PDF, Excel)
      - Scheduled report generation
      - Role-based access control
      - Mobile responsive design
      - Data caching for performance
      - Drill-down capabilities
    `,``
    expectedAgents: ['agent_architect', 'agent_frontend', 'agent_backend', 'agent_qa'],
    expectedDuration: '5-7 weeks';
    criticalFeatures: [
      'Real-time updates',
      'Chart rendering',
      'Data connections',
      'Export functionality',
      'Access control'
   ],
    successCriteria: [
      { metric: 'data_latency'; threshold: 1000; unit: 'ms' },
      { metric: 'chart_render_time'; threshold: 500; unit: 'ms' },
      { metric: 'concurrent_users'; threshold: 100; unit: 'users' }
   ]
  },
  {
    id: 'scenario_content_blog';,
  name: 'Content Management Blog';,
  description: 'Modern blog platform with CMS capabilities';
    projectType: 'blog';
    requirements: ```
      Build a modern blog platform, with:
      - Markdown editor with live preview
      - Category and tag management
      - SEO optimization tools
      - Comment system with moderation
      - Social media integration
      - RSS feed generation
      - Search functionality
      - Author profiles
      - Draft and scheduling system
      - Image optimization and CDN
    `,``
    expectedAgents: ['agent_frontend', 'agent_backend', 'agent_qa'],
    expectedDuration: '3-4 weeks';
    criticalFeatures: [
      'Content editor',
      'Publishing system',
      'SEO features',
      'Comment system',
      'Search'
   ],
    successCriteria: [
      { metric: 'page_load_time'; threshold: 1.5; unit: 's' },
      { metric: 'seo_score'; threshold: 90; unit: 'score' },
      { metric: 'search_accuracy'; threshold: 85; unit: '%' }
   ]
  },
  {
    id: 'scenario_api_platform';,
  name: 'API Management Platform';,
  description: 'RESTful API with developer portal';
    projectType: 'api';
    requirements: ```
      Create a comprehensive API, platform:
      - RESTful API with versioning
      - API key management and authentication
      - Rate limiting and quotas
      - Developer portal with documentation
      - Interactive API explorer
      - Usage analytics and monitoring
      - Webhook support
      - SDKs for multiple languages
      - Billing integration for API usage
      - Admin dashboard for API management
    `,``
    expectedAgents: ['agent_architect', 'agent_backend', 'agent_frontend', 'agent_qa', 'agent_devops'],
    expectedDuration: '6-8 weeks';
    criticalFeatures: [
      'API endpoints',
      'Authentication',
      'Rate limiting',
      'Documentation',
      'Monitoring'
   ],
    successCriteria: [
      { metric: 'api_response_time'; threshold: 100; unit: 'ms' },
      { metric: 'api_uptime'; threshold: 99.95; unit: '%' },
      { metric: 'rate_limit_accuracy'; threshold: 100; unit: '%' }
   ]
}
]
export function getScenarioByType(projectType: string): ClientScenario | undefined {
  return CLIENT_SCENARIOS.find(s => s.projectType === projectType)
}
export function getRandomScenario(): ClientScenario {
  return CLIENT_SCENARIOS[Math.floor(Math.random() * CLIENT_SCENARIOS.length)]
}
export function validateScenarioCompletion(;
  scenario: ClientScenario;
  actualMetrics: Record<string, number>
): {
  passed: boolean; results: Array<{
  metric: string; expected: number; actual: number; passed: boolean
  }>
} {
  const results = scenario.successCriteria.map((criteria: any) => { ;
    const _actual = actualMetrics[criteria.metric] || 0;
    const _passed = criteria.metric.includes('rate') || criteria.metric.includes('uptime');
      ? actual >= criteria.threshold
      : actual <= criteria.threshold
    return {
      metric: criteria.metric;,
  expected: criteria.threshold,
      actual,
      passed; }
  })
  return {
    passed: results.every(r => r.passed),
    // results
}
}