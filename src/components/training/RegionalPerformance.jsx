import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRegionalPerformance } from '@/services/trainingAnalyticsService';

const REGIONS = [
  'Chennai Region',
  'Mumbai Region',
  'Delhi Region',
  'Bangalore Region',
  'Hyderabad Region'
];

const RegionalPerformance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const performanceData = await getRegionalPerformance();
      if (performanceData.length === 0) {
        // Generate empty data for all regions
        const emptyData = REGIONS.map(region => ({
          region,
          completion_rate: 0
        }));
        setData(emptyData);
      } else {
        setData(performanceData.sort((a, b) => b.completion_rate - a.completion_rate));
      }
    } catch (error) {
      console.error('Error:', error);
      // Show empty data on error
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Training completion rates by region
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((region) => (
            <div key={region.region} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{region.region}</span>
                <span className="text-sm text-muted-foreground">
                  {region.completion_rate === 0 ? 'No data' : `${region.completion_rate.toFixed(1)}%`}
                </span>
              </div>
              <Progress value={region.completion_rate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalPerformance; 