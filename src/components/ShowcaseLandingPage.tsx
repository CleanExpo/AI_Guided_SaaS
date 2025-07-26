'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, Code, Palette, Rocket, Sparkles, Brain, BarChart3, Users, ArrowRight, Play, Pause, RefreshCw, TrendingUp, Wrench } from 'lucide-react';
import Link from 'next/link';

const personas = [
  { 
    id: 'ai-architect',
    name: 'AI Architect',
    description: 'Expert in AI-powered development workflows',
    avatar: '🤖',
    color: 'from-blue-500 to-cyan-500',
    icon: Bot
  },
  { 
    id: 'fullstack-wizard',
    name: 'Fullstack Wizard',
    description: 'Master of frontend and backend development',
    avatar: '🧙‍♂️',
    color: 'from-brand-primary-500 to-pink-500',
    icon: Code
  },
  { 
    id: 'ui-designer',
    name: 'UI Designer',
    description: 'Creating beautiful, user-friendly interfaces',
    avatar: '🎨',
    color: 'from-pink-500 to-rose-500',
    icon: Palette
  },
  { 
    id: 'startup-founder',
    name: 'Startup Founder',
    description: 'MVP development and rapid iteration',
    avatar: '🚀',
    color: 'from-orange-500 to-red-500',
    icon: Rocket
  }
];

const liveFeatures = [
  { 
    title: 'Claude Code Integration',
    description: 'Advanced AI-powered development with token optimization',
    icon: Brain,
    demo: 'claude-dashboard',
    color: 'bg-blue-500'
  },
  { 
    title: 'Visual UI Builder',
    description: 'Drag-and-drop interface builder with real-time preview',
    icon: Wrench,
    demo: 'ui-builder',
    color: 'bg-brand-primary-500'
  },
  { 
    title: 'Analytics Dashboard',
    description: 'Real-time performance monitoring and insights',
    icon: BarChart3,
    demo: 'analytics',
    color: 'bg-green-500'
  },
  { 
    title: 'Collaboration Workspace',
    description: 'Team collaboration with real-time synchronization',
    icon: Users,
    demo: 'collaboration',
    color: 'bg-orange-500'
  }
];

const claudeCommands = [
  { command: '/init-docs', status: 'completed', tokens: '+8K' },
  { command: '/sync-docs', status: 'executing', tokens: '+2K' },
  { command: '/compact-docs', status: 'pending', tokens: '-15K' },
  { command: '/docs:status', status: 'pending', tokens: '+500' }
];

