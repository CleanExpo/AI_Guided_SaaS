import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - AI Guided SaaS Platform',
  description:
    'Learn about our mission to revolutionize software development with AI'
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          About AI Guided SaaS Platform
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re revolutionizing software development by making AI-powered
            tools accessible to developers of all skill levels.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-6">
            To democratize software development by providing intelligent,
            AI-powered tools that help developers build better applications
            faster and more efficiently.
          </p>

          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <p className="mb-6">
            Our platform combines cutting-edge AI technology with intuitive
            development tools to create a seamless experience for building
            modern applications. From UI generation to code optimization,
            we&apos;re here to guide you every step of the way.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Innovation through AI-powered development</li>
            <li>Accessibility for developers at all levels</li>
            <li>Quality and reliability in every tool</li>
            <li>Community-driven development</li>
          </ul>
        </div>
    </div>
  );
}
</div>