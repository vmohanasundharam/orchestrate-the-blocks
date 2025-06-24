
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Database, Calendar, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flow } from '@/pages/Index';

interface FlowConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  flow?: Flow | null;
}

const dataSources = ['CNC', 'Fanuc', 'Siemens', 'Mitsubishi', 'Heidenhain'];

const cronExpressions = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Daily at 6 AM', value: '0 6 * * *' },
  { label: 'Weekly (Mondays at 9 AM)', value: '0 9 * * 1' },
  { label: 'Monthly (1st day at midnight)', value: '0 0 1 * *' },
];

export const FlowConfigModal: React.FC<FlowConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  flow
}) => {
  const [triggerType, setTriggerType] = useState<'datasource' | 'schedule' | 'webhook'>('datasource');
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [selectedCron, setSelectedCron] = useState('');
  const [customCron, setCustomCron] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  useEffect(() => {
    if (flow) {
      reset({
        name: flow.name,
        description: flow.description,
      });
      setTriggerType(flow.triggerType);
      
      if (flow.triggerConfig) {
        if (flow.triggerType === 'datasource') {
          setSelectedDataSource(flow.triggerConfig.source || '');
        } else if (flow.triggerType === 'schedule') {
          setSelectedCron(flow.triggerConfig.cron || '');
        } else if (flow.triggerType === 'webhook') {
          setWebhookUrl(flow.triggerConfig.url || '');
        }
      }
    } else {
      reset({ name: '', description: '' });
      setTriggerType('datasource');
      setSelectedDataSource('');
      setSelectedCron('');
      setCustomCron('');
      setWebhookUrl('https://api.example.com/webhook/' + Math.random().toString(36).substr(2, 9));
    }
  }, [flow, reset]);

  useEffect(() => {
    if (triggerType === 'webhook') {
      setWebhookUrl('https://api.example.com/webhook/' + Math.random().toString(36).substr(2, 9));
    }
  }, [triggerType]);

  const onSubmit = (data: any) => {
    let triggerConfig = {};
    
    if (triggerType === 'datasource') {
      triggerConfig = { source: selectedDataSource };
    } else if (triggerType === 'schedule') {
      triggerConfig = { cron: selectedCron === 'custom' ? customCron : selectedCron };
    } else if (triggerType === 'webhook') {
      triggerConfig = { url: webhookUrl };
    }

    onSave({
      name: data.name,
      description: data.description,
      triggerType,
      triggerConfig,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {flow ? 'Edit Flow' : 'Create New Flow'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="name">Flow Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Flow name is required' })}
                placeholder="Enter flow name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter flow description"
                rows={3}
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-base font-medium mb-4 block">Trigger Type</Label>
            <Tabs value={triggerType} onValueChange={(value: any) => setTriggerType(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="datasource" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Datasource Polling
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Scheduling
                </TabsTrigger>
                <TabsTrigger value="webhook" className="flex items-center gap-2">
                  <Webhook className="w-4 h-4" />
                  Webhook
                </TabsTrigger>
              </TabsList>

              <TabsContent value="datasource" className="mt-4">
                <div>
                  <Label htmlFor="datasource">Select Data Source</Label>
                  <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a data source" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-4">
                <div>
                  <Label htmlFor="cron">Schedule</Label>
                  <Select value={selectedCron} onValueChange={setSelectedCron}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {cronExpressions.map((expr) => (
                        <SelectItem key={expr.value} value={expr.value}>
                          {expr.label} ({expr.value})
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Cron Expression</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedCron === 'custom' && (
                    <div className="mt-3">
                      <Label htmlFor="customCron">Custom Cron Expression</Label>
                      <Input
                        id="customCron"
                        value={customCron}
                        onChange={(e) => setCustomCron(e.target.value)}
                        placeholder="* * * * *"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Format: minute hour day month day-of-week
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="webhook" className="mt-4">
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={webhookUrl}
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This URL will be automatically generated for your webhook
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {flow ? 'Update Flow' : 'Create Flow'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
