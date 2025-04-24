
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, LineChart, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { config } from "@/lib/config";

const Algorithms = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-2">Machine Learning Algorithms</h1>
        <p className="text-muted-foreground mb-6">
          Learn about the different prediction algorithms used in our platform
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-sm bg-accent/30">
                <CardHeader className="pb-3">
                  <CardTitle>Why Machine Learning?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    Machine learning models can process vast amounts of historical stock data to 
                    identify patterns that might not be obvious to human analysts. These models can 
                    adapt to new data, improving their predictions over time.
                  </p>
                  <p className="text-sm mb-4">
                    While no prediction model is perfect, using multiple algorithms and 
                    understanding their strengths and weaknesses can provide valuable insights 
                    for investment decision making.
                  </p>
                  <Link to="/predictions">
                    <Button className="w-full mt-2">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Try Predictions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2 space-y-8">
            {config.mlModels.map((model) => (
              <Card key={model.slug} id={model.slug} className="shadow-md overflow-hidden scroll-mt-24">
                <CardHeader className="bg-accent/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{model.name}</CardTitle>
                      <CardDescription className="mt-1">{model.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{model.accuracy} accuracy</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <AlgorithmContent algorithmSlug={model.slug} />
                  
                  <div className="mt-6 pt-4 border-t">
                    <Link to={`/predictions?model=${model.slug}`}>
                      <Button>
                        Use {model.name} for Predictions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Algorithm content component
const AlgorithmContent = ({ algorithmSlug }: { algorithmSlug: string }) => {
  switch (algorithmSlug) {
    case 'lstm':
      return (
        <>
          <h3 className="font-medium text-lg mb-3">Long Short-Term Memory Networks</h3>
          <div className="mb-6 flex justify-center">
            <img 
              src="https://source.unsplash.com/random/800x400?neural,network" 
              alt="LSTM Neural Network" 
              className="rounded-md shadow-sm max-w-full h-auto"
            />
          </div>
          <p className="mb-4">
            Long Short-Term Memory (LSTM) networks are a type of recurrent neural network (RNN) 
            architecture designed to model temporal sequences and their long-range dependencies 
            more accurately than conventional RNNs.
          </p>
          <h4 className="font-medium text-md mb-2">How LSTM Works</h4>
          <p className="mb-4">
            LSTMs have a chain-like structure with repeating modules. Each module contains:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Cell State:</strong> Acts as a conveyor belt running through the entire 
              chain, with minor linear interactions allowing information to flow unchanged.
            </li>
            <li>
              <strong>Forget Gate:</strong> Decides what information is discarded from the cell state.
            </li>
            <li>
              <strong>Input Gate:</strong> Decides what new information will be stored in the cell state.
            </li>
            <li>
              <strong>Output Gate:</strong> Determines what parts of the cell state to output.
            </li>
          </ul>
          <p className="mb-4">
            This architecture allows LSTMs to selectively remember or forget information over 
            long sequences, making them ideal for time series data like stock prices.
          </p>
          <h4 className="font-medium text-md mb-2">Advantages for Stock Prediction</h4>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Can identify long-term dependencies in stock price movements
            </li>
            <li>
              Capable of recognizing complex patterns that simpler models might miss
            </li>
            <li>
              Handles multivariate inputs well (prices, volume, technical indicators)
            </li>
            <li>
              Less sensitive to noise in the data compared to simpler models
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            LSTM models typically perform well on stocks with clear long-term trends but may 
            struggle with highly volatile stocks showing no consistent patterns.
          </p>
        </>
      );
    
    case 'arima':
      return (
        <>
          <h3 className="font-medium text-lg mb-3">AutoRegressive Integrated Moving Average</h3>
          <div className="mb-6 flex justify-center">
            <img 
              src="https://source.unsplash.com/random/800x400?chart,statistics" 
              alt="ARIMA Statistical Model" 
              className="rounded-md shadow-sm max-w-full h-auto"
            />
          </div>
          <p className="mb-4">
            ARIMA (AutoRegressive Integrated Moving Average) is a statistical model used for 
            analyzing and forecasting time series data. It combines three components: autoregression (AR), 
            differencing (I), and moving average (MA).
          </p>
          <h4 className="font-medium text-md mb-2">How ARIMA Works</h4>
          <p className="mb-4">
            ARIMA models are characterized by three parameters: p, d, q.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>p (Autoregressive):</strong> Uses the relationship between an observation and 
              a number of lagged observations.
            </li>
            <li>
              <strong>d (Integrated):</strong> Represents the number of differencing operations needed 
              to make the time series stationary.
            </li>
            <li>
              <strong>q (Moving Average):</strong> Uses the dependency between an observation and a 
              residual error from a moving average model applied to lagged observations.
            </li>
          </ul>
          <p className="mb-4">
            The model first makes the time series stationary (consistent statistical properties over time) 
            through differencing, then applies AR and MA components to capture patterns.
          </p>
          <h4 className="font-medium text-md mb-2">Advantages for Stock Prediction</h4>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Strong theoretical foundation in statistical time series analysis
            </li>
            <li>
              Works well for stocks with clear seasonal patterns
            </li>
            <li>
              Good for short to medium-term forecasts
            </li>
            <li>
              Provides confidence intervals for predictions
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            ARIMA models are most effective for stocks with regular, stationary behavior and 
            may not capture sudden market events or complex non-linear relationships.
          </p>
        </>
      );
    
    case 'linear-regression':
      return (
        <>
          <h3 className="font-medium text-lg mb-3">Linear Regression</h3>
          <div className="mb-6 flex justify-center">
            <img 
              src="https://source.unsplash.com/random/800x400?line,graph" 
              alt="Linear Regression" 
              className="rounded-md shadow-sm max-w-full h-auto"
            />
          </div>
          <p className="mb-4">
            Linear Regression is one of the simplest and most widely used statistical models 
            for predictive analysis. It establishes a linear relationship between dependent 
            variables (stock prices) and one or more independent variables (time, indicators).
          </p>
          <h4 className="font-medium text-md mb-2">How Linear Regression Works</h4>
          <p className="mb-4">
            In the context of stock price prediction, linear regression:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Models the relationship between time (or other variables) and price as a straight line
            </li>
            <li>
              Uses the equation: y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε
            </li>
            <li>
              Minimizes the sum of squared differences between observed and predicted values
            </li>
            <li>
              Can incorporate multiple features (multivariate regression)
            </li>
          </ul>
          <p className="mb-4">
            For stock predictions, various technical indicators and historical price data points 
            can be used as independent variables to predict future prices.
          </p>
          <h4 className="font-medium text-md mb-2">Advantages for Stock Prediction</h4>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Simple to implement and interpret
            </li>
            <li>
              Computationally efficient
            </li>
            <li>
              Provides clear coefficient values showing the relationship strength
            </li>
            <li>
              Works well as a baseline model for comparison
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Linear regression performs best on stocks with relatively stable, trending behavior 
            over short time horizons. It's less effective for volatile stocks or those with 
            complex non-linear patterns.
          </p>
        </>
      );
    
    case 'prophet':
      return (
        <>
          <h3 className="font-medium text-lg mb-3">Facebook Prophet</h3>
          <div className="mb-6 flex justify-center">
            <img 
              src="https://source.unsplash.com/random/800x400?forecasting,prediction" 
              alt="Facebook Prophet" 
              className="rounded-md shadow-sm max-w-full h-auto"
            />
          </div>
          <p className="mb-4">
            Prophet is an open-source forecasting procedure developed by Facebook's Core Data Science team. 
            It's designed for analyzing time series data with strong seasonal effects and 
            multiple seasons of historical data.
          </p>
          <h4 className="font-medium text-md mb-2">How Prophet Works</h4>
          <p className="mb-4">
            Prophet uses a decomposable time series model with three main components:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Trend:</strong> A piecewise linear or logistic growth curve to capture 
              non-periodic changes
            </li>
            <li>
              <strong>Seasonality:</strong> Fourier series to provide a flexible model for periodic effects
            </li>
            <li>
              <strong>Holidays/Events:</strong> A list of irregular events or holidays that impact the time series
            </li>
          </ul>
          <p className="mb-4">
            These components are combined in the following equation: y(t) = g(t) + s(t) + h(t) + ε
            where g(t) is the trend, s(t) represents seasonality, h(t) accounts for holiday effects, 
            and ε is error.
          </p>
          <h4 className="font-medium text-md mb-2">Advantages for Stock Prediction</h4>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Automatically handles seasonal patterns in stock prices
            </li>
            <li>
              Robust to missing data and outliers
            </li>
            <li>
              Can incorporate the effects of holidays and special events
            </li>
            <li>
              Produces uncertainty intervals for forecasts
            </li>
            <li>
              Handles trend changes effectively
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Prophet is especially useful for stocks with strong seasonal components or those 
            affected by regular events (like retail stocks with holiday seasons). It may be less 
            effective for stocks driven primarily by news and irregular events.
          </p>
        </>
      );
    
    default:
      return (
        <p className="text-muted-foreground">
          Algorithm details not available.
        </p>
      );
  }
};

export default Algorithms;
