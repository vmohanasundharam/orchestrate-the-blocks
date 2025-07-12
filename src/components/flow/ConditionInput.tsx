import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGlobalVariables } from '@/contexts/GlobalVariablesContext';

interface Tag {
  id: string;
  key: string;
  value: string;
  type: string;
}

interface ConditionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ConditionInput: React.FC<ConditionInputProps> = ({
  value,
  onChange,
  placeholder = "Enter condition..."
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ name: string; type: 'tag' | 'variable' }>>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [triggerChar, setTriggerChar] = useState<'#' | '$' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { variables } = useGlobalVariables();

  // Mock tags data - in real app, this would come from a context
  const tags: Tag[] = [
    { id: '1', key: 'environment', value: 'production', type: 'String' },
    { id: '2', key: 'version', value: '1.2.3', type: 'String' },
    { id: '3', key: 'region', value: 'us-east-1', type: 'String' },
    { id: '4', key: 'debug', value: 'false', type: 'Boolean' },
  ];

  useEffect(() => {
    const handleInputChange = () => {
      if (!inputRef.current) return;
      
      const input = inputRef.current;
      const position = input.selectionStart || 0;
      setCursorPosition(position);
      
      const beforeCursor = value.slice(0, position);
      const lastChar = beforeCursor[beforeCursor.length - 1];
      
      if (lastChar === '#') {
        setTriggerChar('#');
        setSuggestions(tags.map(tag => ({ name: tag.key, type: 'tag' as const })));
        setShowSuggestions(true);
      } else if (lastChar === '$') {
        setTriggerChar('$');
        setSuggestions(variables.map(variable => ({ name: variable.name, type: 'variable' as const })));
        setShowSuggestions(true);
      } else {
        // Check if we're still in a suggestion context
        const hashIndex = beforeCursor.lastIndexOf('#');
        const dollarIndex = beforeCursor.lastIndexOf('$');
        const spaceAfterHash = beforeCursor.indexOf(' ', hashIndex);
        const spaceAfterDollar = beforeCursor.indexOf(' ', dollarIndex);
        
        if (hashIndex !== -1 && (spaceAfterHash === -1 || spaceAfterHash > position)) {
          const searchTerm = beforeCursor.slice(hashIndex + 1);
          const filteredTags = tags
            .filter(tag => tag.key.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(tag => ({ name: tag.key, type: 'tag' as const }));
          setTriggerChar('#');
          setSuggestions(filteredTags);
          setShowSuggestions(filteredTags.length > 0);
        } else if (dollarIndex !== -1 && (spaceAfterDollar === -1 || spaceAfterDollar > position)) {
          const searchTerm = beforeCursor.slice(dollarIndex + 1);
          const filteredVariables = variables
            .filter(variable => variable.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(variable => ({ name: variable.name, type: 'variable' as const }));
          setTriggerChar('$');
          setSuggestions(filteredVariables);
          setShowSuggestions(filteredVariables.length > 0);
        } else {
          setShowSuggestions(false);
          setTriggerChar(null);
        }
      }
    };

    handleInputChange();
  }, [value, variables, tags]);

  const handleSuggestionClick = (suggestion: { name: string; type: 'tag' | 'variable' }) => {
    if (!inputRef.current || !triggerChar) return;

    const input = inputRef.current;
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);
    
    // Find the trigger character position
    const triggerIndex = triggerChar === '#' 
      ? beforeCursor.lastIndexOf('#')
      : beforeCursor.lastIndexOf('$');
    
    if (triggerIndex === -1) return;
    
    const beforeTrigger = value.slice(0, triggerIndex);
    const newValue = beforeTrigger + triggerChar + suggestion.name + afterCursor;
    
    onChange(newValue);
    setShowSuggestions(false);
    setTriggerChar(null);
    
    // Set cursor position after the inserted suggestion
    setTimeout(() => {
      const newPosition = triggerIndex + 1 + suggestion.name.length;
      input.setSelectionRange(newPosition, newPosition);
      input.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setTriggerChar(null);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2">
              {triggerChar === '#' ? 'Tags' : 'Global Variables'}
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant={suggestion.type === 'tag' ? 'secondary' : 'outline'}
                  className="cursor-pointer hover:bg-gray-100 text-xs"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {triggerChar}{suggestion.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};