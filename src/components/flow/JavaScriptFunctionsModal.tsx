
import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useJavaScriptFunctions, Argument, JavaScriptFunction } from '@/contexts/JavaScriptFunctionsContext';

interface JavaScriptFunctionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FunctionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  functionData?: JavaScriptFunction;
  onSave: (func: Omit<JavaScriptFunction, 'id'>) => void;
}

const FunctionFormModal: React.FC<FunctionFormModalProps> = ({
  isOpen,
  onClose,
  functionData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: functionData?.name || '',
    description: functionData?.description || '',
    arguments: functionData?.arguments || [],
    code: functionData?.code || '',
    returnType: functionData?.returnType || 'void',
  });

  const [newArg, setNewArg] = useState({ name: '', type: 'string' });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Name and Code are mandatory fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  const addArgument = () => {
    if (newArg.name.trim()) {
      setFormData(prev => ({
        ...prev,
        arguments: [...prev.arguments, newArg]
      }));
      setNewArg({ name: '', type: 'string' });
    }
  };

  const removeArgument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      arguments: prev.arguments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {functionData ? 'Edit Function' : 'Add New Function'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Function name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Function description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Return Type</label>
            <select
              value={formData.returnType}
              onChange={(e) => setFormData(prev => ({ ...prev, returnType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="void">void</option>
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
              <option value="object">object</option>
              <option value="array">array</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Arguments</label>
            <div className="space-y-2">
              {formData.arguments.map((arg, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input value={arg.name} readOnly className="flex-1" />
                  <span className="text-sm text-gray-500">{arg.type}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArgument(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Argument name"
                  value={newArg.name}
                  onChange={(e) => setNewArg(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1"
                />
                <select
                  value={newArg.type}
                  onChange={(e) => setNewArg(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="object">object</option>
                  <option value="array">array</option>
                </select>
                <Button onClick={addArgument}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Code <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Enter your JavaScript code here..."
              rows={8}
              className="font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Function
          </Button>
        </div>
      </div>
    </div>
  );
};

export const JavaScriptFunctionsModal: React.FC<JavaScriptFunctionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { functions, addFunction, updateFunction, deleteFunction } = useJavaScriptFunctions();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState<JavaScriptFunction | undefined>();

  const handleEdit = (func: JavaScriptFunction) => {
    setEditingFunction(func);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteFunction(id);
  };

  const handleSave = (functionData: Omit<JavaScriptFunction, 'id'>) => {
    if (editingFunction) {
      updateFunction(editingFunction.id, functionData);
    } else {
      addFunction(functionData);
    }
    setEditingFunction(undefined);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingFunction(undefined);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl m-4 h-[600px] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">JavaScript Functions</h2>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsFormModalOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Function
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-hidden">
            <ScrollArea className="h-[450px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Arguments</TableHead>
                    <TableHead>Return Type</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {functions.map((func) => (
                    <TableRow key={func.id}>
                      <TableCell className="font-mono font-medium">{func.name}</TableCell>
                      <TableCell>{func.description || '-'}</TableCell>
                      <TableCell>
                        {func.arguments.length > 0 ? (
                          <div className="space-y-1">
                            {func.arguments.map((arg, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-mono">{arg.name}</span>
                                <span className="text-gray-500">: {arg.type}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{func.returnType}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(func)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(func.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </div>

      <FunctionFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        functionData={editingFunction}
        onSave={handleSave}
      />
    </>
  );
};
