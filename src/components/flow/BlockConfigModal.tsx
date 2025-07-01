
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Node } from '@xyflow/react';
import { JavaScriptBlockConfig } from './JavaScriptBlockConfig';

interface BlockConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node;
  onSave: (nodeId: string, config: any) => void;
}

export const BlockConfigModal: React.FC<BlockConfigModalProps> = ({
  isOpen,
  onClose,
  node,
  onSave,
}) => {
  const [config, setConfig] = useState<Record<string, any>>(node.data?.config || {});

  const handleSave = () => {
    onSave(node.id, config);
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: Record<string, any>) => ({ ...prev, [key]: value }));
  };

  const renderConfigFields = (): React.ReactNode => {
    switch (node.type) {
      case 'javascript':
        return <JavaScriptBlockConfig config={config} updateConfig={updateConfig} />;
      case 'if':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <Input
                value={config.condition || ''}
                onChange={(e) => updateConfig('condition', e.target.value)}
                placeholder="Enter condition..."
              />
            </div>
          </div>
        );
      case 'loop':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Loop Type</label>
              <select
                value={config.type || 'for'}
                onChange={(e) => updateConfig('type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="for">For Loop</option>
                <option value="while">While Loop</option>
                <option value="foreach">For Each</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <Input
                value={config.condition || ''}
                onChange={(e) => updateConfig('condition', e.target.value)}
                placeholder="Enter loop condition..."
              />
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Query</label>
              <Textarea
                value={config.query || ''}
                onChange={(e) => updateConfig('query', e.target.value)}
                placeholder="Enter SQL query..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Database Connection</label>
              <Input
                value={config.connection || ''}
                onChange={(e) => updateConfig('connection', e.target.value)}
                placeholder="Database connection string..."
              />
            </div>
          </div>
        );
      case 'redis':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Operation</label>
              <select
                value={config.operation || 'get'}
                onChange={(e) => updateConfig('operation', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="get">GET</option>
                <option value="set">SET</option>
                <option value="del">DELETE</option>
                <option value="exists">EXISTS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Key</label>
              <Input
                value={config.key || ''}
                onChange={(e) => updateConfig('key', e.target.value)}
                placeholder="Redis key..."
              />
            </div>
            {config.operation === 'set' && (
              <div>
                <label className="block text-sm font-medium mb-2">Value</label>
                <Input
                  value={config.value || ''}
                  onChange={(e) => updateConfig('value', e.target.value)}
                  placeholder="Redis value..."
                />
              </div>
            )}
          </div>
        );
      default:
        return (
          <div>
            <p className="text-gray-500">No configuration options available for this block type.</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Configure {node.type} Block</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {renderConfigFields()}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};
