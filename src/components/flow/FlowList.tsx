
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Calendar, Database, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlowConfigModal } from './FlowConfigModal';
import { Flow } from '@/pages/Index';
import { useFlow } from '@/contexts/FlowContext';

interface FlowListProps {
  onCreateFlow: (flow: Flow) => void;
  onEditFlow: (flow: Flow) => void;
}

const defaultFlows: Flow[] = [
  {
    id: '1',
    name: 'CNC Data Processing',
    description: 'Process CNC machine data every 5 minutes',
    triggerType: 'datasource',
    triggerConfig: { source: 'CNC', polling: '*/5 * * * *' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Daily Report Generation',
    description: 'Generate daily reports at 6 AM',
    triggerType: 'schedule',
    triggerConfig: { cron: '0 6 * * *' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const FlowList: React.FC<FlowListProps> = ({ onCreateFlow, onEditFlow }) => {
  const { flows, saveFlow } = useFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);

  const handleCreateNew = () => {
    setEditingFlow(null);
    setIsModalOpen(true);
  };

  const handleEdit = (flow: Flow) => {
    setEditingFlow(flow);
    setIsModalOpen(true);
  };

  const handleSaveFlow = (flowData: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingFlow) {
      const updatedFlow = {
        ...editingFlow,
        ...flowData,
        updatedAt: new Date(),
      };
      saveFlow(updatedFlow);
      onEditFlow(updatedFlow);
    } else {
      const newFlow: Flow = {
        ...flowData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveFlow(newFlow);
      onCreateFlow(newFlow);
    }
    setIsModalOpen(false);
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'datasource': return <Database className="w-4 h-4" />;
      case 'schedule': return <Calendar className="w-4 h-4" />;
      case 'webhook': return <Webhook className="w-4 h-4" />;
      default: return null;
    }
  };

  // Use flows from context, fallback to default flows if empty
  const displayFlows = flows.length > 0 ? flows : defaultFlows;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flow Builder</h1>
          <p className="text-gray-600 mt-2">Create and manage your automation flows</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Flow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayFlows.map((flow) => (
          <Card key={flow.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTriggerIcon(flow.triggerType)}
                  <CardTitle className="text-lg">{flow.name}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(flow);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">{flow.description}</p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {flow.triggerType}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditFlow(flow)}
                >
                  Open Builder
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FlowConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFlow}
        flow={editingFlow}
      />
    </div>
  );
};
