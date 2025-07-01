
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Tag {
  id: string;
  key: string;
  value: string;
  type: string;
}

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagsModal: React.FC<TagsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tags] = useState<Tag[]>([
    { id: '1', key: 'environment', value: 'production', type: 'String' },
    { id: '2', key: 'version', value: '1.2.3', type: 'String' },
    { id: '3', key: 'debug_mode', value: 'false', type: 'Boolean' },
    { id: '4', key: 'max_connections', value: '100', type: 'Number' },
    { id: '5', key: 'timeout_seconds', value: '30', type: 'Number' },
    { id: '6', key: 'feature_flags', value: 'auth,notifications,analytics', type: 'Array' },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Tags</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Read-only tags with key-value pairs and type information.
            </p>
          </div>

          <div className="border rounded-md" style={{ height: '400px' }}>
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.key}</TableCell>
                      <TableCell>{tag.value}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tag.type === 'String' ? 'bg-blue-100 text-blue-800' :
                          tag.type === 'Number' ? 'bg-green-100 text-green-800' :
                          tag.type === 'Boolean' ? 'bg-purple-100 text-purple-800' :
                          tag.type === 'Array' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tag.type}
                        </span>
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
