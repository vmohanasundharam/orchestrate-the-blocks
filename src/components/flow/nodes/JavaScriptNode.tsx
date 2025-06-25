
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Code } from 'lucide-react';

interface JavaScriptNodeProps {
  data: {
    label: string;
    config?: {
      functionName?: string;
      arguments?: Record<string, string>;
      returnVariable?: string;
    };
  };
}

export const JavaScriptNode: React.FC<JavaScriptNodeProps> = ({ data }) => {
  const { config } = data;
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-300">
      <div className="flex items-center">
        <div className="rounded-full w-6 h-6 flex items-center justify-center bg-indigo-500 text-white mr-2">
          <Code className="w-3 h-3" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-gray-900">
            {config?.functionName || 'JavaScript Function'}
          </div>
          {config?.returnVariable && (
            <div className="text-xs text-gray-500">
              → {config.returnVariable}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-indigo-500"
      />
    </div>
  );
};
