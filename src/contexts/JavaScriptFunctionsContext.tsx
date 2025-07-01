
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Argument {
  name: string;
  type: string;
}

export interface JavaScriptFunction {
  id: string;
  name: string;
  description?: string;
  arguments: Argument[];
  code: string;
  returnType: string;
}

interface JavaScriptFunctionsContextType {
  functions: JavaScriptFunction[];
  addFunction: (func: Omit<JavaScriptFunction, 'id'>) => void;
  updateFunction: (id: string, func: Omit<JavaScriptFunction, 'id'>) => void;
  deleteFunction: (id: string) => void;
}

const JavaScriptFunctionsContext = createContext<JavaScriptFunctionsContextType | undefined>(undefined);

const defaultFunctions: JavaScriptFunction[] = [
  {
    id: '1',
    name: 'validateEmail',
    description: 'Validates email format',
    arguments: [{ name: 'email', type: 'string' }],
    code: 'function validateEmail(email) {\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return regex.test(email);\n}',
    returnType: 'boolean',
  },
  {
    id: '2',
    name: 'formatCurrency',
    description: 'Formats number as currency',
    arguments: [
      { name: 'amount', type: 'number' },
      { name: 'currency', type: 'string' }
    ],
    code: 'function formatCurrency(amount, currency = "USD") {\n  return new Intl.NumberFormat("en-US", {\n    style: "currency",\n    currency: currency\n  }).format(amount);\n}',
    returnType: 'string',
  },
];

export const JavaScriptFunctionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [functions, setFunctions] = useState<JavaScriptFunction[]>([]);

  // Load functions from localStorage on mount
  useEffect(() => {
    const savedFunctions = localStorage.getItem('javascriptFunctions');
    if (savedFunctions) {
      try {
        setFunctions(JSON.parse(savedFunctions));
      } catch (error) {
        console.error('Error parsing saved functions:', error);
        setFunctions(defaultFunctions);
      }
    } else {
      setFunctions(defaultFunctions);
    }
  }, []);

  // Save functions to localStorage whenever functions change
  useEffect(() => {
    if (functions.length > 0) {
      localStorage.setItem('javascriptFunctions', JSON.stringify(functions));
    }
  }, [functions]);

  const addFunction = (func: Omit<JavaScriptFunction, 'id'>) => {
    const newFunction = { ...func, id: Date.now().toString() };
    setFunctions(prev => [...prev, newFunction]);
  };

  const updateFunction = (id: string, func: Omit<JavaScriptFunction, 'id'>) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...func, id } : f));
  };

  const deleteFunction = (id: string) => {
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  return (
    <JavaScriptFunctionsContext.Provider value={{
      functions,
      addFunction,
      updateFunction,
      deleteFunction
    }}>
      {children}
    </JavaScriptFunctionsContext.Provider>
  );
};

export const useJavaScriptFunctions = () => {
  const context = useContext(JavaScriptFunctionsContext);
  if (context === undefined) {
    throw new Error('useJavaScriptFunctions must be used within a JavaScriptFunctionsProvider');
  }
  return context;
};
