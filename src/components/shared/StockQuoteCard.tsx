
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StockQuote } from "@/services/stockApi";
import { ArrowUp, ArrowDown, Eye, Star } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useAuth } from "@/contexts/AuthContext";

interface StockQuoteCardProps {
  quote: StockQuote;
  showActions?: boolean;
}

const StockQuoteCard = ({ quote, showActions = true }: StockQuoteCardProps) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { user } = useAuth();
  
  const {
    symbol,
    companyName,
    latestPrice,
    change,
    changePercent,
    high,
    low,
    volume,
    marketCap
  } = quote;
  
  const isPriceUp = change >= 0;
  
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
  
  const handleViewDetails = () => {
    navigate(`/stocks/${symbol}`);
  };
  
  const handleToggleWatchlist = () => {
    if (isInWatchlist(symbol)) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist({
        symbol,
        name: companyName,
        lastPrice: latestPrice,
        priceChange: change,
        percentChange: changePercent
      });
    }
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{companyName}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">${latestPrice.toFixed(2)}</p>
            <div className={`flex items-center justify-end ${isPriceUp ? 'text-finance-green' : 'text-finance-red'}`}>
              {isPriceUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              <span className="text-sm">
                {change.toFixed(2)} ({(changePercent * 100).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">High:</span>{" "}
            <span className="font-medium">${high.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Low:</span>{" "}
            <span className="font-medium">${low.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Volume:</span>{" "}
            <span className="font-medium">{volume.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Market Cap:</span>{" "}
            <span className="font-medium">{formatMarketCap(marketCap)}</span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            
            {user && (
              <Button 
                variant={isInWatchlist(symbol) ? "destructive" : "outline"} 
                size="sm"
                onClick={handleToggleWatchlist}
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockQuoteCard;
