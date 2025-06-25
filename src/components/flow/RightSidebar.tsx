
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Code, Tag } from 'lucide-react';
import { GlobalVariablesModal } from './GlobalVariablesModal';
import { JavaScriptFunctionsModal } from './JavaScriptFunctionsModal';
import { TagsModal } from './TagsModal';

export const RightSidebar: React.FC = () => {
  const [isVariablesModalOpen, setIsVariablesModalOpen] = useState(false);
  const [isFunctionsModalOpen, setIsFunctionsModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  return (
    <>
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setIsVariablesModalOpen(true)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Global Variables</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setIsFunctionsModalOpen(true)}
                >
                  <Code className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>JavaScript Functions</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setIsTagsModalOpen(true)}
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tags</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
