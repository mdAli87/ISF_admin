
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import React from 'react';

const TrainerDetail = () => {
  const { id } = useParams();
  
  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold font-montserrat text-white tracking-tight">Trainer Details</h1>
        <p className="text-muted-foreground">
          Viewing details for trainer ID: {id}
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1">
        {/* Trainer detail content will go here */}
        <p>Trainer detail content placeholder</p>
      </div>
    </DashboardLayout>
  );
};

export default TrainerDetail;
