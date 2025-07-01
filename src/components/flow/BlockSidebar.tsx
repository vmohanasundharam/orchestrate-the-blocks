
import React from 'react';
import { GitBranch, RotateCcw, Database, Zap, Code } from 'lucide-react';

const blocks = [
  {
    type: 'if',
    label: 'If Condition',
    icon: GitBranch,
    description: 'Conditional logic block',
    color: 'bg-blue-500',
  },
  {
    type: 'loop',
    label: 'Loop',
    icon: RotateCcw,
    description: 'Iteration block',
    color: 'bg-orange-500',
  },
  {
    type: 'database',
    label: 'Database',
    icon: Database,
    description: 'Database operations',
    color: 'bg-green-500',
  },
  {
    type: 'redis',
    label: 'Redis',
    icon: Zap,
    description: 'Redis cache operations',
    color: 'bg-red-500',
  },
  {
    type: 'javascript',
    label: 'JavaScript',
    icon: Code,
    description: 'Execute JavaScript function',
    color: 'bg-indigo-500',
  },
];

export const BlockSidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Flow Blocks</h3>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.type}
            className="p-3 border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow"
            draggable
            onDragStart={(event) => onDragStart(event, block.type)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded ${block.color} text-white`}>
                <block.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-sm">{block.label}</div>
                <div className="text-xs text-gray-500">{block.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Tip:</strong> Drag and drop blocks onto the canvas to build your flow.
        </p>
      </div>
    </div>
  );
};
