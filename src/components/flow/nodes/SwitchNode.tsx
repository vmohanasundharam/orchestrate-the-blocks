
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ToggleLeft } from 'lucide-react';

export const SwitchNode = memo(({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 min-w-[120px]">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-purple-500 text-white">
          <ToggleLeft className="w-3 h-3" />
        </div>
        <div className="text-sm font-medium">Switch</div>
      </div>
      {data.config?.variable && (
        <div className="text-xs text-gray-600 mt-1 truncate">
          {data.config.variable}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} id="case1" className="w-3 h-3" style={{ left: '20%' }} />
      <Handle type="source" position={Position.Bottom} id="case2" className="w-3 h-3" style={{ left: '40%' }} />
      <Handle type="source" position={Position.Bottom} id="case3" className="w-3 h-3" style={{ left: '60%' }} />
      <Handle type="source" position={Position.Bottom} id="default" className="w-3 h-3" style={{ left: '80%' }} />
    </div>
  );
});
