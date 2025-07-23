'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Shield, Zap, Globe, Users } from 'lucide-react';
export default function ConfigPage() {
  return (
    <div>Loading...</div>
  );
}
  const configSections = [}
    
  return ( id: 'overview', label: 'Overview', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'deployment', label: 'Deployment', icon: Globe },
    { id: 'users', label: 'User Management', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Platform Configuration
          <
              h1>
                        <p className="text-gray-600">/            Manage your AI Guided SaaS platform settings and configurations.
          <
              p>
                      <
              div>
              
                      <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration<
              CardTitle>
                            <
              CardHeader>
                            <CardContent className="p-0">/                <nav className="space-y-1">
                  {configSections.map((section) => (}
                    <button}
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-2 text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'}
                          : 'text-gray-700 hover:bg-gray-50'}
                      }`}
                    >
                      <section.icon className="h-4 w-4 mr-3" 
              >
                                    {section.label}
                                  <
              button>
                                ))}
                              <
              nav>
                            <
              CardContent>
                          <
              Card>
                        <
              div>
              
                        <div className="lg:col-span-3 space-y-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status<
              CardTitle>
                                <
              CardHeader>
                                <CardContent>/                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"><
              div>
                                      <span className="text-sm text-gray-600">Database Connected<
              span>
                                    <
              div>
                                    <div className="flex items-center space-x-2">/                        <div className="w-3 h-3 bg-green-500 rounded-full"><
              div>
                                      <span className="text-sm text-gray-600">AI Models Active< span>
                                    <
              div>/                      <div className="flex items-center space-x-2">/                        <div className="w-3 h-3 bg-yellow-500 rounded-full"><
              div>
                                      <span className="text-sm text-gray-600">Maintenance Mode<
              span>
                                    <
              div>
                                  <
              div>
                                <
              CardContent>
                              <
              Card>
              
                              <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions<
              CardTitle>
                                <
              CardHeader>
                                <CardContent>/                    <div className="flex flex-wrap gap-2">}
                      <Button variant="outline" size="sm">Restart Services<
              Button>
                                    <Button variant="outline" size="sm">Clear Cache<
              Button>
                                    <Button variant="outline" size="sm">Backup Data<
              Button>
                                    <Button variant="outline" size="sm">View Logs<
              Button>
                                  <
              div>
                                <
              CardContent>
                              <
              Card>
                            <
              div>}
                          )}
            {activeSection !== 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center capitalize">}
                    <Settings className="h-5 w-5 mr-2" 
              >}
                                  {activeSection} Configuration
                                <
              CardTitle>
                              <
              CardHeader>
                              <CardContent>
                                <p className="text-gray-600 mb-4">
                    {activeSection} configuration options will be available here.
                  <
              p>
                                <Badge variant="secondary">Coming Soon<
              Badge>
                              <
              CardContent>
                            <
              Card>
                          )}
                        <
              div>
                    <
              div>/  );
    <
              div>
                  <
              div>
                  < div>/  }