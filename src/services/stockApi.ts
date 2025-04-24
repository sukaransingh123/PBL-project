
import { toast } from "@/hooks/use-toast";

// Types for API responses
export interface StockQuote {
  symbol: string;
  companyName: string;
  latestPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  peRatio: number | null;
}

export interface StockHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockNews {
  id: string;
  headline: string;
  source: string;
  url: string;
  summary: string;
  image: string;
  datetime: string;
  related: string;
}

// Dummy data generation helpers
const generateRandomPrice = (base: number, volatility: number = 0.02): number => {
  return base * (1 + (Math.random() - 0.5) * volatility);
};

const generateHistoricalData = (
  symbol: string, 
  days: number = 30, 
  basePrice: number = 150
): StockHistoricalData[] => {
  const data: StockHistoricalData[] = [];
  let price = basePrice;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    const open = generateRandomPrice(price, 0.01);
    const close = generateRandomPrice(open, 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(Math.random() * 10000000) + 1000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high, 
      low,
      close,
      volume
    });
    
    price = close; // Set next day's base price
  }
  
  return data;
};

// Mock stock data
const MOCK_STOCKS: Record<string, { 
  name: string;
  basePrice: number;
}> = {
  'AAPL': { name: 'Apple Inc.', basePrice: 180.32 },
  'MSFT': { name: 'Microsoft Corporation', basePrice: 403.78 },
  'GOOGL': { name: 'Alphabet Inc.', basePrice: 142.65 },
  'AMZN': { name: 'Amazon.com, Inc.', basePrice: 175.89 },
  'META': { name: 'Meta Platforms, Inc.', basePrice: 465.20 },
  'TSLA': { name: 'Tesla, Inc.', basePrice: 251.05 },
  'NVDA': { name: 'NVIDIA Corporation', basePrice: 432.76 },
  'JPM': { name: 'JPMorgan Chase & Co.', basePrice: 198.43 },
  'V': { name: 'Visa Inc.', basePrice: 264.15 },
  'WMT': { name: 'Walmart Inc.', basePrice: 69.34 },
  'JNJ': { name: 'Johnson & Johnson', basePrice: 151.89 },
  'PG': { name: 'Procter & Gamble Co.', basePrice: 162.50 },
  'UNH': { name: 'UnitedHealth Group Inc.', basePrice: 515.67 },
  'HD': { name: 'The Home Depot, Inc.', basePrice: 342.80 },
  'BAC': { name: 'Bank of America Corp.', basePrice: 39.42 },
};

// Mock prediction data
const MOCK_PREDICTION_MODELS = ['LSTM', 'ARIMA', 'Linear Regression', 'Facebook Prophet'];

