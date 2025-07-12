
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useJavaScriptFunctions } from '@/contexts/JavaScriptFunctionsContext';
import { useGlobalVariables } from '@/contexts/GlobalVariablesContext';

interface JavaScriptBlockConfigProps {
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
  onSave?: () => void;
}

export const JavaScriptBlockConfig: React.FC<JavaScriptBlockConfigProps> = ({
  config,
  updateConfig,
  onSave,
}) => {
  const { functions: availableFunctions } = useJavaScriptFunctions();
  const { variables: globalVariables, addVariable } = useGlobalVariables();
  const [showFunctionDropdown, setShowFunctionDropdown] = useState(false);

  const selectedFunction = availableFunctions.find(f => f.name === config.functionName);

  const handleFunctionSelect = (functionName: string) => {
    updateConfig('functionName', functionName);
    setShowFunctionDropdown(false);
    // Reset arguments when function changes
    updateConfig('arguments', {});
    updateConfig('returnVariable', '');
  };

  const handleArgumentChange = (argumentName: string, value: string) => {
    const currentArgs = config.arguments || {};
    updateConfig('arguments', { ...currentArgs, [argumentName]: value });
  };

  const handleReturnVariableChange = (value: string) => {
    updateConfig('returnVariable', value);
  };

  const handleSaveConfiguration = () => {
    // Check if the return variable is a new global variable and add it
    const returnVar = config.returnVariable;
    if (returnVar && selectedFunction) {
      const existingVariable = globalVariables.find(v => v.name === returnVar);
      if (!existingVariable) {
        // Add as new global variable
        addVariable({
          name: returnVar,
          value: '',
          type: selectedFunction.returnType === 'string' ? 'String' : 
                selectedFunction.returnType === 'number' ? 'Number' :
                selectedFunction.returnType === 'boolean' ? 'Boolean' : 'String'
        });
      }
    }
    
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">JavaScript Function</label>
        <div className="relative">
          <Input
            value={config.functionName || ''}
            onClick={(e) => {
              e.stopPropagation();
              setShowFunctionDropdown(true);
            }}
            placeholder="Select a function..."
            readOnly
            className="cursor-pointer"
          />
          {showFunctionDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
              {availableFunctions.map((func) => (
                <div
                  key={func.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleFunctionSelect(func.name)}
                >
                  <div className="font-medium">{func.name}</div>
                  {func.description && (
                    <div className="text-sm text-gray-500">{func.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedFunction && selectedFunction.arguments.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Arguments</label>
          <div className="space-y-2">
            {selectedFunction.arguments.map((arg) => (
              <div key={arg.name}>
                <label className="block text-xs text-gray-600 mb-1">
                  {arg.name} ({arg.type})
                </label>
                <Input
                  value={config.arguments?.[arg.name] || ''}
                  onChange={(e) => handleArgumentChange(arg.name, e.target.value)}
                  placeholder={`Enter ${arg.name}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFunction && selectedFunction.returnType !== 'void' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Return Variable ({selectedFunction.returnType})
          </label>
          <Input
            value={config.returnVariable || ''}
            onChange={(e) => handleReturnVariableChange(e.target.value)}
            placeholder="Enter variable name"
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSaveConfiguration} className="bg-blue-600 hover:bg-blue-700">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
