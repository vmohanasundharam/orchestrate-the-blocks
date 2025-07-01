
import React from 'react';
import { Code, GitBranch, RotateCcw, Database, Zap } from 'lucide-react';

const blocks = [
  { type: 'javascript', label: 'JavaScript', icon: Code, color: 'indigo' },
  { type: 'if', label: 'If Condition', icon: GitBranch, color: 'blue' },
  { type: 'loop', label: 'Loop', icon: RotateCcw, color: 'orange' },
  { type: 'database', label: 'Database', icon: Database, color: 'green' },
  { type: 'redis', label: 'Redis', icon: Zap, color: 'red' },
];

export const BlockSidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Blocks</h3>
      <div className="space-y-2">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.type}
              className={`p-3 rounded-lg border border-${block.color}-200 bg-${block.color}-50 cursor-grab active:cursor-grabbing hover:bg-${block.color}-100 transition-colors`}
              draggable
              onDragStart={(event) => onDragStart(event, block.type)}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${block.color}-600`} />
                <span className="text-sm font-medium">{block.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
