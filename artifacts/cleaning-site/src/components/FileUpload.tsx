import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
}

export function FileUpload({ value, onChange, className, placeholder = "Image URL" }: FileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", { 
        method: "POST", 
        body: formData,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onChange(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <Button 
          type="button" 
          variant="secondary" 
          disabled={isUploading}
          className="pointer-events-none"
        >
          {isUploading ? (
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Upload
        </Button>
      </div>
    </div>
  );
}
