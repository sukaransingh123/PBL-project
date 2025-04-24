
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, ChartBar, Star, Printer, Download } from "lucide-react";
import Layout from "@/components/layout/Layout";
import StockChart from "@/components/shared/StockChart";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { stockApi, StockQuote, StockHistoricalData, StockNews } from "@/services/stockApi";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useAuth } from "@/contexts/AuthContext";

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<StockHistoricalData[]>([]);
  const [news, setNews] = useState<StockNews[]>([]);
  const [timeRange, setTimeRange] = useState<'1d'|'5d'|'1m'|'3m'|'6m'|'1y'|'5y'>('1m');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState({
    quote: true,
    historical: true,
    news: true
  });

  // Fetch stock data when symbol or time range changes
  useEffect(() => {
    if (!symbol) return;

    const fetchStockData = async () => {
      // Fetch quote data
      setIsLoading(prev => ({ ...prev, quote: true }));
      try {
        const quoteData = await stockApi.getQuote(symbol);
        setQuote(quoteData);
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
      } finally {
        setIsLoading(prev => ({ ...prev, quote: false }));
      }

      // Fetch historical data
      setIsLoading(prev => ({ ...prev, historical: true }));
      try {
        const historicalData = await stockApi.getHistoricalData(symbol, timeRange);
        setHistoricalData(historicalData);
      } catch (error) {
        console.error(`Failed to fetch historical data for ${symbol}:`, error);
      } finally {
        setIsLoading(prev => ({ ...prev, historical: false }));
      }

      // Fetch news
      setIsLoading(prev => ({ ...prev, news: true }));
      try {
        const newsData = await stockApi.getNews(symbol);
        setNews(newsData);
      } catch (error) {
        console.error(`Failed to fetch news for ${symbol}:`, error);
      } finally {
        setIsLoading(prev => ({ ...prev, news: false }));
      }
    };

    fetchStockData();
  }, [symbol, timeRange]);

  // Handle watchlist toggle
  const handleToggleWatchlist = () => {
    if (!quote) return;

    if (isInWatchlist(symbol!)) {
      removeFromWatchlist(symbol!);
    } else {
      addToWatchlist({
        symbol: quote.symbol,
        name: quote.companyName,
        lastPrice: quote.latestPrice,
        priceChange: quote.change,
        percentChange: quote.changePercent
      });
    }
  };

  // Handle format market cap
  const formatMarketCap = (value: number): string => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  // Format date for news
  const formatNewsDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        {isLoading.quote ? (
          <LoadingSpinner className="py-16" text="Loading stock data..." />
        ) : !quote ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Stock not found</h2>
            <p className="text-muted-foreground mb-4">
              Sorry, we couldn't find the stock with symbol "{symbol}".
            </p>
            <Button asChild>
              <Link to="/stocks">Back to Stock Explorer</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Stock Header */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-3xl font-bold">{quote.symbol}</h1>
                  <Badge variant="outline" className="text-sm h-6">
                    {quote.companyName}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-semibold">${quote.latestPrice.toFixed(2)}</span>
                  <div className={`flex items-center ${quote.change >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
                    {quote.change >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span>
                      {quote.change.toFixed(2)} ({(quote.changePercent * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex mt-4 md:mt-0 space-x-2">
                <Link to={`/predictions?symbol=${quote.symbol}`}>
                  <Button variant="default">
                    <ChartBar className="h-4 w-4 mr-2" />
                    Predict
                  </Button>
                </Link>
                
                {user && (
                  <Button
                    variant={isInWatchlist(quote.symbol) ? "destructive" : "outline"}
                    onClick={handleToggleWatchlist}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {isInWatchlist(quote.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                )}
                
                <Button variant="outline" title="Download data" onClick={() => alert("Data download feature")}>
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" title="Print report" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Stock Chart */}
            <div className="mb-6">
              {isLoading.historical ? (
                <LoadingSpinner className="py-16" text="Loading chart data..." />
              ) : (
                <StockChart
                  historicalData={historicalData}
                  symbol={quote.symbol}
                />
              )}
            </div>
            
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Key Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Previous Close</p>
                          <p className="font-medium">${quote.previousClose.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Open</p>
                          <p className="font-medium">${(quote.previousClose + (Math.random() - 0.5)).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Day Range</p>
                          <p className="font-medium">${quote.low.toFixed(2)} - ${quote.high.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Volume</p>
                          <p className="font-medium">{quote.volume.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Average Volume</p>
                          <p className="font-medium">{quote.avgVolume.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Market Cap</p>
                          <p className="font-medium">{formatMarketCap(quote.marketCap)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">P/E Ratio</p>
                          <p className="font-medium">{quote.peRatio ? quote.peRatio.toFixed(2) : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">52 Week Range</p>
                          <p className="font-medium">
                            ${(quote.latestPrice * 0.8).toFixed(2)} - ${(quote.latestPrice * 1.2).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {quote.companyName} is a publicly traded company in the technology sector. 
                        The company specializes in innovative products and services that serve 
                        consumers and businesses alike.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">CEO</span>
                          <span className="text-sm font-medium">John Smith</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Industry</span>
                          <span className="text-sm font-medium">Technology</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Sector</span>
                          <span className="text-sm font-medium">Information Technology</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Exchange</span>
                          <span className="text-sm font-medium">NASDAQ</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* News Tab */}
              <TabsContent value="news">
                {isLoading.news ? (
                  <LoadingSpinner className="py-16" text="Loading news..." />
                ) : news.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    No news available for {quote.symbol}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {news.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          {item.image && (
                            <div className="md:w-1/4">
                              <img 
                                src={item.image} 
                                alt={item.headline}
                                className="h-48 md:h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className={`p-4 ${item.image ? 'md:w-3/4' : 'w-full'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold">{item.headline}</h3>
                              <Badge variant="outline">{item.source}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {formatNewsDate(item.datetime)}
                            </p>
                            <p className="text-sm mb-3">{item.summary}</p>
                            <a href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary text-sm hover:underline"
                            >
                              Read full article
                            </a>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Financials Tab */}
              <TabsContent value="financials">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Reports</CardTitle>
                    <CardDescription>
                      Historical financial data for {quote.symbol}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="quarterly">
                      <TabsList className="mb-4">
                        <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                        <TabsTrigger value="annual">Annual</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="quarterly">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3">Period</th>
                                <th className="text-right p-3">Revenue</th>
                                <th className="text-right p-3">Net Income</th>
                                <th className="text-right p-3">EPS</th>
                                <th className="text-right p-3">Profit Margin</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="p-3">Q1 2023</td>
                                <td className="text-right p-3">$94.8B</td>
                                <td className="text-right p-3">$24.2B</td>
                                <td className="text-right p-3">$1.52</td>
                                <td className="text-right p-3">25.5%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3">Q4 2022</td>
                                <td className="text-right p-3">$117.2B</td>
                                <td className="text-right p-3">$30.0B</td>
                                <td className="text-right p-3">$1.88</td>
                                <td className="text-right p-3">25.6%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3">Q3 2022</td>
                                <td className="text-right p-3">$90.1B</td>
                                <td className="text-right p-3">$20.7B</td>
                                <td className="text-right p-3">$1.29</td>
                                <td className="text-right p-3">23.0%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3">Q2 2022</td>
                                <td className="text-right p-3">$82.9B</td>
                                <td className="text-right p-3">$19.4B</td>
                                <td className="text-right p-3">$1.20</td>
                                <td className="text-right p-3">23.4%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="annual">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3">Year</th>
                                <th className="text-right p-3">Revenue</th>
                                <th className="text-right p-3">Net Income</th>
                                <th className="text-right p-3">EPS</th>
                                <th className="text-right p-3">Profit Margin</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="p-3">2022</td>
                                <td className="text-right p-3">$394.3B</td>
                                <td className="text-right p-3">$99.8B</td>
                                <td className="text-right p-3">$6.11</td>
                                <td className="text-right p-3">25.3%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3">2021</td>
                                <td className="text-right p-3">$365.8B</td>
                                <td className="text-right p-3">$94.7B</td>
                                <td className="text-right p-3">$5.61</td>
                                <td className="text-right p-3">25.9%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3">2020</td>
                                <td className="text-right p-3">$274.5B</td>
                                <td className="text-right p-3">$57.4B</td>
                                <td className="text-right p-3">$3.28</td>
                                <td className="text-right p-3">20.9%</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3">2019</td>
                                <td className="text-right p-3">$260.2B</td>
                                <td className="text-right p-3">$55.3B</td>
                                <td className="text-right p-3">$2.97</td>
                                <td className="text-right p-3">21.2%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6">
                      <Button variant="outline" className="mr-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download Financial Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StockDetail;
