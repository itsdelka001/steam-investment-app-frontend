import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import TradeonPage from './pages/tradeon'; // Імпортуємо сторінку Tradeon
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tradeon" element={<TradeonPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();