// API methods
export const stockApi = {
  // Search for stocks
  searchStocks: async (query: string): Promise<{ symbol: string; name: string; }[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!query) return [];

    const results = Object.entries(MOCK_STOCKS)
      .filter(([symbol, { name }]) => 
        symbol.toLowerCase().includes(query.toLowerCase()) || 
        name.toLowerCase().includes(query.toLowerCase())
      )
      .map(([symbol, { name }]) => ({ symbol, name }));
      
    return results;
  },
  
  // Get stock quote
  getQuote: async (symbol: string): Promise<StockQuote | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if symbol exists in our mock data
      const stockInfo = MOCK_STOCKS[symbol.toUpperCase()];
      if (!stockInfo) {
        throw new Error(`Stock ${symbol} not found`);
      }
      
      const { name, basePrice } = stockInfo;
      
      const latestPrice = generateRandomPrice(basePrice);
      const previousClose = generateRandomPrice(basePrice, 0.005);
      const change = latestPrice - previousClose;
      const changePercent = change / previousClose;
      
      return {
        symbol: symbol.toUpperCase(),
        companyName: name,
        latestPrice,
        previousClose,
        change,
        changePercent,
        high: latestPrice * (1 + Math.random() * 0.01),
        low: latestPrice * (1 - Math.random() * 0.01),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        avgVolume: Math.floor(Math.random() * 15000000) + 2000000,
        marketCap: latestPrice * (Math.random() * 10000000000 + 100000000000),
        peRatio: Math.random() > 0.1 ? Math.random() * 40 + 10 : null,
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  },
  
  // Get historical data
  getHistoricalData: async (
    symbol: string, 
    range: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' | '5y' = '1m'
  ): Promise<StockHistoricalData[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Check if symbol exists in our mock data
    const stockInfo = MOCK_STOCKS[symbol.toUpperCase()];
    if (!stockInfo) {
      throw new Error(`Stock ${symbol} not found`);
    }
    
    // Determine number of days based on range
    let days = 30;
    switch (range) {
      case '1d': days = 1; break;
      case '5d': days = 5; break;
      case '1m': days = 30; break;
      case '3m': days = 90; break;
      case '6m': days = 180; break;
      case '1y': days = 365; break;
      case '5y': days = 365 * 5; break;
    }
    
    return generateHistoricalData(symbol, days, stockInfo.basePrice);
  },
  
  // Get news for a stock
  getNews: async (symbol: string): Promise<StockNews[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check if symbol exists in our mock data
    const stockInfo = MOCK_STOCKS[symbol.toUpperCase()];
    if (!stockInfo) {
      throw new Error(`Stock ${symbol} not found`);
    }
    
    // Generate mock news
    const companyName = stockInfo.name;
    const news: StockNews[] = [];
    
    const headlines = [
      `${companyName} Reports Q2 Earnings Above Expectations`,
      `Analysts Upgrade ${companyName} to Buy`,
      `${companyName} Announces New Product Line`,
      `${companyName} Expands Operations in European Markets`,
      `Investors Remain Bullish on ${companyName}'s Growth Prospects`,
      `${companyName} Addresses Supply Chain Challenges`,
      `${companyName} CEO Discusses Future Strategy in Interview`,
      `${companyName} Introduces Sustainable Business Practices`
    ];
    
    const sources = ['Bloomberg', 'CNBC', 'Reuters', 'Wall Street Journal', 'Seeking Alpha', 'MarketWatch'];
    
    const now = new Date();
    
    // Generate 5 random news items
    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Random date within last week
      
      news.push({
        id: `news-${symbol}-${i}`,
        headline: headlines[Math.floor(Math.random() * headlines.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        url: '#',
        summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        image: `https://source.unsplash.com/random/300x200?business,${i}`,
        datetime: date.toISOString(),
        related: symbol,
      });
    }
    
    return news;
  },
  
  // Get stock predictions
  getPrediction: async (
    symbol: string, 
    model: string,
    days: number = 30
  ): Promise<{ 
    historical: StockHistoricalData[], 
    predicted: StockHistoricalData[],
    metrics: { 
      rmse: number;
      mape: number;
      accuracy: number; 
      r2Score: number;
    }
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if symbol exists in our mock data
    const stockInfo = MOCK_STOCKS[symbol.toUpperCase()];
    if (!stockInfo) {
      throw new Error(`Stock ${symbol} not found`);
    }
    
    // Check if model is supported
    if (!MOCK_PREDICTION_MODELS.includes(model)) {
      throw new Error(`Model ${model} is not supported`);
    }
    
    // Get historical data for training period
    const historical = await stockApi.getHistoricalData(symbol, '3m');
    
    // Generate prediction data based on the last closing price
    const lastClose = historical[historical.length - 1].close;
    const predicted: StockHistoricalData[] = [];
    const lastDate = new Date(historical[historical.length - 1].date);
    
    // Different models have slightly different prediction patterns
    let volatility = 0.02;
    let trend = 0;
    
    switch (model) {
      case 'LSTM':
        volatility = 0.015;
        trend = 0.001;
        break;
      case 'ARIMA':
        volatility = 0.02;
        trend = 0.0005;
        break;
      case 'Linear Regression':
        volatility = 0.01;
        trend = 0.0008;
        break;
      case 'Facebook Prophet':
        volatility = 0.018;
        trend = 0.0012;
        break;
    }
    
    let predictedPrice = lastClose;
    
    for (let i = 1; i <= days; i++) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      // Add small trend component based on model
      predictedPrice = predictedPrice * (1 + trend);
      
      const open = generateRandomPrice(predictedPrice, volatility * 0.5);
      const close = generateRandomPrice(predictedPrice, volatility);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 10000000) + 1000000;
      
      predicted.push({
        date: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume
      });
      
      predictedPrice = close; // Update for next iteration
    }
    
    // Generate random but realistic metrics
    const metrics = {
      rmse: 1 + Math.random() * 3, // Root Mean Squared Error
      mape: 2 + Math.random() * 5, // Mean Absolute Percentage Error
      accuracy: 85 + Math.random() * 10, // Accuracy percentage
      r2Score: 0.7 + Math.random() * 0.25, // R-squared score
    };
    
    return {
      historical,
      predicted,
      metrics,
    };
  },
  
  // Get all available prediction models
  getAvailableModels: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_PREDICTION_MODELS];
  },

  // Get top market movers
  getTopMovers: async (): Promise<{
    gainers: Array<{ symbol: string; name: string; change: number; price: number; }>;
    losers: Array<{ symbol: string; name: string; change: number; price: number; }>;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const stocks = Object.entries(MOCK_STOCKS);
    const movers = stocks.map(([symbol, { name, basePrice }]) => {
      const change = (Math.random() * 20) - 10; // -10% to +10%
      return {
        symbol,
        name,
        change,
        price: basePrice * (1 + change / 100)
      };
    });
    
    // Sort by change percentage
    movers.sort((a, b) => b.change - a.change);
    
    return {
      gainers: movers.slice(0, 5).filter(stock => stock.change > 0),
      losers: movers.slice(-5).reverse().filter(stock => stock.change < 0)
    };
  },

  // Get market indices
  getMarketIndices: async (): Promise<Array<{ 
    name: string; 
    symbol: string; 
    price: number; 
    change: number; 
    changePercent: number;
  }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const indices = [
      { name: 'S&P 500', symbol: 'SPX', basePrice: 4769.83 },
      { name: 'Dow Jones', symbol: 'DJI', basePrice: 37305.16 },
      { name: 'Nasdaq', symbol: 'COMP', basePrice: 15310.97 },
      { name: 'Russell 2000', symbol: 'RUT', basePrice: 2023.83 }
    ];
    
    return indices.map(index => {
      const changePercent = (Math.random() * 2) - 1; // -1% to +1%
      const price = index.basePrice * (1 + changePercent / 100);
      const change = price - index.basePrice;
      
      return {
        name: index.name,
        symbol: index.symbol,
        price,
        change,
        changePercent
      };
    });
  }
};
