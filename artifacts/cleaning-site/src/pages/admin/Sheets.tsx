import React, { useState, useEffect } from 'react';
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SheetsConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState({
    sheetsScriptUrl: '',
    sheetsSpreadsheetId: '',
    sheetsSheetName: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        sheetsScriptUrl: settings.sheetsScriptUrl || '',
        sheetsSpreadsheetId: settings.sheetsSpreadsheetId || '',
        sheetsSheetName: settings.sheetsSheetName || ''
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Only update these specific fields in settings
    updateSettings.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({
          title: "Saved successfully",
          description: "Google Sheets configuration updated.",
        });
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" /> Google Sheets Config
        </h1>
        <p className="text-gray-500 mt-2">Connect contact form submissions to a Google Sheet.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>To enable saving contacts to Google Sheets, provide the Apps Script URL.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label>Google Apps Script Web App URL</Label>
              <Input 
                value={formData.sheetsScriptUrl} 
                onChange={(e) => setFormData({...formData, sheetsScriptUrl: e.target.value})} 
                placeholder="https://script.google.com/macros/s/..."
                type="url"
              />
              <p className="text-xs text-muted-foreground">The deployed web app URL from your Google Apps Script project.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Spreadsheet ID (Optional)</Label>
              <Input 
                value={formData.sheetsSpreadsheetId} 
                onChange={(e) => setFormData({...formData, sheetsSpreadsheetId: e.target.value})} 
                placeholder="1BxiMVs0XRYFgwnTE..."
              />
              <p className="text-xs text-muted-foreground">The long ID string in your Google Sheets URL.</p>
            </div>

            <div className="space-y-2">
              <Label>Sheet Tab Name</Label>
              <Input 
                value={formData.sheetsSheetName} 
                onChange={(e) => setFormData({...formData, sheetsSheetName: e.target.value})} 
                placeholder="Sheet1"
              />
            </div>

            <Button type="submit" size="lg" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? 'Saving...' : (
                <>
                  <Check className="w-4 h-4 mr-2" /> Save Integration
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
