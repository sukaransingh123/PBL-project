# 📈 TrendPilot — Stock Market Prediction & Analysis Platform

> A fully responsive web application for analyzing and forecasting stock prices using advanced machine learning algorithms. Designed for investors, data science enthusiasts, and finance students who want powerful insights through intuitive visuals.

---

## 🚀 Features

- 🎨 Beautiful, modern UI with React and Tailwind CSS  
- 📊 Real-time & historical stock data visualization  
- 🤖 Multiple machine learning models for accurate predictions  
- 📈 Interactive prediction charts and trend tracking  
- 🧠 Transparent explanation of how each algorithm works  
- 🔐 User authentication and personalized watchlists  
- 📄 Downloadable reports of prediction results  
- 📱 Fully responsive and mobile-optimized interface  

---

## 🧠 Machine Learning Algorithms Used

| Algorithm         | Description                       | Technology         |
|------------------|-----------------------------------|--------------------|
| LSTM              | Deep learning for time series     | TensorFlow / Keras |
| ARIMA             | Statistical forecasting           | statsmodels        |
| Linear Regression | Simple regression modeling        | Scikit-learn       |
| Prophet           | Additive forecasting model        | Facebook Prophet   |

Each model includes:
- User input interface
- Visualized prediction output
- Evaluation metrics (RMSE, MAE, etc.)
- Clear explanation of model logic

---

## 📸 Screenshots

> *(You can add screenshots in the `/public/images` folder and reference them here)*

![Dashboard Preview](./public/images/dashboard-preview.png)  
![Prediction Results](./public/images/prediction-results.png)

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- Tailwind CSS  
- Vite

**Backend:**  
- Node.js + Express.js  
- MongoDB (via Mongoose)

**Machine Learning Service:**  
- Python (Flask or FastAPI)  
- ML Libraries: TensorFlow, Scikit-learn, statsmodels, Prophet

---

## 📦 Setup Instructions

### 🔧 Requirements

- Node.js & npm
- Python 3.8+
- MongoDB
- Git

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
