
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GlobalVariable {
  id: string;
  name: string;
  value: string;
  type: string;
}

interface GlobalVariablesContextType {
  variables: GlobalVariable[];
  addVariable: (variable: Omit<GlobalVariable, 'id'>) => void;
  updateVariable: (id: string, variable: Partial<GlobalVariable>) => void;
  deleteVariable: (id: string) => void;
}

const GlobalVariablesContext = createContext<GlobalVariablesContextType | undefined>(undefined);

const defaultVariables: GlobalVariable[] = [
  { id: '1', name: 'API_URL', value: 'https://api.example.com', type: 'String' },
  { id: '2', name: 'MAX_RETRIES', value: '3', type: 'Number' },
  { id: '3', name: 'TIMEOUT', value: '5000', type: 'Number' },
];

export const GlobalVariablesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [variables, setVariables] = useState<GlobalVariable[]>([]);

  // Load variables from localStorage on mount
  useEffect(() => {
    const savedVariables = localStorage.getItem('globalVariables');
    if (savedVariables) {
      try {
        setVariables(JSON.parse(savedVariables));
      } catch (error) {
        console.error('Error parsing saved variables:', error);
        setVariables(defaultVariables);
      }
    } else {
      setVariables(defaultVariables);
    }
  }, []);

  // Save variables to localStorage whenever variables change
  useEffect(() => {
    if (variables.length > 0) {
      localStorage.setItem('globalVariables', JSON.stringify(variables));
    }
  }, [variables]);

  const addVariable = (variable: Omit<GlobalVariable, 'id'>) => {
    const newVariable = { ...variable, id: Date.now().toString() };
    setVariables(prev => [...prev, newVariable]);
  };

  const updateVariable = (id: string, variable: Partial<GlobalVariable>) => {
    setVariables(prev => prev.map(v => v.id === id ? { ...v, ...variable } : v));
  };

  const deleteVariable = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  };

  return (
    <GlobalVariablesContext.Provider value={{
      variables,
      addVariable,
      updateVariable,
      deleteVariable
    }}>
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export const useGlobalVariables = () => {
  const context = useContext(GlobalVariablesContext);
  if (context === undefined) {
    throw new Error('useGlobalVariables must be used within a GlobalVariablesProvider');
  }
  return context;
};
