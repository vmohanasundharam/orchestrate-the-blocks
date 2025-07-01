
import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGlobalVariables, GlobalVariable } from '@/contexts/GlobalVariablesContext';

interface GlobalVariablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalVariablesModal: React.FC<GlobalVariablesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { variables, addVariable, updateVariable, deleteVariable } = useGlobalVariables();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVariable, setNewVariable] = useState({ name: '', value: '', type: 'String' });

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, updatedVariable: Partial<GlobalVariable>) => {
    updateVariable(id, updatedVariable);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteVariable(id);
  };

  const handleAdd = () => {
    if (newVariable.name && newVariable.value) {
      addVariable(newVariable);
      setNewVariable({ name: '', value: '', type: 'String' });
    }
  };

  const EditableCell: React.FC<{
    value: string;
    isEditing: boolean;
    onSave: (value: string) => void;
  }> = ({ value, isEditing, onSave }) => {
    const [editValue, setEditValue] = useState(value);

    if (!isEditing) {
      return <span>{value}</span>;
    }

    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => onSave(editValue)}
        onKeyPress={(e) => e.key === 'Enter' && onSave(editValue)}
        className="h-8"
        autoFocus
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Global Variables</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Variable name"
              value={newVariable.name}
              onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={newVariable.value}
              onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
              className="flex-1"
            />
            <select
              value={newVariable.type}
              onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
            </select>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          <div className="border rounded-md" style={{ height: '350px' }}>
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variables.map((variable) => (
                    <TableRow key={variable.id}>
                      <TableCell>
                        <EditableCell
                          value={variable.name}
                          isEditing={editingId === variable.id}
                          onSave={(value) => handleSave(variable.id, { name: value })}
                        />
                      </TableCell>
                      <TableCell>
                        <EditableCell
                          value={variable.value}
                          isEditing={editingId === variable.id}
                          onSave={(value) => handleSave(variable.id, { value })}
                        />
                      </TableCell>
                      <TableCell>
                        {editingId === variable.id ? (
                          <select
                            value={variable.type}
                            onChange={(e) => handleSave(variable.id, { type: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="String">String</option>
                            <option value="Number">Number</option>
                            <option value="Boolean">Boolean</option>
                          </select>
                        ) : (
                          <span>{variable.type}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {editingId === variable.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(variable.id)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(variable.id)}
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

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
