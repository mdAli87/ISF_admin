
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileSection from "./ProfileSection";
import React from 'react';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold font-montserrat text-white tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1">
        <ProfileSection />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
