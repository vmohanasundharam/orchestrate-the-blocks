
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { RotateCcw } from 'lucide-react';

export const LoopNode = memo(({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-500 min-w-[120px]">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-orange-500 text-white">
          <RotateCcw className="w-3 h-3" />
        </div>
        <div className="text-sm font-medium">Loop</div>
      </div>
      {data.config?.condition && (
        <div className="text-xs text-gray-600 mt-1 truncate">
          {data.config.condition}
        </div>
      )}
      {data.config?.executionMode && (
        <div className="text-xs text-gray-500 mt-1">
          {data.config.executionMode === 'checkThenExecute' ? 'Check → Execute' : 'Execute → Check'}
        </div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} id="loop" className="w-3 h-3" style={{ left: '30%' }} />
      <Handle type="source" position={Position.Bottom} id="exit" className="w-3 h-3" style={{ left: '70%' }} />
    </div>
  );
});
