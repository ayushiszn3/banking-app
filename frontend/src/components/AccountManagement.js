import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AccountManagement.module.css'; // Import scoped CSS module

const AccountManagement = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(''); // State for Date of Birth
  const [address, setAddress] = useState(''); // State for Address
  const [zipcode, setZipcode] = useState(''); // State for Zip Code
  const [branch, setBranch] = useState(''); // State for Branch
  const [error, setError] = useState(null); // Error state

  // New states for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setDob(response.data.dob || ''); // Set DOB if available
        setAddress(response.data.address || ''); // Set Address if available
        setZipcode(response.data.zipcode || ''); // Set Zip Code if available
        setBranch(response.data.branch || ''); // Set Branch if available
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://127.0.0.1:5000/user', { 
        name, 
        email, 
        dob, 
        address, 
        zipcode, 
        branch 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Account updated successfully.');
    } catch (error) {
      setError('Error updating account details');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5000/change-password', {
        currentPassword,
        newPassword,
        confirmPassword // Include confirmPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <div className={styles.accountManagement}>
      <h1 className={styles.heading}>Account Management</h1>
      {error && <p className={styles.error}>{error}</p>}
      {user && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Name:
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Date of Birth:
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Address:
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Zip Code:
            <input 
              type="text" 
              value={zipcode} 
              onChange={(e) => setZipcode(e.target.value)} 
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Branch:
            <input 
              type="text" 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)} 
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.submitButton}>Update</button>
        </form>
      )}
      <h2 className={styles.heading}>Change Password</h2>
      {passwordError && <p className={styles.error}>{passwordError}</p>}
      <form className={styles.form} onSubmit={handleChangePassword}>
        <label className={styles.label}>
          Current Password:
          <input 
            type={showPassword ? 'text' : 'password'}
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            required 
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          New Password:
          <input 
            type={showPassword ? 'text' : 'password'}
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Confirm New Password:
          <input 
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            className={styles.input}
          />
        </label>
        <button 
          type="button" 
          className={styles.togglePassword} 
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'} Password
        </button>
        <button type="submit" className={styles.submitButton}>Change Password</button>
      </form>
    </div>
  );
};

export default AccountManagement;
