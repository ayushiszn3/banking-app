import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [query, setQuery] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data.reverse());
        setFilteredTransactions(response.data.reverse()); // Initialize with all transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleSearch = () => {
    const results = transactions.filter(transaction => {
      const matchesDescription = transaction.description.toLowerCase().includes(query.toLowerCase());
      const matchesAmount = amount ? transaction.amount === parseFloat(amount) : true;
      
      return matchesDescription && matchesAmount;
    });
    setFilteredTransactions(results);
  };

  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Search by amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <ul>
        {filteredTransactions.map(transaction => (
          <li
            key={transaction.id}
            className={transaction.type}
          >
            <span className="description">{transaction.date} {transaction.description}</span>
            <span className="amount">
              ₹{transaction.amount.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
