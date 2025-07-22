import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features - AI Guided SaaS',
  description: 'Explore the powerful features of AI Guided SaaS platform for building production-ready applications.'
};

export default function FeaturesPage() {
  const features = [
    {
      title: 'AI-Powered Code Generation',
      description: 'Generate production-ready code from natural language descriptions.',
      icon: '🤖'
    },
    {
      title: 'Visual Development',
      description: 'Build applications with our intuitive drag-and-drop interface.',
      icon: '🎨'
    },
    {
      title: 'One-Click Deployment',
      description: 'Deploy your applications to any cloud provider instantly.',
      icon: '🚀'
    },
    {
      title: 'Enterprise Security',
      description: 'Built-in security features for production applications.',
      icon: '🔒'
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time.',
      icon: '👥'
    },
    {
      title: 'Smart Analytics',
      description: 'Get insights into your application performance.',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h1>
          <p className="text-xl text-gray-600">
            Everything you need to build amazing applications with AI.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}