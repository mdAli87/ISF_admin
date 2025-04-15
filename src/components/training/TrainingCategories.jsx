import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTrainingCategories } from '@/services/trainingAnalyticsService';

const TrainingCategories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rawData = await getTrainingCategories();
      if (rawData.length === 0) {
        // Generate empty data for last 6 months
        const emptyData = Array.from({ length: 6 }).map((_, index) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (5 - index));
          return {
            date: date.toLocaleDateString('en-US', { month: 'short' }),
            'Fire Safety': 0,
            'Road Safety': 0,
            'Industrial Safety': 0
          };
        });
        setData(emptyData);
      } else {
        // Process actual data if exists
        const processedData = rawData.reduce((acc, session) => {
          const date = new Date(session.session_date).toLocaleDateString('en-US', { month: 'short' });
          if (!acc[date]) {
            acc[date] = {
              date,
              'Fire Safety': 0,
              'Road Safety': 0,
              'Industrial Safety': 0
            };
          }
          acc[date][session.category] += session.participants_count;
          return acc;
        }, {});
        setData(Object.values(processedData));
      }
    } catch (error) {
      console.error('Error:', error);
      // Show empty data on error
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export functionality to be implemented');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Training Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monthly training sessions by category
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export Chart
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No training data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Fire Safety"
                  stackId="1"
                  stroke="#FF7F00"
                  fill="#FF7F00"
                />
                <Area
                  type="monotone"
                  dataKey="Road Safety"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                />
                <Area
                  type="monotone"
                  dataKey="Industrial Safety"
                  stackId="1"
                  stroke="#2EBD6B"
                  fill="#2EBD6B"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingCategories; 