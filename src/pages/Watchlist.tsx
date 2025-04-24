
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star, AlertTriangle, Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import StockQuoteCard from "@/components/shared/StockQuoteCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { stockApi, StockQuote } from "@/services/stockApi";

const Watchlist = () => {
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    const fetchWatchlistQuotes = async () => {
      if (watchlist.length === 0) {
        setQuotes([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const quotePromises = watchlist.map(item => stockApi.getQuote(item.symbol));
        const results = await Promise.all(quotePromises);
        setQuotes(results.filter(Boolean) as StockQuote[]);
      } catch (error) {
        console.error("Failed to fetch watchlist quotes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWatchlistQuotes();
  }, [watchlist]);
  
  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
            <p className="text-muted-foreground">
              Track and manage your favorite stocks
            </p>
          </div>
          
          <Link to="/stocks">
            <Button className="mt-4 md:mt-0">
              <Search className="mr-2 h-4 w-4" />
              Add Stocks
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <LoadingSpinner className="py-16" text="Loading your watchlist..." />
        ) : watchlist.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Your watchlist is empty</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Add stocks to your watchlist to track their performance and get quick access to their data.
              </p>
              <Link to="/stocks">
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Browse Stocks
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {quotes.map(quote => (
                <StockQuoteCard key={quote.symbol} quote={quote} />
              ))}
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                Stock information is for educational purposes only. Past performance is not indicative of future results.
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Watchlist;
