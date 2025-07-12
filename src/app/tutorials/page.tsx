import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, PlayCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tutorials - AI Guided SaaS Platform',
  description: 'Step-by-step tutorials to master AI Guided SaaS Platform',
};

const tutorials = [
  {
    id: 1,
    title: 'Getting Started with AI Code Generation',
    description:
      'Learn the basics of using AI to generate high-quality code for your projects.',
    level: 'Beginner',
    duration: '15 min',
    rating: 4.8,
    students: 1250,
    category: 'Getting Started',
  },
  {
    id: 2,
    title: 'Building Your First SaaS Application',
    description:
      'Complete walkthrough of creating a full-stack SaaS app from scratch.',
    level: 'Intermediate',
    duration: '45 min',
    rating: 4.9,
    students: 890,
    category: 'Full Stack',
  },
  {
    id: 3,
    title: 'Advanced AI Prompt Engineering',
    description:
      'Master the art of crafting effective prompts for better AI-generated code.',
    level: 'Advanced',
    duration: '30 min',
    rating: 4.7,
    students: 650,
    category: 'AI & ML',
  },
  {
    id: 4,
    title: 'API Integration Best Practices',
    description:
      'Learn how to integrate external APIs efficiently in your applications.',
    level: 'Intermediate',
    duration: '25 min',
    rating: 4.6,
    students: 720,
    category: 'Backend',
  },
  {
    id: 5,
    title: 'Deploying to Production',
    description:
      'Complete guide to deploying your applications to production environments.',
    level: 'Intermediate',
    duration: '35 min',
    rating: 4.8,
    students: 980,
    category: 'DevOps',
  },
  {
    id: 6,
    title: 'UI/UX Design with AI Assistance',
    description:
      'Create beautiful user interfaces with AI-powered design suggestions.',
    level: 'Beginner',
    duration: '20 min',
    rating: 4.5,
    students: 540,
    category: 'Design',
  },
];

const categories = [
  'All',
  'Getting Started',
  'Full Stack',
  'AI & ML',
  'Backend',
  'DevOps',
  'Design',
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Tutorials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master AI Guided SaaS Platform with our comprehensive step-by-step
            tutorials
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(category => (
            <Badge
              key={category}
              variant={category === 'All' ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map(tutorial => (
            <Card
              key={tutorial.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{tutorial.category}</Badge>
                  <Badge className={getLevelColor(tutorial.level)}>
                    {tutorial.level}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{tutorial.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {tutorial.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{tutorial.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{tutorial.rating}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/tutorials/${tutorial.id}`}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Tutorial
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path */}
        <div className="mt-16 text-center bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Structured Learning Path
          </h2>
          <p className="text-muted-foreground mb-6">
            Follow our recommended learning path to become an expert in
            AI-powered development
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/tutorials/learning-path">View Learning Path</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs">Browse Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
