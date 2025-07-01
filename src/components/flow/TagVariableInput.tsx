
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGlobalVariables } from '@/contexts/GlobalVariablesContext';
import { useJavaScriptFunctions } from '@/contexts/JavaScriptFunctionsContext';

interface TagVariableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TagVariableInput: React.FC<TagVariableInputProps> = ({
  value,
  onChange,
  placeholder,
  className
}) => {
  const { variables } = useGlobalVariables();
  const { functions } = useJavaScriptFunctions();
  const [isOpen, setIsOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTags = [
    ...variables.map(v => ({ name: v.name, type: 'variable' })),
    ...functions.map(f => ({ name: f.name, type: 'function' }))
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart || 0;
    
    onChange(newValue);
    setCursorPosition(position);
    
    // Check if user typed # to show popup
    if (newValue.charAt(position - 1) === '#') {
      setIsOpen(true);
    }
  };

  const handleTagSelect = (tagName: string) => {
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);
    const hashIndex = beforeCursor.lastIndexOf('#');
    
    if (hashIndex !== -1) {
      const beforeHash = beforeCursor.slice(0, hashIndex);
      const newValue = beforeHash + '#' + tagName + afterCursor;
      onChange(newValue);
    }
    
    setIsOpen(false);
    
    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '#') {
      setTimeout(() => setIsOpen(true), 100);
    }
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setIsOpen(true)}
            >
              #
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {allTags.length > 0 ? (
              allTags.map((tag, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => handleTagSelect(tag.name)}
                >
                  <span className="text-blue-600">#{tag.name}</span>
                  <span className="ml-2 text-xs text-gray-500">({tag.type})</span>
                </Button>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-2">No variables or functions available</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
