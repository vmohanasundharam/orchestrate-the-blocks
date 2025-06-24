
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    setConfig(node.data?.config || {});
  }, [node]);

  const handleSave = () => {
    onSave(node.id, config);
  };

  const renderConfigFields = () => {
    switch (node.type) {
      case 'if':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={config.condition || ''}
                onChange={(e) => setConfig({ ...config, condition: e.target.value })}
                placeholder="e.g., data.value > 100"
              />
            </div>
            <div>
              <Label htmlFor="operator">Operator</Label>
              <Select value={config.operator || ''} onValueChange={(value) => setConfig({ ...config, operator: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">=</SelectItem>
                  <SelectItem value="not_equals">!=</SelectItem>
                  <SelectItem value="greater_than">&gt;</SelectItem>
                  <SelectItem value="less_than">&lt;</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'switch':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="variable">Switch Variable</Label>
              <Input
                id="variable"
                value={config.variable || ''}
                onChange={(e) => setConfig({ ...config, variable: e.target.value })}
                placeholder="e.g., data.status"
              />
            </div>
            <div>
              <Label htmlFor="cases">Cases (JSON format)</Label>
              <Textarea
                id="cases"
                value={config.cases || ''}
                onChange={(e) => setConfig({ ...config, cases: e.target.value })}
                placeholder='{"case1": "action1", "case2": "action2"}'
                rows={4}
              />
            </div>
          </div>
        );
      
      case 'loop':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="loopType">Loop Type</Label>
              <Select value={config.loopType || ''} onValueChange={(value) => setConfig({ ...config, loopType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="for">For Loop</SelectItem>
                  <SelectItem value="while">While Loop</SelectItem>
                  <SelectItem value="foreach">For Each</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="iterations">Max Iterations</Label>
              <Input
                id="iterations"
                type="number"
                value={config.iterations || ''}
                onChange={(e) => setConfig({ ...config, iterations: e.target.value })}
                placeholder="100"
              />
            </div>
          </div>
        );
      
      case 'database':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="operation">Database Operation</Label>
              <Select value={config.operation || ''} onValueChange={(value) => setConfig({ ...config, operation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">SELECT</SelectItem>
                  <SelectItem value="insert">INSERT</SelectItem>
                  <SelectItem value="update">UPDATE</SelectItem>
                  <SelectItem value="delete">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="table">Table Name</Label>
              <Input
                id="table"
                value={config.table || ''}
                onChange={(e) => setConfig({ ...config, table: e.target.value })}
                placeholder="table_name"
              />
            </div>
            <div>
              <Label htmlFor="query">SQL Query</Label>
              <Textarea
                id="query"
                value={config.query || ''}
                onChange={(e) => setConfig({ ...config, query: e.target.value })}
                placeholder="SELECT * FROM table_name WHERE condition"
                rows={3}
              />
            </div>
          </div>
        );
      
      case 'redis':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="redisOperation">Redis Operation</Label>
              <Select value={config.operation || ''} onValueChange={(value) => setConfig({ ...config, operation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="get">GET</SelectItem>
                  <SelectItem value="set">SET</SelectItem>
                  <SelectItem value="del">DELETE</SelectItem>
                  <SelectItem value="exists">EXISTS</SelectItem>
                  <SelectItem value="expire">EXPIRE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={config.key || ''}
                onChange={(e) => setConfig({ ...config, key: e.target.value })}
                placeholder="cache_key"
              />
            </div>
            <div>
              <Label htmlFor="value">Value (for SET operation)</Label>
              <Input
                id="value"
                value={config.value || ''}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                placeholder="cache_value"
              />
            </div>
          </div>
        );
      
      default:
        return <p>No configuration available for this block type.</p>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            Configure {node.data?.label || 'Block'}
          </h2>
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
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};
