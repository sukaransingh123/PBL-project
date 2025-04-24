
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, TrendingUp, Search, ChartBar } from "lucide-react";
import Layout from "@/components/layout/Layout";
import StockQuoteCard from "@/components/shared/StockQuoteCard";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { stockApi, StockQuote } from "@/services/stockApi";
import { config } from "@/lib/config";

const Dashboard = () => {
  const { user } = useAuth();
  const { watchlist } = useWatchlist();
  const [topMovers, setTopMovers] = useState<{
    gainers: Array<{ symbol: string; name: string; change: number; price: number; }>;
    losers: Array<{ symbol: string; name: string; change: number; price: number; }>;
  }>({ gainers: [], losers: [] });
  const [marketIndices, setMarketIndices] = useState<Array<{ 
    name: string; 
    symbol: string; 
    price: number; 
    change: number; 
    changePercent: number;
  }>>([]);
  const [watchlistQuotes, setWatchlistQuotes] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState({
    movers: true,
    indices: true,
    watchlist: false
  });
  
  // Fetch market data on component mount
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch top movers
        const moversData = await stockApi.getTopMovers();
        setTopMovers(moversData);
      } catch (error) {
        console.error("Failed to fetch top movers:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, movers: false }));
      }
      
      try {
        // Fetch market indices
        const indicesData = await stockApi.getMarketIndices();
        setMarketIndices(indicesData);
      } catch (error) {
        console.error("Failed to fetch market indices:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, indices: false }));
      }
    };
    
    fetchMarketData();
  }, []);

  // Fetch watchlist quotes when watchlist changes
  useEffect(() => {
    const fetchWatchlistQuotes = async () => {
      if (!watchlist.length) return;
      
      setIsLoading(prev => ({ ...prev, watchlist: true }));
      
      try {
        const quotes = await Promise.all(
          watchlist.map(item => stockApi.getQuote(item.symbol))
        );
        
        setWatchlistQuotes(quotes.filter(Boolean) as StockQuote[]);
      } catch (error) {
        console.error("Failed to fetch watchlist quotes:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, watchlist: false }));
      }
    };
    
    fetchWatchlistQuotes();
  }, [watchlist]);

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {user ? `Welcome back, ${user.name}!` : 'Welcome to StockML'}
              </h1>
              <p className="text-blue-100 mb-4 md:mb-0">
                Advanced stock market analysis and prediction platform with machine learning
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary" className="font-medium">
                <Link to="/stocks">
                  <Search className="mr-2 h-4 w-4" />
                  Explore Stocks
                </Link>
              </Button>
              <Button asChild className="bg-white text-blue-700 hover:bg-blue-50">
                <Link to="/predictions">
                  <ChartBar className="mr-2 h-4 w-4" />
                  ML Predictions
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Market Overview */}
          <Card className="md:col-span-2 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Latest market indices and trends</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading.indices ? (
                <LoadingSpinner className="py-4" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {marketIndices.map(index => (
                    <div key={index.symbol} className="border rounded-md p-3">
                      <p className="font-medium text-sm">{index.name}</p>
                      <p className="text-lg font-semibold mt-1">
                        {index.price.toFixed(2)}
                      </p>
                      <div className={`flex items-center mt-1 ${
                        index.change >= 0 ? "text-finance-green" : "text-finance-red"
                      }`}>
                        {index.change >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        <span className="text-sm">
                          {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-4">
                <Tabs defaultValue="gainers" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                    <TabsTrigger value="losers">Top Losers</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gainers">
                    {isLoading.movers ? (
                      <LoadingSpinner className="py-4" />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {topMovers.gainers.map(stock => (
                          <Link 
                            key={stock.symbol} 
                            to={`/stocks/${stock.symbol}`}
                            className="flex items-center p-3 border rounded-md hover:bg-accent transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{stock.symbol}</p>
                              <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${stock.price.toFixed(2)}</p>
                              <div className="flex items-center justify-end text-finance-green">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                <span className="text-sm">{stock.change.toFixed(2)}%</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="losers">
                    {isLoading.movers ? (
                      <LoadingSpinner className="py-4" />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {topMovers.losers.map(stock => (
                          <Link 
                            key={stock.symbol} 
                            to={`/stocks/${stock.symbol}`}
                            className="flex items-center p-3 border rounded-md hover:bg-accent transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{stock.symbol}</p>
                              <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${stock.price.toFixed(2)}</p>
                              <div className="flex items-center justify-end text-finance-red">
                                <ArrowDown className="h-3 w-3 mr-1" />
                                <span className="text-sm">{Math.abs(stock.change).toFixed(2)}%</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Quick Search */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Quick Search</CardTitle>
              <CardDescription>Find stocks by symbol or company name</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchBar className="mb-4" />
              
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {config.popularStocks.map(stock => (
                    <Badge key={stock.symbol} variant="outline" asChild>
                      <Link to={`/stocks/${stock.symbol}`}>
                        {stock.symbol}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="border-t mt-6 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">ML Prediction Tools</p>
                  <Button asChild variant="link" size="sm" className="p-0 h-auto">
                    <Link to="/predictions">View all</Link>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {config.mlModels.map(model => (
                    <Link 
                      key={model.name} 
                      to={`/algorithms/${model.slug}`}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <p className="font-medium text-sm">{model.name}</p>
                      </div>
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* My Watchlist Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Watchlist</h2>
            <Link to="/watchlist">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {!user ? (
            <div className="bg-accent/50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Sign in to use Watchlist</h3>
              <p className="text-muted-foreground mb-4">
                Create an account to track your favorite stocks and get personalized predictions.
              </p>
              <div className="flex justify-center space-x-3">
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            </div>
          ) : watchlist.length === 0 ? (
            <div className="bg-accent/50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Start adding stocks to your watchlist to track them.
              </p>
              <Link to="/stocks">
                <Button>Explore Stocks</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoading.watchlist ? (
                <LoadingSpinner className="col-span-full py-8" />
              ) : (
                watchlistQuotes.slice(0, 4).map(quote => (
                  <StockQuoteCard key={quote.symbol} quote={quote} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
