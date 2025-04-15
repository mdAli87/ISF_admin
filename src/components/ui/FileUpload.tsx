
import { useState, useRef, ChangeEvent } from "react";
import { File, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  onUploadSuccess?: (fileName: string) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
}

const FileUpload = ({
  onFilesSelected,
  maxFiles = 5,
  acceptedFileTypes = ".pdf,.doc,.docx,.xls,.xlsx",
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (selectedFiles.length + files.length > maxFiles) {
      toast({
        title: "File limit exceeded",
        description: `You can only upload a maximum of ${maxFiles} files.`,
        variant: "destructive"
      });
      return;
    }

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return acceptedFileTypes.includes(fileExtension);
    });

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: `Only ${acceptedFileTypes.replace(/,/g, ', ')} files are allowed.`,
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      if (onFilesSelected) {
        onFilesSelected([...selectedFiles, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <File className="text-alert-red" />;
      case 'doc':
      case 'docx':
        return <File className="text-deep-blue" />;
      case 'xls':
      case 'xlsx':
        return <File className="text-success-green" />;
      default:
        return <File />;
    }
  };

  return (
    <div className="w-full">
      <div
        className={`upload-zone ${dragActive ? "upload-zone-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          ref={inputRef}
          onChange={handleChange}
          accept={acceptedFileTypes}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-lg font-semibold">Drag & Drop files here</p>
          <p className="text-muted-foreground mb-4">or</p>
          <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            className="animate-scale-in"
          >
            Browse Files
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Supported formats: {acceptedFileTypes.replace(/,/g, ', ')}
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} files, 10MB each
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Selected Files ({selectedFiles.length})</h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
              >
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <div className="ml-3">
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
