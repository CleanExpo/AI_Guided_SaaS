import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - AI Guided SaaS Platform',
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
            

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To democratize software development by providing intelligent, AI-driven tools that bridge the gap between no-code simplicity and professional development power.
              
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>AI-powered development tools that understand your requirements</li>
                <li>No-code and pro-code experiences to suit every skill level</li>
                <li>Enterprise-grade security and scalability built-in</li>
                <li>One-click deployment to any cloud platform</li>
                <li>Continuous learning and improvement of our AI models</li>
              
            </section>
          
        
      
    
  );
}