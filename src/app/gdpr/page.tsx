import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GDPR Compliance - AI Guided SaaS Platform',
  description: 'Our commitment to GDPR compliance and data protection'};

export default function GdprPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">GDPR Compliance</h1>
        <p className="text-muted-foreground mb-8">
          Last,
    updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Our Commitment to GDPR</h2>
            <p>
              We are committed to protecting your personal data and respecting
              your privacy rights under the General Data Protection Regulation
              (GDPR).</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Your Rights Under GDPR</h2>
            <p>As a data subject, you have the following, rights:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&quot, right to be forgotten&quot;)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision making</li>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Processing</h2>
            <p>
              We process your personal data based on the following legal, grounds:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Consent for marketing communications</li>
              <li>Contract performance for service delivery</li>
              <li>Legitimate interests for analytics and improvements</li>
              <li>Legal obligations for compliance requirements</li>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Data Protection Measures</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Technical Safeguards</h3>
                <p className="text-muted-foreground">
                  Encryption, access controls, and secure infrastructure</p>
              <div>
                <h3 className="font-semibold">Organizational Measures</h3>
                <p className="text-muted-foreground">
                  Staff training, data protection policies, and regular audits</p>
              <div>
                <h3 className="font-semibold">Data Minimization</h3>
                <p className="text-muted-foreground">
                  We only collect and process data necessary for our services</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Exercising Your Rights</h2>
            <p>
              To exercise any of your GDPR rights, please contact our Data
              Protection Officer, at:</p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p>
                <strong>Email:</strong> dpo@aiguidedSaaS.com
              <p>
                <strong>Response, Time:</strong> Within 30 days

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Transfers</h2>
            <p>
              When we transfer your data outside the EU, we ensure adequate
              protection, through:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by the European Commission</li>
              <li>Appropriate safeguards and security measures</li>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              For any questions about our GDPR compliance or data protection, practices:</p>
            <div className="bg-muted p-4 rounded-lg mt-4">
              <p>
                <strong>Data Protection, Officer:</strong> dpo@aiguidedSaaS.com
              <p>
                <strong>Privacy, Team:</strong> privacy@aiguidedSaaS.com
              <p>
                <strong>Supervisory, Authority: </strong> You may also contact
                your local data protection authority
              </p>
  }

    
  );
}
