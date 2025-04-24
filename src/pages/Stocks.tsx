
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import StockQuoteCard from "@/components/shared/StockQuoteCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { stockApi, StockQuote } from "@/services/stockApi";
import { config } from "@/lib/config";

const Stocks = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ symbol: string; name: string }[]>([]);
  const [popularStocks, setPopularStocks] = useState<StockQuote[]>([]);
  const [isLoading, setIsLoading] = useState({
    search: false,
    popular: true
  });

  // Fetch popular stocks on component mount
  useEffect(() => {
    const fetchPopularStocks = async () => {
      setIsLoading(prev => ({ ...prev, popular: true }));
      
      try {
        const quotes = await Promise.all(
          config.popularStocks.map(stock => stockApi.getQuote(stock.symbol))
        );
        
        setPopularStocks(quotes.filter(Boolean) as StockQuote[]);
      } catch (error) {
        console.error("Failed to fetch popular stocks:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, popular: false }));
      }
    };
    
    fetchPopularStocks();
  }, []);

  // Search for stocks when search input changes
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(prev => ({ ...prev, search: true }));
      
      try {
        const results = await stockApi.searchStocks(search);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching stocks:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, search: false }));
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [search]);

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Stock Explorer</h1>
          <p className="text-muted-foreground mb-6">
            Search and explore stocks to analyze their performance and make predictions
          </p>

          {/* Search Section */}
          <Card className="mb-8 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Search Stocks</CardTitle>
              <CardDescription>Enter a stock symbol or company name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by symbol or company name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Search Results */}
              {search && (
                <div className="mt-4">
                  {isLoading.search ? (
                    <LoadingSpinner className="py-4" />
                  ) : searchResults.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <div className="grid grid-cols-3 p-3 bg-muted text-sm font-medium">
                        <div>Symbol</div>
                        <div className="col-span-2">Company</div>
                      </div>
                      {searchResults.map((result) => (
                        <Link
                          key={result.symbol}
                          to={`/stocks/${result.symbol}`}
                          className="grid grid-cols-3 p-3 hover:bg-accent border-t items-center"
                        >
                          <div className="font-medium">{result.symbol}</div>
                          <div className="col-span-2">{result.name}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No matching stocks found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Stocks */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Popular Stocks</h2>
            {isLoading.popular ? (
              <LoadingSpinner className="py-8" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularStocks.map((quote) => (
                  <StockQuoteCard key={quote.symbol} quote={quote} />
                ))}
              </div>
            )}
          </div>

          {/* Quick Access Categories */}
          <div>
            <h2 className="text-xl font-bold mb-4">Stock Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stockCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {category.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full mt-2">
                      <Link to={category.link}>
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Sample stock categories
const stockCategories = [
  {
    id: 'tech',
    name: 'Technology',
    description: 'Technology companies including software, hardware, and internet services',
    tags: ['Software', 'Hardware', 'Semiconductors'],
    link: '/stocks?category=technology'
  },
  {
    id: 'finance',
    name: 'Financial',
    description: 'Banks, investment firms, insurance companies, and financial services',
    tags: ['Banks', 'Insurance', 'Investment'],
    link: '/stocks?category=financial'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Pharmaceutical companies, healthcare providers, and medical equipment manufacturers',
    tags: ['Pharma', 'Biotech', 'Medical Devices'],
    link: '/stocks?category=healthcare'
  },
  {
    id: 'consumer',
    name: 'Consumer Goods',
    description: 'Companies producing goods for consumers including retail, food, and household products',
    tags: ['Retail', 'Food', 'Apparel'],
    link: '/stocks?category=consumer'
  },
  {
    id: 'energy',
    name: 'Energy',
    description: 'Oil companies, renewable energy, utilities, and energy infrastructure',
    tags: ['Oil & Gas', 'Renewable', 'Utilities'],
    link: '/stocks?category=energy'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Manufacturing, aerospace, defense, construction, and industrial services',
    tags: ['Manufacturing', 'Aerospace', 'Defense'],
    link: '/stocks?category=industrial'
  }
];

export default Stocks;
