import React, { useState, useEffect } from 'react';
import { useGetAbout, useUpdateAbout, getGetAboutQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AboutManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: about, isLoading } = useGetAbout({ query: { queryKey: getGetAboutQueryKey() } });
  const updateAbout = useUpdateAbout();

  const [formData, setFormData] = useState({
    introduction: '',
    mission: '',
    vision: '',
    experience: ''
  });

  useEffect(() => {
    if (about) {
      setFormData({
        introduction: about.introduction || '',
        mission: about.mission || '',
        vision: about.vision || '',
        experience: about.experience || ''
      });
    }
  }, [about]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAboutQueryKey() });
        toast({
          title: "Saved successfully",
          description: "About section has been updated.",
        });
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">About Section</h1>
        <p className="text-gray-500 mt-2">Manage the company information displayed on the website.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Content</CardTitle>
          <CardDescription>This text will appear in the About Us section.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label>Introduction Paragraph</Label>
              <Textarea 
                value={formData.introduction} 
                onChange={(e) => setFormData({...formData, introduction: e.target.value})} 
                placeholder="Welcome to CleanPro..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Our Mission</Label>
              <Textarea 
                value={formData.mission} 
                onChange={(e) => setFormData({...formData, mission: e.target.value})} 
                placeholder="Our mission is to..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Our Vision</Label>
              <Textarea 
                value={formData.vision} 
                onChange={(e) => setFormData({...formData, vision: e.target.value})} 
                placeholder="We envision a world where..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Experience & Background</Label>
              <Textarea 
                value={formData.experience} 
                onChange={(e) => setFormData({...formData, experience: e.target.value})} 
                placeholder="With over 10 years of experience..."
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" size="lg" disabled={updateAbout.isPending}>
              {updateAbout.isPending ? 'Saving...' : (
                <>
                  <Check className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
