import React, { useState } from 'react';
import { useListTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember, useReorderTeamMembers, getListTeamMembersQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/FileUpload';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { TeamMemberInput, TeamMember } from '@workspace/api-client-react';

export default function TeamManager() {
  const queryClient = useQueryClient();
  const { data: team, isLoading } = useListTeamMembers({ query: { queryKey: getListTeamMembersQueryKey() } });
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const reorderMembers = useReorderTeamMembers();

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<TeamMemberInput>({
    name: '',
    position: '',
    description: '',
    photoUrl: '',
  });

  const handleOpenForm = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        position: member.position,
        description: member.description || '',
        photoUrl: member.photoUrl || '',
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        position: '',
        description: '',
        photoUrl: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMember.mutate({ id: editingMember.id, data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
          setIsFormOpen(false);
        }
      });
    } else {
      createMember.mutate({ data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
          setIsFormOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      deleteMember.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        }
      });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!team) return;
    const newItems = [...team];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    
    reorderMembers.mutate({ data: { ids: newItems.map(s => s.id) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Members</h1>
          <p className="text-gray-500 mt-2">Manage the staff displayed in the About section.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Team Member
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-primary shadow-lg border-t-4">
          <CardHeader>
            <CardTitle>{editingMember ? 'Edit Team Member' : 'New Team Member'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input 
                    value={formData.position} 
                    onChange={(e) => setFormData({...formData, position: e.target.value})} 
                    required 
                    placeholder="e.g. Lead Cleaner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Photo URL</Label>
                <FileUpload 
                  value={formData.photoUrl || ''} 
                  onChange={(url) => setFormData({...formData, photoUrl: url})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Bio / Description</Label>
                <Textarea 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Short bio..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
                  Save Member
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
        <p>Loading team members...</p>
      ) : team?.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p>No team members added yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team?.map((member, index) => (
            <Card key={member.id} className="flex flex-col text-center">
              <CardContent className="pt-6 flex-1">
                <div className="relative mx-auto w-32 h-32 mb-4 group">
                  <div className="absolute top-0 right-0 z-10 flex flex-col gap-1 -mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleMove(index, 'down')} disabled={index === team.length - 1}>
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-4xl text-gray-300 font-light border-4 border-white shadow-lg">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm font-medium text-primary uppercase tracking-wide">{member.position}</p>
                <p className="text-sm text-gray-500 mt-4 line-clamp-3">{member.description}</p>
              </CardContent>
              <div className="flex gap-2 p-4 border-t bg-gray-50/50">
                <Button variant="outline" className="flex-1" onClick={() => handleOpenForm(member)}>
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(member.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
