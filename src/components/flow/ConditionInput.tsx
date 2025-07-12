import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useGlobalVariables } from '@/contexts/GlobalVariablesContext';

interface Tag {
  id: string;
  key: string;
  value: string;
  type: string;
}

interface ConditionChip {
  id: string;
  text: string;
  type: 'tag' | 'variable';
  originalName: string;
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
  const [chips, setChips] = useState<ConditionChip[]>([]);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { variables } = useGlobalVariables();

  // Mock tags data - in real app, this would come from a context
  const tags: Tag[] = [
    { id: '1', key: 'environment', value: 'production', type: 'String' },
    { id: '2', key: 'version', value: '1.2.3', type: 'String' },
    { id: '3', key: 'region', value: 'us-east-1', type: 'String' },
    { id: '4', key: 'debug', value: 'false', type: 'Boolean' },
    { id: '5', key: 'timestamp', value: '1234567888', type: 'Number' },
    { id: '6', key: 'user_id', value: 'user123', type: 'String' },
    { id: '7', key: 'feature_flag', value: 'true', type: 'Boolean' },
  ];

  // Parse the value to extract chips and remaining text
  useEffect(() => {
    const parseValue = () => {
      const newChips: ConditionChip[] = [];
      let remainingText = value;
      
      // Find all #tag and $variable patterns
      const tagPattern = /#([a-zA-Z_][a-zA-Z0-9_]*)/g;
      const variablePattern = /\$([a-zA-Z_][a-zA-Z0-9_]*)/g;
      
      let match;
      const replacements: Array<{ start: number; end: number; chipId: string }> = [];
      
      // Find tags
      while ((match = tagPattern.exec(value)) !== null) {
        const tagName = match[1];
        const tag = tags.find(t => t.key === tagName);
        if (tag) {
          const chipId = `tag_${Date.now()}_${Math.random()}`;
          newChips.push({
            id: chipId,
            text: `#${tagName}`,
            type: 'tag',
            originalName: tagName
          });
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            chipId
          });
        }
      }
      
      // Find variables
      while ((match = variablePattern.exec(value)) !== null) {
        const variableName = match[1];
        const variable = variables.find(v => v.name === variableName);
        if (variable) {
          const chipId = `var_${Date.now()}_${Math.random()}`;
          newChips.push({
            id: chipId,
            text: `$${variableName}`,
            type: 'variable',
            originalName: variableName
          });
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            chipId
          });
        }
      }
      
      // Sort replacements by position and remove them from text
      replacements.sort((a, b) => b.start - a.start);
      for (const replacement of replacements) {
        remainingText = remainingText.slice(0, replacement.start) + 
                      `__CHIP_${replacement.chipId}__` + 
                      remainingText.slice(replacement.end);
      }
      
      setChips(newChips);
      setInputText(remainingText);
    };
    
    parseValue();
  }, [value, variables, tags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputText = e.target.value;
    setInputText(newInputText);
    
    // Reconstruct the full value with chips
    let fullValue = newInputText;
    chips.forEach(chip => {
      fullValue = fullValue.replace(`__CHIP_${chip.id}__`, chip.text);
    });
    
    onChange(fullValue);
    
    // Handle suggestions
    const input = e.target;
    const position = input.selectionStart || 0;
    setCursorPosition(position);
    
    const beforeCursor = newInputText.slice(0, position);
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
      // Check if we're still typing after # or $
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

  const handleSuggestionClick = (suggestion: { name: string; type: 'tag' | 'variable' }) => {
    if (!inputRef.current || !triggerChar) return;

    const input = inputRef.current;
    const beforeCursor = inputText.slice(0, cursorPosition);
    const afterCursor = inputText.slice(cursorPosition);
    
    // Find the trigger character position
    const triggerIndex = triggerChar === '#' 
      ? beforeCursor.lastIndexOf('#')
      : beforeCursor.lastIndexOf('$');
    
    if (triggerIndex === -1) return;
    
    const beforeTrigger = inputText.slice(0, triggerIndex);
    const newInputText = beforeTrigger + triggerChar + suggestion.name + afterCursor;
    
    setInputText(newInputText);
    
    // Create chip
    const chipId = `${suggestion.type}_${Date.now()}_${Math.random()}`;
    const newChip: ConditionChip = {
      id: chipId,
      text: triggerChar + suggestion.name,
      type: suggestion.type,
      originalName: suggestion.name
    };
    
    const newChips = [...chips, newChip];
    setChips(newChips);
    
    // Update full value
    let fullValue = newInputText;
    newChips.forEach(chip => {
      fullValue = fullValue.replace(`__CHIP_${chip.id}__`, chip.text);
    });
    
    onChange(fullValue);
    setShowSuggestions(false);
    setTriggerChar(null);
    
    // Set cursor position after the inserted suggestion
    setTimeout(() => {
      const newPosition = triggerIndex + 1 + suggestion.name.length;
      input.setSelectionRange(newPosition, newPosition);
      input.focus();
    }, 0);
  };

  const removeChip = (chipId: string) => {
    const chipToRemove = chips.find(c => c.id === chipId);
    if (!chipToRemove) return;
    
    const newChips = chips.filter(c => c.id !== chipId);
    setChips(newChips);
    
    // Remove chip from input text and reconstruct value
    const newInputText = inputText.replace(`__CHIP_${chipId}__`, '');
    setInputText(newInputText);
    
    let fullValue = newInputText;
    newChips.forEach(chip => {
      fullValue = fullValue.replace(`__CHIP_${chip.id}__`, chip.text);
    });
    
    onChange(fullValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setTriggerChar(null);
    }
  };

  // Render the input with chips
  const renderInputWithChips = () => {
    const parts = inputText.split(/(__CHIP_[^_]+_[^_]+_[^_]+__)/);
    
    return (
      <div className="min-h-[40px] w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background flex flex-wrap items-center gap-1 rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {parts.map((part, index) => {
          if (part.startsWith('__CHIP_') && part.endsWith('__')) {
            const chipId = part.slice(7, -2);
            const chip = chips.find(c => c.id === chipId);
            if (chip) {
              return (
                <Badge
                  key={index}
                  variant={chip.type === 'tag' ? 'secondary' : 'outline'}
                  className="flex items-center gap-1 text-xs"
                >
                  {chip.text}
                  <X
                    className="w-3 h-3 cursor-pointer hover:bg-gray-200 rounded"
                    onClick={() => removeChip(chip.id)}
                  />
                </Badge>
              );
            }
          }
          
          // For text parts, create an invisible input for each segment
          if (part && !part.startsWith('__CHIP_')) {
            return (
              <span key={index} className="flex-1 min-w-0">
                {part}
              </span>
            );
          }
          
          return null;
        })}
        
        <input
          ref={inputRef}
          type="text"
          value=""
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={chips.length === 0 && !inputText ? placeholder : ""}
          className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-sm"
          style={{ 
            position: 'absolute',
            left: '-9999px',
            opacity: 0,
            width: '1px',
            height: '1px'
          }}
        />
        
        {/* Visible input overlay */}
        <input
          type="text"
          value={inputText.replace(/__CHIP_[^_]+_[^_]+_[^_]+__/g, '')}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm"
        />
      </div>
    );
  };

  return (
    <div className="relative">
      {renderInputWithChips()}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2">
              {triggerChar === '#' ? 'Tags' : 'Global Variables'}
            </div>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
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