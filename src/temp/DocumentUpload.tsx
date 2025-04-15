import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type DocumentUploadProps = {
  onUploadComplete?: () => void;
};

const DocumentUpload = ({ onUploadComplete }: DocumentUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentData, setDocumentData] = useState({
    title: "",
    description: "",
    category: ""
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDocumentData({
      ...documentData,
      [id]: value
    });
  };

  const handleCategoryChange = (value: string) => {
    setDocumentData({
      ...documentData,
      category: value
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Missing File",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!documentData.title || !documentData.category) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and category for your document",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Create unique file name
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const safeName = documentData.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const fileName = `${safeName}-${timestamp}.${fileExt}`;
      const filePath = `documents/${user.id}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Save document metadata
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title: documentData.title,
          description: documentData.description,
          category: documentData.category,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: "Document Uploaded",
        description: "Your document has been successfully uploaded."
      });
      
      // Reset form
      setFile(null);
      setDocumentData({
        title: "",
        description: "",
        category: ""
      });
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload document",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="elegant-card overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-card/80">
        <CardTitle className="text-lg font-semibold text-white">Upload Document</CardTitle>
        <CardDescription>Add a new document to the repository</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input 
              id="title"
              value={documentData.title}
              onChange={handleInputChange}
              placeholder="Safety Protocol Manual"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={documentData.category} 
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safety">Safety Manual</SelectItem>
                <SelectItem value="training">Training Material</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="forms">Forms</SelectItem>
                <SelectItem value="certifications">Certifications</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document"
              rows={3}
              value={documentData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Document File</Label>
            {!file ? (
              <div className="border-2 border-dashed border-secondary/30 rounded-lg p-8 text-center hover:border-success-green/50 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
                  <p className="text-xs text-muted-foreground mb-4">Or click to browse files</p>
                  <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                    Select File
                  </Button>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    PDF, DOCX, XLSX, CSV, JPG, PNG files (Max 20MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-secondary/30 rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRemoveFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" disabled={isLoading} onClick={() => {
              setFile(null);
              setDocumentData({
                title: "",
                description: "",
                category: ""
              });
            }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
