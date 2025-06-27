
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Code, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlobalVariablesModal } from './GlobalVariablesModal';
import { JavaScriptFunctionsModal } from './JavaScriptFunctionsModal';
import { TagsModal } from './TagsModal';

export const FlowControlCenter: React.FC = () => {
  const [isVariablesModalOpen, setIsVariablesModalOpen] = useState(false);
  const [isFunctionsModalOpen, setIsFunctionsModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className={`fixed top-1/2 right-4 transform -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-12'
      } z-10`}>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            {isExpanded && (
              <h3 className="text-sm font-medium text-gray-700">Flow Controls</h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-8 w-8"
            >
              {isExpanded ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className={`space-y-2 ${isExpanded ? '' : 'flex flex-col items-center'}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${isExpanded ? 'w-full justify-start' : 'w-8 h-8 p-0 justify-center'}`}
                    onClick={() => setIsVariablesModalOpen(true)}
                  >
                    <Settings className="w-4 h-4" />
                    {isExpanded && <span className="ml-2">Global Variables</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Global Variables</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${isExpanded ? 'w-full justify-start' : 'w-8 h-8 p-0 justify-center'}`}
                    onClick={() => setIsFunctionsModalOpen(true)}
                  >
                    <Code className="w-4 h-4" />
                    {isExpanded && <span className="ml-2">JavaScript Functions</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>JavaScript Functions</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${isExpanded ? 'w-full justify-start' : 'w-8 h-8 p-0 justify-center'}`}
                    onClick={() => setIsTagsModalOpen(true)}
                  >
                    <Tag className="w-4 h-4" />
                    {isExpanded && <span className="ml-2">Tags</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Tags</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <GlobalVariablesModal
        isOpen={isVariablesModalOpen}
        onClose={() => setIsVariablesModalOpen(false)}
      />

      <JavaScriptFunctionsModal
        isOpen={isFunctionsModalOpen}
        onClose={() => setIsFunctionsModalOpen(false)}
      />

      <TagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
      />
    </>
  );
};
