
import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Save, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlockSidebar } from './BlockSidebar';
import { BlockConfigModal } from './BlockConfigModal';
import { FlowControlCenter } from './FlowControlCenter';
import { JavaScriptNode } from './nodes/JavaScriptNode';
import { IfNode } from './nodes/IfNode';
import { LoopNode } from './nodes/LoopNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { RedisNode } from './nodes/RedisNode';
import { Flow } from '@/pages/Index';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  javascript: JavaScriptNode,
  if: IfNode,
  loop: LoopNode,
  database: DatabaseNode,
  redis: RedisNode,
};

interface FlowBuilderProps {
  flow: Flow | null;
  onBack: () => void;
}

export const FlowBuilder: React.FC<FlowBuilderProps> = ({ flow, onBack }) => {
  const { saveFlow, saveDraft, getDraft } = useFlow();
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Load draft or existing flow data
  useEffect(() => {
    if (flow) {
      // Check for draft first
      const draft = getDraft(flow.id);
      if (draft && draft.nodes) {
        setNodes(draft.nodes || []);
        setEdges(draft.edges || []);
        toast({
          title: "Draft loaded",
          description: "Loaded unsaved changes from draft",
        });
      } else if (flow.nodes) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    }
  }, [flow, getDraft, setNodes, setEdges, toast]);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsConfigModalOpen(true);
  }, []);

  const handleSaveConfiguration = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    );
    setIsConfigModalOpen(false);
  };

  const handleSaveFlow = () => {
    if (flow) {
      const updatedFlow = {
        ...flow,
        nodes,
        edges,
        updatedAt: new Date(),
      };
      saveFlow(updatedFlow);
      toast({
        title: "Flow saved",
        description: "Your flow has been saved successfully",
      });
    }
  };

  const handleSaveDraft = () => {
    if (flow) {
      const draftFlow = {
        ...flow,
        nodes,
        edges,
        updatedAt: new Date(),
      };
      saveDraft(draftFlow);
      toast({
        title: "Draft saved",
        description: "Your changes have been saved as draft",
      });
    }
  };

  const handleDownloadFlow = () => {
    if (flow) {
      const flowData = {
        ...flow,
        nodes,
        edges,
        exportedAt: new Date().toISOString(),
      };
      
      const dataStr = JSON.stringify(flowData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${flow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flow.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Flow exported",
        description: "Your flow has been downloaded as JSON file",
      });
    }
  };

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

      // Generate unique ID with timestamp and random number
      const uniqueId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newNode: Node = {
        id: uniqueId,
        type,
        position,
        data: { 
          label: `${type} node`,
          config: {} // Initialize with empty config specific to this node instance
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="h-screen flex bg-gray-50">
      <BlockSidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flows
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{flow?.name || 'Untitled Flow'}</h1>
              <p className="text-sm text-gray-600">{flow?.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadFlow}>
              <Download className="w-4 h-4 mr-2" />
              Download Flow
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <FileText className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSaveFlow}>
              <Save className="w-4 h-4 mr-2" />
              Save Flow
            </Button>
          </div>
        </div>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={handleNodeDoubleClick}
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

          <FlowControlCenter />
        </div>
      </div>

      {selectedNode && (
        <BlockConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          node={selectedNode}
          onSave={handleSaveConfiguration}
        />
      )}
    </div>
  );
};
