// @ts-nocheck
/* BREADCRUMB: pages - Application pages and routes */
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'About - AI Guided SaaS Platform',
  description: 'Learn about our mission to revolutionize software development with AI'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About AI Guided SaaS</h1>
          
          <div className="space-y-6">
          <p className="text-lg text-gray-700">
              We're revolutionizing software development by making professional-grade applications accessible to everyone through AI-powered guidance.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
              <p className="text-gray-700">
                To democratize software creation by combining the power of AI with intuitive design tools, enabling anyone to build professional applications.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Beginners</h3>
                <p className="text-gray-600">
                  Start with guided templates and let AI help you build your first application with no coding experience required.
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">For Professionals</h3>
                <p className="text-gray-600">
                  Access advanced tools, custom code editing, and AI-powered optimization for enterprise-grade applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
