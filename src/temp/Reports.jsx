import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import TrainingCategories from "@/components/training/TrainingCategories";
import CategoryDistribution from "@/components/training/CategoryDistribution";
import WeeklyTrends from "@/components/training/WeeklyTrends";
import RegionalPerformance from "@/components/training/RegionalPerformance";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Training Reports</h2>
        </div>
        
        {/* Training Categories and Distribution */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <TrainingCategories />
          <CategoryDistribution />
        </div>
        
        {/* Weekly Trends and Regional Performance */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <WeeklyTrends />
          <RegionalPerformance />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports; 