import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  Code2, 
  Rocket,
  FileCode,
  GitBranch,
  Database,
  Cloud,
  Lock,
  BarChart
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features - AI Guided SaaS',
  description: 'Explore the powerful features of AI Guided SaaS platform for building production-ready applications.',
}

const features = [
  {
    title: 'Multi-Agent AI System',
    description: 'Leverage our advanced multi-agent architecture with specialized agents for frontend, backend, QA, and DevOps.',
    icon: Brain,
    highlights: [
      'Architect Agent for system design',
      'Frontend Agent for UI/UX',
      'Backend Agent for API development',
      'QA Agent for testing',
      'DevOps Agent for deployment'
    ]
  },
  {
    title: 'Natural Language Development',
    description: 'Build complete applications using simple English descriptions. No coding experience required.',
    icon: Code2,
    highlights: [
      'Describe your app in plain English',
      'AI generates production-ready code',
      'Real-time code preview',
      'Automatic best practices',
      'Built-in optimization'
    ]
  },
  {
    title: 'Instant Deployment',
    description: 'Deploy your applications with one click to production-ready infrastructure.',
    icon: Rocket,
    highlights: [
      'One-click deployment',
      'Automatic scaling',
      'SSL certificates included',
      'Global CDN',
      'Zero downtime updates'
    ]
  },
  {
    title: 'Enterprise Security',
    description: 'Built with security best practices from day one. Your data and applications are always protected.',
    icon: Shield,
    highlights: [
      'OAuth 2.0 authentication',
      'Role-based access control',
      'Data encryption at rest',
      'Secure API endpoints',
      'Regular security audits'
    ]
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time with built-in collaboration features.',
    icon: Users,
    highlights: [
      'Live code sharing',
      'Team workspaces',
      'Version control',
      'Code review tools',
      'Activity tracking'
    ]
  },
  {
    title: 'Performance Analytics',
    description: 'Monitor and optimize your applications with built-in analytics and performance tracking.',
    icon: BarChart,
    highlights: [
      'Real-time metrics',
      'Performance monitoring',
      'Error tracking',
      'User analytics',
      'Custom dashboards'
    ]
  }
]

const additionalFeatures = [
  { icon: FileCode, text: 'TypeScript & JavaScript support' },
  { icon: GitBranch, text: 'Git version control integration' },
  { icon: Database, text: 'Database management tools' },
  { icon: Cloud, text: 'Cloud infrastructure automation' },
  { icon: Lock, text: 'Secure environment variables' },
  { icon: Zap, text: 'Lightning-fast build times' }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative px-6 py-24 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Powerful Features for
            <span className="text-purple-600"> Modern Development</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale production-ready applications
            with the power of AI. No coding experience required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/signin"
              className="rounded-md bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="text-base font-semibold leading-6 text-gray-900 hover:text-purple-600"
            >
              View Pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="px-6 py-24 mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <feature.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {feature.description}
              </p>
              <ul className="mt-6 space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 bg-purple-600 rounded-full" />
                    <span className="ml-3 text-sm text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features */}
      <section className="px-6 py-24 mx-auto max-w-7xl bg-gray-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            And So Much More
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Dozens of additional features to supercharge your development
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm"
            >
              <feature.icon className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <span className="ml-3 text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 mx-auto max-w-7xl">
        <div className="relative overflow-hidden bg-purple-600 rounded-3xl">
          <div className="px-6 py-24 sm:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Build Something Amazing?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-purple-100">
                Join thousands of developers and businesses building the future with AI Guided SaaS.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/auth/signin"
                  className="rounded-md bg-white px-6 py-3 text-base font-semibold text-purple-600 shadow-sm hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Start Building Free
                </Link>
                <Link
                  href="/docs"
                  className="text-base font-semibold leading-6 text-white hover:text-purple-100"
                >
                  Read Documentation <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}