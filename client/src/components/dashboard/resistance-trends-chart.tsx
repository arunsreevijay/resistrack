import { useQuery } from "@tanstack/react-query";
import { ResistanceTrend, FilterState } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ResistanceTrendsChartProps {
  filters: Partial<FilterState>;
}

// Color palette for the chart lines
const colorPalette = [
  "#1976D2", // primary-500
  "#00ACC1", // secondary-500
  "#FF9800", // warning-500
  "#F44336", // alert-500
];

const ResistanceTrendsChart = ({ filters }: ResistanceTrendsChartProps) => {
  const { data, isLoading, error } = useQuery<ResistanceTrend[]>({
    queryKey: ['/api/dashboard/trends', filters],
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resistance Trends Over Time</CardTitle>
          <CardDescription>Percentage of resistant isolates by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            Error loading resistance trends: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group data by bacteria
  const groupedByBacteria = new Map<string, { name: string, data: { month: string, resistanceRate: number }[] }>();
  
  if (data) {
    for (const item of data) {
      if (!groupedByBacteria.has(item.bacteriaName)) {
        groupedByBacteria.set(item.bacteriaName, { 
          name: item.bacteriaName, 
          data: [] 
        });
      }
      
      groupedByBacteria.get(item.bacteriaName)!.data.push({
        month: item.month,
        resistanceRate: item.resistanceRate,
      });
    }
    
    // Sort each bacteria's data by month
    for (const [_, value] of groupedByBacteria.entries()) {
      value.data.sort((a, b) => a.month.localeCompare(b.month));
    }
  }
  
  // Prepare data for Recharts
  // We need to transform from series to a format where each month has all bacteria data
  const chartData: { month: string } & Record<string, number> = [];
  
  if (data) {
    // Get all unique months
    const months = [...new Set(data.map(item => item.month))].sort();
    
    for (const month of months) {
      const monthData: any = { month };
      
      for (const [bacteriaName, series] of groupedByBacteria.entries()) {
        const dataPoint = series.data.find(item => item.month === month);
        monthData[bacteriaName] = dataPoint ? dataPoint.resistanceRate : null;
      }
      
      chartData.push(monthData);
    }
  }

  // Format month labels (convert YYYY-MM to Mon YYYY)
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    return new Date(`${year}-${monthNum}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="border-b border-neutral-200 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Resistance Trends Over Time</CardTitle>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-neutral-500 hover:text-neutral-700">
              <i className="ri-download-line"></i>
            </button>
            <button className="text-sm text-neutral-500 hover:text-neutral-700">
              <i className="ri-more-2-fill"></i>
            </button>
          </div>
        </div>
        <CardDescription>Percentage of resistant isolates by month</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-64 w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={formatMonth}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Resistance Rate (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: '12px', textAnchor: 'middle' } 
                    }}
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]}
                    labelFormatter={formatMonth}
                  />
                  <Legend />
                  {Array.from(groupedByBacteria.keys()).map((bacteria, index) => (
                    <Line
                      key={bacteria}
                      type="monotone"
                      dataKey={bacteria}
                      stroke={colorPalette[index % colorPalette.length]}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-4 text-sm">
              {Array.from(groupedByBacteria.keys()).map((bacteria, index) => (
                <div key={bacteria} className="flex items-center">
                  <span 
                    className="w-3 h-3 inline-block rounded-full mr-1"
                    style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                  ></span>
                  <span>{bacteria}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResistanceTrendsChart;