export default function ShowcaseLandingPage() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string>('claude-dashboard');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [memoryUsage, setMemoryUsage] = useState<number>(42);
  const [commandIndex, setCommandIndex] = useState<number>(0);

  // Simulate live dashboard updates
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setMemoryUsage((prev) => {
        const newValue = prev + (Math.random() - 0.5) * 5;
        return Math.max(20, Math.min(80, newValue));
      });
      setCommandIndex(prev => (prev + 1) % claudeCommands.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  const renderPersonaShowcase = () => (
    <div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {personas.map((persona, index) => {
        const Icon = persona.icon;
        return (<motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`cursor-pointer transition-all duration-300 ${
              selectedPersona === persona.id ? 'scale-105' : 'hover:scale-105')
            }`}>onClick={() => 
              setSelectedPersona(selectedPersona === persona.id ? null : persona.id)
            }
          >
            <Card className={`glass border-0 ${selectedPersona === persona.id ? 'ring-2 ring-white/50' : ''}`}>
              <CardHeader className="text-center glass">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${persona.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white glass">{persona.name}
                <CardDescription className="text-white/80 glass">
                  {persona.description}
                
              
              <CardContent className="glass">
                <AnimatePresence>
                  {selectedPersona === persona.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center">
                        Active Persona
                      
                      <Button size="sm" className="w-full" asChild>
                        <Link href="/auth/signin">
                          Start with {persona.name}
                          <ArrowRight className="ml-2 h-3 w-3" />
                        
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              
            
          </motion.div>
        );
      })}
    </div>
  );

  const renderClaudeDashboard = () => (
    <Card className="glass border-0">
      <CardHeader className="glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white glass">
              Claude Code Integration
            
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost">onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/10">
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            
            <Button
              size="sm"
              variant="ghost">onClick={() => setMemoryUsage(42)}
              className="text-white hover:bg-white/10">
              <RefreshCw className="w-4 h-4" />
            
          </div>
        </div>
        <CardDescription className="text-white/80 glass">
          Live AI-powered development with intelligent memory optimization
        
      
      <CardContent className="space-y-4 glass">
        <div className="glass grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-2 text-white/80">
              <span>Memory Usage</span>
              <span>{Math.round(memoryUsage)}K / 200K</span>
            </div>
            <Progress value={memoryUsage} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2 text-white/80">
              <span>Optimization</span>
              <span>78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/90">Active Commands</h4>
          {claudeCommands.map((cmd, index) => (
            <motion.div
              key={cmd.command}
              className={`flex items-center justify-between p-2 rounded-lg ${
                index === commandIndex
                  ? 'bg-blue-500/20 border border-blue-400/30'
                  : 'bg-white/5'
              }`}
              animate={{ 
                scale: index === commandIndex ? 1.02 : 1, 
                opacity: index === commandIndex ? 1 : 0.7 
              }}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  cmd.status === 'completed'
                    ? 'bg-green-400'
                    : cmd.status === 'executing'
                      ? 'bg-blue-400 animate-pulse'
                      : 'bg-gray-400'>}`} />
                <span className="font-mono text-sm text-white">
                  {cmd.command}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {cmd.tokens}
              
            </motion.div>
          ))}
        </div>
      
    
  );

  const renderUIBuilder = () => (
    <Card className="glass border-0">
      <CardHeader className="glass">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-brand-primary-400" />
          <CardTitle className="text-white glass">Visual UI Builder
        </div>
        <CardDescription className="text-white/80 glass">
          Drag-and-drop interface with real-time preview
        
      
      <CardContent className="glass">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['Button', 'Card', 'Input', 'Modal', 'Chart', 'Table'].map((component) => (
            <motion.div
              key={component}
              className="p-2 bg-white/10 rounded-lg text-center text-sm text-white cursor-pointer hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {component}
            </motion.div>
          ))}
        </div>

        <div className="h-32 bg-white/5 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-center text-white/60">
          <div>
            <Palette className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Drop components here
          </div>
        </div>
      
    
  );

  const renderAnalytics = () => (
    <Card className="glass border-0">
      <CardHeader className="glass">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <CardTitle className="text-white glass">Analytics Dashboard
        </div>
        <CardDescription className="text-white/80 glass">
          Real-time performance monitoring
        
      
      <CardContent className="glass">
        <div className="glass grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-center text-2xl font-bold text-white">12</div>
            <div className="text-sm text-white/60">Active Projects</div>
          </div>
          <div>
            <div className="text-center text-2xl font-bold text-white">98%</div>
            <div className="text-sm text-white/60">System Health</div>
          </div>
        </div>

        <div className="space-y-2">
          {['API Response Time', 'Memory Usage', 'Active Users'].map((metric, index) => (
            <div key={metric} className="flex items-center justify-between">
              <span className="text-sm text-white/80">{metric}</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-sm text-green-400">
                  +{5 + index * 2}%
                </span>
              </div>
            </div>
          ))}
        </div>
      
    
  );

  const renderCollaboration = () => (
    <Card className="glass border-0">
      <CardHeader className="glass">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-400" />
          <CardTitle className="text-white glass">Collaboration Workspace
        </div>
        <CardDescription className="text-white/80 glass">
          Real-time team collaboration
        
      
      <CardContent className="glass">
        <div className="space-y-3">
          {[
            { name: 'Alex Chen', status: 'online', action: 'Editing Dashboard.tsx' },
            { name: 'Sarah Kim', status: 'online', action: 'Reviewing PR #42' },
            { name: 'Mike Johnson', status: 'away', action: 'Last seen 5m ago' }
          ].map((user) => (
            <div key={user.name} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                user.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'>}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-white/60">{user.action}</div>
              </div>
            </div>
          ))}
        </div>
      
    
  );

  const renderDemo = () => {
    switch (activeDemo) {
      case 'claude-dashboard':
        return renderClaudeDashboard();
      case 'ui-builder':
        return renderUIBuilder();
      case 'analytics':
        return renderAnalytics();
      case 'collaboration':
        return renderCollaboration();
      default:
        return renderClaudeDashboard();
    }
  };

  return (<div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-primary-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <Badge variant="outline" className="mb-6 glass border-white/20 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered SaaS Platform
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-brand-primary-400 to-pink-400 bg-clip-text text-transparent mb-6">
              AI-Guided SaaS Builder
            </h1>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Experience the future of development with AI personas, intelligent
              code generation, and real-time collaboration - all in one
              sophisticated platform.
            
          </motion.div>

          {/* Persona Selection Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              Choose Your AI Development Persona
            </h2>)
            {renderPersonaShowcase()}
          </motion.div>
        </div>
      

      {/* Live Features Demo */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Live Platform Demo
            </h2>
            <p className="text-xl text-white/80">
              See our actual components and features in action
            
          </motion.div>

          <div className="glass grid lg:grid-cols-3 gap-8">
            {/* Feature Tabs */}
            <div className="lg:col-span-1 space-y-3">
              {liveFeatures.map((feature) => {
                const Icon = feature.icon;
                return (<motion.button
                    key={feature.demo}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      activeDemo === feature.demo
                        ? 'bg-white/20 border border-white/30'
                        : 'bg-white/5 hover:bg-white/10')
                    }`}>onClick={() => setActiveDemo(feature.demo)}
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
                        
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Live Demo */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  {renderDemo()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join the next generation of AI-powered development
            
            <div className="glass flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-brand-primary-500 hover:from-blue-600 hover:to-brand-primary-600"
                asChild>
                <Link href="/auth/signin">
                  Start Building Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                
              
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                asChild>
                <Link href="/ui-builder">
                  Try UI Builder
                  <Wrench className="ml-2 h-4 w-4" />
                
              
            </div>
          </motion.div>
        </div>
      
    </div>
  );
}