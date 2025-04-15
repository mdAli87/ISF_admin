
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DocumentUpload from "./DocumentUpload";
import DocumentList from "./DocumentList";

const Documents = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold font-montserrat text-white tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Upload, view and manage safety training documents
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <DocumentUpload onUploadComplete={handleRefresh} />
        <DocumentList key={refreshTrigger} onRefresh={handleRefresh} />
      </div>
    </DashboardLayout>
  );
};

export default Documents;
