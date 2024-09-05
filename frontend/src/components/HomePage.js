// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import './LoginPage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="logo" style={{ marginBottom: '0' }}>
        <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" />
      </div>
      <h1 style={{ marginTop: '0' }}>Welcome to JK-BANK</h1>
      <div className="home-page-links">
        <Link to="/login" className="home-page-link">Login</Link>
        <Link to="/register" className="home-page-link">Register</Link>
      </div>
    </div>
  );
};

export default HomePage;
