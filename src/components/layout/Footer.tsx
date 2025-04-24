
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-xl font-bold text-primary">StockML</Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Advanced stock analysis and prediction using machine learning algorithms.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/algorithms" className="text-sm text-muted-foreground hover:text-foreground">
                  Machine Learning Algorithms
                </Link>
              </li>
              <li>
                <Link to="/stocks" className="text-sm text-muted-foreground hover:text-foreground">
                  Stock Explorer
                </Link>
              </li>
              <li>
                <Link to="/predictions" className="text-sm text-muted-foreground hover:text-foreground">
                  Prediction Models
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">About</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About This Project
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-muted pt-8 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StockML. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            A Project-Based Learning (PBL) application
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
