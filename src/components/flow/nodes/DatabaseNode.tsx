
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';

export const DatabaseNode = memo(({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 min-w-[120px]">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-green-500 text-white">
          <Database className="w-3 h-3" />
        </div>
        <div className="text-sm font-medium">Database</div>
      </div>
      {data.config?.query && (
        <div className="text-xs text-gray-600 mt-1 truncate">
          Query defined
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
