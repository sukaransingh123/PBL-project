
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Stocks from "./pages/Stocks";
import StockDetail from "./pages/StockDetail";
import Watchlist from "./pages/Watchlist";
import Predictions from "./pages/Predictions";
import Algorithms from "./pages/Algorithms";
import AlgorithmDetail from "./pages/AlgorithmDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WatchlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/stocks/:symbol" element={<StockDetail />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/algorithms/:slug" element={<AlgorithmDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WatchlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
