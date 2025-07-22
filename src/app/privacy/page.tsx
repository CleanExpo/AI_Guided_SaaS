import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - AI Guided SaaS Platform',
  description: 'Our privacy policy and data protection practices'};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last,
    updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, use our services, or contact us for
              support.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and
              improve our services, process transactions, and communicate with
              you.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@aiguidedSaaS.com.</p>
  }

    
  );
}
