
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JavaScriptFunction {
  id: string;
  name: string;
  description?: string;
  arguments: Array<{ name: string; type: string }>;
  code: string;
  returnType: string;
}

interface Variable {
  id: string;
  name: string;
  value: string;
  type: string;
}

interface Tag {
  id: string;
  key: string;
  value: string;
  type: string;
}

interface JavaScriptBlockConfigProps {
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
}

export const JavaScriptBlockConfig: React.FC<JavaScriptBlockConfigProps> = ({
  config,
  updateConfig,
}) => {
  const [showFunctionDropdown, setShowFunctionDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState<{
    show: boolean;
    inputKey: string;
    type: 'variables' | 'tags';
    position: { top: number; left: number };
  }>({ show: false, inputKey: '', type: 'variables', position: { top: 0, left: 0 } });

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Mock data - in real app, these would come from context or props
  const availableFunctions: JavaScriptFunction[] = [
    {
      id: '1',
      name: 'validateEmail',
      description: 'Validates email format',
      arguments: [{ name: 'email', type: 'string' }],
      code: 'function validateEmail(email) { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email); }',
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
      code: 'function formatCurrency(amount, currency = "USD") { return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount); }',
      returnType: 'string',
    },
  ];

  const globalVariables: Variable[] = [
    { id: '1', name: 'API_URL', value: 'https://api.example.com', type: 'String' },
    { id: '2', name: 'MAX_RETRIES', value: '3', type: 'Number' },
    { id: '3', name: 'TIMEOUT', value: '5000', type: 'Number' },
  ];

  const tags: Tag[] = [
    { id: '1', key: 'environment', value: 'production', type: 'String' },
    { id: '2', key: 'version', value: '1.2.3', type: 'String' },
    { id: '3', key: 'debug_mode', value: 'false', type: 'Boolean' },
  ];

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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, inputKey: string, allowTags: boolean = true) => {
    if (e.key === '#') {
      e.preventDefault();
      const input = e.currentTarget;
      const rect = input.getBoundingClientRect();
      setShowSuggestions({
        show: true,
        inputKey,
        type: allowTags ? 'tags' : 'variables',
        position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX }
      });
    }
  };

  const handleSuggestionSelect = (suggestion: Variable | Tag) => {
    const currentValue = inputRefs.current[showSuggestions.inputKey]?.value || '';
    const suggestionName = 'name' in suggestion ? suggestion.name : suggestion.key;
    const newValue = currentValue + `#${suggestionName}`;
    
    if (showSuggestions.inputKey === 'returnVariable') {
      updateConfig('returnVariable', newValue);
    } else {
      handleArgumentChange(showSuggestions.inputKey, newValue);
    }
    
    setShowSuggestions({ show: false, inputKey: '', type: 'variables', position: { top: 0, left: 0 } });
  };

  const toggleSuggestionType = () => {
    setShowSuggestions(prev => ({
      ...prev,
      type: prev.type === 'variables' ? 'tags' : 'variables'
    }));
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions({ show: false, inputKey: '', type: 'variables', position: { top: 0, left: 0 } });
      setShowFunctionDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
                  ref={(el) => (inputRefs.current[arg.name] = el)}
                  value={config.arguments?.[arg.name] || ''}
                  onChange={(e) => handleArgumentChange(arg.name, e.target.value)}
                  onKeyDown={(e) => handleInputKeyDown(e, arg.name)}
                  placeholder={`Enter ${arg.name} or press # for variables/tags`}
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
            ref={(el) => (inputRefs.current['returnVariable'] = el)}
            value={config.returnVariable || ''}
            onChange={(e) => updateConfig('returnVariable', e.target.value)}
            onKeyDown={(e) => handleInputKeyDown(e, 'returnVariable', false)}
            placeholder="Enter variable name or press # for global variables"
          />
        </div>
      )}

      {showSuggestions.show && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 w-64"
          style={{
            top: showSuggestions.position.top,
            left: showSuggestions.position.left,
          }}
        >
          <div className="p-2 border-b flex gap-2">
            <Button
              size="sm"
              variant={showSuggestions.type === 'variables' ? 'default' : 'outline'}
              onClick={toggleSuggestionType}
            >
              Variables
            </Button>
            <Button
              size="sm"
              variant={showSuggestions.type === 'tags' ? 'default' : 'outline'}
              onClick={toggleSuggestionType}
            >
              Tags
            </Button>
          </div>
          <ScrollArea className="max-h-32">
            {showSuggestions.type === 'variables' ? (
              globalVariables.map((variable) => (
                <div
                  key={variable.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionSelect(variable)}
                >
                  <div className="font-medium">{variable.name}</div>
                  <div className="text-xs text-gray-500">{variable.type}: {variable.value}</div>
                </div>
              ))
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionSelect(tag)}
                >
                  <div className="font-medium">{tag.key}</div>
                  <div className="text-xs text-gray-500">{tag.type}: {tag.value}</div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
