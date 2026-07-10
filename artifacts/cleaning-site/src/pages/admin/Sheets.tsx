import React, { useState, useEffect } from 'react';
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, FileSpreadsheet, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SheetsConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState({
    sheetsScriptUrl: '',
    sheetsSpreadsheetId: '',
    sheetsSheetName: '',
    reviewsScriptUrl: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        sheetsScriptUrl: settings.sheetsScriptUrl || '',
        sheetsSpreadsheetId: settings.sheetsSpreadsheetId || '',
        sheetsSheetName: settings.sheetsSheetName || '',
        reviewsScriptUrl: settings.reviewsScriptUrl || '',
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
          <FileSpreadsheet className="w-8 h-8 text-primary" /> Google Sheets Config
        </h1>
        <p className="text-gray-500 mt-2">Send form submissions and reviews directly to Google Sheets via Apps Script.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Form → Sheets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" /> Contact Form Submissions
            </CardTitle>
            <CardDescription>When a visitor submits the contact form, the data is forwarded to this Apps Script URL.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Apps Script Web App URL</Label>
              <Input
                value={formData.sheetsScriptUrl}
                onChange={(e) => setFormData({...formData, sheetsScriptUrl: e.target.value})}
                placeholder="https://script.google.com/macros/s/..."
                type="url"
              />
              <p className="text-xs text-muted-foreground">Deploy your Apps Script as a web app and paste the URL here.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Spreadsheet ID <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  value={formData.sheetsSpreadsheetId}
                  onChange={(e) => setFormData({...formData, sheetsSpreadsheetId: e.target.value})}
                  placeholder="1BxiMVs0XRYFgwnTE..."
                />
              </div>
              <div className="space-y-2">
                <Label>Sheet Tab Name <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  value={formData.sheetsSheetName}
                  onChange={(e) => setFormData({...formData, sheetsSheetName: e.target.value})}
                  placeholder="Contacts"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Reviews → Sheets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Customer Reviews
            </CardTitle>
            <CardDescription>When a visitor submits a review on the homepage, it is also forwarded to this Apps Script URL.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Apps Script Web App URL</Label>
              <Input
                value={formData.reviewsScriptUrl}
                onChange={(e) => setFormData({...formData, reviewsScriptUrl: e.target.value})}
                placeholder="https://script.google.com/macros/s/..."
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                Each review submission posts: <code className="bg-muted px-1 rounded text-xs">name, rating, comment, status, date, time</code>.
                You can use the same Apps Script URL as contacts or a separate one.
              </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={updateSettings.isPending}>
          {updateSettings.isPending ? 'Saving...' : (
            <><Check className="w-4 h-4 mr-2" /> Save Configuration</>
          )}
        </Button>
      </form>
    </div>
  );
}
