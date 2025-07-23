import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Pricing - AI Guided SaaS Platform',
  description: 'Choose the perfect plan for your development needs'
};;
const plans = [
  {name: 'Starter',
    price: '$0',
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      '3 projects',
      'Basic AI assistance',
      'Community support',
      '1GB storage',
      'Standard templates'
   ],
    popular: false
    cta: 'Get Started Free'}
  },
  {name: 'Professional',
    price: '$29',
    period: 'month',
    description: 'For professional developers',
    features: [
      'Unlimited projects',
      'Advanced AI features',
      'Priority support',
      '50GB storage',
      'Premium templates',
      'Custom integrations',
      'Team collaboration'
   ],
    popular: true
    cta: 'Start Free Trial'}
  },
  {name: 'Enterprise',
    price: '$99',
    period: 'month',
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      'Advanced security',
      'Dedicated support',
      'Unlimited storage',
      'Custom branding',
      'SSO integration',
      'Advanced analytics',
      'SLA guarantee'
   ],
    popular: false
    cta: 'Contact Sales'}
];
const features = [
  'AI-powered code generation',
  'Visual development tools',
  'One-click deployment',
  'Built-in security',
  'Version control integration',
  'Performance monitoring'
];
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl text-center mb-12"><
              div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing<
              h1>
                        <p className="text-xl text-gray-600">
            Choose the perfect plan for your development needs. Upgrade or downgrade at any time.
<
              p>}
                      
  return (
              * Pricing Plans *
              }/        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {plans.map((plan) => (\n    <
              div>}
                          <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular  && (
div className="absolute -top-3 left-1
              2 transform -translate-x-1
              2"><
              Card>
                                <Badge className="bg-blue-500">Most Popular<
              Badge>}
                    )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}<
              CardTitle>
                              <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}<
              span>
                                <span className="text-gray-600 ml-2">
              {plan.period}<
              span>/                <p className="text-gray-600 mt-2">{plan.description}<
              p>
                            <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (\n    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" 
              >
                                    <span className="text-gray-600">{feature}<
              span>
                                ))}
<
              ul>
                              <Button className={`w-full ${plan.popular ? '' : 'variant-outline'}`}>
                  {plan.cta}
<
              Button>
              <
              Card>
                        ))}
      <
              div>
                      {
              * All, Plans Include *
              }/        <Card className="mb-12"><CardHeader>
            <CardTitle className="text-center text-2xl">All Plans Include<
              CardTitle>
                        <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (\n    <
              div>}
                              <div key={feature} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-3" 
              >
                                <span className="text-gray-600">{feature}<
              span>
                            ))}
      <
              div>
              <
              CardContent>
                            <
              Card>
                      {
              * FAQ *
              }/        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions<
              h2>
                        <div className="grid gap-6 md:grid-cols-2 text-left" >
              <
              div>
                            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?<
              h3>
                            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time.<
              p>
                          <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?<
              h3>
                            <p className="text-gray-600">Yes, all paid plans come with a 14-day free trial.<
              p>
                          <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?<
              h3>
                            <p className="text-gray-600">We accept all major credit cards and PayPal.<
              p>
                          <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer discounts?<
              h3>
                        <p className="Yes, we offer discounts for annual plans and educational institutions.">< p>/        <
              div>
                  );;
<
              div>
                
    <
              div>
                  <
              div>
                  <
              CardHeader>
                  <
              li>
                  <
              CardContent>
                  <
              CardHeader>
                  <
              div>
                }