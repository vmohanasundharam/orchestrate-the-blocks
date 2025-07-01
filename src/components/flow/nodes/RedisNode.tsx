
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

export const RedisNode = memo(({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500 min-w-[120px]">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-red-500 text-white">
          <Zap className="w-3 h-3" />
        </div>
        <div className="text-sm font-medium">Redis</div>
      </div>
      {data.config?.operation && (
        <div className="text-xs text-gray-600 mt-1 uppercase">
          {data.config.operation}
        </div>
      )}
      {data.config?.resultMapping && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          → {data.config.resultMapping}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
