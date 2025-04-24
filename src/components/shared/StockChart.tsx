
import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Area,
  ComposedChart,
  Legend,
  Bar
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StockHistoricalData } from '@/services/stockApi';
import { format, parseISO } from 'date-fns';

interface StockChartProps {
  historicalData: StockHistoricalData[];
  predictedData?: StockHistoricalData[];
  symbol: string;
  modelName?: string;
}

const StockChart = ({ 
  historicalData, 
  predictedData, 
  symbol, 
  modelName 
}: StockChartProps) => {
  const [timeRange, setTimeRange] = useState<'1w'|'1m'|'3m'|'6m'|'1y'|'all'>('1m');
  const [chartType, setChartType] = useState<'line'|'candle'|'area'|'volume'>('line');
  
  // Merge historical and predicted data for the chart
  const chartData = useMemo(() => {
    if (!historicalData?.length) return [];
    
    let filteredHistorical = [...historicalData];
    
    // Filter based on selected time range
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeRange) {
        case '1w': 
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '1m': 
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3m': 
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6m': 
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case '1y': 
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredHistorical = historicalData.filter(item => 
        new Date(item.date) >= cutoffDate
      );
    }
    
    // If we have prediction data, merge it with historical
    const mergedData = [...filteredHistorical];
    
    if (predictedData?.length) {
      predictedData.forEach(dataPoint => {
        mergedData.push({
          ...dataPoint,
          predicted: true,
          predictionClose: dataPoint.close,
          close: undefined // Don't show historical line for predicted dates
        });
      });
    }
    
    return mergedData;
  }, [historicalData, predictedData, timeRange]);
  
  // Determine max and min values for Y axis
  const yDomain = useMemo(() => {
    if (!chartData.length) return [0, 100];
    
    const allValues = chartData.flatMap(item => [
      item.close, 
      item.predictionClose, 
      item.high, 
      item.low
    ].filter(Boolean) as number[]);
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    // Add a small buffer for better visualization
    const buffer = (max - min) * 0.05;
    return [Math.floor(min - buffer), Math.ceil(max + buffer)];
  }, [chartData]);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPrediction = data.predicted;
      const closeValue = isPrediction ? data.predictionClose : data.close;
      
      return (
        <div className="bg-popover p-3 border rounded-md shadow-md">
          <p className="text-sm font-semibold">{format(new Date(label), 'PP')}</p>
          {isPrediction && (
            <Badge className="mb-2 text-xs" variant="outline">Predicted</Badge>
          )}
          <p className="text-sm">Open: <span className="font-medium">${data.open?.toFixed(2)}</span></p>
          <p className="text-sm">Close: <span className="font-medium">${closeValue?.toFixed(2)}</span></p>
          <p className="text-sm">High: <span className="font-medium">${data.high?.toFixed(2)}</span></p>
          <p className="text-sm">Low: <span className="font-medium">${data.low?.toFixed(2)}</span></p>
          <p className="text-sm">Volume: <span className="font-medium">{data.volume?.toLocaleString()}</span></p>
        </div>
      );
    }
    
    return null;
  };

  // Format date for X-axis ticks
  const formatXAxis = (tickItem: string) => {
    return format(parseISO(tickItem), 'MMM d');
  };
  
  // Get appropriate chart based on type selection
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                minTickGap={30}
              />
              <YAxis 
                domain={yDomain as [number, number]} 
                tickCount={7}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#0052FF" 
                strokeWidth={2} 
                dot={false} 
                animationDuration={500}
              />
              {predictedData && (
                <Line 
                  type="monotone" 
                  dataKey="predictionClose" 
                  stroke="#0ECB81" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  animationDuration={500}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                minTickGap={30}
              />
              <YAxis 
                domain={yDomain as [number, number]} 
                tickCount={7}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ECB81" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ECB81" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="#0052FF" 
                fillOpacity={1}
                fill="url(#colorClose)" 
                animationDuration={500}
              />
              {predictedData && (
                <Area 
                  type="monotone" 
                  dataKey="predictionClose" 
                  stroke="#0ECB81" 
                  strokeDasharray="5 5" 
                  fillOpacity={1}
                  fill="url(#colorPrediction)" 
                  animationDuration={500}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      case 'candle':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                minTickGap={30}
              />
              <YAxis 
                domain={yDomain as [number, number]} 
                tickCount={7}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="low" 
                stackId="a" 
                fill="transparent" 
                animationDuration={500}
              />
              <Bar 
                dataKey={(d) => d.high - d.low} 
                stackId="a" 
                fill={(d) => d.close > d.open ? '#0ECB81' : '#F6465D'} 
                stroke={(d) => d.close > d.open ? '#0ECB81' : '#F6465D'} 
                animationDuration={500}
              />
              {predictedData && (
                <Line 
                  type="monotone" 
                  dataKey="predictionClose" 
                  stroke="#0052FF" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  animationDuration={500}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      case 'volume':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                minTickGap={30}
              />
              <YAxis 
                yAxisId="left"
                domain={yDomain as [number, number]} 
                tickCount={7}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="volume" 
                yAxisId="right"
                fill="#8884d8" 
                animationDuration={500}
                opacity={0.5}
              />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#0052FF" 
                strokeWidth={2} 
                dot={false} 
                yAxisId="left"
                animationDuration={500}
              />
              {predictedData && (
                <Line 
                  type="monotone" 
                  dataKey="predictionClose" 
                  stroke="#0ECB81" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                  yAxisId="left"
                  animationDuration={500}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>
              {symbol} Price Chart
              {modelName && (
                <Badge className="ml-2 text-xs" variant="outline">{modelName} Model</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {predictedData 
                ? "Historical data and prediction"
                : "Historical price data"
              }
            </CardDescription>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Tabs 
              value={timeRange} 
              onValueChange={(v) => setTimeRange(v as any)}
              className="w-auto"
            >
              <TabsList className="h-8 text-xs">
                <TabsTrigger value="1w" className="h-7 px-2">1W</TabsTrigger>
                <TabsTrigger value="1m" className="h-7 px-2">1M</TabsTrigger>
                <TabsTrigger value="3m" className="h-7 px-2">3M</TabsTrigger>
                <TabsTrigger value="6m" className="h-7 px-2">6M</TabsTrigger>
                <TabsTrigger value="1y" className="h-7 px-2">1Y</TabsTrigger>
                <TabsTrigger value="all" className="h-7 px-2">All</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs 
              value={chartType} 
              onValueChange={(v) => setChartType(v as any)}
              className="w-auto"
            >
              <TabsList className="h-8 text-xs">
                <TabsTrigger value="line" className="h-7 px-2">Line</TabsTrigger>
                <TabsTrigger value="area" className="h-7 px-2">Area</TabsTrigger>
                <TabsTrigger value="candle" className="h-7 px-2">Candle</TabsTrigger>
                <TabsTrigger value="volume" className="h-7 px-2">Volume</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          renderChart()
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
        
        {predictedData && (
          <div className="flex gap-4 items-center mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-1 bg-[#0052FF] rounded mr-2"></div>
              <span>Historical</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0 border-t-2 border-dashed border-[#0ECB81] mr-2"></div>
              <span>Predicted</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockChart;
