import React, { useState } from 'react';
import { useListServices, useCreateService, useUpdateService, useDeleteService, useReorderServices, getListServicesQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/FileUpload';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { ServiceInput, Service } from '@workspace/api-client-react';

export default function ServicesManager() {
  const queryClient = useQueryClient();
  const { data: services, isLoading } = useListServices({ query: { queryKey: getListServicesQueryKey() } });
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const reorderServices = useReorderServices();

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceInput>({
    title: '',
    description: '',
    iconUrl: '',
    beforeImageUrl: '',
    afterImageUrl: '',
  });

  const handleOpenForm = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description || '',
        iconUrl: service.iconUrl || '',
        beforeImageUrl: service.beforeImageUrl || '',
        afterImageUrl: service.afterImageUrl || '',
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        iconUrl: '',
        beforeImageUrl: '',
        afterImageUrl: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService.mutate({ id: editingService.id, data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
          setIsFormOpen(false);
        }
      });
    } else {
      createService.mutate({ data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
          setIsFormOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        }
      });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!services) return;
    const newItems = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    
    reorderServices.mutate({ data: { ids: newItems.map(s => s.id) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services</h1>
          <p className="text-gray-500 mt-2">Manage your cleaning services and before/after photos.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-primary shadow-lg border-t-4">
          <CardHeader>
            <CardTitle>{editingService ? 'Edit Service' : 'New Service'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Service Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                  placeholder="e.g. Deep House Cleaning"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Describe the service..."
                />
              </div>
              <div className="space-y-2">
                <Label>Icon / Thumbnail URL (Optional)</Label>
                <FileUpload 
                  value={formData.iconUrl || ''} 
                  onChange={(url) => setFormData({...formData, iconUrl: url})} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                <div className="space-y-2">
                  <Label>Before Image URL</Label>
                  <FileUpload 
                    value={formData.beforeImageUrl || ''} 
                    onChange={(url) => setFormData({...formData, beforeImageUrl: url})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>After Image URL</Label>
                  <FileUpload 
                    value={formData.afterImageUrl || ''} 
                    onChange={(url) => setFormData({...formData, afterImageUrl: url})} 
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createService.isPending || updateService.isPending}>
                  Save Service
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p>Loading services...</p>
      ) : services?.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p>No services created yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services?.map((service, index) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {service.iconUrl && (
                      <img src={service.iconUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    )}
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleMove(index, 'down')} disabled={index === services.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-500 flex-1">{service.description}</p>
                
                <div className="flex gap-2 mt-6">
                  {service.beforeImageUrl && (
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-gray-400 uppercase">Before</p>
                      <img src={service.beforeImageUrl} alt="Before" className="w-full h-24 object-cover rounded bg-gray-100" />
                    </div>
                  )}
                  {service.afterImageUrl && (
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-gray-400 uppercase">After</p>
                      <img src={service.afterImageUrl} alt="After" className="w-full h-24 object-cover rounded bg-gray-100" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => handleOpenForm(service)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
