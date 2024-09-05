import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import AccountDashboard from './components/AccountDashboard';
import TransactionHistory from './components/TransactionHistory';
import TransferFunds from './components/TransferFunds';
import AccountManagement from './components/AccountManagement';


const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={isAuthenticated ? <AccountDashboard /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={isAuthenticated ? <TransactionHistory /> : <Navigate to="/login" />} />
            <Route path="/transfer" element={isAuthenticated ? <TransferFunds /> : <Navigate to="/login" />} />
            <Route path="/account" element={isAuthenticated ? <AccountManagement /> : <Navigate to="/login" />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
