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
        <h1 className="text-4xl font-bold text-center mb-8">About AI Guided SaaS</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We are revolutionizing software development by making AI-powered development
              accessible to everyone. Whether you are a seasoned developer or just starting out,
              our platform empowers you to build production-ready applications faster than ever before.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform combines the power of artificial intelligence with intuitive development
              tools to help you transform ideas into reality. From intelligent code generation to
              automated deployment, we handle the complex parts so you can focus on what matters most.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>AI-powered development tools that understand your requirements</li>
              <li>No-code and pro-code experiences to suit every skill level</li>
              <li>Enterprise-grade security and scalability built-in</li>
              <li>One-click deployment to any cloud platform</li>
              <li>Continuous learning and improvement of our AI models</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}