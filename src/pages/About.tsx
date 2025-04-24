
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, LineChart, MessageSquare } from "lucide-react";
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">About This Project</h1>
          <p className="text-muted-foreground mb-6">
            Learn more about the StockML platform and its development
          </p>
          
          <div className="prose max-w-none mb-8">
            <p className="lead text-xl">
              StockML is a Project-Based Learning (PBL) application focused on stock market analysis 
              and prediction using machine learning algorithms.
            </p>
            
            <h2>Project Overview</h2>
            <p>
              This platform demonstrates how various machine learning techniques can be applied to financial 
              data to identify patterns and make predictions. It serves both as an educational tool and 
              a practical application for stock market analysis.
            </p>
            
            <h2>Key Features</h2>
            <ul>
              <li>
                <strong>Real-time and Historical Analysis:</strong> Explore stock data with 
                interactive charts and visualizations.
              </li>
              <li>
                <strong>Machine Learning Predictions:</strong> Generate price forecasts using 
                multiple sophisticated algorithms.
              </li>
              <li>
                <strong>Algorithm Comparison:</strong> Compare the performance of different 
                prediction models.
              </li>
              <li>
                <strong>Educational Resources:</strong> Learn how each algorithm works through 
                detailed explanations.
              </li>
              <li>
                <strong>Personalized Watchlist:</strong> Track your favorite stocks in one place.
              </li>
            </ul>
            
            <h2>Technical Implementation</h2>
            <p>
              The application is built using a modern tech stack:
            </p>
            <ul>
              <li>
                <strong>Frontend:</strong> React with TypeScript, Tailwind CSS for styling, 
                and Recharts for data visualization.
              </li>
              <li>
                <strong>Machine Learning:</strong> Multiple algorithms including LSTM, ARIMA, 
                Linear Regression, and Facebook Prophet.
              </li>
              <li>
                <strong>User Experience:</strong> Responsive design, interactive components, 
                and smooth transitions.
              </li>
            </ul>
            
            <h2>Educational Purpose</h2>
            <p>
              This platform is primarily designed for educational purposes to demonstrate:
            </p>
            <ul>
              <li>How machine learning can be applied to financial markets</li>
              <li>The strengths and limitations of different prediction algorithms</li>
              <li>Modern web development practices and interactive data visualization</li>
              <li>User experience considerations for financial applications</li>
            </ul>
            
            <div className="bg-accent/50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Disclaimer</h3>
              <p className="text-sm">
                This application is for educational purposes only. The predictions and analyses provided 
                should not be used as the sole basis for actual investment decisions. Stock market 
                investments always carry risk, and past performance is not indicative of future results.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn More
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore our detailed guides on machine learning algorithms and stock market analysis.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/algorithms">
                    View Algorithms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Try It Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate your own stock predictions using our machine learning models.
                </p>
                <Button asChild className="w-full">
                  <Link to="/predictions">
                    Make Predictions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions or feedback about the project? We'd love to hear from you.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
