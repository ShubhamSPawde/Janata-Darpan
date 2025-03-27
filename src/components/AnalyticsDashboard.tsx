
import React, { useEffect, useState } from 'react';
import { AnalyticsData, DataEntry } from '../types';
import { getAnalyticsData, getAllEntries } from '../services/api';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Activity, BarChart3, PieChart as PieChartIcon, ListFilter } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentEntries, setRecentEntries] = useState<DataEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, entries] = await Promise.all([
          getAnalyticsData(),
          getAllEntries()
        ]);
        setAnalytics(analyticsData);
        setRecentEntries(entries.slice(0, 5));
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up periodic refresh
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="glass-panel p-6 text-center animate-pulse">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const typeData = [
    { name: 'Text', value: analytics.typeBreakdown.text },
    { name: 'Image', value: analytics.typeBreakdown.image },
    { name: 'Video', value: analytics.typeBreakdown.video },
  ];

  const accuracyData = [
    { name: 'Correct', value: analytics.correctPredictions },
    { name: 'Flagged', value: analytics.flaggedPredictions },
  ];

  const historyData = [
    { name: 'Total', value: analytics.totalPredictions },
    { name: 'Flagged', value: analytics.flaggedPredictions },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel p-4 hover-lift">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              <h3 className="text-2xl font-medium">
                {analytics.accuracyRate.toFixed(1)}%
              </h3>
            </div>
          </div>
        </Card>
        
        <Card className="glass-panel p-4 hover-lift">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Predictions</p>
              <h3 className="text-2xl font-medium">
                {analytics.totalPredictions}
              </h3>
            </div>
          </div>
        </Card>
        
        <Card className="glass-panel p-4 hover-lift">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <ListFilter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Flagged Predictions</p>
              <h3 className="text-2xl font-medium">
                {analytics.flaggedPredictions}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="charts">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="history">Recent History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                Input Type Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="glass-panel p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Prediction Performance
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={historyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="glass-panel p-4">
            <h3 className="text-lg font-medium mb-4">Recent Predictions</h3>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="text-xs bg-secondary rounded-full px-2 py-0.5 mr-2">
                            {entry.inputType}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 font-medium">{entry.predicted}</p>
                      </div>
                      {entry.actual && (
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                          Flagged
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No recent predictions</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
