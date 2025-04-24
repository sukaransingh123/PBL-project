
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Menu, X, User, LogOut } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', path: '/' },
    { name: 'Stocks', path: '/stocks' },
    { name: 'Predictions', path: '/predictions' },
    { name: 'Algorithms', path: '/algorithms' },
    { name: 'Watchlist', path: '/watchlist' },
  ];
  
  const isActive = (path: string) => {
    // For exact match or subpaths (e.g., /stocks/AAPL matches /stocks)
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };
  
  return (
    <nav className="bg-background border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center mr-4">
              <span className="text-xl font-bold text-primary">StockML</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full ${
                    isActive(item.path)
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/70 hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Search and Auth Actions */}
          <div className="hidden sm:flex items-center">
            <SearchBar className="mr-3 w-64" />
            
            {user ? (
              <div className="relative ml-3 flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="text-sm"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <SearchBar className="mb-6" />
                  
                  <div className="flex flex-col space-y-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`px-3 py-2 rounded-md text-base font-medium ${
                          isActive(item.path)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t">
                    {user ? (
                      <>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">Login</Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full">Register</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
