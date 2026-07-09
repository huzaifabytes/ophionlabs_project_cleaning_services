import React, { useState, useEffect } from 'react';
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/FileUpload';
import { Textarea } from '@/components/ui/textarea';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { NavItem, SocialLink } from '@workspace/api-client-react';

export default function SettingsManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState<any>({
    siteName: '',
    primaryColor: '',
    secondaryColor: '',
    fontFamily: '',
    logoUrl: '',
    faviconUrl: '',
    whatsappNumber: '',
    instagramUrl: '',
    contactInfo: '',
    businessAddress: '',
    metaTitle: '',
    metaDescription: '',
    seoKeywords: '',
    footerText: '',
    navItems: [],
    socialLinks: []
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({
          title: "Settings Saved",
          description: "Website configuration updated successfully.",
        });
      }
    });
  };

  const addNavItem = () => {
    setFormData({
      ...formData,
      navItems: [...(formData.navItems || []), { label: 'New Link', href: '/', visible: true }]
    });
  };

  const updateNavItem = (index: number, field: keyof NavItem, value: any) => {
    const newItems = [...formData.navItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, navItems: newItems });
  };

  const removeNavItem = (index: number) => {
    setFormData({
      ...formData,
      navItems: formData.navItems.filter((_: any, i: number) => i !== index)
    });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...(formData.socialLinks || []), { platform: 'Facebook', url: '' }]
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
    const newItems = [...formData.socialLinks];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, socialLinks: newItems });
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_: any, i: number) => i !== index)
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Site Settings</h1>
        <p className="text-gray-500 mt-2">Configure branding, contact info, and navigation.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Details */}
        <Card>
          <CardHeader>
            <CardTitle>General Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input 
                value={formData.siteName || ''} 
                onChange={(e) => setFormData({...formData, siteName: e.target.value})} 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <FileUpload 
                  value={formData.logoUrl || ''} 
                  onChange={(url) => setFormData({...formData, logoUrl: url})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Favicon URL</Label>
                <FileUpload 
                  value={formData.faviconUrl || ''} 
                  onChange={(url) => setFormData({...formData, faviconUrl: url})} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Social Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Phone / Contact Info</Label>
                <Input 
                  value={formData.contactInfo || ''} 
                  onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} 
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input 
                  value={formData.whatsappNumber || ''} 
                  onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} 
                  placeholder="Format: 1234567890 (no + or spaces)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Business Address</Label>
              <Textarea 
                value={formData.businessAddress || ''} 
                onChange={(e) => setFormData({...formData, businessAddress: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input 
                value={formData.instagramUrl || ''} 
                onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} 
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Metadata</CardTitle>
            <CardDescription>How your site appears on Google.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input 
                value={formData.metaTitle || ''} 
                onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea 
                value={formData.metaDescription || ''} 
                onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Navigation Menu</CardTitle>
              <CardDescription>Links in the top header</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addNavItem}>
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.navItems?.map((item: NavItem, index: number) => (
              <div key={index} className="flex gap-4 items-start p-4 border rounded-lg bg-gray-50/50">
                <div className="flex-1 space-y-2">
                  <Label>Label</Label>
                  <Input value={item.label} onChange={(e) => updateNavItem(index, 'label', e.target.value)} />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>URL/Anchor</Label>
                  <Input value={item.href} onChange={(e) => updateNavItem(index, 'href', e.target.value)} />
                </div>
                <div className="w-24 space-y-2">
                  <Label>Visible</Label>
                  <div className="h-10 flex items-center">
                    <input 
                      type="checkbox" 
                      checked={item.visible} 
                      onChange={(e) => updateNavItem(index, 'visible', e.target.checked)}
                      className="w-5 h-5 rounded text-primary"
                    />
                  </div>
                </div>
                <div className="pt-8">
                  <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeNavItem(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!formData.navItems || formData.navItems.length === 0) && (
              <p className="text-gray-500 text-center py-4">No navigation links added.</p>
            )}
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Footer Social Links</CardTitle>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
              <Plus className="w-4 h-4 mr-1" /> Add Social
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.socialLinks?.map((item: SocialLink, index: number) => (
              <div key={index} className="flex gap-4 items-start p-4 border rounded-lg bg-gray-50/50">
                <div className="w-1/3 space-y-2">
                  <Label>Platform</Label>
                  <Input value={item.platform} onChange={(e) => updateSocialLink(index, 'platform', e.target.value)} placeholder="e.g. Facebook" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>URL</Label>
                  <Input value={item.url} onChange={(e) => updateSocialLink(index, 'url', e.target.value)} placeholder="https://..." />
                </div>
                <div className="pt-8">
                  <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeSocialLink(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="space-y-2 mt-6 border-t pt-6">
              <Label>Footer Copyright Text</Label>
              <Input 
                value={formData.footerText || ''} 
                onChange={(e) => setFormData({...formData, footerText: e.target.value})} 
                placeholder="© 2024 CleanPro. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>

        {/* Floating Save Button */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-white/80 backdrop-blur-md border-t flex justify-end z-50">
          <Button type="submit" size="lg" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? 'Saving...' : (
              <>
                <Check className="w-5 h-5 mr-2" /> Save All Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
