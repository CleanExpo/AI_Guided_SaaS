// app/admin/causal/page.tsx
import CausalExplorerUI from '../../../packages/causal-engine/explorer-ui';
import SelfCheckTrigger from '../../../components/admin/SelfCheckTrigger';

export default function CausalAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System health monitoring and causal intelligence analytics</p>
        </div>
        
        {/* Self-Check System */}
        <SelfCheckTrigger />
        
        {/* Causal Analytics */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Causal Intelligence Analytics</h2>
            <p className="text-gray-600 mt-1">User behavior patterns and component performance insights</p>
          </div>
          <CausalExplorerUI />
        </div>
    </div>
  );
}
</div>