import { Metadata } from 'next';
import EnhancedAdminPanel from '@/components/admin/EnhancedAdminPanel';

export const metadata: Metadata = {
  title: 'Performance Admin Panel | AI Guided SaaS',
  description:
    'Advanced system performance monitoring and safe mode health checks',
};

export default function PerformanceAdminPage() {
  return <EnhancedAdminPanel />
}
