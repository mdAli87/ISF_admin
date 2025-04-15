import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryDistribution } from '@/services/trainingAnalyticsService';

const COLORS = ['#FF7F00', '#3B82F6', '#2EBD6B'];

const CategoryDistribution = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rawData = await getCategoryDistribution();
      if (rawData.length === 0) {
        // Generate empty data for all categories
        const emptyData = [
          { name: 'Fire Safety', value: 0 },
          { name: 'Road Safety', value: 0 },
          { name: 'Industrial Safety', value: 0 }
        ];
        setData(emptyData);
      } else {
        const processedData = rawData.map(item => ({
          name: item.category,
          value: parseInt(item.count)
        }));
        setData(processedData);
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
          <CardTitle>Category Distribution</CardTitle>
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
        <CardTitle>Category Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Training types percentages
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value === 0 ? 'No data' : value} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution; 