
import DashboardLayout from "@/components/layout/DashboardLayout";
import React from 'react';

const Trainers = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold font-montserrat text-white tracking-tight">Trainers</h1>
        <p className="text-muted-foreground">
          View and manage safety trainers
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1">
        {/* Trainers content will go here */}
        <p>Trainers content placeholder</p>
      </div>
    </DashboardLayout>
  );
};

export default Trainers;
