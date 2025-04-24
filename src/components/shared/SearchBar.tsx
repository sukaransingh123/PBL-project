
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { stockApi } from "@/services/stockApi";

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ symbol: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Search for stocks when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        try {
          const searchResults = await stockApi.searchStocks(query);
          setResults(searchResults);
        } catch (error) {
          console.error('Error searching stocks:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleResultClick = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };
  
  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };
  
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pr-8"
        />
        {query ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        ) : (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {isFocused && (results.length > 0 || isLoading) && (
        <div className="absolute z-10 mt-1 w-full bg-popover shadow-lg rounded-md border py-1 animate-fade-in">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">Searching...</div>
          ) : (
            <ul>
              {results.map((result) => (
                <li key={result.symbol}>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex justify-between items-center"
                    onClick={() => handleResultClick(result.symbol)}
                  >
                    <span className="font-medium">{result.symbol}</span>
                    <span className="text-muted-foreground truncate ml-2">{result.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
