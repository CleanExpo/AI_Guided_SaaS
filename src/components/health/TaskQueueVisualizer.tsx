import React from 'react'

interface TaskQueueVisualizerProps {
  queue?: Array<{
    id: string;
  name: string
   ; priority: string
   ;
  status: string
  }>
};

export function TaskQueueVisualizer({ queue = [] }: TaskQueueVisualizerProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-medium">Task Queue ({queue.length})</h3>
      <div className="divide-y">
        {queue.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No tasks in queue</p>
        ) : (
          queue.map((task) => (
            <div key={task.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{task.name}</p>
                <p className="text-sm text-gray-500">Priority: {task.priority}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.status}
              </span>))
        )}

    );
  };
</div></div>
}
