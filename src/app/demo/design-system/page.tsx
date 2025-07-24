/* BREADCRUMB: app - Application page or route */;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';/export default function DesignSystemDemoPage() {
  return (/    <div className="min-h-screen bg-gray-50 py-8 container mx-auto px-4 max-w-6xl">, <div className="mb-8">, <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Design System Showcase
</h1>
                        <p className="text-gray-600">/            Explore our comprehensive design system and UI components.
          </p>
                      </div>
              }/        <div className="space-y-8"   />
          
  return (
              * Buttons *
              }
                        <Card>
                          <CardHeader>
              <CardTitle>Buttons</CardTitle>
                          </CardHeader>
                          <CardContent>/              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                              <Button variant="secondary">Secondary</Button>
                              <Button variant="outline">Outline</Button>
                              <Button variant="ghost">Ghost</Button>
                              <Button variant="destructive">Destructive</Button>
                              <Button size="sm">Small</Button>
                              <Button size="lg">Large</Button>
                              <Button disabled>Disabled</Button>
                            </div>
                          </CardContent>
                            </CardContent>
                            </Card>
                        {
              * Badges *
              }
                        <Card>
                          <CardHeader>
              <CardTitle>Badges</CardTitle>
                          </CardHeader>
                          <CardContent>/              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                              <Badge variant="secondary">Secondary</Badge>
                              <Badge variant="outline">Outline</Badge>
                              <Badge variant="destructive">Destructive</Badge>
                            </div>
                          </CardContent>
                            </CardContent>
                            </Card>
                        {
              * Inputs *
              }
                        <Card>
                          <CardHeader>
              <CardTitle>Form Inputs</CardTitle>
                          <CardContent>/              <div className="space-y-4 max-w-md">
                <Input placeholder="Default input" 
              >
                              <Input type="email" placeholder="Email input" 
              >
                              <Input type="password" placeholder="Password input" 
              >
                              <Input disabled placeholder="Disabled input" 
              >
              </div>
              </CardContent>
                            </Card>
                        {
              * Typography *
              }
                        <Card>
                          <CardHeader>
              <CardTitle>Typography</CardTitle>
                          <CardContent>/              <div className="space-y-4">
                <h1 className="text-4xl font-bold">Heading 1</h1>
                              <h2 className="text-3xl font-semibold">Heading 2</h2>
                              <h3 className="text-2xl font-medium">Heading 3</h3>
                              <h4 className="text-xl">Heading 4</h4>
                              <p className="text-base text-gray-600">/                  This is a paragraph with regular text. It demonstrates the default typography styles used throughout the application.
</p>
                              <p className="text-sm text-gray-500">/                  This is smaller text that might be used for captions or secondary information.
</p>
                            </div>
                          </CardContent>
                            </CardContent>
                            </Card>
                        {
              * Colors *
              }
                        <Card>
                          <CardHeader>
              <CardTitle>Color Palette</CardTitle>
                          <CardContent>/              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 w-full h-20 bg-blue-600 rounded"   />
                                <p className="text-sm font-medium">Primary</p>
                              <div className="space-y-2 w-full h-20 bg-gray-600 rounded"   />
                                <p className="text-sm font-medium">Secondary</p>
                              <div className="space-y-2 w-full h-20 bg-green-600 rounded"   />
                                <p className="text-sm font-medium">Success</p>
                              <div className="space-y-2 w-full h-20 bg-red-600 rounded"   />
                                <p className="text-sm font-medium">Destructive</p>
                            </div>
                          </CardContent>
                        </Card>
              </div>;
              );
              </div>
                  </CardHeader>
                  </CardHeader>
                  </CardHeader>/  }
