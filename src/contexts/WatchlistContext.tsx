
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';

export interface WatchlistItem {
  symbol: string;
  name: string;
  lastPrice?: number;
  priceChange?: number;
  percentChange?: number;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  isLoading: boolean;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load watchlist from localStorage on mount or when user changes
  useEffect(() => {
    if (user) {
      const storedWatchlist = localStorage.getItem(`watchlist-${user.id}`);
      
      if (storedWatchlist) {
        try {
          setWatchlist(JSON.parse(storedWatchlist));
        } catch (error) {
          console.error('Error parsing stored watchlist', error);
          localStorage.removeItem(`watchlist-${user.id}`);
        }
      }
    } else {
      // Clear watchlist when user logs out
      setWatchlist([]);
    }
    
    setIsLoading(false);
  }, [user]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (user && watchlist.length > 0) {
      localStorage.setItem(`watchlist-${user.id}`, JSON.stringify(watchlist));
    }
  }, [watchlist, user]);

  const addToWatchlist = (item: WatchlistItem) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add stocks to your watchlist.",
        variant: "destructive",
      });
      return;
    }

    if (isInWatchlist(item.symbol)) {
      toast({
        title: "Already in watchlist",
        description: `${item.symbol} is already in your watchlist.`,
        variant: "destructive",
      });
      return;
    }

    setWatchlist(prev => [...prev, item]);
    
    toast({
      title: "Added to watchlist",
      description: `${item.symbol} has been added to your watchlist.`,
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    if (!user) return;
    
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
    
    toast({
      title: "Removed from watchlist",
      description: `${symbol} has been removed from your watchlist.`,
    });
  };

  const isInWatchlist = (symbol: string): boolean => {
    return watchlist.some(item => item.symbol === symbol);
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      isLoading, 
      addToWatchlist, 
      removeFromWatchlist,
      isInWatchlist 
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  
  return context;
};
