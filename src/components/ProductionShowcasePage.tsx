'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  BarChart3,
  Users,
  ArrowRight,
  Wrench,
  Shield,
  Brain,
  Zap,
} from 'lucide-react';
import {
  AIIcon,
  CodeIcon,
  RocketIcon,
  DatabaseIcon,
  BrandIcon,
} from '@/components/ui/icons';
import Link from 'next/link';

// Import your actual production components
import ClaudeCodeDashboard from '@/components/ClaudeCodeDashboard';

interface WorkflowResult {
  totalTokenUsage: number;
  utilizationRate: number;
  integrationCommands: string[];
  nextSteps: string[];
}

const personas = [
  {
    id: 'ai-architect',
    name: 'AI Architect',
    description: 'Expert in AI-powered development workflows',
    avatar: '🤖',
    color: 'from-blue-500 to-cyan-500',
    icon: AIIcon,
    features: [
      'Claude Code Integration',
      'Multi-Agent Orchestration',
      'Token Optimization',
    ],
  },
  {
    id: 'fullstack-wizard',
    name: 'Fullstack Wizard',
    description: 'Master of frontend and backend development',
    avatar: '🧙‍♂️',
    color: 'from-brand-primary-500 to-pink-500',
    icon: CodeIcon,
    features: ['Next.js 15', 'TypeScript', 'API Development'],
  },
  {
    id: 'ui-designer',
    name: 'UI Designer',
    description: 'Creating beautiful, user-friendly interfaces',
    avatar: '🎨',
    color: 'from-pink-500 to-rose-500',
    icon: BrandIcon,
    features: ['shadcn/ui', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    description: 'MVP development and rapid iteration',
    avatar: '🚀',
    color: 'from-orange-500 to-red-500',
    icon: RocketIcon,
    features: ['Rapid Prototyping', 'Deployment', 'Analytics'],
  },
];

const productionFeatures = [
  {
    title: 'Claude Code Integration',
    description:
      'Advanced AI-powered development with multi-agent orchestration',
    icon: Brain,
    demo: 'claude-dashboard',
    color: 'bg-blue-500',
    component: 'ClaudeCodeDashboard',
  },
  {
    title: 'Visual UI Builder',
    description: 'Production drag-and-drop interface builder',
    icon: Wrench,
    demo: 'ui-builder',
    color: 'bg-brand-primary-500',
    component: 'UIBuilder',
  },
  {
    title: 'System Analytics',
    description: 'Real-time system monitoring and performance analytics',
    icon: BarChart3,
    demo: 'analytics',
    color: 'bg-green-500',
    component: 'SystemResourceMonitor',
  },
  {
    title: 'Collaboration Hub',
    description: 'Production team collaboration workspace',
    icon: Users,
    demo: 'collaboration',
    color: 'bg-orange-500',
    component: 'CollaborationWorkspace',
  },
];

const engineeringHighlights = [
  {
    title: 'Multi-Agent Architecture',
    description:
      'Orchestrated AI agents for documentation, research, and optimization',
    icon: AIIcon,
    metrics: '5 Specialized Agents',
  },
  {
    title: 'Token Optimization Engine',
    description: 'Strategic memory management with 150K context optimization',
    icon: DatabaseIcon,
    metrics: '96% Quality Retention',
  },
  {
    title: 'Causal Engine System',
    description: 'Advanced dependency tracking and cycle detection',
    icon: Zap,
    metrics: 'Real-time Analysis',
  },
  {
    title: 'Self-Check Framework',
    description: 'Automated system health monitoring and validation',
    icon: Shield,
    metrics: '100% Uptime Target',
  },
];

export default function ProductionShowcasePage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string>('claude-dashboard');
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: '99.9%',
    activeUsers: 12,
    systemHealth: 98,
    memoryOptimization: 78,
  });

  // Simulate real-time system updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        systemHealth: Math.max(
          95,
          Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)
        ),
        memoryOptimization: Math.max(
          70,
          Math.min(85, prev.memoryOptimization + (Math.random() - 0.5) * 3)
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderPersonaShowcase = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {personas.map((persona, index) => {
        const Icon = persona.icon;
        return (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`cursor-pointer transition-all duration-300 ${
              selectedPersona === persona.id ? 'scale-105' : 'hover:scale-105'
            }`}
            onClick={() =>
              setSelectedPersona(
                selectedPersona === persona.id ? null : persona.id
              )
            }
          >
            <Card
              className={`glass border-0 ${selectedPersona === persona.id ? 'ring-2 ring-white/50' : ''}`}
            >
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${persona.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white">{persona.name}</CardTitle>
                <CardDescription className="text-white/80">
                  {persona.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {selectedPersona === persona.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="space-y-2">
                        <p className="text-sm text-white/90 font-medium">
                          Core Technologies:
                        </p>
                        {persona.features.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs mr-1 mb-1"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full" asChild>
                        <Link href="/auth/signin">
                          Start with {persona.name}
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  const renderProductionDemo = () => {
    switch (activeDemo) {
      case 'claude-dashboard':
        return (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <ClaudeCodeDashboard
              onWorkflowComplete={(result: WorkflowResult) => {
                console.log('Claude Code workflow completed:', result);
              }}
            />
          </div>
        );

      case 'ui-builder':
        return (
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-brand-primary-400" />
                <CardTitle className="text-white">
                  Production UI Builder
                </CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Real drag-and-drop interface with live component library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button
                  asChild
                  className="bg-brand-primary-600 hover:bg-brand-primary-700"
                >
                  <Link href="/ui-builder">
                    Launch UI Builder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-white/60 text-sm mt-4">
                  Access the full production UI Builder with your component
                  library
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'analytics':
        return (
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white">System Analytics</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Real-time system monitoring and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {systemMetrics.uptime}
                  </div>
                  <div className="text-sm text-white/60">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {systemMetrics.activeUsers}
                  </div>
                  <div className="text-sm text-white/60">Active Users</div>
                </div>
              </div>
              <div className="text-center">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/analytics">
                    View Full Analytics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'collaboration':
        return (
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                <CardTitle className="text-white">Collaboration Hub</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Production team collaboration workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/collaborate">
                    Enter Collaboration Hub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-white/60 text-sm mt-4">
                  Access real-time team collaboration features
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderEngineeringHighlights = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {engineeringHighlights.map((highlight, index) => {
        const Icon = highlight.icon;
        return (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-0 h-full">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-brand-primary-500 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg">
                  {highlight.title}
                </CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  {highlight.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="text-white border-white/20">
                  {highlight.metrics}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/50"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Production-Ready AI Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              AI-Guided SaaS Platform
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Experience sophisticated engineering with multi-agent AI
              orchestration, advanced token optimization, and production-grade
              system architecture.
            </p>
          </motion.div>

          {/* Engineering Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Advanced Engineering Foundation
            </h2>
            {renderEngineeringHighlights()}
          </motion.div>

          {/* Persona Selection */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Choose Your Development Persona
            </h2>
            {renderPersonaShowcase()}
          </motion.div>
        </div>
      </section>

      {/* Production Features Demo */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Live Production Systems
            </h2>
            <p className="text-xl text-white/80">
              Interact with our actual production components and systems
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature Tabs */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {productionFeatures.map(feature => {
                  const Icon = feature.icon;
                  return (
                    <motion.button
                      key={feature.demo}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        activeDemo === feature.demo
                          ? 'bg-white/20 border border-white/30'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setActiveDemo(feature.demo)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${feature.color}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-white/60">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Live Production Demo */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderProductionDemo()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience Production-Grade AI?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join the next generation of sophisticated AI-powered development
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-brand-primary-500 hover:from-blue-600 hover:to-brand-primary-600"
                asChild
              >
                <Link href="/auth/signin">
                  Access Production Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/admin">
                  View System Admin
                  <Shield className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
