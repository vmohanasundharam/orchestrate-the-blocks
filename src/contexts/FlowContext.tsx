
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Flow } from '@/pages/Index';

interface FlowContextType {
  flows: Flow[];
  currentFlow: Flow | null;
  setCurrentFlow: (flow: Flow | null) => void;
  saveFlow: (flow: Flow) => void;
  saveDraft: (flow: Flow) => void;
  deleteDraft: (flowId: string) => void;
  getDraft: (flowId: string) => Flow | null;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [currentFlow, setCurrentFlow] = useState<Flow | null>(null);

  // Load flows from localStorage on mount
  useEffect(() => {
    const savedFlows = localStorage.getItem('flows');
    if (savedFlows) {
      try {
        const parsedFlows = JSON.parse(savedFlows).map((flow: any) => ({
          ...flow,
          createdAt: new Date(flow.createdAt),
          updatedAt: new Date(flow.updatedAt),
        }));
        setFlows(parsedFlows);
      } catch (error) {
        console.error('Error parsing saved flows:', error);
      }
    }
  }, []);

  // Save flows to localStorage whenever flows change
  useEffect(() => {
    if (flows.length > 0) {
      localStorage.setItem('flows', JSON.stringify(flows));
    }
  }, [flows]);

  const saveFlow = (flow: Flow) => {
    const updatedFlow = { ...flow, updatedAt: new Date() };
    setFlows(prev => {
      const existingIndex = prev.findIndex(f => f.id === flow.id);
      if (existingIndex >= 0) {
        const newFlows = [...prev];
        newFlows[existingIndex] = updatedFlow;
        return newFlows;
      }
      return [...prev, updatedFlow];
    });
    
    // Remove draft when saving
    deleteDraft(flow.id);
  };

  const saveDraft = (flow: Flow) => {
    const draftKey = `draft_${flow.id}`;
    const draftFlow = { ...flow, isDraft: true };
    localStorage.setItem(draftKey, JSON.stringify(draftFlow));
  };

  const deleteDraft = (flowId: string) => {
    const draftKey = `draft_${flowId}`;
    localStorage.removeItem(draftKey);
  };

  const getDraft = (flowId: string): Flow | null => {
    const draftKey = `draft_${flowId}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        return {
          ...draft,
          createdAt: new Date(draft.createdAt),
          updatedAt: new Date(draft.updatedAt),
        };
      } catch (error) {
        console.error('Error parsing draft:', error);
      }
    }
    return null;
  };

  return (
    <FlowContext.Provider value={{
      flows,
      currentFlow,
      setCurrentFlow,
      saveFlow,
      saveDraft,
      deleteDraft,
      getDraft,
    }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};
