import { Metadata } from 'next';
import { DevelopmentIntelligence } from '@/components/dev-intelligence/DevelopmentIntelligence';

export const metadata: Metadata = {
  title: 'Development Intelligence - AI Guided SaaS',
  description: 'Autonomous development lifecycle intelligence and project analysis',
};

export default function DevIntelligencePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <DevelopmentIntelligence />
    </div>
  );
}