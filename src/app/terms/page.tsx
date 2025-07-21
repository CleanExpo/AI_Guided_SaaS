import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AI Guided SaaS Platform',
  description: 'Terms and conditions for using our platform'};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Last, updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using AI Guided SaaS Platform, you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily use AI Guided SaaS Platform
              for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
              The materials on AI Guided SaaS Platform are provided on an
              &apos;as is&apos; basis. AI Guided SaaS Platform makes no
              warranties, expressed or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p>
              In no event shall AI Guided SaaS Platform or its suppliers be
              liable for any damages arising out of the use or inability to use
              the materials on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at legal@aiguidedSaaS.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
