
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  LineChart,
  TrendingUp,
  Download,
  AlertTriangle
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import StockChart from "@/components/shared/StockChart";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { stockApi } from "@/services/stockApi";
import { config } from "@/lib/config";

const Predictions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSymbol = searchParams.get('symbol') || '';
  
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [symbolName, setSymbolName] = useState('');
  const [selectedModel, setSelectedModel] = useState('LSTM');
  const [predictionDays, setPredictionDays] = useState(30);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [predictionData, setPredictionData] = useState<{
    historical: any[];
    predicted: any[];
    metrics: {
      rmse: number;
      mape: number;
      accuracy: number;
      r2Score: number;
    };
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState({
    models: true,
    prediction: false,
    symbolName: false
  });
  
  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const models = await stockApi.getAvailableModels();
        setAvailableModels(models);
      } catch (error) {
        console.error("Failed to fetch available models:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, models: false }));
      }
    };
    
    fetchModels();
  }, []);
  
  // Lookup symbol name when symbol changes
  useEffect(() => {
    const fetchSymbolName = async () => {
      if (!selectedSymbol) {
        setSymbolName('');
        return;
      }
      
      setIsLoading(prev => ({ ...prev, symbolName: true }));
      
      try {
        const quote = await stockApi.getQuote(selectedSymbol);
        setSymbolName(quote?.companyName || '');
      } catch (error) {
        console.error(`Failed to fetch name for ${selectedSymbol}:`, error);
      } finally {
        setIsLoading(prev => ({ ...prev, symbolName: false }));
      }
    };
    
    fetchSymbolName();
  }, [selectedSymbol]);
  
  // Handle symbol selection from search
  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('symbol', symbol);
      return newParams;
    });
  };
  
  // Handle generate prediction
  const handleGeneratePrediction = async () => {
    if (!selectedSymbol || !selectedModel) return;
    
    setIsLoading(prev => ({ ...prev, prediction: true }));
    setPredictionData(null);
    
    try {
      const prediction = await stockApi.getPrediction(
        selectedSymbol,
        selectedModel,
        predictionDays
      );
      setPredictionData(prediction);
    } catch (error) {
      console.error("Failed to generate prediction:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, prediction: false }));
    }
  };
  
  // Find model by name
  const findModelByName = (name: string) => {
    return config.mlModels.find(model => model.name === name);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-2">Stock Price Predictions</h1>
        <p className="text-muted-foreground mb-6">
          Use machine learning algorithms to predict future stock price movements
        </p>
        
        {/* Prediction Setup Card */}
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle>Generate Prediction</CardTitle>
            <CardDescription>
              Select a stock and prediction model to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock Symbol
                </label>
                <div className="space-y-2">
                  <SearchBar
                    className="w-full"
                  />
                  {selectedSymbol && (
                    <div className="flex items-center space-x-2">
                      <Badge className="text-sm">{selectedSymbol}</Badge>
                      {isLoading.symbolName ? (
                        <span className="text-xs text-muted-foreground">Loading...</span>
                      ) : symbolName ? (
                        <span className="text-xs text-muted-foreground">{symbolName}</span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prediction Model
                </label>
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading.models ? (
                      <div className="p-2 text-center">
                        <LoadingSpinner size={16} text="Loading models..." />
                      </div>
                    ) : (
                      availableModels.map(model => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {selectedModel && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {findModelByName(selectedModel)?.description}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prediction Time Range
                </label>
                <Select
                  value={predictionDays.toString()}
                  onValueChange={val => setPredictionDays(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.predictionRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={handleGeneratePrediction}
                  disabled={!selectedSymbol || !selectedModel || isLoading.prediction}
                  className="w-full"
                >
                  {isLoading.prediction ? (
                    <LoadingSpinner size={16} text="Generating..." />
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Generate Prediction
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Prediction Results */}
        {predictionData && !isLoading.prediction && (
          <div className="space-y-6">
            <StockChart
              historicalData={predictionData.historical}
              predictedData={predictionData.predicted}
              symbol={selectedSymbol}
              modelName={selectedModel}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Statistical evaluation of the prediction model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">RMSE (Root Mean Squared Error)</p>
                      <p className="font-medium">{predictionData.metrics.rmse.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">MAPE (Mean Absolute Percentage Error)</p>
                      <p className="font-medium">{predictionData.metrics.mape.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="font-medium">{predictionData.metrics.accuracy.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">R² Score</p>
                      <p className="font-medium">{predictionData.metrics.r2Score.toFixed(4)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>{selectedModel} Model</CardTitle>
                  <CardDescription>
                    About this prediction algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    {findModelByName(selectedModel)?.description}
                  </p>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Best For</p>
                      <p className="font-medium">{findModelByName(selectedModel)?.bestFor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Accuracy</p>
                      <p className="font-medium">{findModelByName(selectedModel)?.accuracy}</p>
                    </div>
                  </div>
                  
                  <Button asChild variant="link" className="pl-0">
                    <Link to={`/algorithms/${findModelByName(selectedModel)?.slug}`}>
                      Learn more about this algorithm
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="flex items-start space-x-4 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Disclaimer</h3>
                  <p className="text-sm text-amber-700">
                    Stock predictions are based on mathematical models and historical data. They are not
                    guaranteed to be accurate and should not be used as the sole basis for investment decisions.
                    Past performance is not indicative of future results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Model Comparison */}
        {!predictionData && !isLoading.prediction && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Our Prediction Models</CardTitle>
              <CardDescription>
                Learn about the different machine learning algorithms available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.mlModels.map((model) => (
                  <Card key={model.slug} className="bg-accent/30 border-none hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <LineChart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold">{model.name}</h3>
                          <p className="text-sm text-muted-foreground my-2">
                            {model.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{model.accuracy} accuracy</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link to={`/algorithms/${model.slug}`}>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Learn more
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Predictions;
