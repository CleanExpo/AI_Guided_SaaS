/* BREADCRUMB: app - Application page or route */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Users, Heart, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen glass py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="glass flex items-center gap-4 mb-6">
            <Link href="/community">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              
            
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Guidelines
          </h1>
          <p className="text-gray-600">
            Help us maintain a welcoming and productive community for everyone.
          
        </div>

        <div className="space-y-8">
          <Card className="glass">
            <CardHeader className="glass">
              <CardTitle className="flex items-center gap-2 glass">
                <Heart className="h-5 w-5 text-red-500" />
                Our Community Values
              
            
            <CardContent className="glass">
              <p className="text-gray-600 mb-4">
                AI Guided SaaS is built on the principles of collaboration, innovation, and mutual respect.
                Our community guidelines ensure everyone can participate in a safe and productive environment.
              
              <ul className="space-y-2 text-gray-600">
                <li>• Be respectful and kind to all community members</li>
                <li>• Share knowledge and help others learn</li>
                <li>• Provide constructive feedback and criticism</li>
                <li>• Celebrate diversity and different perspectives</li>
              
            
          
          
          <Card className="glass">
            <CardHeader className="glass">
              <CardTitle className="flex items-center gap-2 glass">
                <Shield className="h-5 w-5 text-blue-500" />
                Code of Conduct
              
            
            <CardContent className="glass">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">✅ Encouraged Behavior</h3>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Sharing helpful resources and tutorials</li>
                    <li>• Asking questions and seeking help</li>
                    <li>• Providing detailed bug reports and feedback</li>
                    <li>• Contributing to discussions constructively</li>
                    <li>• Welcoming newcomers to the community</li>
                  
                </div>
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">❌ Prohibited Behavior</h3>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Harassment, discrimination, or hate speech</li>
                    <li>• Spam, self-promotion, or off-topic content</li>
                    <li>• Sharing malicious code or security vulnerabilities</li>
                    <li>• Personal attacks or inflammatory language</li>
                    <li>• Sharing copyrighted content without permission</li>
                  
                </div>
              </div>
            
          

          <Card className="glass">
              <CardHeader className="glass">
                <CardTitle className="flex items-center gap-2 glass">
                <Users className="h-5 w-5 text-green-500" />
                How to Participate
              
            
            <CardContent className="glass">
              <div className="glass grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Asking Questions</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Search existing topics before posting</li>
                    <li>• Provide clear, detailed descriptions</li>
                    <li>• Include relevant code snippets or screenshots</li>
                    <li>• Use descriptive titles for your posts</li>
                  
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Providing Answers</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Be patient and understanding</li>
                    <li>• Explain your reasoning and approach</li>
                    <li>• Provide working examples when possible</li>
                    <li>• Point to relevant documentation</li>
                  
                </div>
              </div>
            
          

          <Card className="glass">
              <CardHeader className="glass">
                <CardTitle className="flex items-center gap-2 glass">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Reporting Issues
              
            
            <CardContent className="glass">
              <p className="text-gray-600 mb-4">
                If you encounter behavior that violates our community guidelines, please report it to our moderation team.
              
              <div className="glass flex gap-4">
                <Button variant="outline">
                  Report Content
                
                <Button variant="outline">
                  Contact Moderators
                
              </div>
            
          

          <Card className="glass">
            <CardContent className="pt-6 glass">
              <p className="text-center text-gray-600 text-sm">
                These guidelines are subject to change as our community grows.
                Last updated: January 2025
              
            
          
        </div>
      </div>
    </div>
  );
}