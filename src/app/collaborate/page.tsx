/* BREADCRUMB: pages - Application pages and routes */
'use client';
import React from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Share2, MessageCircle, Clock, Globe, Lock, Zap } from 'lucide-react';

export default function CollaboratePage() {
  const { data: session, status }  = useSession();

const [activeProject, setActiveProject] = useState<string | null>(null);
  
const [projectName, setProjectName]  = useState('');

const [showWorkspace, setShowWorkspace] = useState(false);
  
  
const mockProjects = [
    { id: '1',
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce solution with AI-powered recommendations',
      members: 5,
      lastActivity: '2 hours ago',
      status: 'active',
      isPublic: false
    },
    { id: '2',
      name: 'Mobile App UI',
      description: 'Designing intuitive mobile interfaces for productivity app',
      members: 3,
      lastActivity: '1 day ago',
      status: 'review',
      isPublic: true
    },
    { id: '3',
      name: 'API Documentation',
      description: 'Comprehensive API documentation with interactive examples',
      members: 2,
      lastActivity: '3 days ago',
      status: 'completed',
      isPublic: true
    }
  ];
  
  if (status === 'loading') {
    return (<div className="flex items-center justify-center min-h-screen">


        <div className="animate-spin rounded-lg-full h-8 w-8 -b-2 -blue-600">
      )
    );
  }
  
  return (<div className="min-h-screen glass">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">


          <div className="absolute inset-0 bg-grid-gray-100 bg-grid opacity-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">


          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
              Real-time Collaboration
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Build Together, Ship Faster
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Collaborate with your team in real-time. Share code, ideas, and build amazing projects together.
            
            {session ? ()
              <Button size="lg" onClick={() => setShowWorkspace(true)} className="gap-2">
                <Plus className="h-5 w-5" />
                Create New Project
              
            ) : (
              <Button size="lg" onClick={() => window.location.href = "/auth/signin"}
                Get Started Free
              
            )}
          
        
      

      {/* Features Section */}
      <section className="py-16 md:py-24">


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">


          <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Collaboration Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to collaborate effectively with your team
            
          
          
          <div className="glass grid gap-8 md:grid-cols-2 lg:grid-cols-3">


            <Card className="hover:shadow-md-lg transition-shadow-md glass">
              <CardHeader className="glass">


                <Share2 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="glass">Real-time Sync
              
              <CardContent className="glass">


                <p className="text-gray-600">
                  See changes instantly as your team works. No more merge conflicts or outdated versions.
                
              
            
            
            <Card className="hover:shadow-md-lg transition-shadow-md glass">


              <CardHeader className="glass">
                <Users className="h-12 w-12 text-green-600 mb-4" />


                <CardTitle className="glass">Team Management
              
              <CardContent className="glass">


                <p className="text-gray-600">
                  Invite team members, manage permissions, and track contributions all in one place.
                
              
            
            
            <Card className="hover:shadow-md-lg transition-shadow-md glass">


              <CardHeader className="glass">
                <MessageCircle className="h-12 w-12 text-purple-600 mb-4" />


                <CardTitle className="glass">Built-in Chat
              
              <CardContent className="glass">


                <p className="text-gray-600">
                  Discuss ideas and solve problems together with integrated team chat and comments.
                
              
            
            
            <Card className="hover:shadow-md-lg transition-shadow-md glass">


              <CardHeader className="glass">
                <Clock className="h-12 w-12 text-orange-600 mb-4" />


                <CardTitle className="glass">Version History
              
              <CardContent className="glass">


                <p className="text-gray-600">
                  Track every change and revert to any previous version with complete history.
                
              
            
            
            <Card className="hover:shadow-md-lg transition-shadow-md glass">


              <CardHeader className="glass">
                <Lock className="h-12 w-12 text-red-600 mb-4" />


                <CardTitle className="glass">Secure & Private
              
              <CardContent className="glass">


                <p className="text-gray-600">
                  Enterprise-grade security with end-to-end encryption and access controls.
                
              
            
            
            <Card className="hover:shadow-md-lg transition-shadow-md glass">


              <CardHeader className="glass">
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />


                <CardTitle className="glass">AI-Powered
              
              <CardContent className="glass">


                <p className="text-gray-600">
                  Get intelligent suggestions, auto-completion, and code reviews powered by AI.
                
              
            
          
        
      

      {/* Projects Section (for logged-in users) */}
      {session && (
        <section className="py-16 glass">


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">


          <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
              <Button onClick={() => setShowWorkspace(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Project
              
            
            
            <div className="glass grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md-lg transition-shadow-md cursor-pointer glass">onClick={() => setActiveProject(project.id)}
                  <CardHeader className="glass">


                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg glass">{project.name}
                      {project.isPublic ? (
                        <Globe className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    
                  
                  <CardContent className="glass">


                    <p className="text-gray-600 text-sm mb-4">{project.description}
                    <div className="flex items-center justify-between">


                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />


                        <span>{project.members} members</span>
                      
                      <Badge variant={
                        project.status === "active" ? "default" :>project.status === "review" ? "secondary" : "outline">}>
                        {project.status}
                      
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Last activity: {project.lastActivity}
                    
                  
                
              ))}
            
          
        
      )}

      {/* CTA Section */}
      {!session && (
        <section className="py-16 glass-button primary">


          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start collaborating?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of teams building amazing products together
            
            <Button size="lg" variant="secondary" onClick={() => window.location.href = "/auth/signin"}
              Start Free Trial
            
          
        
      )}
    
  );
}