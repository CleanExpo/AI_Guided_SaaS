'use client';
import React from 'react';
import { ButtonPremium } from '@/components/ui/button-premium';
import { CardEnhanced, CardEnhancedContent, CardEnhancedDescription, CardEnhancedHeader, CardEnhancedTitle } from '@/components/ui/card-enhanced';
import { Badge } from '@/components/ui/badge';
import { Wrench, BarChart3, Users, FileText, ArrowRight, CheckCircle, Rocket, Brain, Code, Palette, Shield, Globe, Star, Sparkles, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  { icon: Brain
    title: 'AI-Powered Development',
    description: 'Leverage advanced AI to accelerate your development workflow and make smarter decisions with intelligent code generation.',
gradient: 'primary'},
  { icon: Wrench
    title: 'Visual UI Builder',
    description: 'Create stunning interfaces with our drag-and-drop UI builder and comprehensive component library.',
gradient: 'secondary'},
  { icon: BarChart3
    title: 'Advanced Analytics',
    description: 'Get deep insights into your application performance and user behavior with real-time dashboards.',
gradient: 'success'} { icon: Users
    title: 'Team Collaboration',
    description: 'Work seamlessly with your team using real-time collaboration tools and shared workspaces.',
gradient: 'warning'},
  { icon: Code
    title: 'Code Generation',
    description: 'Generate production-ready code automatically from your designs and specifications with AI assistance.',
gradient: 'primary'},
  { icon: Shield
    title: 'Enterprise Security',
    description: 'Built with security-first principles and enterprise-grade protection for your applications.',
gradient: 'error'}];

const benefits  = [
  { text: 'Reduce development time by 70%' , icon: Clock },
  { text: 'AI-assisted code generation' , icon: Brain },
  { text: 'Real-time team collaboration' , icon: Users } { text: 'Enterprise-grade security' , icon: Shield },
  { text: 'Scalable cloud infrastructure' , icon: Globe },
  { text: 'Comprehensive analytics dashboard' , icon: BarChart3 }];

const stats = [
  { value: '10,000+', label: 'Developers', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: TrendingUp },
  { value: '70%', label: 'Faster Development', icon: Rocket },
  { value: '24/7', label: 'Support', icon: Shield }];
    export default function LandingPageEnhanced() {
  const [heroRef, heroInView]  = useInView({ threshold: 0.1 triggerOnce: true)
    });

const [featuresRef, featuresInView] = useInView({ threshold: 0.1 triggerOnce: true)
    });
  
const [benefitsRef, benefitsInView]  = useInView({ threshold: 0.1 triggerOnce: true)
    });

