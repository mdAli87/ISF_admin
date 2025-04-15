import StatsCards from "@/components/dashboard/StatsCards";
import CategoryDistribution from "@/components/dashboard/CategoryDistribution";
import WeeklyTrends from "@/components/dashboard/WeeklyTrends";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Safety Incidents Dashboard</h2>
      </div>
      <StatsCards />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <WeeklyTrends />
        </div>
        <div className="col-span-3">
          <CategoryDistribution />
        </div>
      </div>
    </div>
  );
} 