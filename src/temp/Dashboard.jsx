
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import UpcomingTrainings from "@/components/dashboard/UpcomingTrainings";
import { CalendarDays, CheckCircle, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold font-montserrat text-oxford-blue tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your safety training dashboard
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <StatCard 
          title="Scheduled Trainings" 
          value={24} 
          description="+8% from last month" 
          icon={<CalendarDays className="text-success-green" />} 
          trend={{ value: 8, isUpward: true }} 
        />
        <StatCard 
          title="Active Trainers" 
          value={16} 
          description="2 new this month" 
          icon={<Users className="text-cambridge-blue" />} 
          trend={{ value: 2, isUpward: true }} 
        />
        <StatCard 
          title="Completed Sessions" 
          value={142} 
          description="Goal: 180 by Q2" 
          icon={<CheckCircle className="text-chart-purple" />} 
          trend={{ value: 0, isUpward: false }} 
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-2">
          <h2 className="text-xl font-semibold font-montserrat mb-4">Training Activity</h2>
          <div className="h-80">
            <ActivityChart />
          </div>
        </div>
        
        <div className="glass-card p-5">
          <h2 className="text-xl font-semibold font-montserrat mb-4">Upcoming Trainings</h2>
          <UpcomingTrainings />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
