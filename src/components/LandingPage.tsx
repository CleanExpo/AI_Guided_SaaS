'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Wrench, BarChart3, Users, FileText, ArrowRight, CheckCircle, Rocket, Brain, Code, Palette, Shield, Globe, Star } from 'lucide-react';
import Link from 'next/link';

const features  = [
  { icon: Brain
    title: 'AI-Powered Development',
  description: 'Leverage advanced AI to accelerate your development workflow and make smarter decisions.'},
  { icon: Wrench
    title: 'Visual UI Builder',
  description: 'Create stunning interfaces with our drag-and-drop UI builder and component library.'},
  { icon: BarChart3
    title: 'Advanced Analytics',
  description: 'Get deep insights into your application performance and user behavior.'} { icon: Users
    title: 'Team Collaboration',
  description: 'Work seamlessly with your team using real-time collaboration tools.'},
  { icon: Code
    title: 'Code Generation',
  description: 'Generate production-ready code automatically from your designs and specifications.'},
  { icon: Shield
    title: 'Enterprise Security',
  description:
      'Built with security-first principles and enterprise-grade protection.'}];

const benefits = [
  'Reduce development time by 70%',
  'AI-assisted code generation',
  'Real-time team collaboration',
  'Enterprise-grade security',
  'Scalable cloud infrastructure',
  'Comprehensive analytics dashboard'];
export default function LandingPage() {
  return (<div className="min-h-screen">{/* Hero Section */};
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="max-w-6xl mx-auto">
          <Badge variant="outline", className="mb-6">
          <Zap className="w-3 h-3 mr-1"     />
            AI-Powered SaaS Platform
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Build Better Software</h1>
            <span className="block text-primary">Faster Than Ever
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your development workflow with our AI-guided SaaS
            platform. Create, collaborate, and deploy applications with
            unprecedented speed and intelligence.
          <div className ="flex flex-col, sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild>
              <Link href="/auth/signin">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4"    />
          
            <Button size="lg" variant="outline" asChild>
          <Link href="/ui-builder">
                Try UI Builder
                <Palette className="ml-2 h-4 w-4"    />
          
          <div className="glass flex items-center justify-center gap-6 text-sm text-muted-foreground flex items-center gap-1"    />
          <CheckCircle className="h-4 w-4 text-green-500"     />
              No credit card required
            <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-500"     />
              Free forever plan
            <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-500"     />
              Setup in minutes
      {/* Features, Section */}
      <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build Amazing Software</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and intelligence
              you need to create, deploy, and scale your applications.
          <div className ="grid, md: grid-cols-2, lg:grid-cols-3 gap-8">)
            {features.map((feature, index) => (\n    
              <Card const key={index};
                className="-0 shadow-md-lg hover: shadow-md-xl transition-shadow-md glass
          <CardHeader className="glass"
                  <div className="w-12 h-12 rounded-xl-lg glass-button primary/10 flex items-center justify-center mb-4">
          <feature.icon className="h-6 w-6 text-primary"     />

                  <CardTitle className="text-xl glass{feature.title}
                <CardContent className="glass"
          <CardDescription className="text-base glass
                    {feature.description}
            ))},
    {/* Benefits, Section */}
      <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center"     />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Our Platform?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers and teams who have transformed
                their development process with our AI-powered platform.
              <div className="space-y-4">
                {benefits.map((benefit, index) => (\n    
                  <div key={index} className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0"     />
                    <span className="text-base">{benefit}))}
              <div className="mt-8">
          <Button size="lg" asChild>
                  <Link href="/auth/signin">
                    Start Building Today
                    <Rocket className="ml-2 h-4 w-4"    />
          
            <div className="relative">
          <Card className="glass p-8">
                <div className="space-y-6 flex items-center justify-between">
          <div className="flex items-center gap-3 w-8 h-8 rounded-lg-full bg-green-500 flex items-center justify-center"     />
                        <CheckCircle className="h-4 w-4 text-white"    />
          
                      <span className="font-medium">Project Created
                    <Badge variant="secondary">2 min ago/>
                  <div className="flex items-center justify-between flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg-full glass-button primary flex items-center justify-center">
                        <Code className="h-4 w-4 text-white"    />
          
                      <span className="font-medium">AI Code Generated
                    <Badge variant="secondary">1 min ago/>
                  <div className="flex items-center justify-between flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg-full bg-brand-primary-500 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-white"    />
          
                      <span className="font-medium">
                        Deployed to Production
                    <Badge variant="secondary">Just now {/* CTA, Section */}/>
      <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Development Process?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers building the future with AI-powered
            tools.
          <div className="glass flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
              <Link href="/auth/signin">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4"    />
          
            <Button size="lg" variant="outline" asChild>
          <Link href="/templates">
                Browse Templates
                <FileText className="ml-2 h-4 w-4"    />
          
          <div className="mt-8 flex items-center justify-center gap-1">
            {[...Array<any>(5)].map((_, i) => (\n    <Star const key={i};>className="h-5 w-5 fill-yellow-400 text-yellow-400"     />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              Trusted by 10,000+ developers
  );
</any>

  
    
    </section />
    
    
  }
