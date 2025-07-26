'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              
              <span className="text-xl font-bold">AI Guided SaaS
            </div>
            <div className="flex items-center gap-6">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 hidden md:block">
                Features
              
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 hidden md:block">
                Pricing
              
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 hidden md:block">
                Docs
              
              <Link href="/auth/signin">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Sign In
              
              <Link href="/dashboard">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Get Started
                
              
            </div>
          
        </div>
      

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              
              #1 AI Development Platform on Product Hunt
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              Build SaaS Apps
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                10x Faster with AI
              
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The complete platform for building, deploying, and scaling AI-powered applications. 
              From idea to production in hours, not months.
            
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto mb-8">
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Start Free Trial
              
            
            <p className="text-sm text-gray-500 mt-2 text-center">
              No credit card required • 14-day free trial
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50M+</div>
              <div className="text-sm text-gray-600">API Calls/Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">&lt; 100ms</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
          </div>
        </div>
      

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Build</h2>
            <p className="text-xl text-gray-600">Powerful features that accelerate development
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Development',
                description: 'Claude, GPT-4, and Gemini integration. Build apps 10x faster with AI pair programming.',
                icon: '🧠'
              },
              {
                title: 'Visual Flow Builder',
                description: 'Drag-and-drop interface to design complex workflows. No code required.',
                icon: '🔄'
              },
              {
                title: 'One-Click Deploy',
                description: 'Deploy to Vercel, Netlify, or AWS with a single click. Auto-scaling included.',
                icon: '☁️'
              },
              {
                title: 'Version Control',
                description: 'Built-in Git integration. Branch, merge, and rollback with confidence.',
                icon: '🌿'
              },
              {
                title: 'Database Designer',
                description: 'Visual schema builder with automatic migrations. PostgreSQL, MySQL, MongoDB.',
                icon: '💾'
              },
              {
                title: 'Enterprise Security',
                description: 'SOC2 compliant. End-to-end encryption, RBAC, and audit logs.',
                icon: '🔒'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}
              </div>
            ))}
          </div>
        </div>
      

      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$0',
                period: 'forever',
                description: 'Perfect for side projects',
                features: ['3 projects', '1 team member', 'Community support', 'Basic AI assistance', 'Deploy to Vercel'],
                cta: 'Start Free',
                popular: false
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                description: 'For professional developers',
                features: ['Unlimited projects', '5 team members', 'Priority support', 'Advanced AI models', 'Custom domains', 'Analytics dashboard', 'API access'],
                cta: 'Start 14-day Trial',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'pricing',
                description: 'For large teams',
                features: ['Everything in Pro', 'Unlimited team members', 'Dedicated support', 'Custom AI training', 'On-premise deployment', 'SLA guarantee', 'Security audit'],
                cta: 'Contact Sales',
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`p-6 bg-white rounded-lg ${plan.popular ? 'border-2 border-blue-600 shadow-lg' : 'border border-gray-200'} relative`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}
                    <span className="text-gray-600">{plan.period}
                  </div>
                  <p className="text-gray-600">{plan.description}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      
                      <span className="text-sm">{feature}
                    </li>
                  ))}
                
                <button className={`w-full py-2 px-4 rounded-md font-medium ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {plan.cta}
                
              </div>
            ))}
          </div>
        </div>
      

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ developers building the future with AI
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100">
                Start Building Now →
              
            
            <Link href="/demo">
              <button className="px-8 py-3 border border-white text-white rounded-md font-medium hover:bg-white/10">
                Schedule Demo
              
            
          </div>
        </div>
      

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                
                <span className="text-white font-bold">AI Guided SaaS
              </div>
              <p className="text-sm">
                The complete platform for building AI-powered applications.
              
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</li>
                <li><Link href="/docs" className="hover:text-white">Documentation</li>
                <li><Link href="/changelog" className="hover:text-white">Changelog</li>
              
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</li>
                <li><Link href="/blog" className="hover:text-white">Blog</li>
                <li><Link href="/careers" className="hover:text-white">Careers</li>
                <li><Link href="/contact" className="hover:text-white">Contact</li>
              
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</li>
                <li><Link href="/security" className="hover:text-white">Security</li>
              
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm">© 2024 AI Guided SaaS. All rights reserved.
          </div>
        </div>
      
    </div>
  );
}