import React, { useState } from 'react';
import { useListSlides, useCreateSlide, useUpdateSlide, useDeleteSlide, useReorderSlides, getListSlidesQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/FileUpload';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, MoveVertical } from 'lucide-react';
import type { SlideInput, Slide } from '@workspace/api-client-react';

export default function CarouselManager() {
  const queryClient = useQueryClient();
  const { data: slides, isLoading } = useListSlides({ query: { queryKey: getListSlidesQueryKey() } });
  const createSlide = useCreateSlide();
  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();
  const reorderSlides = useReorderSlides();

  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<SlideInput>({
    heading: '',
    description: '',
    imageUrl: '',
    overlayOpacity: 40,
    autoplay: true,
    autoplaySpeed: 5000,
  });

  const handleOpenForm = (slide?: Slide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        heading: slide.heading,
        description: slide.description || '',
        imageUrl: slide.imageUrl,
        overlayOpacity: slide.overlayOpacity,
        autoplay: slide.autoplay,
        autoplaySpeed: slide.autoplaySpeed,
      });
    } else {
      setEditingSlide(null);
      setFormData({
        heading: '',
        description: '',
        imageUrl: '',
        overlayOpacity: 40,
        autoplay: true,
        autoplaySpeed: 5000,
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: getListSlidesQueryKey() });
      setIsFormOpen(false);
    };
    if (editingSlide) {
      updateSlide.mutate({ id: editingSlide.id, data: formData }, { onSuccess });
    } else {
      createSlide.mutate({ data: formData }, { onSuccess });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      deleteSlide.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSlidesQueryKey() });
        }
      });
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (!slides) return;
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    
    // Swap
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    
    // Update IDs order
    reorderSlides.mutate({ data: { ids: newSlides.map(s => s.id) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSlidesQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hero Carousel</h1>
          <p className="text-gray-500 mt-2">Manage the slides that appear on the homepage.</p>
        </div>
        <Button onClick={() => handleOpenForm()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Slide
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-primary shadow-lg border-t-4">
          <CardHeader>
            <CardTitle>{editingSlide ? 'Edit Slide' : 'New Slide'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Image</Label>
                <FileUpload 
                  value={formData.imageUrl} 
                  onChange={(url) => setFormData({...formData, imageUrl: url})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input 
                  value={formData.heading} 
                  onChange={(e) => setFormData({...formData, heading: e.target.value})} 
                  required 
                  placeholder="e.g. Premium Cleaning Services"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="e.g. Professional, reliable, and trustworthy."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Overlay Opacity (0-100)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={formData.overlayOpacity} 
                    onChange={(e) => setFormData({...formData, overlayOpacity: Number(e.target.value)})} 
                  />
                  <p className="text-xs text-muted-foreground">Darkens image for better text readability</p>
                </div>
                <div className="space-y-2">
                  <Label>Autoplay Speed (ms)</Label>
                  <Input 
                    type="number" 
                    min="1000" 
                    step="500" 
                    value={formData.autoplaySpeed} 
                    onChange={(e) => setFormData({...formData, autoplaySpeed: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="autoplay" 
                  checked={formData.autoplay} 
                  onChange={(e) => setFormData({...formData, autoplay: e.target.checked})}
                  className="w-4 h-4 rounded text-primary"
                />
                <Label htmlFor="autoplay" className="cursor-pointer">Enable Autoplay</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createSlide.isPending || updateSlide.isPending}>
                  Save Slide
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
        <p>Loading slides...</p>
      ) : slides?.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <p>No slides created yet.</p>
          <Button variant="link" onClick={() => handleOpenForm()} className="mt-2">Create your first slide</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {slides?.map((slide, index) => (
            <Card key={slide.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto relative bg-gray-100 flex-shrink-0">
                  {slide.imageUrl && (
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.heading} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(0,0,0,${(slide.overlayOpacity || 0)/100})` }}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{slide.heading}</h3>
                    <p className="text-gray-500 mt-2 line-clamp-2">{slide.description}</p>
                    <div className="flex gap-4 mt-4 text-sm text-gray-400">
                      <span>Opacity: {slide.overlayOpacity}%</span>
                      <span>Autoplay: {slide.autoplay ? `${slide.autoplaySpeed}ms` : 'Off'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === slides.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleOpenForm(slide)}>
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(slide.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
