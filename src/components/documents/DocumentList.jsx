
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";

const DocumentList = ({ onRefresh }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Get documents from the database
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      // Get file download URL
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);
        
      if (error) throw error;
      
      // Create download link
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.title + '.' + document.file_path.split('.').pop();
      window.document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `${document.title} is being downloaded`
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download Failed",
        description: error.message || "Could not download the document",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (document) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);
        
      if (dbError) throw dbError;
      
      // Update local state
      setDocuments(documents.filter(d => d.id !== document.id));
      
      toast({
        title: "Document Deleted",
        description: "The document has been successfully deleted"
      });
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Could not delete the document",
        variant: "destructive"
      });
    }
  };

  // Filter documents based on search query and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="elegant-card overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-card/80">
        <CardTitle className="text-lg font-semibold text-white">Document Repository</CardTitle>
        <CardDescription>View and manage your documents</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-56">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="safety">Safety Manual</SelectItem>
                <SelectItem value="training">Training Material</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="forms">Forms</SelectItem>
                <SelectItem value="certifications">Certifications</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-secondary/30 rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter 
                ? "Try adjusting your search or filter criteria"
                : "Upload your first document to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="p-4 border border-secondary/20 rounded-lg hover:border-success-green/30 hover:bg-success-green/5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex-shrink-0 flex items-center justify-center mt-1">
                      <FileText className="h-5 w-5 text-success-green" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium">{doc.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>
                          {format(new Date(doc.created_at), 'MMM d, yyyy')}
                        </span>
                        <span>
                          {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                        </span>
                        <span>
                          {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive gap-1"
                      onClick={() => handleDelete(doc)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;
