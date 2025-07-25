import {
  ShoppingCart,
  BarChart3,
  Bot,
  Globe,
  CreditCard,
  Mail,
  Shield,
  Database,
  FileText,
  MessageSquare,
  Calendar,
  Smartphone,
  Package,
  Code2,
  Zap
} from 'lucide-react';
import { MarketplaceItem } from '../types';

export const marketplaceItems: MarketplaceItem[] = [
  // Templates
  {
    id: 't1',
    name: 'E-commerce Starter',
    description: 'Full e-commerce template with cart, checkout, and admin panel',
    category: 'template',
    price: 'free',
    rating: 4.8,
    downloads: 12453,
    author: 'AI Guided Team',
    icon: ShoppingCart,
    tags: ['e-commerce', 'stripe', 'inventory'],
    features: ['Product catalog', 'Shopping cart', 'Stripe checkout', 'Admin dashboard'],
    timeToImplement: '< 5 mins',
    previewUrl: '/preview/ecommerce',
    compatible: true
  },
  {
    id: 't2',
    name: 'SaaS Dashboard Pro',
    description: 'Analytics dashboard with 20+ chart types and real-time data',
    category: 'template',
    price: 49,
    rating: 4.9,
    downloads: 8234,
    author: 'DashboardMaster',
    icon: BarChart3,
    tags: ['analytics', 'dashboard', 'charts'],
    features: ['20+ chart types', 'Real-time updates', 'Export features', 'Dark mode'],
    timeToImplement: '10 mins',
    previewUrl: '/preview/dashboard',
    compatible: true
  },
  {
    id: 't3',
    name: 'AI Chatbot Template',
    description: 'Ready-to-use AI chat interface with streaming responses',
    category: 'template',
    price: 'free',
    rating: 4.7,
    downloads: 9876,
    author: 'AI Guided Team',
    icon: Bot,
    tags: ['ai', 'chat', 'gpt-4'],
    features: ['Streaming responses', 'Chat history', 'Multi-model support', 'Voice input'],
    timeToImplement: '< 3 mins',
    compatible: true
  },
  {
    id: 't4',
    name: 'Landing Page Builder',
    description: 'Drag-and-drop landing page builder with A/B testing',
    category: 'template',
    price: 79,
    rating: 4.6,
    downloads: 6543,
    author: 'PageCraft',
    icon: Globe,
    tags: ['landing-page', 'marketing', 'a/b-testing'],
    features: ['Drag-and-drop editor', 'A/B testing', '50+ components', 'SEO optimized'],
    timeToImplement: '15 mins',
    compatible: true
  },
  {
    id: 't5',
    name: 'Mobile App Template',
    description: 'React Native template with navigation and native features',
    category: 'template',
    price: 59,
    rating: 4.5,
    downloads: 4321,
    author: 'MobileFirst',
    icon: Smartphone,
    tags: ['mobile', 'react-native', 'ios', 'android'],
    features: ['Cross-platform', 'Push notifications', 'Offline support', 'App store ready'],
    timeToImplement: '20 mins',
    compatible: true
  },
  
  // Plugins
  {
    id: 'p1',
    name: 'Stripe Payments',
    description: 'Complete Stripe integration with subscriptions and webhooks',
    category: 'plugin',
    price: 'free',
    rating: 5.0,
    downloads: 23456,
    author: 'AI Guided Team',
    icon: CreditCard,
    tags: ['payments', 'stripe', 'subscriptions'],
    features: ['One-time payments', 'Subscriptions', 'Webhooks', 'Customer portal'],
    timeToImplement: '5 mins',
    compatible: true
  },
  {
    id: 'p2',
    name: 'Email Magic',
    description: 'Email automation with templates and scheduling',
    category: 'plugin',
    price: 29,
    rating: 4.5,
    downloads: 7890,
    author: 'MailMaster',
    icon: Mail,
    tags: ['email', 'automation', 'marketing'],
    features: ['Email templates', 'Scheduling', 'Analytics', 'A/B testing'],
    timeToImplement: '10 mins',
    compatible: true
  },
  {
    id: 'p3',
    name: 'Auth Shield',
    description: 'Advanced authentication with 2FA and social logins',
    category: 'plugin',
    price: 'free',
    rating: 4.9,
    downloads: 15678,
    author: 'AI Guided Team',
    icon: Shield,
    tags: ['auth', 'security', '2fa'],
    features: ['Social logins', '2FA', 'Magic links', 'Session management'],
    timeToImplement: '< 5 mins',
    compatible: true
  },
  {
    id: 'p4',
    name: 'Analytics Pro',
    description: 'Advanced analytics with custom events and funnels',
    category: 'plugin',
    price: 39,
    rating: 4.7,
    downloads: 5432,
    author: 'DataInsights',
    icon: BarChart3,
    tags: ['analytics', 'tracking', 'insights'],
    features: ['Custom events', 'Conversion funnels', 'User cohorts', 'Predictive analytics'],
    timeToImplement: '8 mins',
    compatible: true
  },
  {
    id: 'p5',
    name: 'File Manager Pro',
    description: 'Advanced file upload and management system',
    category: 'plugin',
    price: 35,
    rating: 4.4,
    downloads: 3210,
    author: 'FileVault',
    icon: FileText,
    tags: ['files', 'upload', 'storage'],
    features: ['Drag & drop', 'Preview files', 'Cloud storage', 'Access control'],
    timeToImplement: '12 mins',
    compatible: true
  },
  
  // Integrations
  {
    id: 'i1',
    name: 'Slack Connect',
    description: 'Send notifications and updates directly to Slack channels',
    category: 'integration',
    price: 'free',
    rating: 4.8,
    downloads: 11234,
    author: 'AI Guided Team',
    icon: MessageSquare,
    tags: ['slack', 'notifications', 'team'],
    features: ['Channel notifications', 'Bot commands', 'File sharing', 'Custom workflows'],
    timeToImplement: '< 5 mins',
    compatible: true
  },
  {
    id: 'i2',
    name: 'Google Calendar Sync',
    description: 'Two-way sync with Google Calendar for scheduling',
    category: 'integration',
    price: 19,
    rating: 4.6,
    downloads: 6789,
    author: 'CalendarSync',
    icon: Calendar,
    tags: ['calendar', 'google', 'scheduling'],
    features: ['Two-way sync', 'Event creation', 'Reminders', 'Meeting links'],
    timeToImplement: '15 mins',
    compatible: true
  },
  {
    id: 'i3',
    name: 'Database Connector',
    description: 'Connect to external databases (MySQL, PostgreSQL, MongoDB)',
    category: 'integration',
    price: 'free',
    rating: 4.7,
    downloads: 8765,
    author: 'AI Guided Team',
    icon: Database,
    tags: ['database', 'sql', 'mongodb'],
    features: ['Multiple DB types', 'Query builder', 'Connection pooling', 'Migration tools'],
    timeToImplement: '20 mins',
    compatible: true
  },
  {
    id: 'i4',
    name: 'API Gateway',
    description: 'Manage external API integrations with rate limiting',
    category: 'integration',
    price: 45,
    rating: 4.5,
    downloads: 4567,
    author: 'APIManager',
    icon: Code2,
    tags: ['api', 'gateway', 'rate-limiting'],
    features: ['Rate limiting', 'API keys', 'Request logging', 'Error handling'],
    timeToImplement: '25 mins',
    compatible: true
  },
  {
    id: 'i5',
    name: 'Webhook Manager',
    description: 'Manage incoming and outgoing webhooks with retry logic',
    category: 'integration',
    price: 25,
    rating: 4.3,
    downloads: 2345,
    author: 'WebhookPro',
    icon: Zap,
    tags: ['webhooks', 'automation', 'retry'],
    features: ['Webhook endpoints', 'Retry logic', 'Payload validation', 'Event logging'],
    timeToImplement: '18 mins',
    compatible: true
  },
  {
    id: 'i6',
    name: 'Package Registry',
    description: 'Private package registry for your organization',
    category: 'integration',
    price: 89,
    rating: 4.2,
    downloads: 1234,
    author: 'RegistryPro',
    icon: Package,
    tags: ['packages', 'registry', 'private'],
    features: ['Private packages', 'Version control', 'Access control', 'CDN delivery'],
    timeToImplement: '30 mins',
    compatible: true
  }
];