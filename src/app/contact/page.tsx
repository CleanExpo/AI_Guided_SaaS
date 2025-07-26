/* BREADCRUMB: pages - Application pages and routes */
'use client';

// Force dynamic rendering to avoid SSG errors
export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';



export default function ContactPage() {
  return (
    <div className="min-h-screen glass py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you succeed with AI Guided SaaS.
          </p>
        </div>
        
        <div className="glass grid gap-8 lg:grid-cols-2">
          <div>
            <Card className="glass">
          <CardHeader className="glass">
            <CardTitle className="glass">Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <form className="space-y-4" role="form">
                  <div className="glass grid gap-4 md:grid-cols-2">
                    <Input ="First Name" />
                    <Input ="Last Name" />
                  </div>
                  <Input ="Email Address" type="email" />
                  <Input ="Company" />
                  <Textarea ="How can we help you?" rows={4} />
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="glass">
          <CardContent className="glass p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">hello@aiguidedsaas.com</p>
                    <p className="text-gray-600">support@aiguidedsaas.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass">
          <CardContent className="glass p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri 9am-6pm EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass">
          <CardContent className="glass p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">
                      123 Innovation Drive<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass">
          <CardContent className="glass p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 2:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}