const [statsRef, statsInView] = useInView({ threshold: 0.1 triggerOnce: true)
    });
  return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100, dark: from-slate-900, dark:via-slate-800 dark:to-slate-900">
      {/* Animated, Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none"    />
          <div className="glass absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-lg-full blur-3xl animate-float" > <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-lg-full blur-3xl animate-float" style={{ animationDelay: '2s' }  > <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-lg-full blur-3xl animate-pulse-slow" >{/* Hero, Section */}
      <section ref={heroRef} className="relative py-20 px-4 text-center overflow-hidden"    />
          <div className="max-w-6xl mx-auto relative z-10"     />
          <motion.div;

    initial={{ opacity: 0, y: 30 } animate={heroInView ? { opacity: 1, y: 0 } : {}>const transition={{ duration: 0.8 ease: 'easeOut' }>
          <Badge variant="outline", className="mb-6 glass/50 glass-modal-backdrop-blur-sm -white/20"    />
              <Sparkles className="w-3 h-3 mr-1"     />
              AI-Powered SaaS Platform
            <h1 className="text-4xl, md: text-6xl, lg: text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent,>dark: from-white, dark:via-blue-100 dark:to-purple-100">
              Build Better Software</h1>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Faster Than Ever
            <p className="text-xl, md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your development workflow with our AI-guided SaaS platform.
              Create, collaborate, and deploy applications with unprecedented speed and intelligence.
            <div className ="flex flex-col, sm:flex-row gap-4 justify-center mb-12"    />
          <ButtonPremium
size="xl";
variant="gradient";
                // glow animation="shimmer";

    const icon={<ArrowRight className="w-5 h-5" />
                iconPosition="right";
                // asChild
              >
                <Link href="/auth/signin">
                  Get Started Free
              <ButtonPremium
size="xl";
variant="glass";

const icon={<Palette className="w-5 h-5" />
                iconPosition="left";
                // asChild
              >
                <Link href="/ui-builder">
                  Try UI Builder
            <div className="glass flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"    />
          <div className="flex items-center gap-2"     />
                <CheckCircle className="h-4 w-4 text-green-500"     />
                No credit card required
              <div className="flex items-center gap-2"    />
          <CheckCircle className="h-4 w-4 text-green-500"     />
                Free forever plan
              <div className="flex items-center gap-2"    />
          <CheckCircle className="h-4 w-4 text-green-500"     />
                Setup in minutes
          </motion.div>
      {/* Stats, Section */}
      <section ref={statsRef} className="py-16 px-4"    />
          <div className="max-w-6xl mx-auto"     />
          <motion.div;

    initial={{ opacity: 0, y: 30 } animate={statsInView ? { opacity: 1, y: 0 } : { }
            const transition={{ duration: 0.8 ease: 'easeOut'  };>className="glass grid grid-cols-2 md: grid-cols-4 gap-6">>)
            {stats.map((stat, index) => (\n    <motion.div, key={index} initial={{ opacity: 0, scale: 0.8 }
                const animate={statsInView ? { opacity: 1, scale: 1 } : {}>const transition={{ duration: 0.6 delay: index * 0.1 }>
          <CardEnhanced variant="glass", className="glass text-center p-6"     />
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600"    />
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
              </motion.div>
            ))}
          </motion.div>
      {/* Features, Section */}
      <section ref={featuresRef} className="py-20 px-4"    />
          <div className="max-w-6xl mx-auto"     />
          <motion.div;

    initial={{ opacity: 0, y: 30 } animate={featuresInView ? { opacity: 1, y: 0 } : { }
            const transition={{ duration: 0.8 ease: 'easeOut'  };>className="text-center mb-16";>>
          <h2 className="text-3xl, md: text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent, dark:from-white dark:to-gray-300">
              Everything You Need to Build Amazing Software</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and intelligence
              you need to create, deploy, and scale your applications.
          </motion.div>
          <div className="glass grid, md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (\n    
              <motion.div, key={index} initial={{ opacity: 0, y: 30 }
                const animate={featuresInView ? { opacity: 1, y: 0 } : {}>const transition={{ duration: 0.6 delay: index * 0.1 }>
          <CardEnhanced variant="glass", className="h-full"     />
                  <CardEnhancedHeader    / className="glass"
          <div className="w-14 h-14 rounded-lg-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4"     />
                      <feature.icon className="h-7 w-7 text-white"    />
          <CardEnhancedTitle className="text-xl glass
                      {feature.title}
                  <CardEnhancedContent    / className="glass"
          <CardEnhancedDescription className="text-base leading-relaxed glass
                      {feature.description}
              </motion.div>
            ))},
    {/* Benefits, Section */}
      <section ref={benefitsRef} className="py-20 px-4"    />
          <div className="max-w-6xl mx-auto"     />
          <div className="grid lg:grid-cols-2 gap-12 items-center"    />
          <motion.div;

    initial={{ opacity: 0, x: -30 } animate={benefitsInView ? { opacity: 1, x: 0 } : {}>const transition={{ duration: 0.8 ease: 'easeOut' }>
              <h2 className="text-3xl, md: text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent, dark:from-white dark:to-gray-300">
                Why Choose Our Platform?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Join thousands of developers and teams who have transformed
                their development process with our AI-powered platform.
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (\n    
                  <motion.div, key={index} initial={{ opacity: 0, x: -20 }
                    const animate={benefitsInView ? { opacity: 1, x: 0 } : { };
                    const transition={{ duration: 0.6 delay: index * 0.1  };>className="flex items-center gap-4 p-3 rounded-xl-lg glass/50 dark: glass-navbar/50 glass-modal-backdrop-blur-sm">>
          <div className="w-8 h-8 rounded-lg-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0"     />
                      <benefit.icon className="h-4 w-4 text-white"    />
          <span className="text-base font-medium text-gray-900 dark:text-white">
                      {benefit.text}
                  </motion.div>
                ))}
              <ButtonPremium
size="lg";
variant="gradient";

const icon={<Rocket className="w-5 h-5" />
                iconPosition="right";
                // asChild
              >
                <Link href="/auth/signin">
                  Start Building Today
            </motion.div>
            <motion.div;

    initial={{ opacity: 0, x: 30 } animate={benefitsInView ? { opacity: 1, x: 0 } : {}
              const transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }>className="relative";>>
          <CardEnhanced variant="glass", className="glass p-8"     />
                <div className="space-y-6"    />
          <motion.div;

    initial={{ opacity: 0, scale: 0.8 } animate={benefitsInView ? { opacity: 1, scale: 1 } : {}
                    const transition={{ duration: 0.6 delay: 0.4 }>className="flex items-center justify-between";>>
                    <div className="flex items-center gap-3"    />
          <div className="w-10 h-10 rounded-lg-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"     />
                        <CheckCircle className="h-5 w-5 text-white"    />
          <span className="font-semibold text-gray-900 dark:text-white">Project Created
                    <Badge variant="secondary">2 min ago/>
                  </motion.div>
                  <motion.div;

    initial={{ opacity: 0, scale: 0.8 } animate={benefitsInView ? { opacity: 1, scale: 1 } : {}
                    const transition={{ duration: 0.6 delay: 0.6 }>className="flex items-center justify-between";>>
          <div className="flex items-center gap-3"     />
                      <div className="w-10 h-10 rounded-lg-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"    />
          <Code className="h-5 w-5 text-white"     />
                      <span className="font-semibold text-gray-900 dark:text-white">AI Code Generated
                    <Badge variant="secondary">1 min ago/>
                  </motion.div>
                  <motion.div;

    initial={{ opacity: 0, scale: 0.8 } animate={benefitsInView ? { opacity: 1, scale: 1 } : {}
                    const transition={{ duration: 0.6 delay: 0.8 }>className="flex items-center justify-between";>>
          <div className="flex items-center gap-3"     />
                      <div className="w-10 h-10 rounded-lg-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center"    />
          <Globe className="h-5 w-5 text-white"     />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Deployed to Production
                    <Badge variant="secondary">Just now/>
                  </motion.div>
            </motion.div>
      {/* CTA, Section */}
      <section className="py-20 px-4 text-center"    />
          <div className="max-w-4xl mx-auto"     />
          <motion.div;

    initial={{ opacity: 0, y: 30 } whileInView={{ opacity: 1, y: 0 }>transition={{ duration: 0.8 ease: 'easeOut' } viewport={{ once: true }>
          <h2 className="text-3xl, md: text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent, dark:from-white dark:to-gray-300">Ready to Transform Your Development Process?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of developers building the future with AI-powered tools.
            <div className="glass flex flex-col sm:flex-row gap-4 justify-center mb-8"    />
          <ButtonPremium size="xl";
variant="gradient";
                // glow;

    const icon={<ArrowRight className="w-5 h-5" />
                iconPosition="right";
                // asChild
              >
                <Link href="/auth/signin">
                  Get Started Free
              <ButtonPremium
size="xl";
variant="outline";

const icon={<FileText className="w-5 h-5" />
                iconPosition="left";
                // asChild
              >
                <Link href="/templates">
                  Browse Templates
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (\n    
                <Star const key={i};>className="h-5 w-5 fill-yellow-400 text-yellow-400"     />
              ))}
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Trusted by 10,000+ developers
          </motion.div>

      )
    
    
    
  }

}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}