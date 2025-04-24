
export const config = {
  // List of popular stocks for quick access
  popularStocks: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' }
  ],
  
  // ML model information
  mlModels: [
    { 
      name: 'LSTM', 
      slug: 'lstm',
      description: 'Long Short-Term Memory neural networks for time series prediction',
      accuracy: '89%',
      bestFor: 'Long-term patterns in stock price movements'
    },
    { 
      name: 'ARIMA', 
      slug: 'arima',
      description: 'AutoRegressive Integrated Moving Average for statistical forecasting',
      accuracy: '82%',
      bestFor: 'Short-term predictions with seasonal components'
    },
    { 
      name: 'Linear Regression', 
      slug: 'linear-regression',
      description: 'Simple statistical relationship between variables',
      accuracy: '75%',
      bestFor: 'Baseline predictions and trend analysis'
    },
    { 
      name: 'Facebook Prophet', 
      slug: 'prophet',
      description: 'Handles seasonality and holiday effects with robust forecasting',
      accuracy: '87%',
      bestFor: 'Predictions with seasonal patterns and special events'
    }
  ],
  
  // Time range options for stock data
  timeRangeOptions: [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' }
  ],
  
  // Prediction time range options
  predictionRangeOptions: [
    { label: '1 Week', value: 7 },
    { label: '2 Weeks', value: 14 },
    { label: '1 Month', value: 30 },
    { label: '2 Months', value: 60 },
    { label: '3 Months', value: 90 }
  ]
};
