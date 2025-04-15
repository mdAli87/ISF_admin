import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthlyIncidentTrends } from '@/services/analyticsService';

const WeeklyTrends = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendsData = await getMonthlyIncidentTrends();
        const formattedData = trendsData?.map(item => ({
          ...item,
          date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })) || [];
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching incident trends:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const NoDataMessage = () => (
    <div className="h-[300px] flex items-center justify-center text-gray-500">
      No incident trend data available
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">Loading...</div>
        ) : data.length === 0 ? (
          <NoDataMessage />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Incidents"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyTrends; 