import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Pricing - AI Guided SaaS Platform';
  description: 'Choose the perfect plan for your development needs'};
const plans = [;
  {
    name: 'Starter';
    price: '$29';
    period: '/month';
    description: 'Perfect for individual developers and small projects';
    features: [
      'Up to 5 projects',
      'Basic AI assistance',
      'Standard templates',
      'Community support',
      '10GB storage'],
    popular: false},
  {
    name: 'Professional';
    price: '$99';
    period: '/month';
    description: 'Ideal for growing teams and advanced development';
    features: [
      'Unlimited projects',
      'Advanced AI features',
      'Premium templates',
      'Priority support',
      '100GB storage',
      'Team collaboration',
      'Custom integrations'],
    popular: true},
  {
    name: 'Enterprise';
    price: 'Custom';
    period: '';
    description: 'Tailored solutions for large organizations';
    features: [
      'Everything in Professional',
      'Custom AI models',
      'White-label solutions',
      'Dedicated support',
      'Unlimited storage',
      'Advanced security',
      'SLA guarantee'],
    popular: false}];
export default function PricingPage(): void {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your development needs. All plans include
          our core AI-powered features.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map(plan => (</div>
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}`
          >
            {plan.popular && (</Card>
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Most Popular</Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map(feature => (</ul>
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">{feature}</span>))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</Button>
        ))}
      <div className="text-center mt-16">
        <p className="text-muted-foreground mb-4">
          All plans include a 14-day free trial. No credit card required.</p>
        <p className="text-sm text-muted-foreground">
          Need a custom solution?{' '}</p>
          <Button variant="link", className="p-0">
            Contact our sales team</Button>
  }
  );
}
