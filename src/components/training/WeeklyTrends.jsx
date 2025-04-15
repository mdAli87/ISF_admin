import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getWeeklyTrends } from '@/services/trainingAnalyticsService';

const WeeklyTrends = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rawData = await getWeeklyTrends();
      
      // Process data for weekly view
      const weeklyData = rawData.reduce((acc, session) => {
        const weekStart = new Date(session.session_date);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
        
        const weekKey = weekStart.toISOString().split('T')[0];
        if (!acc[weekKey]) {
          acc[weekKey] = {
            week: `Week ${Math.ceil((weekStart.getDate() + 1) / 7)}`,
            participants: 0,
            sessions: 0
          };
        }
        acc[weekKey].participants += session.participants_count;
        acc[weekKey].sessions += 1;
        return acc;
      }, {});

      setData(Object.values(weeklyData));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
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
      <CardHeader>
        <CardTitle>Weekly Trends</CardTitle>
        <p className="text-sm text-muted-foreground">
          Training sessions and participants
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No trend data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sessions"
                  name="Training Sessions"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="participants"
                  name="Participants"
                  stroke="#2EBD6B"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyTrends; 