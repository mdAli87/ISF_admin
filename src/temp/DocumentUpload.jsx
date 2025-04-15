import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const MAX_SUPABASE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/jpg'
];

const DocumentUpload = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, Word document, or image file.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > MAX_SUPABASE_SIZE) {
        toast({
          title: "File Too Large",
          description: `Maximum file size is ${MAX_SUPABASE_SIZE / 1024 / 1024}MB`,
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      setDocumentTitle(file.name.split('.').slice(0, -1).join('.'));
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setDocumentTitle('');
    setDocumentDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadToSupabase = async (file) => {
    try {
      // Create a unique file name to prevent collisions
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${documentTitle.replace(/[^a-zA-Z0-9]/g, '-')}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('isf-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('isf-documents')
        .getPublicUrl(filePath);

      return { publicUrl, filePath };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Error uploading file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide both a file and title.",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(20);

      // Upload file to storage
      const { publicUrl, filePath } = await uploadToSupabase(selectedFile);
      setUploadProgress(60);

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            title: documentTitle,
            description: documentDescription,
            file_url: publicUrl,
            file_path: filePath,
            file_name: selectedFile.name,
            file_size: selectedFile.size,
            file_type: selectedFile.type,
            status: 'active'
          }
        ]);

      if (dbError) throw dbError;

      setUploadProgress(100);
      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });

      clearSelection();
      onUploadComplete?.();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document-title">Document Title</Label>
            <Input
              type="text"
              id="document-title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Enter document title"
              disabled={uploading}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document-description">Description (Optional)</Label>
            <Input
              type="text"
              id="document-description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="Enter document description"
              disabled={uploading}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document">Document</Label>
            <Input
              id="document"
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="cursor-pointer"
              disabled={uploading}
              accept={ALLOWED_FILE_TYPES.join(',')}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, Word, Images (JPEG, PNG) up to 50MB
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={clearSelection}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload; 