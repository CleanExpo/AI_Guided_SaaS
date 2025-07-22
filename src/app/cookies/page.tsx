import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - AI Guided SaaS Platform',
  description: 'Our cookie policy and how we use cookies on our platform'};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last,
    updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences and improving our
              services.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p>We use cookies for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Essential functionality and security</li>
              <li>Remembering your preferences and settings</li>
              <li>Analytics and performance monitoring</li>
              <li>Improving user experience</li>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Essential Cookies</h3>
                <p className="text-muted-foreground">
                  Required for basic website functionality and security.</p>
              <div>
                <h3 className="font-semibold">Analytics Cookies</h3>
                <p className="text-muted-foreground">
                  Help us understand how visitors interact with our website.</p>
              <div>
                <h3 className="font-semibold">Preference Cookies</h3>
                <p className="text-muted-foreground">
                  Remember your settings and preferences.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings.
              Please note that disabling certain cookies may affect the
              functionality of our website.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact
              us at privacy@aiguidedSaaS.com.</p>
  }

    
  );
}
