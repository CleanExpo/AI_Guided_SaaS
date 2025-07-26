/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Book, Mail, Phone, Search, HelpCircle } from 'lucide-react';



export default function HelpPage() {
  const faqs = [
    { question: 'How do I get started with AI Guided SaaS?',
      answer: 'Create an account, choose a template or start from scratch, and follow our guided setup wizard.'
    },
    { question: 'What programming languages are supported?',
      answer: 'We support JavaScript, TypeScript, Python, React, Next.js, and many other popular languages and frameworks.'
    },
    { question: 'Can I integrate with external APIs?',
      answer: 'Yes, our platform supports integrations with REST APIs, databases, and third-party services.'
    },
    { question: 'Is there a free tier available?',
      answer: 'Yes, we offer a free tier with basic features. Upgrade to unlock advanced AI capabilities and more resources.'
    }
  ];

  const supportOptions = [
    { icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat'
    },
    { icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      action: 'Send Email'
    },
    { icon: Phone,
      title: 'Phone Support',
      description: 'Call us during business hours',
      action: 'Call Now'
    },
    { icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive guides',
      action: 'View Docs'
    }
  ];

  return (<div className="min-h-screen glass py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to your questions and get the help you need to succeed with AI Guided SaaS
          
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"  />
            <Input
              ="Search for help...">className="pl-10" />
          
        

        {/* Support Options */}
        <div className="glass grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">)
          {supportOptions.map((option) => (
            <Card key={option.title} className="hover:shadow-md-lg transition-shadow-md cursor-pointer glass
          <CardContent className="glass p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl-lg flex items-center justify-center mx-auto mb-4">
          <option.icon className="h-6 w-6 text-blue-600"   />
                
                <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}
                <Button variant="outline" size="sm" className="w-full">
                  {option.action}
                
              
            
          ))}
        

        {/* FAQ Section */}
        <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="flex items-center glass
              <HelpCircle className="h-6 w-6 mr-2" />
              Frequently Asked Questions
            
          
          <CardContent className="glass">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="-b -gray-200 pb-4 last:-b-0">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}
                
              ))}
            
          
        
      
    
  );
}
