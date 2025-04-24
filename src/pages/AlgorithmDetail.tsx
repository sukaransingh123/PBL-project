
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { config } from "@/lib/config";

// Mock data for algorithm steps
const algorithmSteps = {
  'lstm': [
    {
      title: "Data Preprocessing",
      description: "Historical stock data is cleaned and normalized. Features like price, volume, and technical indicators are prepared.",
      image: "https://source.unsplash.com/random/800x400?data"
    },
    {
      title: "Sequence Creation",
      description: "Data is transformed into sequences suitable for LSTM processing, with each sequence representing a time window.",
      image: "https://source.unsplash.com/random/800x400?sequence"
    },
    {
      title: "LSTM Network Architecture",
      description: "Multiple LSTM layers process the sequences, learning patterns in the data through training iterations.",
      image: "https://source.unsplash.com/random/800x400?network"
    },
    {
      title: "Prediction Generation",
      description: "The trained model generates future price predictions based on the patterns it has learned.",
      image: "https://source.unsplash.com/random/800x400?prediction"
    }
  ],
  'arima': [
    {
      title: "Stationarity Check",
      description: "Time series data is tested for stationarity and transformed if necessary through differencing.",
      image: "https://source.unsplash.com/random/800x400?stationary"
    },
    {
      title: "Model Identification",
      description: "Appropriate p, d, q values are determined using autocorrelation and partial autocorrelation functions.",
      image: "https://source.unsplash.com/random/800x400?correlation"
    },
    {
      title: "Parameter Estimation",
      description: "The model parameters are estimated using maximum likelihood estimation.",
      image: "https://source.unsplash.com/random/800x400?estimation"
    },
    {
      title: "Forecasting",
      description: "Future values are forecasted using the fitted ARIMA model.",
      image: "https://source.unsplash.com/random/800x400?forecast"
    }
  ],
  'linear-regression': [
    {
      title: "Feature Selection",
      description: "Relevant features are selected from historical data including price, volume, and technical indicators.",
      image: "https://source.unsplash.com/random/800x400?selection"
    },
    {
      title: "Data Splitting",
      description: "Data is split into training and testing sets to evaluate model performance.",
      image: "https://source.unsplash.com/random/800x400?split"
    },
    {
      title: "Model Training",
      description: "The linear regression model is trained by finding the line that minimizes the sum of squared residuals.",
      image: "https://source.unsplash.com/random/800x400?training"
    },
    {
      title: "Prediction and Evaluation",
      description: "Predictions are made on test data and evaluated using metrics like RMSE and R-squared.",
      image: "https://source.unsplash.com/random/800x400?evaluation"
    }
  ],
  'prophet': [
    {
      title: "Data Preparation",
      description: "Historical data is organized into a dataframe with 'ds' (date) and 'y' (target) columns.",
      image: "https://source.unsplash.com/random/800x400?preparation"
    },
    {
      title: "Model Configuration",
      description: "Growth model (linear or logistic) is selected and seasonal components are defined.",
      image: "https://source.unsplash.com/random/800x400?configuration"
    },
    {
      title: "Model Fitting",
      description: "The Prophet model is fitted to the historical data, decomposing it into trend, seasonality, and holiday effects.",
      image: "https://source.unsplash.com/random/800x400?fitting"
    },
    {
      title: "Forecasting Future Points",
      description: "The model generates predictions with uncertainty intervals for specified future dates.",
      image: "https://source.unsplash.com/random/800x400?future"
    }
  ]
};

const AlgorithmDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [algorithm, setAlgorithm] = useState<any>(null);
  
  useEffect(() => {
    if (slug) {
      const foundAlgorithm = config.mlModels.find(model => model.slug === slug);
      setAlgorithm(foundAlgorithm || null);
    }
  }, [slug]);

  if (!algorithm) {
    return (
      <Layout>
        <div className="container mx-auto p-4 md:p-6 text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Algorithm not found</h2>
          <p className="text-muted-foreground mb-4">
            Sorry, we couldn't find the algorithm you're looking for.
          </p>
          <Button asChild>
            <Link to="/algorithms">Back to Algorithms</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <Link to="/algorithms" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Algorithms
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">{algorithm.name}</h1>
        <p className="text-muted-foreground mb-6">
          {algorithm.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 md:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Detailed explanation of the {algorithm.name} algorithm for stock prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                The {algorithm.name} algorithm is a powerful tool for predicting stock price movements.
                It works by analyzing historical patterns in price data and identifying relationships
                that can be extrapolated into the future.
              </p>
              
              {slug === 'lstm' && (
                <>
                  <h3>Long Short-Term Memory Networks</h3>
                  <p>
                    LSTM networks are a special kind of recurrent neural network (RNN) capable of learning
                    long-term dependencies in sequence data. This makes them particularly well-suited for
                    stock market prediction, where patterns may develop over extended periods.
                  </p>
                  <p>
                    Unlike traditional neural networks, LSTMs have a memory cell that can maintain information
                    for long periods. This cell is regulated by structures called gates, which control the flow
                    of information.
                  </p>
                  <h4>LSTM Architecture Components</h4>
                  <ul>
                    <li>
                      <strong>Forget Gate:</strong> Decides what information to discard from the cell state.
                    </li>
                    <li>
                      <strong>Input Gate:</strong> Updates the cell state with new information.
                    </li>
                    <li>
                      <strong>Output Gate:</strong> Controls what information flows to the next layer.
                    </li>
                  </ul>
                </>
              )}
              
              {slug === 'arima' && (
                <>
                  <h3>AutoRegressive Integrated Moving Average</h3>
                  <p>
                    ARIMA is a statistical model used for analyzing and forecasting time series data.
                    It combines three components to capture different aspects of the data.
                  </p>
                  <p>
                    The model is defined by three parameters (p, d, q) which represent:
                  </p>
                  <ul>
                    <li>
                      <strong>p (AutoRegressive):</strong> The number of lag observations included in the model.
                    </li>
                    <li>
                      <strong>d (Integrated):</strong> The number of times the raw observations are differenced.
                    </li>
                    <li>
                      <strong>q (Moving Average):</strong> The size of the moving average window.
                    </li>
                  </ul>
                </>
              )}
              
              {slug === 'linear-regression' && (
                <>
                  <h3>Linear Regression for Time Series</h3>
                  <p>
                    Linear regression is one of the simplest yet powerful statistical methods for predicting
                    stock prices. It models the relationship between a dependent variable (stock price) and
                    one or more independent variables.
                  </p>
                  <p>
                    In the context of stock prediction, linear regression can use various features such as:
                  </p>
                  <ul>
                    <li>Previous stock prices</li>
                    <li>Trading volume</li>
                    <li>Technical indicators (moving averages, RSI, etc.)</li>
                    <li>Market indices</li>
                    <li>Macroeconomic indicators</li>
                  </ul>
                </>
              )}
              
              {slug === 'prophet' && (
                <>
                  <h3>Facebook Prophet</h3>
                  <p>
                    Prophet is a time series forecasting procedure developed by Facebook. It's designed to
                    be robust to missing data, shifts in trends, and outliers, making it ideal for stock
                    market prediction.
                  </p>
                  <p>
                    The core of Prophet is an additive regression model with three main components:
                  </p>
                  <ul>
                    <li>
                      <strong>Trend:</strong> Models non-periodic changes using a piecewise linear or logistic growth curve.
                    </li>
                    <li>
                      <strong>Seasonality:</strong> Captures periodic changes using Fourier series.
                    </li>
                    <li>
                      <strong>Holidays/Events:</strong> Accounts for the effects of holidays or special events.
                    </li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="font-medium text-lg">{algorithm.accuracy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best For</p>
                  <p className="font-medium">{algorithm.bestFor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Training Time</p>
                  <p className="font-medium">
                    {slug === 'lstm' && 'High (minutes to hours)'}
                    {slug === 'arima' && 'Medium (seconds to minutes)'}
                    {slug === 'linear-regression' && 'Low (milliseconds to seconds)'}
                    {slug === 'prophet' && 'Medium (seconds to minutes)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prediction Speed</p>
                  <p className="font-medium">
                    {slug === 'lstm' && 'Fast once trained'}
                    {slug === 'arima' && 'Very fast'}
                    {slug === 'linear-regression' && 'Extremely fast'}
                    {slug === 'prophet' && 'Fast'}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <Link to={`/predictions?model=${slug}`}>
                    <Button className="w-full">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Try This Algorithm
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Step-by-Step Process */}
        <h2 className="text-2xl font-bold mb-4">Step-by-Step Process</h2>
        <div className="space-y-6 mb-8">
          {algorithmSteps[slug as keyof typeof algorithmSteps]?.map((step, index) => (
            <Card key={index} className="shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="h-48 md:h-full w-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Recommended Uses */}
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle>Recommended Uses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slug === 'lstm' && (
                <>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Long-term Trend Prediction</h3>
                    <p className="text-sm text-muted-foreground">
                      LSTM excels at capturing long-term trends in stock prices, making it ideal for
                      predicting overall market movements over extended periods.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Pattern Recognition</h3>
                    <p className="text-sm text-muted-foreground">
                      Use LSTM when you need to identify complex patterns in stock price movements that
                      simpler models might miss.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Multi-feature Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      When you want to incorporate multiple data points beyond just price, such as
                      volume, news sentiment, and technical indicators.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Stable High-cap Stocks</h3>
                    <p className="text-sm text-muted-foreground">
                      Works best with established companies that have more predictable patterns and
                      less erratic price movements.
                    </p>
                  </div>
                </>
              )}
              
              {slug === 'arima' && (
                <>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Seasonal Stock Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      ARIMA is excellent for stocks with clear seasonal patterns, such as retail companies
                      with holiday sales cycles.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Short-term Forecasting</h3>
                    <p className="text-sm text-muted-foreground">
                      Works well for short to medium-term predictions where recent price movements have
                      a strong influence on future prices.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Stationary Time Series</h3>
                    <p className="text-sm text-muted-foreground">
                      Best suited for stocks with relatively stable statistical properties over time.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Statistical Confidence</h3>
                    <p className="text-sm text-muted-foreground">
                      When you need prediction intervals and statistical confidence measures for your
                      forecasts.
                    </p>
                  </div>
                </>
              )}
              
              {slug === 'linear-regression' && (
                <>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Baseline Predictions</h3>
                    <p className="text-sm text-muted-foreground">
                      Use Linear Regression as a baseline model to compare with more complex algorithms.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Trend Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Excellent for understanding the general direction of a stock's price movement and
                      the strength of the trend.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Feature Impact Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      When you want to understand which factors have the strongest influence on a stock's price.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Simple & Interpretable Results</h3>
                    <p className="text-sm text-muted-foreground">
                      When you need predictions that can be easily explained to stakeholders without
                      deep technical knowledge.
                    </p>
                  </div>
                </>
              )}
              
              {slug === 'prophet' && (
                <>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Seasonal Business Stocks</h3>
                    <p className="text-sm text-muted-foreground">
                      Prophet excels with stocks that have strong seasonal components, such as retail,
                      travel, or consumer goods companies.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Event-influenced Stocks</h3>
                    <p className="text-sm text-muted-foreground">
                      When stock prices are affected by regular events or holidays that can be explicitly
                      modeled.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Missing Data Scenarios</h3>
                    <p className="text-sm text-muted-foreground">
                      Prophet handles missing data points well, making it suitable for stocks with irregular
                      trading or reporting.
                    </p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Multiple Seasonality Patterns</h3>
                    <p className="text-sm text-muted-foreground">
                      When you need to model stocks with multiple seasonal effects (daily, weekly, quarterly).
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Try It Now CTA */}
        <Card className="bg-primary text-primary-foreground shadow-lg mb-8">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Ready to try {algorithm.name}?</h3>
              <p>Generate stock predictions using this algorithm in just a few clicks.</p>
            </div>
            <Link to={`/predictions?model=${slug}`}>
              <Button variant="secondary" className="w-full md:w-auto">
                Start Predicting
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AlgorithmDetail;
