import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentIncidents, getSeverityDistribution } from '@/services/analyticsService';

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalIncidents: 0,
    highSeverity: 0,
    openIncidents: 0,
    resolvedIncidents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all recent incidents
        const incidents = await getRecentIncidents(1000); // Get a large enough sample
        const severityData = await getSeverityDistribution();
        
        // Calculate stats
        const total = incidents?.length || 0;
        const highSeverity = severityData?.find(s => s.severity === 'HIGH')?.count || 0;
        const open = incidents?.filter(i => i.status === 'OPEN').length || 0;
        const resolved = incidents?.filter(i => i.status === 'RESOLVED').length || 0;

        setStats({
          totalIncidents: total,
          highSeverity,
          openIncidents: open,
          resolvedIncidents: resolved
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? '...' : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Incidents"
        value={stats.totalIncidents}
        description="Total reported incidents"
      />
      <StatCard
        title="High Severity"
        value={stats.highSeverity}
        description="High severity incidents"
      />
      <StatCard
        title="Open Incidents"
        value={stats.openIncidents}
        description="Currently open incidents"
      />
      <StatCard
        title="Resolved"
        value={stats.resolvedIncidents}
        description="Successfully resolved incidents"
      />
    </div>
  );
};

export default StatsCards; 