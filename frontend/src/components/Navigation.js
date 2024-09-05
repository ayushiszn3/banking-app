// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/" className="navigation-link">Home</Link>
        </li>
        <li className="navigation-item">
          <Link to="/dashboard" className="navigation-link">Account Dashboard</Link>
        </li>
        <li className="navigation-item">
          <Link to="/transactions" className="navigation-link">Transaction History</Link>
        </li>
        <li className="navigation-item">
          <Link to="/transfer" className="navigation-link">Transfer Funds</Link>
        </li>
        <li className="navigation-item">
          <Link to="/account" className="navigation-link">Account Management</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
