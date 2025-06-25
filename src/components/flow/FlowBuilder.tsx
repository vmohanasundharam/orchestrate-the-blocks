import React, { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Flow } from '@/pages/Index';
import { BlockSidebar } from './BlockSidebar';
import { BlockConfigModal } from './BlockConfigModal';
import { RightSidebar } from './RightSidebar';
import { IfNode } from './nodes/IfNode';
import { SwitchNode } from './nodes/SwitchNode';
import { LoopNode } from './nodes/LoopNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { RedisNode } from './nodes/RedisNode';
import { JavaScriptNode } from './nodes/JavaScriptNode';

const nodeTypes = {
  if: IfNode,
  switch: SwitchNode,
  loop: LoopNode,
  database: DatabaseNode,
  redis: RedisNode,
  javascript: JavaScriptNode,
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 250, y: 25 },
    data: { label: 'Start' },
    style: { background: '#10B981', color: 'white', border: 'none' },
  },
];

const initialEdges: Edge[] = [];

interface FlowBuilderProps {
  flow: Flow | null;
  onBack: () => void;
}

export const FlowBuilder: React.FC<FlowBuilderProps> = ({ flow, onBack }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type !== 'input' && node.type !== 'output') {
      setSelectedNode(node);
      setIsConfigModalOpen(true);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Block` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleConfigSave = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    );
    setIsConfigModalOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="flex h-screen">
      <BlockSidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flows
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{flow?.name || 'Untitled Flow'}</h1>
              <p className="text-gray-600 text-sm">{flow?.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Save Draft
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Deploy Flow
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
          <RightSidebar />
        </div>
      </div>

      {selectedNode && (
        <BlockConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => {
            setIsConfigModalOpen(false);
            setSelectedNode(null);
          }}
          node={selectedNode}
          onSave={handleConfigSave}
        />
      )}
    </div>
  );
};
