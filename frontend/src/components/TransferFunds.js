import React, { useState } from 'react';
import axios from 'axios';
import styles from './TransferFunds.module.css'; // Import scoped CSS module

const TransferFunds = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleTransfer = async (type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      await axios.post('http://127.0.0.1:5000/transactions', {
        amount: parseFloat(amount),
        type, // 'credit' or 'debit'
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAmount('');
      setDescription('');
      alert('Transaction successful!');
      // Consider navigating to another page or updating the state instead of reloading
      // window.location.reload(); // Reload the page to reflect the updated balance
    } catch (error) {
      setError(`Error processing ${type}: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className={styles.transferFunds}>
      <h1 className={styles.heading}>Transfer Funds</h1>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
          />
        </label>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.creditButton}
            onClick={() => handleTransfer('credit')}
          >
            Credit
          </button>
          <button
            type="button"
            className={styles.debitButton}
            onClick={() => handleTransfer('debit')}
          >
            Debit
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default TransferFunds;
