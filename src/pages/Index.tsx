
import React, { useState } from 'react';
import { FlowList } from '@/components/flow/FlowList';
import { FlowBuilder } from '@/components/flow/FlowBuilder';
import { Node, Edge } from '@xyflow/react';

export interface Flow {
  id: string;
  name: string;
  description: string;
  triggerType: 'datasource' | 'schedule' | 'webhook';
  triggerConfig: any;
  nodes?: Node[];
  edges?: Edge[];
  createdAt: Date;
  updatedAt: Date;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'list' | 'builder'>('list');
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  const handleCreateFlow = (flow: Flow) => {
    setSelectedFlow(flow);
    setCurrentView('builder');
  };

  const handleEditFlow = (flow: Flow) => {
    setSelectedFlow(flow);
    setCurrentView('builder');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedFlow(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'list' ? (
        <FlowList 
          onCreateFlow={handleCreateFlow}
          onEditFlow={handleEditFlow}
        />
      ) : (
        <FlowBuilder 
          flow={selectedFlow}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default Index;
